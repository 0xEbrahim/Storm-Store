import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schema/user.schema';
import { Model } from 'mongoose';
import { JWTService } from '../../jwt/jwt.service';

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
    return await this.UserModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
