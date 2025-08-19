import { Controller } from '@nestjs/common';
import { AdminOrderService } from './order.service';

@Controller('order')
export class AdminOrderController {
  constructor(private readonly orderService: AdminOrderService) {}
}
