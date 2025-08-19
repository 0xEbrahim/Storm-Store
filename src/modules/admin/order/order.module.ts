import { Module } from '@nestjs/common';
import { AdminOrderService } from './order.service';
import { AdminOrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminOrderController],
  providers: [AdminOrderService, JWTService],
})
export class AdminOrderModule {}
