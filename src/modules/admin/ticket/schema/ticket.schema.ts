import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/Schema/user.schema';
import { Category } from '../../category/schema/category.schema';

export interface TicketDocument extends HydratedDocument<Ticket> {}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
