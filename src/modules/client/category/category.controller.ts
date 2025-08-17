import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() q: any) {
    return this.categoryService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.categoryService.findOne(id);
  }
}
