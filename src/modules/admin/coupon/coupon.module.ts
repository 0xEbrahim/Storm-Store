import { Module } from '@nestjs/common';
import { AdminCouponService } from './coupon.service';
import { AdminCouponController } from './coupon.controller';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { User, UserSchema } from '../user/Schema/user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminCouponController],
  providers: [AdminCouponService, JWTService],
})
export class AdminCouponModule {}
