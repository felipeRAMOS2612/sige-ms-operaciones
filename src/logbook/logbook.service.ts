import { Injectable, NotFoundException } from '@nestjs/common';
import { LogbookRepository } from './logbook.repository.js';
import type { LogEntry } from './log-entry.entity.js';
import type { CreateLogEntry, UpdateLogEntry } from './logbook.schemas.js';

@Injectable()
export class LogbookService {
  constructor(private readonly entries: LogbookRepository) {}

  list(apartmentId?: number): Promise<LogEntry[]> {
    if (apartmentId === undefined) {
      return this.entries.list();
    }
    return this.entries.listByApartment(apartmentId);
  }

  async get(id: number): Promise<LogEntry> {
    const entry = await this.entries.findById(id);
    if (!entry) {
      throw new NotFoundException(`Log entry ${id} not found`);
    }
    return entry;
  }

  create(data: CreateLogEntry): Promise<LogEntry> {
    return this.entries.create(data);
  }

  async update(id: number, changes: UpdateLogEntry): Promise<LogEntry> {
    const affected = await this.entries.update(id, changes);
    if (affected === 0) {
      throw new NotFoundException(`Log entry ${id} not found`);
    }
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.entries.remove(id);
    if (affected === 0) {
      throw new NotFoundException(`Log entry ${id} not found`);
    }
  }
}
