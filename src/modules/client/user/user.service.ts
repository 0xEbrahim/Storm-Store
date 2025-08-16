import { Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findProfile(userId: string) {
    const user = await this.UserModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
}
