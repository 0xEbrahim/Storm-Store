import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productId: string;
}
