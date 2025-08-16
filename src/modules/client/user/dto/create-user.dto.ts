import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Gender } from 'src/modules/admin/user/Schema/user.schema';

export class CreateUserDto {
  @IsString({ message: 'Your name should be a string value' })
  @Length(3, 30, {
    message: 'Your name length should be between 3 and 30 characters',
  })
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'Your email should be a string value' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Your password should be a string value' })
  @Length(3, 30, {
    message: 'Your name length should be between 3 and 30 characters',
  })
  @IsNotEmpty()
  password: string;

  @IsString({ message: 'Your avatar should be a string value' })
  @IsUrl({}, { message: 'Please provide an avatar url' })
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString({ message: 'Your phone number should be a string value' })
  @IsPhoneNumber('EG', { message: 'Provide a valid egyptian phone number' })
  @IsOptional()
  phoneNumber?: string;

  @IsString({ message: 'Your gender should be a string value' })
  @IsEnum(Gender, { message: 'Your gender should be only male or female' })
  @IsOptional()
  gender?: string;

  @IsString({ message: 'Your address should be a string value' })
  @IsOptional()
  address?: string;
}
