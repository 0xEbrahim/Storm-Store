import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/schema/category.schema';

export interface SubCategoryModel extends HydratedDocument<SubCategory> {}

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    minLength: [3, 'Name must be at least 3 characers'],
    maxLength: [30, 'Name must be at most 30 characers'],
  })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
