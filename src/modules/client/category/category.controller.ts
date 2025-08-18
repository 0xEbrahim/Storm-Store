import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @desc user gets all categories
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/category
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  findAll(@Query() q: any) {
    return this.categoryService.findAll(q);
  }

  /**
   * @desc user get one category
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/category/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Get(':id')
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.categoryService.findOne(id);
  }
}
