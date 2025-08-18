import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './schema/ticket.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class AdminTicketService {
  constructor(@InjectModel(Ticket.name) private TicketModel: Model<Ticket>) {}

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.TicketModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const tickets = await query.exec();
    return { data: { tickets }, page: +q.page, size: tickets.length };
  }

  async findOne(id: string) {
    const ticket = await this.TicketModel.findById(id);
    if (!ticket) throw new NotFoundException('ticket not found');
    return { data: { ticket } };
  }
}
