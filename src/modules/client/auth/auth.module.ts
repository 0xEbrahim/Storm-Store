import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { EmailService } from 'src/modules/email/email.service';
import { Cart, CartSchema } from 'src/modules/admin/cart/schema/cart.schema';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from 'src/queue/email/email.worker';
import { EmailQueueEventsListener } from 'src/queue/email/email-queue.events';

@Module({
  imports: [
    JwtModule,
    BullModule.registerQueue({ name: 'email' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTService,
    EmailService,
    EmailProcessor,
    EmailQueueEventsListener,
  ],
})
export class AuthModule {}
