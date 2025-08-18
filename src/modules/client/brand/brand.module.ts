import { Module } from '@nestjs/common';
import { ClientBrandService } from './brand.service';
import { ClientBrandController } from './brand.controller';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Brand,
  BrandSchema,
} from 'src/modules/admin/brand/schema/brand.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientBrandController],
  providers: [ClientBrandService, JWTService],
})
export class ClientBrandModule {}
