import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schema/product.schema';
import { User } from '../../user/Schema/user.schema';
import { Cart } from '../../cart/schema/cart.schema';

export interface OrderDocument extends HydratedDocument<Order> {}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: string;
  @Prop({
    type: String,
    required: false,
  })
  sessionId: string;
  @Prop({ type: Types.ObjectId, required: true, ref: Cart.name })
  cart: string;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  taxPrice: number;
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  shippingPrice: number;
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalOrderPrice: number;
  @Prop({
    type: String,
    required: false,
    default: 'Card',
    enum: ['Cash', 'Card'],
  })
  paymentMethodType: string;
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isPaid: boolean;
  @Prop({
    type: Date,
    required: false,
  })
  paidAt: Date;
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDeliverd: boolean;
  @Prop({
    type: Date,
    required: false,
  })
  deliverdAt: Date;
  @Prop({
    type: String,
    required: false,
  })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
