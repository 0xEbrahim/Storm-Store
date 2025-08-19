import { Module } from '@nestjs/common';
import { AdminCartService } from './cart.service';
import { AdminCartController } from './cart.controller';

@Module({
  controllers: [AdminCartController],
  providers: [AdminCartService],
})
export class AdminCartModule {}
