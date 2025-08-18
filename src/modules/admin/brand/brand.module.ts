import { Module } from '@nestjs/common';
import { AdminBrandService } from './brand.service';
import { AdminBrandController } from './brand.controller';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schema/brand.schema';
import { User, UserSchema } from '../user/Schema/user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminBrandController],
  providers: [AdminBrandService, JWTService],
})
export class AdminBrandModule {}
