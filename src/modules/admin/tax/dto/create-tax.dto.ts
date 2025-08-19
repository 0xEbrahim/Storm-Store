import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AdminCreateTaxDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  taxPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  shippingPrice?: number;
}
