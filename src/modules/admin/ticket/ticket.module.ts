import { Module } from '@nestjs/common';
import { AdminTicketService } from './ticket.service';
import { AdminTicketController } from './ticket.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schema/ticket.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminTicketController],
  providers: [AdminTicketService, JWTService],
})
export class AdminTicketModule {}
