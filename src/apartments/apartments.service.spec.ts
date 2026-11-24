import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApartmentsRepository } from './apartments.repository.js';
import { ApartmentsService } from './apartments.service.js';
import type { Apartment } from './apartment.entity.js';

const sampleApartment = {
  id: 1,
  number: '101',
  floor: 1,
  residentId: null,
} satisfies Apartment;

function createFakeRepository() {
  return {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('ApartmentsService', () => {
  let service: ApartmentsService;
  let repo: ReturnType<typeof createFakeRepository>;

  beforeEach(async () => {
    repo = createFakeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [ApartmentsService, { provide: ApartmentsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(ApartmentsService);
  });

  it('lists the apartments', async () => {
    repo.list.mockResolvedValue([sampleApartment]);

    await expect(service.list()).resolves.toEqual([sampleApartment]);
  });

  it('gets an existing apartment', async () => {
    repo.findById.mockResolvedValue(sampleApartment);

    await expect(service.get(1)).resolves.toEqual(sampleApartment);
  });

  it('throws NotFoundException when getting a missing apartment', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.get(99)).rejects.toThrow(NotFoundException);
  });

  it('creates an apartment with no resident assigned', async () => {
    repo.create.mockResolvedValue(sampleApartment);

    const created = await service.create({ number: '101', floor: 1 });

    expect(created.residentId).toBeNull();
    expect(repo.create).toHaveBeenCalledWith({ number: '101', floor: 1 });
  });

  it('maps a duplicate number to ConflictException', async () => {
    repo.create.mockRejectedValue({ driverError: { errorNum: 1 } });

    await expect(service.create({ number: '101', floor: 1 })).rejects.toThrow(ConflictException);
  });

  it('rethrows other errors on create', async () => {
    repo.create.mockRejectedValue({ driverError: { errorNum: 1400 } });

    await expect(service.create({ number: '101', floor: 1 })).rejects.not.toThrow(
      ConflictException,
    );
  });

  it('assigns a resident on update', async () => {
    repo.update.mockResolvedValue(1);
    repo.findById.mockResolvedValue({ ...sampleApartment, residentId: 7 });

    const updated = await service.update(1, { residentId: 7 });

    expect(repo.update).toHaveBeenCalledWith(1, { residentId: 7 });
    expect(updated.residentId).toBe(7);
  });

  it('throws NotFoundException when updating a missing apartment', async () => {
    repo.update.mockResolvedValue(0);

    await expect(service.update(99, { floor: 2 })).rejects.toThrow(NotFoundException);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('maps a duplicate number on update', async () => {
    repo.update.mockRejectedValue({ driverError: { errorNum: 1 } });

    await expect(service.update(1, { number: '102' })).rejects.toThrow(ConflictException);
  });

  it('removes an existing apartment', async () => {
    repo.remove.mockResolvedValue(1);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('throws NotFoundException when removing a missing apartment', async () => {
    repo.remove.mockResolvedValue(0);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
