import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentsRepository } from './incidents.repository.js';
import type { Incident } from './incident.entity.js';
import type { CreateIncident, UpdateIncident } from './incidents.schemas.js';

@Injectable()
export class IncidentsService {
  constructor(private readonly incidents: IncidentsRepository) {}

  list(): Promise<Incident[]> {
    return this.incidents.list();
  }

  async get(id: number): Promise<Incident> {
    const incident = await this.incidents.findById(id);
    if (!incident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return incident;
  }

  create(data: CreateIncident): Promise<Incident> {
    return this.incidents.create(data);
  }

  async update(id: number, changes: UpdateIncident): Promise<Incident> {
    const affected = await this.incidents.update(id, changes);
    if (affected === 0) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.incidents.remove(id);
    if (affected === 0) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
  }
}
