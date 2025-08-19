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
import { AdminProductService } from './product.service';
import { AdminCreateProductDto } from './dto/create-product.dto';
import { AdminUpdateProductDto } from './dto/update-product.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('admin/product')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Product')
export class AdminProductController {
  constructor(private readonly productService: AdminProductService) {}

  @ApiBody({ type: AdminCreateProductDto })
  @Post()
  async create(@Body() createProductDto: AdminCreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.productService.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateProductDto: AdminUpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectId) id: string) {
    return await this.productService.remove(id);
  }
}
