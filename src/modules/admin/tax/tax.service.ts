import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateTaxDto } from './dto/create-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './schema/tax.schema';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AdminTaxService {
  constructor(
    @InjectModel(Tax.name) private TaxModel: Model<Tax>,
    private readonly i18n: I18nService,
  ) {}

  async upsert(createTaxDto: AdminCreateTaxDto) {
    let tax = await this.TaxModel.findOne({});
    if (!tax) {
      if (!createTaxDto?.shippingPrice || !createTaxDto?.taxPrice) {
        throw new BadRequestException(
          await this.i18n.t('service.TAX_FIELDS_REQUIRED'),
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
    if (!tax)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.TAX'),
          },
        }),
      );
    return { data: { tax } };
  }

  async deleteTax() {
    const tax = await this.TaxModel.findOne({});
    if (!tax)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.TAX'),
          },
        }),
      );
    await this.TaxModel.deleteOne({});
  }
}
