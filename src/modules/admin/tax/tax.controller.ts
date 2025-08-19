import { Controller, Post, Body, UseGuards, Get, Delete } from '@nestjs/common';
import { AdminTaxService } from './tax.service';
import { AdminCreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('admin/tax')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Tax')
export class AdminTaxController {
  constructor(private readonly taxService: AdminTaxService) {}

  /**
   * @desc Admin create or update tax
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/admin/tax/
   */
  @ApiBody({ type: AdminCreateTaxDto })
  @Post()
  async upsert(@Body() createTaxDto: AdminCreateTaxDto) {
    return await this.taxService.upsert(createTaxDto);
  }

  /**
   * @desc Admin gets tax
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/tax/
   */
  @Get()
  async getTax() {
    return await this.taxService.getTax();
  }

  /**
   * @desc Admin deletes tax
   * @access Private [Admin]
   * @method Delete
   * @route /api/v1/admin/tax/
   */
  @Delete()
  async deleteTax() {
    return await this.taxService.deleteTax();
  }
}
