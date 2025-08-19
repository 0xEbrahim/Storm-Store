import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ClientCreateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(500)
  text: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  product: string;
}
