import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-In.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { User } from 'src/common/decorators/user.decorator';

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

  /**
   * @desc User requests to reset his forgotten password
   * @access Public
   * @method Post
   * @route /api/v1/auth/forgot-password
   */
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() ForgotPasswordDTO: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(ForgotPasswordDTO);
  }

  /**
   * @desc User resets his forgotten password
   * @access Public
   * @method Post
   * @route /api/v1/auth/reset-password/:code
   */
  @Post('reset-password/:code')
  @HttpCode(200)
  async resetPassword(
    @Param('code') code: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ) {
    return await this.authService.resetPassword(code, resetPasswordDTO);
  }

  /**
   *
   */
  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() ChangePasswordDTO: ChangePasswordDTO,
    @User() user: any,
  ) {
    return this.authService.changePassword(ChangePasswordDTO, user.id);
  }
}
