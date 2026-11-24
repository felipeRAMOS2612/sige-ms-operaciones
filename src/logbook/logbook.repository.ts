import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntry } from './log-entry.entity.js';
import type { CreateLogEntry, UpdateLogEntry } from './logbook.schemas.js';

@Injectable()
export class LogbookRepository {
  constructor(
    @InjectRepository(LogEntry)
    private readonly entries: Repository<LogEntry>,
  ) {}

  list(): Promise<LogEntry[]> {
    return this.entries.find({ order: { id: 'DESC' } });
  }

  listByApartment(apartmentId: number): Promise<LogEntry[]> {
    return this.entries.find({ where: { apartmentId }, order: { id: 'DESC' } });
  }

  findById(id: number): Promise<LogEntry | null> {
    return this.entries.findOneBy({ id });
  }

  create(data: CreateLogEntry): Promise<LogEntry> {
    return this.entries.save(this.entries.create(data));
  }

  async update(id: number, changes: UpdateLogEntry): Promise<number> {
    const result = await this.entries.update({ id }, changes);
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<number> {
    const result = await this.entries.delete({ id });
    return result.affected ?? 0;
  }
}
