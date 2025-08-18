import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface BrandDocument extends HydratedDocument<Brand> {}

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    required: true,
    minLength: [3, 'Name must be at least 3 characers'],
    maxLength: [100, 'Name must be at most 100 characers'],
  })
  name: string;

  @Prop({ type: String })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
