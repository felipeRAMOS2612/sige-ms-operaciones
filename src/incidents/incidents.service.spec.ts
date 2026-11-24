import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IncidentsRepository } from './incidents.repository.js';
import { IncidentsService } from './incidents.service.js';
import type { Incident } from './incident.entity.js';

const sampleIncident = {
  id: 1,
  title: 'Elevator out of service',
  description: 'The main hall elevator does not respond',
  status: 'OPEN',
  apartmentId: 3,
  createdAt: new Date('2026-11-23T10:00:00.000Z'),
} satisfies Incident;

function createFakeRepository() {
  return {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('IncidentsService', () => {
  let service: IncidentsService;
  let repo: ReturnType<typeof createFakeRepository>;

  beforeEach(async () => {
    repo = createFakeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [IncidentsService, { provide: IncidentsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(IncidentsService);
  });

  it('lists the incidents', async () => {
    repo.list.mockResolvedValue([sampleIncident]);

    await expect(service.list()).resolves.toEqual([sampleIncident]);
  });

  it('gets an existing incident', async () => {
    repo.findById.mockResolvedValue(sampleIncident);

    await expect(service.get(1)).resolves.toEqual(sampleIncident);
  });

  it('throws NotFoundException when getting a missing incident', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.get(99)).rejects.toThrow(NotFoundException);
  });

  it('creates the incident with OPEN status', async () => {
    repo.create.mockResolvedValue(sampleIncident);

    const created = await service.create({
      title: 'Elevator out of service',
      description: 'The main hall elevator does not respond',
      apartmentId: 3,
    });

    expect(created.status).toBe('OPEN');
  });

  it('changes the status on update', async () => {
    repo.update.mockResolvedValue(1);
    repo.findById.mockResolvedValue({ ...sampleIncident, status: 'CLOSED' });

    const updated = await service.update(1, { status: 'CLOSED' });

    expect(repo.update).toHaveBeenCalledWith(1, { status: 'CLOSED' });
    expect(updated.status).toBe('CLOSED');
  });

  it('throws NotFoundException when updating a missing incident', async () => {
    repo.update.mockResolvedValue(0);

    await expect(service.update(99, { status: 'CLOSED' })).rejects.toThrow(NotFoundException);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('removes an existing incident', async () => {
    repo.remove.mockResolvedValue(1);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('throws NotFoundException when removing a missing incident', async () => {
    repo.remove.mockResolvedValue(0);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
