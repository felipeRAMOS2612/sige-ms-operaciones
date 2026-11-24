import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './apartment.entity.js';
import type { CreateApartment, UpdateApartment } from './apartments.schemas.js';

@Injectable()
export class ApartmentsRepository {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartments: Repository<Apartment>,
  ) {}

  list(): Promise<Apartment[]> {
    return this.apartments.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<Apartment | null> {
    return this.apartments.findOneBy({ id });
  }

  create(data: CreateApartment): Promise<Apartment> {
    return this.apartments.save(
      this.apartments.create({ ...data, residentId: data.residentId ?? null }),
    );
  }

  async update(id: number, changes: UpdateApartment): Promise<number> {
    const result = await this.apartments.update({ id }, changes);
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<number> {
    const result = await this.apartments.delete({ id });
    return result.affected ?? 0;
  }
}
