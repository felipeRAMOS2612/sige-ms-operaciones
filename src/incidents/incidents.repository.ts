import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity.js';
import type { CreateIncident, UpdateIncident } from './incidents.schemas.js';

@Injectable()
export class IncidentsRepository {
  constructor(
    @InjectRepository(Incident)
    private readonly incidents: Repository<Incident>,
  ) {}

  list(): Promise<Incident[]> {
    return this.incidents.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<Incident | null> {
    return this.incidents.findOneBy({ id });
  }

  create(data: CreateIncident): Promise<Incident> {
    return this.incidents.save(this.incidents.create({ ...data, status: 'OPEN' }));
  }

  async update(id: number, changes: UpdateIncident): Promise<number> {
    const result = await this.incidents.update({ id }, changes);
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<number> {
    const result = await this.incidents.delete({ id });
    return result.affected ?? 0;
  }
}
