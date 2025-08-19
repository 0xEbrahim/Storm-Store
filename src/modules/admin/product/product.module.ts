import { Module } from '@nestjs/common';
import { AdminProductService } from './product.service';
import { AdminProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { Category, categorySchema } from '../category/schema/category.schema';
import {
  SubCategory,
  SubCategorySchema,
} from '../sub-category/schema/sub-category.schema';
import { Brand, BrandSchema } from '../brand/schema/brand.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: categorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminProductController],
  providers: [AdminProductService, JWTService],
})
export class AdminProductModule {}
