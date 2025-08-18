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
import { AdminSupplierService } from './supplier.service';
import { AdminCreateSupplierDto } from './dto/create-supplier.dto';
import { AdminUpdateSupplierDto } from './dto/update-supplier.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('admin/supplier')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Supplier')
export class AdminSupplierController {
  constructor(private readonly supplierService: AdminSupplierService) {}

  @ApiBody({ type: AdminCreateSupplierDto })
  @Post()
  create(@Body() createSupplierDto: AdminCreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @ApiQuery({ type: QueryDto })
  @Get()
  findAll(@Query() q: any) {
    return this.supplierService.findAll(q);
  }

  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @Get(':id')
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.supplierService.findOne(id);
  }

  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @ApiBody({ type: AdminUpdateSupplierDto })
  @Patch(':id')
  update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateSupplierDto: AdminUpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @Delete(':id')
  remove(@Param('id', ParseObjectId) id: string) {
    return this.supplierService.remove(id);
  }
}
