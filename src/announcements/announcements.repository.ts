import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity.js';
import type { CreateAnnouncement, UpdateAnnouncement } from './announcements.schemas.js';

@Injectable()
export class AnnouncementsRepository {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcements: Repository<Announcement>,
  ) {}

  list(): Promise<Announcement[]> {
    return this.announcements.find({ order: { id: 'DESC' } });
  }

  findById(id: number): Promise<Announcement | null> {
    return this.announcements.findOneBy({ id });
  }

  create(data: CreateAnnouncement): Promise<Announcement> {
    return this.announcements.save(this.announcements.create(data));
  }

  async update(id: number, changes: UpdateAnnouncement): Promise<number> {
    const result = await this.announcements.update({ id }, changes);
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<number> {
    const result = await this.announcements.delete({ id });
    return result.affected ?? 0;
  }
}
