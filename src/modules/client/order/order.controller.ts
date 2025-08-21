import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ClientOrderService } from './order.service';
import { ClientCreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

@Controller('order')
@ApiTags('Order')
export class ClientOrderController {
  constructor(private readonly orderService: ClientOrderService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.USER)
  @Post('checkout')
  create(@Body() createOrderDto: ClientCreateOrderDto, @User() user: any) {
    return this.orderService.create(createOrderDto, user.id);
  }

  @Post('checkout/webhook')
  updatePaidCard(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const payload = request.rawBody;
    return this.orderService.updatePaidCard(payload, sig);
  }
}
