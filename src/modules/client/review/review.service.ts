import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientCreateReviewDto } from './dto/create-review.dto';
import { ClientUpdateReviewDto } from './dto/update-review.dto';
import { Product } from 'src/modules/admin/product/schema/product.schema';
import { Review } from 'src/modules/admin/review/schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class ClientReviewService {
  private cacheKeyPrefix = 'review';
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

  private async _INVALIDATE_REVIEW_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }
  private async _CheckValidProduct(productId: string) {
    const product = await this.ProductModel.findById(productId);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
  }

  async create(createReviewDto: ClientCreateReviewDto, userId: string) {
    await this._CheckValidProduct(createReviewDto.product);
    const review = await this.ReviewModel.create({
      ...createReviewDto,
      user: userId,
    });
    return { data: { review } };
  }

  async findAll(q: any, userId: string) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.ReviewModel.find({ user: userId }), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const reviews = await query.exec();
    const response = { data: { reviews }, page: +q.page, size: reviews.length };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
  }

  async findOne(id: string) {
    const review = await this.ReviewModel.findById(id);
    if (!review)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.REVIEW'),
          },
        }),
      );
    await review.populate('user');
    return { data: { review } };
  }

  async update(
    id: string,
    updateReviewDto: ClientUpdateReviewDto,
    userId: string,
  ) {
    let review = await this.ReviewModel.findOne({ _id: id, user: userId });
    if (!review)
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    if (updateReviewDto?.product)
      await this._CheckValidProduct(updateReviewDto?.product);
    review = await this.ReviewModel.findByIdAndUpdate(id, updateReviewDto, {
      new: true,
    });
    await this._INVALIDATE_REVIEW_CACHE();
    return { data: { review } };
  }

  async remove(id: string, userId: string) {
    const review = await this.ReviewModel.findOne({ _id: id, user: userId });
    if (!review)
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    await this.ReviewModel.findByIdAndDelete(id);
    await this._INVALIDATE_REVIEW_CACHE();
  }
}
