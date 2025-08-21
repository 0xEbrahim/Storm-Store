import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientUpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly i18n: I18nService,
  ) {}

  private async _checkExistance(userId: string) {
    let user = await this.UserModel.findById(userId);
    if (!user)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.USER'),
          },
        }),
      );
    return { data: { user } };
  }

  async findProfile(userId: string) {
    let user: any = this._checkExistance(userId);
    return { data: { user } };
  }

  async updateUser(DTO: ClientUpdateUserDto, userId: string) {
    let user: any = this._checkExistance(userId);
    user = await this.UserModel.findByIdAndUpdate(userId, DTO, {
      new: true,
    }).select('-password -__v');
    return { data: { user } };
  }

  async deactivateProfile(userId: string) {
    let user: any = this._checkExistance(userId);
    user = await this.UserModel.findByIdAndUpdate(userId, { active: false });
  }
}
