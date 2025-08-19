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
@Injectable()
export class ClientOrderService {
  stripe: Stripe;
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Tax.name) private TaxModel: Model<Tax>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    private config: ConfigService,
    private EmailService: EmailService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY')!);
  }

  async create(
    { paymentMethod, shippingAddress }: ClientCreateOrderDto,
    userId: string,
  ) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Nothing to checkout, cart is empty');
    }
    let tax: any = await this.TaxModel.findOne({});
    if (!tax) {
      tax = { taxPrice: 0, shippingPrice: 0 };
    }
    const user = await this.UserModel.findById(userId);
    if (!user)
      throw new UnauthorizedException('You are not authorized to do this');
    shippingAddress = user.address ? user.address : shippingAddress;
    if (!shippingAddress)
      throw new BadRequestException('You have to provide a shipping address');
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
      success_url: 'https://www.google.com',
      cancel_url: 'https://www.google.com',
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

  async updateInCash(orderId: string, updateOrderDto: ClientUpdateOrderDto) {
    const order = await this.OrderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const user = await this.UserModel.findById(order.user.toString());
    if (order.paymentMethodType !== 'Cash') {
      throw new BadRequestException('This order not paid by cash');
    }

    if (order.isPaid) {
      throw new BadRequestException('Order already paid');
    }
    if (updateOrderDto.isPaid) {
      updateOrderDto.paidAt = new Date();
      const cart = await this.CartModel.findOne({
        user: order.user.toString(),
      }).populate('cartItems.product user');
      if (!cart) throw new NotFoundException('cart not found');
      cart.cartItems.forEach(async (item) => {
        await this.ProductModel.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: -item.quantity, sold: item.quantity } },
          { new: true },
        );
      });
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
      await this.EmailService.sendMail(data);
      await this.CartModel.findOneAndUpdate(
        { user: order.user.toString() },
        { cartItems: [], totalPrice: 0 },
      );
    }
    if (updateOrderDto.isDeliverd) {
      updateOrderDto.deliverdAt = new Date();
    }

    const updatedOrder = await this.OrderModel.findByIdAndUpdate(
      orderId,
      { ...updateOrderDto },
      { new: true },
    );
    return { data: { order: updatedOrder } };
  }
}
