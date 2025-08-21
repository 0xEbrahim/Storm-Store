import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateCouponDto } from './dto/create-coupon.dto';
import { AdminUpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema/coupon.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminCouponService {
  private cacheKeyPrefix = 'coupon';
  constructor(
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

  private async _INVALIDATE_COUPON_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }

  private async _CheckValidCoupon(_coupon: string) {
    const coupon = await this.CouponModel.findOne({ coupon: _coupon });
    if (coupon)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.COUPON'),
          },
        }),
      );
  }

  async create({ coupon: _coupon, discount, expireIn }: AdminCreateCouponDto) {
    await this._CheckValidCoupon(_coupon);
    const coupon = await this.CouponModel.create({
      coupon: _coupon,
      discount: discount,
      expireIn: expireIn,
    });
    await this._INVALIDATE_COUPON_CACHE();
    return { data: { coupon } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.CouponModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const coupons = await query.exec();
    const response = { data: { coupons }, page: +q.page, size: coupons.length };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const coupon = await this.CouponModel.findById(id);
    if (!coupon)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.COUPON'),
          },
        }),
      );
    return { data: { coupon } };
  }

  async update(id: string, updateCouponDto: AdminUpdateCouponDto) {
    let coupon = await this.CouponModel.findById(id);
    if (!coupon)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.COUPON'),
          },
        }),
      );
    if (updateCouponDto?.coupon)
      await this._CheckValidCoupon(updateCouponDto.coupon);
    coupon = await this.CouponModel.findByIdAndUpdate(id, updateCouponDto, {
      new: true,
    });
    await this._INVALIDATE_COUPON_CACHE();

    return { data: { coupon } };
  }

  async remove(id: string) {
    let coupon = await this.CouponModel.findById(id);
    if (!coupon)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.COUPON'),
          },
        }),
      );
    await this.CouponModel.findByIdAndDelete(id);
    await this._INVALIDATE_COUPON_CACHE();
  }
}
