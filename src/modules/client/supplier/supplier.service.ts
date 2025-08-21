import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Supplier } from 'src/modules/admin/supplier/schema/supplier.schema';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class ClientSupplierService {
  private cacheKeyPrefix = 'supplier';
  constructor(
    @InjectModel(Supplier.name) private SupplierModel: Model<Supplier>,
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
    const query = new ApiFeatures(this.SupplierModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const suppliers = await query.exec();
    const response = {
      data: { suppliers },
      page: +q.page,
      size: suppliers.length,
    };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const supplier = await this.SupplierModel.findById(id);
    if (!supplier)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUPPLIER'),
          },
        }),
      );
    return { data: { supplier } };
  }
}
