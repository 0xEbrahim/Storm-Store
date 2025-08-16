import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/Auth.guard';
import { Roles } from 'src/modules/admin/user/Schema/user.schema';
import { Role } from 'src/common/decorators/roles.decorator';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @desc User gets profile
   * @access Private [Admin, User]
   * @method Get
   * @route /api/v1/user/me
   */
  @Get('/me')
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN, Roles.USER)
  async findProfile(@Req() req: Request) {
    return await this.userService.findProfile(req['user'].id);
  }
}
