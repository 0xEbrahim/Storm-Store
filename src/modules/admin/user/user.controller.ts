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
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../../common/guards/Auth.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from './Schema/user.schema';
import type { Request } from 'express';
import { ParseObjectId } from 'src/common/pipes/parseObjectId.pipe';
import { RolesGuard } from 'src/common/guards/Role.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('admin/user')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @desc Admin creates user
   * @param createUserDto
   * @access Private [Admin]
   * @method Post
   * @route /api/v1/admin/user
   */
  @ApiBody({ type: CreateUserDto })
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * @desc Admin get all users
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/user
   */
  @ApiQuery({ type: QueryDto })
  @Get()
  @HttpCode(200)
  findAll(@Req() req: Request) {
    return this.userService.findAll(req.query);
  }

  /**
   * @desc Admin get one user
   * @access Private [Admin]
   * @method Get
   * @route /api/v1/admin/user/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseObjectId) id: string) {
    return this.userService.findOne(id);
  }

  /**
   * @desc Admin updates user
   * @access Private [Admin]
   * @method Patch
   * @route /api/v1/admin/user/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseObjectId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * @desc Admin deletes user
   * @access Private [Admin]
   * @method Delete
   * @route /api/v1/admin/user/:id
   */
  @ApiParam({ name: 'id', type: '68a1e4e778f9ec5681c9f87f' })
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseObjectId) id: string) {
    return this.userService.remove(id);
  }
}
