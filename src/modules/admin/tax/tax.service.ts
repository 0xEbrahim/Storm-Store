import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateTaxDto } from './dto/create-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './schema/tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminTaxService {
  constructor(@InjectModel(Tax.name) private TaxModel: Model<Tax>) {}

  async upsert(createTaxDto: AdminCreateTaxDto) {
    let tax = await this.TaxModel.findOne({});
    if (!tax) {
      if (!createTaxDto?.shippingPrice || !createTaxDto?.taxPrice) {
        throw new BadRequestException(
          'Please fill all the required fields: [shippingPrice, taxPrice]',
        );
      }
      tax = await this.TaxModel.create(createTaxDto);
    } else {
      tax.taxPrice = createTaxDto?.taxPrice
        ? createTaxDto?.taxPrice
        : tax.taxPrice;
      tax.shippingPrice = createTaxDto?.shippingPrice
        ? createTaxDto?.shippingPrice
        : tax.shippingPrice;
      tax = await tax.save();
    }
    return { data: { tax } };
  }

  async getTax() {
    const tax = await this.TaxModel.findOne({});
    if (!tax) throw new NotFoundException('Tax not found');
    return { data: { tax } };
  }

  async deleteTax() {
    const tax = await this.TaxModel.findOne({});
    if (!tax) throw new NotFoundException('Tax not found');
    await this.TaxModel.deleteOne({});
  }
}
