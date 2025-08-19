import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { Product } from 'src/modules/admin/product/schema/product.schema';

@Injectable()
export class ClientProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}


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
}
