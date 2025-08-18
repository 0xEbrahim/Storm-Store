import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClientBrandService } from './brand.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { AuthGuard } from 'src/common/guards/Auth.guard';

@Controller('brand')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
@ApiTags('Brand')
export class ClientBrandController {
  constructor(private readonly brandService: ClientBrandService) {}
  /**
   * @desc user gets all brands
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/brand
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  findAll(@Query() q: any) {
    return this.brandService.findAll(q);
  }

  /**
   * @desc user get one brand
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/brand/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Get(':id')
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.brandService.findOne(id);
  }
}
