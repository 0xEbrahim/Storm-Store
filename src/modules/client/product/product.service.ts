import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Product } from 'src/modules/admin/product/schema/product.schema';
import { I18nService } from 'nestjs-i18n';
import stringify from 'fast-json-stable-stringify';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ClientProductService {
  private cacheKeyPrefix = 'product';
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
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
    const query = new ApiFeatures(this.ProductModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const products = await query.exec();
    const response = {
      data: { products },
      page: +q.page,
      size: products.length,
    };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    return { data: { product } };
  }
}
