import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class AdminCreateCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  coupon: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  expireIn: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discount: number;
}
