import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { IncidentsService } from './incidents.service.js';
import {
  createIncidentSchema,
  idSchema,
  updateIncidentSchema,
  type CreateIncident,
  type UpdateIncident,
} from './incidents.schemas.js';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidents: IncidentsService) {}

  @Get()
  list() {
    return this.incidents.list();
  }

  @Get(':id')
  get(@Param('id', { schema: idSchema }) id: number) {
    return this.incidents.get(id);
  }

  @Post()
  create(@Body({ schema: createIncidentSchema }) data: CreateIncident) {
    return this.incidents.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateIncidentSchema }) changes: UpdateIncident,
  ) {
    return this.incidents.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.incidents.remove(id);
  }
}
