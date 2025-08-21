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
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.UserModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.USER'),
          },
        }),
      );
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.UserModel.findById(id);
    if (!user)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.USER'),
          },
        }),
      );
    user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return { data: { user } };
  }

  async remove(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.USER'),
          },
        }),
      );
    await this.UserModel.findByIdAndDelete(id);
  }
}
