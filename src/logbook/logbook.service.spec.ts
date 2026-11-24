import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LogbookRepository } from './logbook.repository.js';
import { LogbookService } from './logbook.service.js';
import type { LogEntry } from './log-entry.entity.js';

const sampleEntry = {
  id: 1,
  type: 'VISIT',
  details: 'Visit from Pedro Rojas, ID 12345678-9',
  apartmentId: 3,
  recordedBy: 5,
  recordedAt: new Date('2026-11-23T10:00:00.000Z'),
} satisfies LogEntry;

function createFakeRepository() {
  return {
    list: vi.fn(),
    listByApartment: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('LogbookService', () => {
  let service: LogbookService;
  let repo: ReturnType<typeof createFakeRepository>;

  beforeEach(async () => {
    repo = createFakeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [LogbookService, { provide: LogbookRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(LogbookService);
  });

  it('lists the whole logbook when no filter is given', async () => {
    repo.list.mockResolvedValue([sampleEntry]);

    await expect(service.list()).resolves.toEqual([sampleEntry]);
    expect(repo.listByApartment).not.toHaveBeenCalled();
  });

  it('filters by apartment when one is given', async () => {
    repo.listByApartment.mockResolvedValue([sampleEntry]);

    await expect(service.list(3)).resolves.toEqual([sampleEntry]);
    expect(repo.listByApartment).toHaveBeenCalledWith(3);
    expect(repo.list).not.toHaveBeenCalled();
  });

  it('gets an existing entry', async () => {
    repo.findById.mockResolvedValue(sampleEntry);

    await expect(service.get(1)).resolves.toEqual(sampleEntry);
  });

  it('throws NotFoundException when getting a missing entry', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.get(99)).rejects.toThrow(NotFoundException);
  });

  it('records a parcel', async () => {
    repo.create.mockResolvedValue({ ...sampleEntry, type: 'PARCEL' });

    const created = await service.create({
      type: 'PARCEL',
      details: 'Medium box from Falabella',
      apartmentId: 3,
      recordedBy: 5,
    });

    expect(created.type).toBe('PARCEL');
  });

  it('updates an existing entry', async () => {
    repo.update.mockResolvedValue(1);
    repo.findById.mockResolvedValue({ ...sampleEntry, details: 'Corrected details' });

    const updated = await service.update(1, { details: 'Corrected details' });

    expect(updated.details).toBe('Corrected details');
  });

  it('throws NotFoundException when updating a missing entry', async () => {
    repo.update.mockResolvedValue(0);

    await expect(service.update(99, { details: 'X' })).rejects.toThrow(NotFoundException);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('removes an existing entry', async () => {
    repo.remove.mockResolvedValue(1);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('throws NotFoundException when removing a missing entry', async () => {
    repo.remove.mockResolvedValue(0);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
