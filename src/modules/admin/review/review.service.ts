import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminCreateReviewDto } from './dto/create-review.dto';
import { AdminUpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';
import { Product } from '../product/schema/product.schema';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AdminReviewService {
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    private readonly i18n: I18nService,
  ) {}

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

  async create(createReviewDto: AdminCreateReviewDto, userId: string) {
    await this._CheckValidProduct(createReviewDto.product);
    const review = await this.ReviewModel.create({
      ...createReviewDto,
      user: userId,
    });
    return { data: { review } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.ReviewModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const reviews = await query.exec();
    return { data: { reviews }, page: +q.page, size: reviews.length };
  }

  async findOne(id: string) {
    const review = await this.ReviewModel.findById(id).populate('user');
    if (!review)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.REVIEW'),
          },
        }),
      );
    return { data: { review } };
  }

  async update(id: string, updateReviewDto: AdminUpdateReviewDto) {
    if (updateReviewDto?.product)
      await this._CheckValidProduct(updateReviewDto?.product);
    let review = await this.ReviewModel.findById(id);
    if (!review)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.REVIEW'),
          },
        }),
      );
    review = await this.ReviewModel.findByIdAndUpdate(id, updateReviewDto, {
      new: true,
    }).populate('user');
    return { data: { review } };
  }

  async remove(id: string) {
    const review = await this.ReviewModel.findById(id);
    if (!review)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.REVIEW'),
          },
        }),
      );
    await this.ReviewModel.findByIdAndDelete(id);
  }
}
