import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementsRepository } from './announcements.repository.js';
import type { Announcement } from './announcement.entity.js';
import type { CreateAnnouncement, UpdateAnnouncement } from './announcements.schemas.js';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly announcements: AnnouncementsRepository) {}

  list(): Promise<Announcement[]> {
    return this.announcements.list();
  }

  async get(id: number): Promise<Announcement> {
    const announcement = await this.announcements.findById(id);
    if (!announcement) {
      throw new NotFoundException(`Announcement ${id} not found`);
    }
    return announcement;
  }

  create(data: CreateAnnouncement): Promise<Announcement> {
    return this.announcements.create(data);
  }

  async update(id: number, changes: UpdateAnnouncement): Promise<Announcement> {
    const affected = await this.announcements.update(id, changes);
    if (affected === 0) {
      throw new NotFoundException(`Announcement ${id} not found`);
    }
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.announcements.remove(id);
    if (affected === 0) {
      throw new NotFoundException(`Announcement ${id} not found`);
    }
  }
}
