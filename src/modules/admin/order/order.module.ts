import { Module } from '@nestjs/common';
import { AdminOrderService } from './order.service';
import { AdminOrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { EmailService } from 'src/modules/email/email.service';
import { Cart, CartSchema } from '../cart/schema/cart.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [AdminOrderController],
  providers: [AdminOrderService, JWTService, EmailService],
})
export class AdminOrderModule {}
