import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminTicketService } from './ticket.service';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';

@Controller('admin/ticket')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Ticket')
export class AdminTicketController {
  constructor(private readonly ticketService: AdminTicketService) {}

  /**
   * @desc Admin gets all suppliers
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/ticket/
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.ticketService.findAll(q);
  }

  /**
   * @desc Admin gets one supplier
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/ticket/:id
   */
  @ApiParam({ name: 'id', type: '68a36b54a7ebf2eb12e7fbd2' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string) {
    return await this.ticketService.findOne(id);
  }
}
