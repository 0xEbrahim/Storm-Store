import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClientSupplierService } from './supplier.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('supplier')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.USER, Roles.ADMIN)
@ApiTags('Supplier')
@ApiBearerAuth()
export class ClientSupplierController {
  constructor(private readonly supplierService: ClientSupplierService) {}

  /**
   * @desc user gets all suppliers
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/supplier
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.supplierService.findAll(q);
  }

  /**
   * @desc user gets one supplier
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/supplier/:id
   */
  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return this.supplierService.findOne(id);
  }
}
