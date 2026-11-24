import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isUniqueViolation } from '../oracle-unique.js';
import { ApartmentsRepository } from './apartments.repository.js';
import type { Apartment } from './apartment.entity.js';
import type { CreateApartment, UpdateApartment } from './apartments.schemas.js';

const DUPLICATE_NUMBER = 'An apartment with that number already exists';

@Injectable()
export class ApartmentsService {
  constructor(private readonly apartments: ApartmentsRepository) {}

  list(): Promise<Apartment[]> {
    return this.apartments.list();
  }

  async get(id: number): Promise<Apartment> {
    const apartment = await this.apartments.findById(id);
    if (!apartment) {
      throw new NotFoundException(`Apartment ${id} not found`);
    }
    return apartment;
  }

  async create(data: CreateApartment): Promise<Apartment> {
    try {
      return await this.apartments.create(data);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(DUPLICATE_NUMBER);
      }
      throw error;
    }
  }

  async update(id: number, changes: UpdateApartment): Promise<Apartment> {
    let affected: number;
    try {
      affected = await this.apartments.update(id, changes);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(DUPLICATE_NUMBER);
      }
      throw error;
    }
    if (affected === 0) {
      throw new NotFoundException(`Apartment ${id} not found`);
    }
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.apartments.remove(id);
    if (affected === 0) {
      throw new NotFoundException(`Apartment ${id} not found`);
    }
  }
}
