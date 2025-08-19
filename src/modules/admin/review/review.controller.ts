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
import { AdminReviewService } from './review.service';
import { AdminCreateReviewDto } from './dto/create-review.dto';
import { AdminUpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from '../user/Schema/user.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('admin/review')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
@ApiTags('Review')
export class AdminReviewController {
  constructor(private readonly reviewService: AdminReviewService) {}

  @ApiBody({ type: AdminCreateReviewDto })
  @Post()
  async create(
    @Body() createReviewDto: AdminCreateReviewDto,
    @User() user: any,
  ) {
    return await this.reviewService.create(createReviewDto, user.id);
  }

  @ApiQuery({ type: QueryDto })
  @Get()
  async findAll(@Query() q: any) {
    return await this.reviewService.findAll(q);
  }

  @ApiParam({ name: 'id', type: '68a34a6dfce71b19a24d00bb' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @ApiParam({ name: 'id', type: '68a34a6dfce71b19a24d00bb' })
  @ApiBody({ type: AdminUpdateReviewDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: AdminUpdateReviewDto,
  ) {
    return await this.reviewService.update(id, updateReviewDto);
  }

  @ApiParam({ name: 'id', type: '68a34a6dfce71b19a24d00bb' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reviewService.remove(id);
  }
}
