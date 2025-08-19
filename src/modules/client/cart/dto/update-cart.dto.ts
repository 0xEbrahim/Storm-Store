import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ClientUpdateCartDto{
     @ApiProperty()
      @IsString()
      @IsNotEmpty()
      @IsMongoId()
      productId: string;
    
      @ApiPropertyOptional()
      @IsNumber()
      @IsNotEmpty()
      @IsOptional()
      quantity?: number;
    
      @ApiPropertyOptional()
      @IsString()
      @IsNotEmpty()
      @IsOptional()
      color: string;
}
