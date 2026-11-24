import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LogbookService } from './logbook.service.js';
import {
  apartmentIdQuerySchema,
  createLogEntrySchema,
  idSchema,
  updateLogEntrySchema,
  type CreateLogEntry,
  type UpdateLogEntry,
} from './logbook.schemas.js';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbook: LogbookService) {}

  @Get()
  list(@Query('apartmentId', { schema: apartmentIdQuerySchema }) apartmentId?: number) {
    return this.logbook.list(apartmentId);
  }

  @Get(':id')
  get(@Param('id', { schema: idSchema }) id: number) {
    return this.logbook.get(id);
  }

  @Post()
  create(@Body({ schema: createLogEntrySchema }) data: CreateLogEntry) {
    return this.logbook.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateLogEntrySchema }) changes: UpdateLogEntry,
  ) {
    return this.logbook.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.logbook.remove(id);
  }
}
