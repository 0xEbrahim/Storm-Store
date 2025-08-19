import { Module } from '@nestjs/common';
import { ClientCartService } from './cart.service';
import { ClientCartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/modules/admin/cart/schema/cart.schema';
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
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientCartController],
  providers: [ClientCartService, JWTService],
})
export class ClientCartModule {}
