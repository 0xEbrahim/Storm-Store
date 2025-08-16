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
import { User } from 'src/common/decorators/user.decorator';

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
  async findProfile(@User() user: any) {
    return await this.userService.findProfile(user.id);
  }

  /**
   * @desc User Updates profile
   * @access Private [Admin, User]
   * @method Patch
   * @route /api/v1/user/me
   */
  @Patch('me')
  @UseGuards(AuthGuard)
  @Role(Roles.USER, Roles.ADMIN)
  async UpdateProfile(@Body() updateUserDTO: UpdateUserDto, @User() user: any) {
    return await this.userService.updateUser(updateUserDTO, user.id);
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  @Role(Roles.USER)
  async deactivateProfile(@User() user: any) {
    return await this.userService.deactivateProfile(user.id);
  }
}
