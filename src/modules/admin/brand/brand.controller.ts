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
import { AdminBrandService } from './brand.service';
import { AdminCreateBrandDto } from './dto/create-brand.dto';
import { AdminUpdateBrandDto } from './dto/update-brand.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { QueryDto } from 'src/common/dto/query.dto';
import { Roles } from '../user/Schema/user.schema';
import { Role } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';

@Controller('admin/brand')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Brand')
export class AdminBrandController {
  constructor(private readonly brandService: AdminBrandService) {}
  /**
   * @desc Admin creates brand
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/admin/brand
   */
  @ApiBody({ type: AdminCreateBrandDto })
  @Post()
  async create(@Body() createBrandDto: AdminCreateBrandDto) {
    return await this.brandService.create(createBrandDto);
  }

  /**
   * @desc Admin get all brands
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/brand
   */

  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.brandService.findAll(q);
  }

  /**
   * @desc Admin gets one brand
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/brand/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.brandService.findOne(id);
  }

  /**
   * @desc Admin updates one brand
   * @access Private [Admin]
   * @method Patch
   * @route /api/v1/admin/brand/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @ApiBody({ type: AdminUpdateBrandDto })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateBrandDto: AdminUpdateBrandDto,
  ) {
    return await this.brandService.update(id, updateBrandDto);
  }

  /**
   * @desc Admin deletes one brand
   * @access Private [Admin]
   * @method Delete
   * @route /api/v1/admin/brand/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Delete(':id')
  async cremove(@Param('id', ParseObjectId) id: string) {
    return await this.brandService.remove(id);
  }
}
