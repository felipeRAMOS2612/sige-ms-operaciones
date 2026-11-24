import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApartmentsService } from './apartments.service.js';
import {
  createApartmentSchema,
  idSchema,
  updateApartmentSchema,
  type CreateApartment,
  type UpdateApartment,
} from './apartments.schemas.js';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartments: ApartmentsService) {}

  @Get()
  list() {
    return this.apartments.list();
  }

  @Get(':id')
  get(@Param('id', { schema: idSchema }) id: number) {
    return this.apartments.get(id);
  }

  @Post()
  create(@Body({ schema: createApartmentSchema }) data: CreateApartment) {
    return this.apartments.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateApartmentSchema }) changes: UpdateApartment,
  ) {
    return this.apartments.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.apartments.remove(id);
  }
}
