import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsString({ message: 'Your email should be a string value' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;
}
