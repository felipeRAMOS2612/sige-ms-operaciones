import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  createUserSchema,
  idSchema,
  updateUserSchema,
  type CreateUser,
  type UpdateUser,
} from './users.schemas.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Get(':id')
  get(@Param('id', { schema: idSchema }) id: number) {
    return this.users.get(id);
  }

  @Post()
  create(@Body({ schema: createUserSchema }) data: CreateUser) {
    return this.users.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateUserSchema }) changes: UpdateUser,
  ) {
    return this.users.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.users.remove(id);
  }
}
