import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schema/product.schema';
import { Coupon } from '../../coupon/schema/coupon.schema';
import { User } from '../../user/Schema/user.schema';

export interface CartDocument extends HydratedDocument<Cart> {}

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          required: true, 
          ref: Product.name, 
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  cartItems: {
    product: string;
    quantity: number;
    color: string;
  }[];

  @Prop({ type: Number, min: 0, default: 0 })
  totalPrice: number;

  @Prop({ type: Number, min: 0, default: 0 })
  totalDiscountPrice: number;

  @Prop({ type: [Types.ObjectId], ref: Coupon.name })
  coupons: string[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
