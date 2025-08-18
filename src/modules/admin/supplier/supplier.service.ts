import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateSupplierDto } from './dto/create-supplier.dto';
import { AdminUpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schema/supplier.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class AdminSupplierService {
  constructor(
    @InjectModel(Supplier.name) private SupplierModel: Model<Supplier>,
  ) {}

  private async _checkValidName(name: string) {
    const supplier = await this.SupplierModel.findOne({ name: name });
    if (supplier) throw new BadRequestException('Supplier already exists');
  }

  async create(createSupplierDto: AdminCreateSupplierDto) {
    await this._checkValidName(createSupplierDto.name);
    const supplier = await this.SupplierModel.create(createSupplierDto);
    return { data: { supplier } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.SupplierModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const suppliers = await query.exec();
    return { data: { suppliers }, page: +q.page, size: suppliers.length };
  }

  async findOne(id: string) {
    const supplier = await this.SupplierModel.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    return { data: { supplier } };
  }

  async update(id: string, updateSupplierDto: AdminUpdateSupplierDto) {
    let supplier = await this.SupplierModel.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (updateSupplierDto?.name)
      await this._checkValidName(updateSupplierDto?.name);
    supplier = await this.SupplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true },
    );
    return { data: { supplier } };
  }

  async remove(id: string) {
    const supplier = await this.SupplierModel.findById(id);
    if (!supplier) throw new NotFoundException('Supplier not found');
    await this.SupplierModel.findByIdAndDelete(id);
  }
}
