import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface CategoryDocument extends HydratedDocument<Category> {}

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    minLength: [3, 'Name must be at least 3 characers'],
    maxLength: [30, 'Name must be at most 30 characers'],
  })
  name: string;

  @Prop({ type: String })
  image?: string;
}

export const categorySchema = SchemaFactory.createForClass(Category);
