import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClientProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.USER, Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Product')
export class ClientProductController {
  constructor(private readonly productService: ClientProductService) {}

  /**
   * @desc User gets all products
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/admin/product
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.productService.findAll(q);
  }

  /**
   * @desc User gets one product
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/admin/product/:id
   */
  @ApiParam({ name: 'id', type: '68a4496b6d637811b8269650' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.productService.findOne(id);
  }
}
