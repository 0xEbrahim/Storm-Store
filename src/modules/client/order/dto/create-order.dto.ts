import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientCreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsIn(['Cash', 'Card'])
  @IsOptional()
  paymentMethod: string;
}
