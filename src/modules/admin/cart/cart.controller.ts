import { Controller } from '@nestjs/common';
import { AdminCartService } from './cart.service';

@Controller('cart')
export class AdminCartController {
  constructor(private readonly cartService: AdminCartService) {}
}
