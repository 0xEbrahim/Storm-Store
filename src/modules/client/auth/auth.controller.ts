import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-In.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @desc User Creates account
   * @access Public
   * @method Post
   * @route /api/v1/auth/sign-up
   */
  @Post('sign-up')
  @HttpCode(201)
  async SignUp(@Body() signUpDTO: SignUpDTO) {
    return await this.authService.SignUp(signUpDTO);
  }

  /**
   * @desc User login account
   * @access Public
   * @method Post
   * @route /api/v1/auth/sign-in
   */
  @Post('sign-in')
  @HttpCode(200)
  async SignIn(@Body() signInDTO: SignInDTO) {
    return await this.authService.SignIn(signInDTO);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() ForgotPasswordDTO: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(ForgotPasswordDTO);
  }

  @Post('reset-password/:code')
  @HttpCode(200)
  async resetPassword(
    @Param('code') code: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ) {
    return await this.authService.resetPassword(code, resetPasswordDTO);
  }
}
