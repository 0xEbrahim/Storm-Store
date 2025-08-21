import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientCreateOrderDto } from './dto/create-order.dto';
import { ClientUpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/modules/admin/cart/schema/cart.schema';
import { Model } from 'mongoose';
import { Order } from 'src/modules/admin/order/schema/order.schema';
import { Tax } from 'src/modules/admin/tax/schema/tax.schema';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/modules/admin/product/schema/product.schema';
import { EmailService, EmailType } from 'src/modules/email/email.service';
import path from 'node:path';
import { I18nService } from 'nestjs-i18n';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ClientOrderService {
  stripe: Stripe;
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Tax.name) private TaxModel: Model<Tax>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectQueue('email') private emailQueue: Queue,
    private config: ConfigService,
    private EmailService: EmailService,
    private readonly i18n: I18nService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async create(
    { paymentMethod, shippingAddress }: ClientCreateOrderDto,
    userId: string,
  ) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException(
        await this.i18n.t('service.EMPTY_CART_CHECKOUT'),
      );
    }
    let tax: any = await this.TaxModel.findOne({});
    if (!tax) {
      tax = { taxPrice: 0, shippingPrice: 0 };
    }
    const user = await this.UserModel.findById(userId);
    if (!user)
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    shippingAddress = user.address ? user.address : shippingAddress;
    if (!shippingAddress)
      throw new BadRequestException(
        await this.i18n.t('service.SHIPPING_ADDRESS_REQUIRED'),
      );
    paymentMethod = paymentMethod ? paymentMethod : 'Cash';
    const data = {
      cart: cart._id.toString(),
      user: userId,
      taxPrice: tax.taxPrice,
      shippingPrice: tax.shippingPrice,
      totalOrderPrice: cart.totalPrice + tax.taxPrice + tax.shippingPrice,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
    };
    if (paymentMethod === 'Cash') {
      const order = await this.OrderModel.create({
        taxPrice: data.taxPrice,
        shippingAddress: data.shippingAddress,
        shippingPrice: data.shippingPrice,
        paymentMethodType: data.paymentMethod,
        user: data.user,
        cart: data.cart,
        totalOrderPrice: data.totalOrderPrice,
        isDeliverd: false,
        isPaid: data.totalOrderPrice === 0 ? true : false,
        paidAt: data.totalOrderPrice === 0 ? new Date() : null,
      });
      if (data.totalOrderPrice === 0) {
        cart.cartItems.forEach(async (item) => {
          await this.ProductModel.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });
        await this.CartModel.findOneAndUpdate(
          { user: userId },
          { cartItems: [], totalPrice: 0 },
        );
      }
      return { data: { order } };
    }
    await cart.populate('cartItems.product', 'title price discountPrice');
    const items: Object[] = [];
    cart.cartItems.map((e) => {
      const obj = {
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(
            100 * ((e.product as any).price - (e.product as any).discountPrice),
          ),
          product_data: {
            name: (e.product as any).title,
          },
        },
        quantity: e.quantity,
      };
      items.push(obj);
    });
    const sessions = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      customer_email: user.email,
      client_reference_id: user.id,
    });
    const order = await this.OrderModel.create({
      ...data,
      sessionId: sessions.id,
      isPaid: false,
      isDeliverd: false,
    });
    return {
      data: {
        totalPrice: sessions.amount_total,
        session: sessions.id,
        url: sessions.url,
        order,
      },
    };
  }

  async updatePaidCard(payload: any, sig: any) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        secret as string,
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const sessionId = event.data.object.id;

        const order = await this.OrderModel.findOne({ sessionId });
        if (!order)
          throw new NotFoundException(
            await this.i18n.t('service.NOT_FOUND', {
              args: {
                name: await this.i18n.t('common.ORDER'),
              },
            }),
          );
        order.isPaid = true;
        order.isDeliverd = true;
        order.paidAt = new Date();
        order.deliverdAt = new Date();

        const cart = await this.CartModel.findOne({
          user: order.user.toString(),
        }).populate('cartItems.productId user');
        if (!cart)
          throw new NotFoundException(
            await this.i18n.t('service.NOT_FOUND', {
              args: {
                name: await this.i18n.t('common.CART'),
              },
            }),
          );

        cart.cartItems.forEach(async (item) => {
          await this.ProductModel.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });

        // reset Cart
        await this.CartModel.findOneAndUpdate(
          { user: order.user.toString() },
          { cartItems: [], totalPrice: 0 },
        );

        await order.save();
        await cart.save();
        const user = await this.UserModel.findById(order.user.toString());
        const data: EmailType = {
          from: this.config.get<string>('SMTP_USER')!,
          to: user?.email!,
          subject: 'Cash paid',
          template: path.join(__dirname, '../../../templates/cash-paid.ejs'),
          data: {
            name: user?.name,
            id: cart.id,
          },
        };
        await this.emailQueue.add('user-order', data, { backoff: 2000 });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
