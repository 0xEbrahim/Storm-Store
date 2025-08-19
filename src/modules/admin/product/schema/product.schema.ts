import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/schema/category.schema';
import { SubCategory } from '../../sub-category/schema/sub-category.schema';
import { Brand } from '../../brand/schema/brand.schema';

export interface ProductDocument extends HydratedDocument<Product> {}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, minLength: 3, required: true, unique: true })
  title: string;

  @Prop({ type: String, required: true, minLength: 20 })
  description: string;

  @Prop({ type: Number, min: 1, max: 500, default: 1, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  mainImage: string;

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ type: Number })
  sold?: number;

  @Prop({ type: Number, required: true, min: 1, max: 1000000 })
  price: number;

  @Prop({ type: Number, min: 1, max: 1000000, default: 0 })
  discountPrice?: number;

  @Prop({ type: [String] })
  color?: string[];

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: string;

  @Prop({ Type: Types.ObjectId, ref: SubCategory.name })
  subCategory?: string;

  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand?: string;

  @Prop({ type: Number, default: 0 })
  averageRatings?: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
