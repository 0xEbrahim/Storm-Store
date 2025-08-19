import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminCartService } from './cart.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('admin/cart')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Cart')
export class AdminCartController {
  constructor(private readonly cartService: AdminCartService) {}

  @ApiParam({ name: 'id', type: '68a492862c0202e173deb9fc' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.cartService.findOne(id);
  }

  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.cartService.findAll(q);
  }
}
