import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AdminCreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(500)
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  mainImage: string;

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(1000000)
  price: number;

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
  category: string;

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
