import { Module } from '@nestjs/common';
import { ClientTicketService } from './ticket.service';
import { ClientTicketController } from './ticket.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Ticket,
  TicketSchema,
} from 'src/modules/admin/ticket/schema/ticket.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientTicketController],
  providers: [ClientTicketService, JWTService],
})
export class ClientTicketModule {}
