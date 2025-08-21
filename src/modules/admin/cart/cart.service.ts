import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminCartService {
  private cacheKeyPrefix = 'cart';
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

  async findOne(id: string) {
    const cart = await this.CartModel.findById(id);
    if (!cart)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.CART'),
          },
        }),
      );
    await cart.populate('cartItems.product');
    return { data: { cart } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.CartModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const carts = await query.exec();
    const response = { data: { carts }, page: +q.page, size: carts.length };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }
}
