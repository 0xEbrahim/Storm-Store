import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdminUpdateSubCategoryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  categoryId?: string;
}
