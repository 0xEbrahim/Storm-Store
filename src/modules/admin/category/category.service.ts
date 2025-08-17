import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminCreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: AdminCreateCategoryDto) {
    const category = await this.CategoryModel.create(createCategoryDto);
    return { data: { category } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.CategoryModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const categories = await query.exec();
    return { data: { categories }, page: +q.page, size: categories.length };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let category = await this.CategoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    category = await this.CategoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    return { data: { category } };
  }

  async remove(id: string) {
    let category = await this.CategoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    await this.CategoryModel.findByIdAndDelete(id);
  }
}
