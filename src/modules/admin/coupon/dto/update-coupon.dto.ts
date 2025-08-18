import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AdminUpdateCouponDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @IsOptional()
  coupon?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  expireIn?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  discount?: number;
}
