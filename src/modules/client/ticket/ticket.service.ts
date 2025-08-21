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
import stringify from 'fast-json-stable-stringify';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ClientTicketService {
  private cacheKeyPrefix = 'ticket';
  constructor(
    @InjectModel(Ticket.name) private TicketModel: Model<Ticket>,
    @InjectRedis() private redis: Redis,
    private readonly i18n: I18nService,
  ) {}
  private async _INVALIDATE_TICKET_CACHE() {
    const keys = await this.redis.keys(`${this.cacheKeyPrefix}:*`);
    if (keys.length > 0) this.redis.del(keys);
  }
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
    const cacheKey = `${this.cacheKeyPrefix}:${stringify(q)}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(this.TicketModel.find({ user: userId }), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const tickets = await query.exec();
    const response = { data: { tickets }, page: +q.page, size: tickets.length };
    await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 60);
    return response;
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
    await this._INVALIDATE_TICKET_CACHE();

    return { data: { ticket } };
  }

  async remove(id: string, userId: string) {
    const ticket = await this.TicketModel.findById(id);
    if (!ticket || ticket.user.toString() !== userId.toString())
      throw new UnauthorizedException(
        await this.i18n.t('service.UNAUTHORIZED_ACTION'),
      );
    await this.TicketModel.findByIdAndDelete(id);
    await this._INVALIDATE_TICKET_CACHE();
  }
}
