import { Module } from '@nestjs/common';
import { ClientOrderService } from './order.service';
import { ClientOrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Order,
  OrderSchema,
} from 'src/modules/admin/order/schema/order.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { Cart, CartSchema } from 'src/modules/admin/cart/schema/cart.schema';
import { Tax, taxSchema } from 'src/modules/admin/tax/schema/tax.schema';
import {
  Product,
  ProductSchema,
} from 'src/modules/admin/product/schema/product.schema';
import { EmailService } from 'src/modules/email/email.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    JwtModule,
    BullModule.registerQueue({ name: 'email' }),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Tax.name, schema: taxSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ClientOrderController],
  providers: [ClientOrderService, JWTService, EmailService],
})
export class ClientOrderModule {}
