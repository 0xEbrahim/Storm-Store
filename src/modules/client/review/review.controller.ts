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
import { ClientReviewService } from './review.service';
import { ClientCreateReviewDto } from './dto/create-review.dto';
import { ClientUpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('review')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.USER)
@ApiBearerAuth()
@ApiTags('Review')
export class ClientReviewController {
  constructor(private readonly reviewService: ClientReviewService) {}

  @ApiBody({ type: ClientCreateReviewDto })
  @Post()
  create(@Body() createReviewDto: ClientCreateReviewDto, @User() user: any) {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @ApiQuery({ type: QueryDto })
  @Get()
  findAll(@Query() q: any, @User() user: any) {
    return this.reviewService.findAll(q, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: ClientUpdateReviewDto,
    @User() user: any,
  ) {
    return this.reviewService.update(id, updateReviewDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.reviewService.remove(id, user.id);
  }
}
