import { Module } from '@nestjs/common';
import { AdminSubCategoryService } from './sub-category.service';
import { ClientSubCategoryController } from './sub-category.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubCategory,
  SubCategorySchema,
} from 'src/modules/admin/sub-category/schema/sub-category.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientSubCategoryController],
  providers: [AdminSubCategoryService, JWTService],
})
export class SubCategoryModule {}
