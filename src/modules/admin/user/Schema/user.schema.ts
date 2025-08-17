import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

export interface UserDocument extends HydratedDocument<User> {
  comparePasswords(password: string): Promise<boolean>;
  createPasswordResetCode(): Promise<string>;
  updatePassword(): Promise<void>;
}

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
  avatar?: string;

  @Prop({ type: Number })
  age?: number;

  @Prop({ type: String })
  phoneNumber?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: String, unique: true })
  forgotPasswordCode?: string;

  @Prop({ type: Date, required: false })
  forgotPasswordCodeExpiresIn?: Date;

  @Prop({ type: String, enum: Gender })
  gender?: string;
  async comparePasswords(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
  async createPasswordResetCode(): Promise<string> {
    const code = await crypto.randomBytes(32).toString('hex');
    const encrypt = await crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');
    this.forgotPasswordCode = encrypt;
    this.forgotPasswordCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000);
    return code;
  }

  async updatePassword(): Promise<void> {
    this.forgotPasswordCode = undefined;
    this.forgotPasswordCodeExpiresIn = undefined;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltOrRound = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, saltOrRound);
  return next();
});

UserSchema.methods.comparePasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createPasswordResetCode = async function () {
  const code = await crypto.randomBytes(32).toString('hex');
  const encrypt = await crypto.createHash('sha256').update(code).digest('hex');
  this.forgotPasswordCode = encrypt;
  this.forgotPasswordCodeExpiresIn = Date.now() + 10 * 60 * 1000;
  return code;
};

UserSchema.methods.updatePassword = async function () {
  this.forgotPasswordCode = undefined;
  this.forgotPasswordCodeExpiresIn = undefined;
};
