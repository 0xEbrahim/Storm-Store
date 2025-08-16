import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export enum Roles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    minLength: [3, 'Name must be at least 3 characers'],
    maxLength: [30, 'Name must be at most 30 characers'],
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    minLength: [3, 'Password must be at least 3 characers'],
    maxLength: [30, 'Password must be at most 30 characers'],
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Roles,
    default: Roles.USER,
  })
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Boolean })
  active: boolean;

  @Prop({ type: String })
  verificationCode: string;

  @Prop({ type: String, enum: Gender })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
