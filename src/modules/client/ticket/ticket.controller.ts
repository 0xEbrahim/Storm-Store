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
import { ClientTicketService } from './ticket.service';
import { ClientCreateTicketDto } from './dto/create-ticket.dto';
import { ClientUpdateTicketDto } from './dto/update-ticket.dto';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { QueryDto } from 'src/common/dto/query.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('ticket')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
@ApiTags('Ticket')
export class ClientTicketController {
  constructor(private readonly ticketService: ClientTicketService) {}

  /**
   * @desc user creates a ticket
   * @access Public [Admin, User]
   * @method Post
   * @route /api/v1/ticket
   */
  @ApiBody({ type: ClientCreateTicketDto })
  @Post()
  async create(
    @Body() createTicketDto: ClientCreateTicketDto,
    @User() user: any,
  ) {
    return await this.ticketService.create(createTicketDto, user.id);
  }

  /**
   * @desc user gets all tickets
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/ticket
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any, @User() user: any) {
    return await this.ticketService.findAll(q, user.id);
  }

  /**
   * @desc user gets one ticket
   * @access Public [Admin, User]
   * @method Get
   * @route /api/v1/ticket/:id
   */
  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @Get(':id')
  async findOne(@Param('id', ParseObjectId) id: string, @User() user: any) {
    return await this.ticketService.findOne(id, user.id);
  }

  /**
   * @desc user updates one ticket
   * @access Public [Admin, User]
   * @method Patch
   * @route /api/v1/ticket/:id
   */
  @ApiParam({ name: 'id', type: '68a1a451b77f4a0abeeb3ce5' })
  @ApiBody({ type: ClientUpdateTicketDto })
  @Patch(':id')
  async update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateTicketDto: ClientUpdateTicketDto,
    @User() user: any,
  ) {
    return await this.ticketService.update(id, updateTicketDto, user.id);
  }

  /**
   * @desc user deletes one ticket
   * @access Public [Admin, User]
   * @method Delete
   * @route /api/v1/ticket/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseObjectId) id: string, @User() user: any) {
    return await this.ticketService.remove(id, user.id);
  }
}
