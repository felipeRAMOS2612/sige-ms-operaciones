import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import type { CreateUser, UpdateUser } from './users.schemas.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  list(): Promise<User[]> {
    return this.users.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  create(data: CreateUser): Promise<User> {
    return this.users.save(this.users.create({ ...data, active: true }));
  }

  async update(id: number, changes: UpdateUser): Promise<number> {
    const result = await this.users.update({ id }, changes);
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<number> {
    const result = await this.users.delete({ id });
    return result.affected ?? 0;
  }
}
