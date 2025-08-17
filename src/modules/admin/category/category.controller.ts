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
import { CategoryService } from './category.service';
import { AdminCreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('admin/category')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * @desc Admin creates category
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/admin/category
   */
  @Post()
  async create(@Body() createCategoryDto: AdminCreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  /**
   * @desc Admin get all categories
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/category
   */
  @Get()
  async findAll(@Query() q: any) {
    return await this.categoryService.findAll(q);
  }

  /**
   * @desc Admin gets one category
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/category/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.categoryService.findOne(id);
  }

  /**
   * @desc Admin updates one category
   * @access Private [Admin]
   * @method Patch
   * @route /api/v1/admin/category/:id
   */
  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * @desc Admin deletes one category
   * @access Private [Admin]
   * @method Delete
   * @route /api/v1/admin/category/:id
   */
  @Delete(':id')
  async cremove(@Param('id', ParseObjectId) id: string) {
    return await this.categoryService.remove(id);
  }
}
