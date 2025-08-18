import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface SupplierDocument extends HydratedDocument<Supplier> {}

@Schema({ timestamps: true })
export class Supplier {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [100, 'Name must be at most 100 characters'],
    unique: true,
  })
  name: string;
  @Prop({
    type: String,
  })
  website: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
