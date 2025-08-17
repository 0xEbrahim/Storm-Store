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

  @Post()
  async create(@Body() createCategoryDto: AdminCreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query() q: any) {
    return await this.categoryService.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async cremove(@Param('id', ParseObjectId) id: string) {
    return await this.categoryService.remove(id);
  }
}
