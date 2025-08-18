import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
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
  controllers: [SubCategoryController],
  providers: [SubCategoryService, JWTService],
})
export class SubCategoryModule {}
