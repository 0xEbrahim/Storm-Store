import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class AdminUpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPaid: boolean;
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  paidAt: Date;
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isDeliverd: boolean;
  @IsOptional()
  @IsDate()
  @ApiPropertyOptional()
  deliverdAt: Date;
}
