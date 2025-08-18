import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { SubCategory } from 'src/modules/admin/sub-category/schema/sub-category.schema';

@Injectable()
export class AdminSubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
  ) {}

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
    const subCategory = await this.SubCategoryModel.findById(id);
    if (!subCategory) throw new NotFoundException('Sub category not found');
    return { data: { subCategory } };
  }
}
