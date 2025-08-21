import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    private readonly i18n: I18nService,
  ) {}

  private async _checkValidName(name: string) {
    const category = await this.CategoryModel.findOne({ name: name });
    if (category)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.CATEGORY'),
          },
        }),
      );
  }

  async create(createCategoryDto: AdminCreateCategoryDto) {
    await this._checkValidName(createCategoryDto.name);
    const category = await this.CategoryModel.create(createCategoryDto);
    return { data: { category } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.CategoryModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const categories = await query.exec();
    return { data: { categories }, page: +q.page, size: categories.length };
  }

  async findOne(id: string) {
    const category = await this.CategoryModel.findById(id);
    if (!category)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.CATEGORY'),
          },
        }),
      );
    return { data: { category } };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let category = await this.CategoryModel.findById(id);
    if (!category)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.CATEGORY'),
          },
        }),
      );
    if (updateCategoryDto?.name)
      await this._checkValidName(updateCategoryDto.name);
    category = await this.CategoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    return { data: { category } };
  }

  async remove(id: string) {
    let category = await this.CategoryModel.findById(id);
    if (!category)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.CATEGORY'),
          },
        }),
      );
    await this.CategoryModel.findByIdAndDelete(id);
  }
}
