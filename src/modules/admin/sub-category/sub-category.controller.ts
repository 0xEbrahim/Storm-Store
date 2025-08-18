import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminSubCategoryService } from './sub-category.service';
import { AdminCreateSubCategoryDto } from './dto/create-sub-category.dto';
import { AdminUpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { QueryDto } from 'src/common/dto/query.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Roles } from '../user/Schema/user.schema';
import { Role } from 'src/common/decorators/roles.decorator';

@Controller('admin/subCategory')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
export class AdminSubCategoryController {
  constructor(private readonly subCategoryService: AdminSubCategoryService) {}

  /**
   * @desc Admin creates sub-category
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/admin/subCategory
   */
  @ApiBody({ type: AdminCreateSubCategoryDto })
  @Post()
  async create(@Body() createCategoryDto: AdminCreateSubCategoryDto) {
    return await this.subCategoryService.create(createCategoryDto);
  }

  /**
   * @desc Admin get all sub-categories
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/subCategory
   */

  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.subCategoryService.findAll(q);
  }

  /**
   * @desc Admin gets one sub-category
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/subCategory/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.subCategoryService.findOne(id);
  }

  /**
   * @desc Admin updates one sub-category
   * @access Private [Admin]
   * @method Patch
   * @route /api/v1/admin/subCategory/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @ApiBody({ type: AdminUpdateSubCategoryDto })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateCategoryDto: AdminUpdateSubCategoryDto,
  ) {
    return await this.subCategoryService.update(id, updateCategoryDto);
  }

  /**
   * @desc Admin deletes one sub-category
   * @access Private [Admin]
   * @method Delete
   * @route /api/v1/admin/subCategory/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Delete(':id')
  async cremove(@Param('id', ParseObjectId) id: string) {
    return await this.subCategoryService.remove(id);
  }
}
