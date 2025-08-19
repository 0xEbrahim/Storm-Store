import { Module } from '@nestjs/common';
import { ClientReviewService } from './review.service';
import { ClientReviewController } from './review.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Review,
  ReviewSchema,
} from 'src/modules/admin/review/schema/review.schema';
import {
  Product,
  ProductSchema,
} from 'src/modules/admin/product/schema/product.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
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
  controllers: [ClientReviewController],
  providers: [ClientReviewService, JWTService],
})
export class ClientReviewModule {}
