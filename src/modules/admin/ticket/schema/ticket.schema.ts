import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface TicketDocument extends HydratedDocument<Ticket> {}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: Types.ObjectId, required: true })
  user: string;

  @Prop({ type: Types.ObjectId, required: true })
  category: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
