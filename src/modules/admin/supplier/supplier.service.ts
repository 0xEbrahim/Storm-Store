import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateSupplierDto } from './dto/create-supplier.dto';
import { AdminUpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schema/supplier.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminSupplierService {
  private cacheKeyPrefix = 'supplier';

  constructor(
    @InjectModel(Supplier.name) private SupplierModel: Model<Supplier>,
    private readonly i18n: I18nService,
    @InjectRedis() private redis: Redis,
  ) {}
  private async _INVALIDATE_SUPPLIER_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }

  private async _checkValidName(name: string) {
    const supplier = await this.SupplierModel.findOne({ name: name });
    if (supplier)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.SUPPLIER'),
          },
        }),
      );
  }

  async create(createSupplierDto: AdminCreateSupplierDto) {
    await this._checkValidName(createSupplierDto.name);
    const supplier = await this.SupplierModel.create(createSupplierDto);
    await this._INVALIDATE_SUPPLIER_CACHE();
    return { data: { supplier } };
  }

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

  async update(id: string, updateSupplierDto: AdminUpdateSupplierDto) {
    let supplier = await this.SupplierModel.findById(id);
    if (!supplier)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUPPLIER'),
          },
        }),
      );
    if (updateSupplierDto?.name)
      await this._checkValidName(updateSupplierDto?.name);
    supplier = await this.SupplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true },
    );
    await this._INVALIDATE_SUPPLIER_CACHE();
    return { data: { supplier } };
  }

  async remove(id: string) {
    const supplier = await this.SupplierModel.findById(id);
    if (!supplier)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUPPLIER'),
          },
        }),
      );
    await this.SupplierModel.findByIdAndDelete(id);
    await this._INVALIDATE_SUPPLIER_CACHE();
  }
}
