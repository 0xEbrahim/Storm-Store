import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { Role } from 'src/common/decorators/roles.decorator';


@Controller('subCategory')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}


  /**
   * @desc user gets all categories
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/category
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  findAll(@Query() q: any) {
    return this.subCategoryService.findAll(q);
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
    return this.subCategoryService.findOne(id);
  }
}
