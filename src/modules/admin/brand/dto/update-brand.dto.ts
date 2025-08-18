import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class AdminUpdateBrandDto  {
     @ApiPropertyOptional()
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(100)
      @IsOptional()
      name: string;
    
      @ApiPropertyOptional()
      @IsString()
      @IsUrl()
      @IsOptional()
      image: string;
}
