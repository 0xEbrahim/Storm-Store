import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import { SignUpDTO } from './dto/sign-up.dto';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { SignInDTO } from './dto/sign-In.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwt: JWTService,
  ) {}

  async SignUp({ email, name, password }: SignUpDTO) {
    let user = await this.UserModel.findOne({ email: email });
    if (user) throw new BadRequestException('Email already exists');
    user = await this.UserModel.create({ name, email, password });
    return { data: { user } };
  }

  async SignIn({ email, password }: SignInDTO) {
    let user = await this.UserModel.findOne({ email });
    if (!user || !user.comparePasswords(password ?? '')) {
      throw new BadRequestException('Wrong email or password');
    }
    const payload = {
      id: user.id,
      role: user.role,
      active: user.active,
    };
    const token = await this.jwt.generateAccessToken(payload);
    return { data: { user }, token };
  }
}
