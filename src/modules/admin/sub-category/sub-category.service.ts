import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateSubCategoryDto } from './dto/create-sub-category.dto';
import { AdminUpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './schema/sub-category.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Category } from '../category/schema/category.schema';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminSubCategoryService {
  private cacheKeyPrefix = 'subCategory';
  constructor(
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    private readonly i18n: I18nService,
    @InjectRedis() private redis: Redis,
  ) {}
  private async _INVALIDATE_SUB_CATEGORY_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }
  private async _CheckValidSubCategoryName(subCategoryName: string) {
    let subCategory = await this.SubCategoryModel.findOne({
      name: subCategoryName,
    });
    if (subCategory)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.SUB_CATEGORY'),
          },
        }),
      );
  }

  private async _CheckValidCategoryId(categoryId: string) {
    const category = await this.CategoryModel.findById(categoryId);
    if (!category)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.CATEGORY'),
          },
        }),
      );
  }

  async create({ categoryId, name }: AdminCreateSubCategoryDto) {
    await this._CheckValidCategoryId(categoryId);
    await this._CheckValidSubCategoryName(name);
    const subCategory = await this.SubCategoryModel.create({
      categoryId,
      name,
    });
    return { data: { subCategory } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.SubCategoryModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const subCategories = await query.exec();
    const response = {
      data: { subCategories },
      page: +q.page,
      size: subCategories.length,
    };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const subCategory =
      await this.SubCategoryModel.findById(id).populate('categoryId');
    if (!subCategory)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUB_CATEGORY'),
          },
        }),
      );
    return { data: { subCategory } };
  }

  async update(id: string, updateCategoryDto: AdminUpdateSubCategoryDto) {
    let subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUB_CATEGORY'),
          },
        }),
      );
    if (updateCategoryDto?.categoryId)
      await this._CheckValidCategoryId(updateCategoryDto.categoryId);
    if (updateCategoryDto?.name)
      await this._CheckValidSubCategoryName(updateCategoryDto.name);
    subCategory = await this.SubCategoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    await this._INVALIDATE_SUB_CATEGORY_CACHE();
    return { data: { subCategory } };
  }

  async remove(id: string) {
    let subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUB_CATEGORY'),
          },
        }),
      );
    await this.SubCategoryModel.findByIdAndDelete(id);
    await this._INVALIDATE_SUB_CATEGORY_CACHE();
  }
}
