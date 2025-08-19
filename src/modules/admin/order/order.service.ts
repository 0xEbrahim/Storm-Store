import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../cart/schema/cart.schema';
import { Tax } from '../tax/schema/tax.schema';
import { User } from '../user/Schema/user.schema';
import { Product } from '../product/schema/product.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailService, EmailType } from 'src/modules/email/email.service';
import { AdminUpdateOrderDto } from './dto/UpdateCash.dto';
import path from 'node:path';

@Injectable()
export class AdminOrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Tax.name) private TaxModel: Model<Tax>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    private config: ConfigService,
    private EmailService: EmailService,
  ) {}

  async updateInCash(orderId: string, updateOrderDto: AdminUpdateOrderDto) {
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
