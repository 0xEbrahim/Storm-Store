import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  categorySchema,
} from 'src/modules/admin/category/schema/category.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JWTService],
})
export class ClientCategoryModule {}
