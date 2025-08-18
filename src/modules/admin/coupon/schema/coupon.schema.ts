import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface CouponDocument extends HydratedDocument<Coupon> {}

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true, unique: true })
  coupon: string;

  @Prop({ type: Date, required: true })
  expireIn: Date;

  @Prop({ type: Number, required: true })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
