import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import type { User } from './user.entity.js';

const sampleUser = {
  id: 1,
  rut: '11111111-1',
  name: 'Ana Soto',
  email: 'ana@sige.cl',
  role: 'RESIDENT',
  active: true,
} satisfies User;

function createFakeRepository() {
  return {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let repo: ReturnType<typeof createFakeRepository>;

  beforeEach(async () => {
    repo = createFakeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(UsersService);
  });

  describe('list', () => {
    it('returns the users from the repository', async () => {
      repo.list.mockResolvedValue([sampleUser]);

      await expect(service.list()).resolves.toEqual([sampleUser]);
    });
  });

  describe('get', () => {
    it('returns the user when it exists', async () => {
      repo.findById.mockResolvedValue(sampleUser);

      await expect(service.get(1)).resolves.toEqual(sampleUser);
      expect(repo.findById).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when it does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.get(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const newUser = {
      rut: '22222222-2',
      name: 'Luis Pino',
      email: 'luis@sige.cl',
      role: 'CONCIERGE' as const,
    };

    it('creates the user as active by default', async () => {
      repo.create.mockResolvedValue({ ...sampleUser, ...newUser, id: 2 });

      const created = await service.create(newUser);

      expect(repo.create).toHaveBeenCalledWith(newUser);
      expect(created.active).toBe(true);
    });

    it('maps an Oracle unique violation to ConflictException', async () => {
      repo.create.mockRejectedValue({ driverError: { errorNum: 1 } });

      await expect(service.create(newUser)).rejects.toThrow(ConflictException);
    });

    it('rethrows any other database error', async () => {
      repo.create.mockRejectedValue({ driverError: { errorNum: 942 } });

      await expect(service.create(newUser)).rejects.not.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('returns the updated user when one row is affected', async () => {
      repo.update.mockResolvedValue(1);
      repo.findById.mockResolvedValue({ ...sampleUser, name: 'Ana Soto Rivas' });

      const updated = await service.update(1, { name: 'Ana Soto Rivas' });

      expect(repo.update).toHaveBeenCalledWith(1, { name: 'Ana Soto Rivas' });
      expect(updated.name).toBe('Ana Soto Rivas');
    });

    it('throws NotFoundException when no rows are affected', async () => {
      repo.update.mockResolvedValue(0);

      await expect(service.update(99, { name: 'X' })).rejects.toThrow(NotFoundException);
      expect(repo.findById).not.toHaveBeenCalled();
    });

    it('maps a unique violation to ConflictException', async () => {
      repo.update.mockRejectedValue({ driverError: { errorNum: 1 } });

      await expect(service.update(1, { email: 'ana@sige.cl' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('removes the user when one row is affected', async () => {
      repo.remove.mockResolvedValue(1);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when no rows are affected', async () => {
      repo.remove.mockResolvedValue(0);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
