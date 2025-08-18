import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Brand } from 'src/modules/admin/brand/schema/brand.schema';

@Injectable()
export class ClientBrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<Brand>) {}

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
}
