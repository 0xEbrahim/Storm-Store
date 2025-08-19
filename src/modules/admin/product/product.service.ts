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

@Injectable()
export class AdminProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Brand.name) private BrandModel: Model<Brand>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
  ) {}

  private async _CheckValidTitle(title: string) {
    const product = await this.ProductModel.findOne({ title: title });
    if (product) throw new BadRequestException('Product already exists');
  }
  private async _CheckValidCategory(categoryId: string) {
    const category = await this.CategoryModel.findById(categoryId);
    if (!category) throw new NotFoundException('Category not found');
  }
  private async _CheckValidSubCategory(
    subCategoryId: string,
    category: string,
  ) {
    const subCategory = await this.SubCategoryModel.findOne({
      _id: subCategoryId,
      categoryId: category,
    });
    if (!subCategory) throw new NotFoundException('Sub category not found');
  }
  private async _CheckValidBrand(brandId: string) {
    const brand = await this.BrandModel.findById(brandId);
    if (!brand) throw new NotFoundException('Brand not found');
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
        "Discount price can't be more than or equal the original price",
      );
    }
    const product = await this.ProductModel.create(createProductDto);
    product.populate('category subCategory brand');
    return { data: { product } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.ProductModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const products = await query.exec();
    return { data: { products }, page: +q.page, size: products.length };
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return { data: { product } };
  }

  async update(id: string, updateProductDto: AdminUpdateProductDto) {
    let product = await this.ProductModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
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
        "Discount price can't be more than or equal the original price",
      );
    }
    product = await this.ProductModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
    return { data: { product } };
  }

  async remove(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    await this.ProductModel.findByIdAndDelete(id);
  }
}
