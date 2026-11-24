import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AnnouncementsRepository } from './announcements.repository.js';
import { AnnouncementsService } from './announcements.service.js';
import type { Announcement } from './announcement.entity.js';

const sampleAnnouncement = {
  id: 1,
  title: 'Scheduled water outage',
  body: 'On Saturday the 29th water will be cut between 09:00 and 13:00',
  publishedAt: new Date('2026-11-23T10:00:00.000Z'),
} satisfies Announcement;

function createFakeRepository() {
  return {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let repo: ReturnType<typeof createFakeRepository>;

  beforeEach(async () => {
    repo = createFakeRepository();
    const moduleRef = await Test.createTestingModule({
      providers: [AnnouncementsService, { provide: AnnouncementsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(AnnouncementsService);
  });

  it('lists the announcements', async () => {
    repo.list.mockResolvedValue([sampleAnnouncement]);

    await expect(service.list()).resolves.toEqual([sampleAnnouncement]);
  });

  it('gets an existing announcement', async () => {
    repo.findById.mockResolvedValue(sampleAnnouncement);

    await expect(service.get(1)).resolves.toEqual(sampleAnnouncement);
  });

  it('throws NotFoundException when getting a missing announcement', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.get(99)).rejects.toThrow(NotFoundException);
  });

  it('creates an announcement', async () => {
    repo.create.mockResolvedValue(sampleAnnouncement);

    const created = await service.create({
      title: 'Scheduled water outage',
      body: 'On Saturday the 29th water will be cut between 09:00 and 13:00',
    });

    expect(created.id).toBe(1);
    expect(created.publishedAt).toBeInstanceOf(Date);
  });

  it('updates an existing announcement', async () => {
    repo.update.mockResolvedValue(1);
    repo.findById.mockResolvedValue({ ...sampleAnnouncement, title: 'Water outage cancelled' });

    const updated = await service.update(1, { title: 'Water outage cancelled' });

    expect(updated.title).toBe('Water outage cancelled');
  });

  it('throws NotFoundException when updating a missing announcement', async () => {
    repo.update.mockResolvedValue(0);

    await expect(service.update(99, { title: 'X' })).rejects.toThrow(NotFoundException);
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('removes an existing announcement', async () => {
    repo.remove.mockResolvedValue(1);

    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('throws NotFoundException when removing a missing announcement', async () => {
    repo.remove.mockResolvedValue(0);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
