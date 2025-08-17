import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from './schema/category.schema';
import { User, UserSchema } from '../user/Schema/user.schema';

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
export class AdminCategoryModule {}
