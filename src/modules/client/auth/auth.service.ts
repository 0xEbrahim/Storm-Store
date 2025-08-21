import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import crypto from 'node:crypto';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import { SignUpDTO } from './dto/sign-up.dto';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { SignInDTO } from './dto/sign-In.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { EmailService, EmailType } from 'src/modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { Cart } from 'src/modules/admin/cart/schema/cart.schema';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectQueue('email') private emailQueue: Queue,
    private jwt: JWTService,
    private emailService: EmailService,
    private config: ConfigService,
    private readonly I18n: I18nService,
  ) {}

  async SignUp({ email, name, password }: SignUpDTO) {
    let user = await this.UserModel.findOne({ email: email });
    if (user)
      throw new BadRequestException(
        await this.I18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.I18n.t('common.USER'),
          },
        }),
      );
    user = await this.UserModel.create({ name, email, password });
    await this.CartModel.create({ user: user._id });
    return { data: { user } };
  }

  async SignIn({ email, password }: SignInDTO) {
    let user = await this.UserModel.findOne({ email });
    if (!user || !(await user.comparePasswords(password ?? ''))) {
      throw new BadRequestException(await this.I18n.t('service.WRONG_CRED'));
    }
    const payload = {
      id: user.id,
      role: user.role,
      active: user.active,
    };
    const token = await this.jwt.generateAccessToken(payload);
    return { data: { user }, token };
  }

  async forgotPassword({ email }: ForgotPasswordDTO) {
    let user = await this.UserModel.findOne({ email });
    if (!user) {
      return { message: await this.I18n.t('service.PASSWORD_EMAIL') };
    }
    const code = await user.createPasswordResetCode();
    await user.save();
    const link = `${this.config.get<string>('RESET_PASSWORD_LINK')}/${code}`;
    const data: EmailType = {
      from: this.config.get<string>('SMTP_USER')!,
      to: user.email,
      subject: 'Forgot password',
      template: path.join(__dirname, '../../../templates/forgot-password.ejs'),
      data: {
        resetLink: link,
        name: user.name,
        expireMinutes: '10',
      },
    };
    await this.emailQueue.add('resetEmail', data, { backoff: 2000 });
    return { message: await this.I18n.t('service.PASSWORD_EMAIL') };
  }

  async resetPassword(code: string, { password }: ResetPasswordDTO) {
    const decrypt = await crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');
    const user = await this.UserModel.findOne({ forgotPasswordCode: decrypt });
    if (
      !user ||
      !user?.forgotPasswordCodeExpiresIn ||
      user?.forgotPasswordCodeExpiresIn <= new Date(Date.now())
    ) {
      throw new BadRequestException(
        await this.I18n.t('service.INVALID_PASS_TOKEN'),
      );
    }
    user.updatePassword();
    console.log(password);
    await user.save();
    return { message: this.I18n.t('service.PASSWORD_SUC_RESET') };
  }

  async changePassword(
    { oldPassword, newPassword }: ChangePasswordDTO,
    userId: string,
  ) {
    /**
     * TODO:
     *  - Blacklist token
     */
    const user = await this.UserModel.findById(userId);
    if (!user)
      throw new NotFoundException(
        await this.I18n.t('service.NOT_FOUND', {
          args: {
            name: await this.I18n.t('common.USER'),
          },
        }),
      );
    if (!(await user.comparePasswords(oldPassword)))
      throw new BadRequestException(await this.I18n.t('service.OLD_PASSWORD'));
    user.password = newPassword;
    await user.save();
    return { data: { user }, message: 'service.PASSWORD_SUC_RESET' };
  }
}
