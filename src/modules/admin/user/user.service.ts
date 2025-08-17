import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schema/user.schema';
import { Model } from 'mongoose';
import { JWTService } from '../../jwt/jwt.service';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwt: JWTService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // return await this.jwt.generateAccessToken({
    //   id: '68a0c2e0b2f063a4829f23fd',
    //   active: false,
    //   role: 'ADMIN',
    // });
    const userExist = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new BadRequestException('Email is already exists.');
    }
    const user = await this.UserModel.create(createUserDto);
    return { data: { user } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;

    const query = new ApiFeatures(this.UserModel.find({}), q)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const users = await query.exec();
    return { data: { users }, page: +q.page, size: users.length };
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return { data: { user } };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    updateUserDto.password = undefined;
    user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return { data: { user } };
  }

  async remove(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.UserModel.findByIdAndDelete(id);
  }
}
