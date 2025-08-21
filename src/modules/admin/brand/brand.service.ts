import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateBrandDto } from './dto/create-brand.dto';
import { AdminUpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema/brand.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminBrandService {
  private cacheKeyPrefix = 'brand';
  constructor(
    @InjectModel(Brand.name) private BrandModel: Model<Brand>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

  private async _INVALIDATE_BRAND_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }

  async _CheckValidName(name: string) {
    const brand = await this.BrandModel.findOne({ name: name });
    if (brand)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.BRAND'),
          },
        }),
      );
  }

  async create(createbrandDto: AdminCreateBrandDto) {
    await this._CheckValidName(createbrandDto.name);
    const brand = await this.BrandModel.create(createbrandDto);
    await this._INVALIDATE_BRAND_CACHE();
    return { data: { brand } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.BrandModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const categories = await query.exec();
    const response = {
      data: { categories },
      page: +q.page,
      size: categories.length,
    };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const brand = await this.BrandModel.findById(id);
    if (!brand)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.BRAND'),
          },
        }),
      );
    return { data: { brand } };
  }

  async update(id: string, updateBrandDto: AdminUpdateBrandDto) {
    let brand = await this.BrandModel.findById(id);
    if (!brand)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.BRAND'),
          },
        }),
      );
    if (updateBrandDto?.name) await this._CheckValidName(updateBrandDto.name);
    brand = await this.BrandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    });
    await this._INVALIDATE_BRAND_CACHE();
    return { data: { brand } };
  }

  async remove(id: string) {
    let brand = await this.BrandModel.findById(id);
    if (!brand)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.BRAND'),
          },
        }),
      );
    await this.BrandModel.findByIdAndDelete(id);
    await this._INVALIDATE_BRAND_CACHE();
  }
}
