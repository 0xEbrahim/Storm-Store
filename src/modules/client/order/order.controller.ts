import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientOrderService } from './order.service';
import { ClientCreateOrderDto } from './dto/create-order.dto';
import { ClientUpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
@ApiTags('Order')
export class ClientOrderController {
  constructor(private readonly orderService: ClientOrderService) {}

  @Post('checkout/')
  create(@Body() createOrderDto: ClientCreateOrderDto, @User() user: any) {
    return this.orderService.create(createOrderDto, user.id);
  }

  
}
