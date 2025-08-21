import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { SubCategory } from 'src/modules/admin/sub-category/schema/sub-category.schema';
import { I18nService } from 'nestjs-i18n';
import { stringify } from 'querystring';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AdminSubCategoryService {
  private cacheKeyPrefix = 'subCategory';
  constructor(
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

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
    const subCategory = await this.SubCategoryModel.findById(id);
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
}
