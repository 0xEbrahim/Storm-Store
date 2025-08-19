import { Controller, Post, Body, UseGuards, Get, Delete } from '@nestjs/common';
import { AdminTaxService } from './tax.service';
import { AdminCreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('admin/tax')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Tax')
export class AdminTaxController {
  constructor(private readonly taxService: AdminTaxService) {}

  @Post()
  async upsert(@Body() createTaxDto: AdminCreateTaxDto) {
    return await this.taxService.upsert(createTaxDto);
  }

  @Get()
  async getTax() {
    return await this.taxService.getTax();
  }

  @Delete()
  async deleteTax() {
    return await this.taxService.deleteTax();
  }
}
