import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateSubCategoryDto } from './dto/create-sub-category.dto';
import { AdminUpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './schema/sub-category.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Category } from '../category/schema/category.schema';

@Injectable()
export class AdminSubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  private async _CheckValidSubCategoryName(subCategoryName: string) {
    let subCategory = await this.SubCategoryModel.findOne({
      name: subCategoryName,
    });
    if (subCategory)
      throw new BadRequestException(
        'There is a sub category which has this name, try another name',
      );
  }
  private async _CheckValidCategoryId(categoryId: string) {
    const subCategory = await this.CategoryModel.findById(categoryId);
    if (!subCategory) throw new NotFoundException('Sub category not found');
  }

  async create({ categoryId, name }: AdminCreateSubCategoryDto) {
    await this._CheckValidCategoryId(categoryId);
    await this._CheckValidSubCategoryName(name);
    const subCategory = await this.SubCategoryModel.create({
      categoryId,
      name,
    });
    return { data: { subCategory } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.SubCategoryModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const subCategories = await query.exec();
    return {
      data: { subCategories },
      page: +q.page,
      size: subCategories.length,
    };
  }

  async findOne(id: string) {
    const subCategory =
      await this.SubCategoryModel.findById(id).populate('categoryId');
    if (!subCategory) throw new NotFoundException('Sub category not found');
    return { data: { subCategory } };
  }

  async update(id: string, updateCategoryDto: AdminUpdateSubCategoryDto) {
    let subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory) throw new NotFoundException('Sub category not found');
    if (updateCategoryDto.categoryId)
      await this._CheckValidCategoryId(updateCategoryDto.categoryId);
    if (updateCategoryDto.name)
      await this._CheckValidSubCategoryName(updateCategoryDto.name);
    subCategory = await this.SubCategoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    return { data: { subCategory } };
  }

  async remove(id: string) {
    let subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory) throw new NotFoundException('Sub category not found');
    await this.SubCategoryModel.findByIdAndDelete(id);
  }
}
