import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity.js';
import { AnnouncementsController } from './announcements.controller.js';
import { AnnouncementsRepository } from './announcements.repository.js';
import { AnnouncementsService } from './announcements.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementsRepository],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
