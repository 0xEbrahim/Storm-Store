import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminCouponService } from './coupon.service';
import { AdminCreateCouponDto } from './dto/create-coupon.dto';
import { AdminUpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Roles } from '../user/Schema/user.schema';
import { Role } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('admin/coupon')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Coupon')
export class AdminCouponController {
  constructor(private readonly couponService: AdminCouponService) {}

  @Post()
  @ApiBody({ type: AdminCreateCouponDto })
  create(@Body() createCouponDto: AdminCreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @ApiQuery({ type: QueryDto })
  findAll(@Query() q: any) {
    return this.couponService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: AdminUpdateCouponDto })
  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateCouponDto: AdminUpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  remove(@Param('id', ParseObjectId) id: string) {
    return this.couponService.remove(id);
  }
}
