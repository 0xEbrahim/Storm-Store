import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class AdminUpdateReviewDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(500)
  @IsOptional()
  text?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  product?: string;
}
