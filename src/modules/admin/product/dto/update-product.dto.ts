import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AdminUpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(500)
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  mainImage?: string;

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(1000000)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsOptional()
  color?: string[];

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  subCategory?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  brand?: string;
}
