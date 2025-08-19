import { Module } from '@nestjs/common';
import { AdminCartService } from './cart.service';
import { AdminCartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
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
  controllers: [AdminCartController],
  providers: [AdminCartService, JWTService],
})
export class AdminCartModule {}
