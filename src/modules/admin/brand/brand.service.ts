import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminCreateBrandDto } from './dto/create-brand.dto';
import { AdminUpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema/brand.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class AdminBrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<Brand>) {}

  async create(createCategoryDto: AdminCreateBrandDto) {
    const category = await this.BrandModel.create(createCategoryDto);
    return { data: { category } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.BrandModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const categories = await query.exec();
    return { data: { categories }, page: +q.page, size: categories.length };
  }

  async findOne(id: string) {
    const category = await this.BrandModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return { data: { category } };
  }

  async update(id: string, updateBrandDto: AdminUpdateBrandDto) {
    let category = await this.BrandModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    category = await this.BrandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    });
    return { data: { category } };
  }

  async remove(id: string) {
    let category = await this.BrandModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    await this.BrandModel.findByIdAndDelete(id);
  }
}
