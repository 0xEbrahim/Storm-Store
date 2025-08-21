import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientCreateTicketDto } from './dto/create-ticket.dto';
import { ClientUpdateTicketDto } from './dto/update-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/modules/admin/ticket/schema/ticket.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ClientTicketService {
  constructor(
    @InjectModel(Ticket.name) private TicketModel: Model<Ticket>,
    private readonly i18n: I18nService,
  ) {}

  async create(createTicketDto: ClientCreateTicketDto, user: string) {
    const ticket = await this.TicketModel.create({
      user: user,
      ...createTicketDto,
    });
    return { data: { ticket } };
  }

  async findAll(q: any, userId: string) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.TicketModel.find({ user: userId }), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const tickets = await query.exec();
    return { data: { tickets }, page: +q.page, size: tickets.length };
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.TicketModel.findById(id);
    if (!ticket || ticket.user.toString() !== userId.toString())
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.TICKET'),
          },
        }),
      );
    await ticket.populate('user category');
    return { data: { ticket } };
  }

  async update(
    id: string,
    updateTicketDto: ClientUpdateTicketDto,
    userId: string,
  ) {
    let ticket = await this.TicketModel.findById(id);
    if (!ticket || ticket.user.toString() !== userId.toString())
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    ticket = await this.TicketModel.findByIdAndUpdate(id, updateTicketDto, {
      new: true,
    });
    return { data: { ticket } };
  }

  async remove(id: string, userId: string) {
    const ticket = await this.TicketModel.findById(id);
    if (!ticket || ticket.user.toString() !== userId.toString())
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    await this.TicketModel.findByIdAndDelete(id);
  }
}
