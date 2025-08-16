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
import { AuthGuard } from '../../../common/guards/Auth.guard';
import type { Request } from 'express';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from './Schema/user.schema';

@Controller('user')
@Role(Roles.ADMIN)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @desc Admin creates user
   * @param createUserDto
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/user
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('Reached');
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
