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
import { JWTService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwt: JWTService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new BadRequestException('Email is already exists.');
    }
    return await this.UserModel.create(createUserDto);
  }

  async findAll() {
    return await this.UserModel.find().select('-password -__v');
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    updateUserDto.password = undefined;
    user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.UserModel.findByIdAndDelete(id);
  }
}
