import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminOrderService } from './order.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminUpdateOrderDto } from './dto/UpdateCash.dto';

@Controller('admin/order')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Order')
export class AdminOrderController {
  constructor(private readonly orderService: AdminOrderService) {}

  @Patch('checkout/:orderId/cash')
  async updateInCash(
    @Param('orderId') orderId: string,
    @Body()
    updateOrderDto: AdminUpdateOrderDto,
  ) {
    return await this.orderService.updateInCash(orderId, updateOrderDto);
  }
}
