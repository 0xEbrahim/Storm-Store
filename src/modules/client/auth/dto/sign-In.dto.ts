import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDTO {
  @ApiProperty()
  @IsString({ message: 'Your email should be a string value' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString({ message: 'Your password should be a string value' })
  @Length(3, 30, {
    message: 'Your name length should be between 3 and 30 characters',
  })
  @IsNotEmpty()
  password: string;
}
