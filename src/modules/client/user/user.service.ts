import { Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  private async _checkExistance(userId: string) {
    let user = await this.UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async findProfile(userId: string) {
    let user: any = this._checkExistance(userId);
    return user;
  }

  async updateUser(DTO: UpdateUserDto, userId: string) {
    let user: any = this._checkExistance(userId);
    user = await this.UserModel.findByIdAndUpdate(userId, DTO, {
      new: true,
    }).select('-passoword -__v');
    return { user };
  }

  async deactivateProfile(userId: string) {
    let user: any = this._checkExistance(userId);
    user = await this.UserModel.findByIdAndUpdate(userId, { active: false });
  }
}
