import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app.js';
import { AnnouncementsController } from './announcements.controller.js';
import { AnnouncementsService } from './announcements.service.js';
import type { INestApplication } from '@nestjs/common';

const sampleAnnouncement = {
  id: 1,
  title: 'Scheduled water outage',
  body: 'On Saturday the 29th water will be cut between 09:00 and 13:00',
  publishedAt: new Date('2026-11-23T10:00:00.000Z').toISOString(),
};

const payload = {
  title: 'Scheduled water outage',
  body: 'On Saturday the 29th water will be cut between 09:00 and 13:00',
};

function createFakeService() {
  return {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('AnnouncementsController', () => {
  let app: INestApplication;
  let service: ReturnType<typeof createFakeService>;

  beforeEach(async () => {
    service = createFakeService();
    const moduleRef = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [{ provide: AnnouncementsService, useValue: service }],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('answers 200 on GET /announcements', async () => {
    service.list.mockResolvedValue([sampleAnnouncement]);

    const response = await request(app.getHttpServer()).get('/announcements').expect(200);

    expect(response.body).toEqual([sampleAnnouncement]);
  });

  it('answers 404 on GET /announcements/:id when missing', async () => {
    service.get.mockRejectedValue(new NotFoundException('Announcement 99 not found'));

    await request(app.getHttpServer()).get('/announcements/99').expect(404);
  });

  it('answers 201 on POST /announcements', async () => {
    service.create.mockResolvedValue(sampleAnnouncement);

    await request(app.getHttpServer()).post('/announcements').send(payload).expect(201);

    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('answers 400 when the title is empty', async () => {
    await request(app.getHttpServer())
      .post('/announcements')
      .send({ ...payload, title: '' })
      .expect(400);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('answers 400 when the body exceeds the limit', async () => {
    await request(app.getHttpServer())
      .post('/announcements')
      .send({ ...payload, body: 'x'.repeat(2001) })
      .expect(400);
  });

  it('answers 200 on PATCH /announcements/:id', async () => {
    service.update.mockResolvedValue({ ...sampleAnnouncement, title: 'Water outage cancelled' });

    await request(app.getHttpServer())
      .patch('/announcements/1')
      .send({ title: 'Water outage cancelled' })
      .expect(200);

    expect(service.update).toHaveBeenCalledWith(1, { title: 'Water outage cancelled' });
  });

  it('answers 204 on DELETE /announcements/:id', async () => {
    service.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/announcements/1').expect(204);
  });
});
