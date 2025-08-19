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
import { ClientCartService } from './cart.service';
import { ClientCreateCartDto } from './dto/create-cart.dto';
import { ClientUpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
@ApiTags('Cart')
export class ClientCartController {
  constructor(private readonly cartService: ClientCartService) {}

  @Post()
  addToCart(@Body() createCartDto: ClientCreateCartDto, @User() user: any) {
    return this.cartService.create(createCartDto, user.id);
  }

  @Get()
  findOne(@User() user: any) {
    return this.cartService.findOne(user.id);
  }

  @Patch()
  update(@User() user: any, @Body() updateCartDto: ClientUpdateCartDto) {
    return this.cartService.update(user.id, updateCartDto);
  }

  @Delete()
  remove(@User() user: any, @Body('productId') pId: string) {
    return this.cartService.remove(user.id, pId);
  }
}
