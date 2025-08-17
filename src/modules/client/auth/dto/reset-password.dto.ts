import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty()
  @IsString({ message: 'Your password should be a string value' })
  @Length(3, 30, {
    message: 'Your name length should be between 3 and 30 characters',
  })
  @IsNotEmpty()
  password: string;
}
