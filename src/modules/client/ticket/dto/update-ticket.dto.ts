import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ClientUpdateTicketDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  @IsOptional()
  text: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  category: string;
}
