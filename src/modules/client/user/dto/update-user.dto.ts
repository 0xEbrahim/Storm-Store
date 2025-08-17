import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
export class ClientUpdateUserDto {
  @ApiProperty()
  @IsString({ message: 'Your name should be a string value' })
  @Length(3, 30, {
    message: 'Your name length should be between 3 and 30 characters',
  })
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString({ message: 'Your email should be a string value' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Your avatar should be a string value' })
  @IsUrl({}, { message: 'Please provide an avatar url' })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiPropertyOptional()
  @IsString({ message: 'Your phone number should be a string value' })
  @IsPhoneNumber('EG', { message: 'Provide a valid egyptian phone number' })
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Your gender should be a string value' })
  @IsEnum(Gender, { message: 'Your gender should be only male or female' })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Your address should be a string value' })
  @IsOptional()
  address?: string;
}
