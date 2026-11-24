import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service.js';
import {
  createAnnouncementSchema,
  idSchema,
  updateAnnouncementSchema,
  type CreateAnnouncement,
  type UpdateAnnouncement,
} from './announcements.schemas.js';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcements: AnnouncementsService) {}

  @Get()
  list() {
    return this.announcements.list();
  }

  @Get(':id')
  get(@Param('id', { schema: idSchema }) id: number) {
    return this.announcements.get(id);
  }

  @Post()
  create(@Body({ schema: createAnnouncementSchema }) data: CreateAnnouncement) {
    return this.announcements.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: number,
    @Body({ schema: updateAnnouncementSchema }) changes: UpdateAnnouncement,
  ) {
    return this.announcements.update(id, changes);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: number) {
    return this.announcements.remove(id);
  }
}
