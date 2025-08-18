import { Module } from '@nestjs/common';
import { AdminSubCategoryService } from './sub-category.service';
import { AdminSubCategoryController } from './sub-category.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './schema/sub-category.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { Category, categorySchema } from '../category/schema/category.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [AdminSubCategoryController],
  providers: [AdminSubCategoryService, JWTService],
})
export class AdminSubCategoryModule {}
