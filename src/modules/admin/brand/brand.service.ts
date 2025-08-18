import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateBrandDto } from './dto/create-brand.dto';
import { AdminUpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema/brand.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class AdminBrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<Brand>) {}

  async _CheckValidName(name: string) {
    const brand = await this.BrandModel.findOne({ name: name });
    if (brand) throw new BadRequestException('There is a brand with this name');
  }
  async create(createbrandDto: AdminCreateBrandDto) {
    await this._CheckValidName(createbrandDto.name);
    const brand = await this.BrandModel.create(createbrandDto);
    return { data: { brand } };
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
    const brand = await this.BrandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return { data: { brand } };
  }

  async update(id: string, updateBrandDto: AdminUpdateBrandDto) {
    let brand = await this.BrandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    if (updateBrandDto?.name) await this._CheckValidName(updateBrandDto.name);
    brand = await this.BrandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    });
    return { data: { brand } };
  }

  async remove(id: string) {
    let brand = await this.BrandModel.findById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    await this.BrandModel.findByIdAndDelete(id);
  }
}
