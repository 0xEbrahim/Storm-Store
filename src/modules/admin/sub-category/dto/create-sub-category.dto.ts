import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminCreateSubCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}
