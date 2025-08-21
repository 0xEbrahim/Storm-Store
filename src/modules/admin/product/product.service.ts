import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateProductDto } from './dto/create-product.dto';
import { AdminUpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { Category } from '../category/schema/category.schema';
import { SubCategory } from '../sub-category/schema/sub-category.schema';
import { Brand } from '../brand/schema/brand.schema';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import stringify from 'fast-json-stable-stringify';

@Injectable()
export class AdminProductService {
  cacheKeyPrefix = 'product';
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Brand.name) private BrandModel: Model<Brand>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}

  private async _INVALIDATE_PRODUCT_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }
  private async _CheckValidTitle(title: string) {
    const product = await this.ProductModel.findOne({ title: title });
    if (product)
      throw new BadRequestException(
        await this.i18n.t('service.ALREADY_EXISTS', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
  }

  private async _CheckValidCategory(categoryId: string) {
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

  private async _CheckValidSubCategory(
    subCategoryId: string,
    category: string,
  ) {
    const subCategory = await this.SubCategoryModel.findOne({
      _id: subCategoryId,
      categoryId: category,
    });
    if (!subCategory)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.SUB_CATEGORY'),
          },
        }),
      );
  }

  private async _CheckValidBrand(brandId: string) {
    const brand = await this.BrandModel.findById(brandId);
    if (!brand)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.BRAND'),
          },
        }),
      );
  }

  async create(createProductDto: AdminCreateProductDto) {
    await this._CheckValidTitle(createProductDto.title);
    await this._CheckValidCategory(createProductDto.category);
    if (createProductDto?.subCategory)
      await this._CheckValidSubCategory(
        createProductDto?.subCategory,
        createProductDto.category,
      );
    if (createProductDto?.brand)
      await this._CheckValidBrand(createProductDto?.brand);
    if (
      createProductDto?.discountPrice &&
      createProductDto?.discountPrice >= createProductDto.price
    ) {
      throw new BadRequestException(
        await this.i18n.t('service.INVALID_DISCOUNT_PRICE'),
      );
    }
    const product = await this.ProductModel.create(createProductDto);
    product.populate('category subCategory brand');
    return { data: { product } };
  }

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

  async update(id: string, updateProductDto: AdminUpdateProductDto) {
    let product = await this.ProductModel.findById(id);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    if (updateProductDto?.title)
      await this._CheckValidTitle(updateProductDto?.title);
    if (updateProductDto?.category)
      await this._CheckValidCategory(updateProductDto?.category);
    if (updateProductDto?.category && updateProductDto?.subCategory)
      await this._CheckValidSubCategory(
        updateProductDto?.subCategory,
        updateProductDto?.category,
      );
    if (updateProductDto?.brand)
      await this._CheckValidBrand(updateProductDto?.brand);
    if (
      (updateProductDto?.discountPrice &&
        updateProductDto?.discountPrice >= product.price) ||
      (updateProductDto?.discountPrice &&
        updateProductDto?.price &&
        updateProductDto?.discountPrice >= updateProductDto?.price)
    ) {
      throw new BadRequestException(
        await this.i18n.t('service.INVALID_DISCOUNT_PRICE'),
      );
    }
    product = await this.ProductModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
    await this._INVALIDATE_PRODUCT_CACHE();
    return { data: { product } };
  }

  async remove(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    await this.ProductModel.findByIdAndDelete(id);
    await this._INVALIDATE_PRODUCT_CACHE();
  }
}
