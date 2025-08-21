import {
  IsBoolean,
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
import { Gender, Roles } from '../Schema/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(3, 30, {
    message: i18nValidationMessage('validation.LENGTH', { min: 3, max: 30 }),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(3, 30, {
    message: i18nValidationMessage('validation.LENGTH', { min: 3, max: 30 }),
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEnum(Roles, { message: i18nValidationMessage('validation.IS_ENUM_ROLES') })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUrl({}, { message: i18nValidationMessage('validation.IS_URL') })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsOptional()
  age?: number;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsPhoneNumber('EG', {
    message: i18nValidationMessage('validation.IS_PHONE_NUMBER_EG'),
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEnum(Gender, {
    message: i18nValidationMessage('validation.IS_ENUM_GENDER'),
  })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  verificationCode?: string;

  @ApiPropertyOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  active?: boolean;
}
