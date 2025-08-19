import { Module } from '@nestjs/common';
import { AdminReviewService } from './review.service';
import { AdminReviewController } from './review.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminReviewController],
  providers: [AdminReviewService, JWTService],
})
export class AdminReviewModule {}
