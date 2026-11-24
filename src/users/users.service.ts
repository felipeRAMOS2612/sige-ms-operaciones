import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isUniqueViolation } from '../oracle-unique.js';
import { UsersRepository } from './users.repository.js';
import type { User } from './user.entity.js';
import type { CreateUser, UpdateUser } from './users.schemas.js';

const DUPLICATE_IDENTITY = 'RUT or email is already registered';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  list(): Promise<User[]> {
    return this.users.list();
  }

  async get(id: number): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async create(data: CreateUser): Promise<User> {
    try {
      return await this.users.create(data);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(DUPLICATE_IDENTITY);
      }
      throw error;
    }
  }

  async update(id: number, changes: UpdateUser): Promise<User> {
    let affected: number;
    try {
      affected = await this.users.update(id, changes);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(DUPLICATE_IDENTITY);
      }
      throw error;
    }
    if (affected === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.users.remove(id);
    if (affected === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
