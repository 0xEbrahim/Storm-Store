import { Module } from '@nestjs/common';
import { ClientProductService } from './product.service';
import { ClientProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
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
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientProductController],
  providers: [ClientProductService, JWTService],
})
export class ClientProductModule {}
