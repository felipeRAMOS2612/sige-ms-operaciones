import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app.js';
import { LogbookController } from './logbook.controller.js';
import { LogbookService } from './logbook.service.js';
import type { INestApplication } from '@nestjs/common';

const sampleEntry = {
  id: 1,
  type: 'VISIT',
  details: 'Visit from Pedro Rojas, ID 12345678-9',
  apartmentId: 3,
  recordedBy: 5,
  recordedAt: new Date('2026-11-23T10:00:00.000Z').toISOString(),
};

const payload = {
  type: 'PARCEL',
  details: 'Medium box from Falabella',
  apartmentId: 3,
  recordedBy: 5,
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

describe('LogbookController', () => {
  let app: INestApplication;
  let service: ReturnType<typeof createFakeService>;

  beforeEach(async () => {
    service = createFakeService();
    const moduleRef = await Test.createTestingModule({
      controllers: [LogbookController],
      providers: [{ provide: LogbookService, useValue: service }],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('answers 200 on GET /logbook with no filter', async () => {
    service.list.mockResolvedValue([sampleEntry]);

    const response = await request(app.getHttpServer()).get('/logbook').expect(200);

    expect(response.body).toEqual([sampleEntry]);
    expect(service.list).toHaveBeenCalledWith(undefined);
  });

  it('coerces the apartmentId query into a number', async () => {
    service.list.mockResolvedValue([sampleEntry]);

    await request(app.getHttpServer()).get('/logbook?apartmentId=3').expect(200);

    expect(service.list).toHaveBeenCalledWith(3);
  });

  it('answers 400 for a non numeric apartmentId query', async () => {
    await request(app.getHttpServer()).get('/logbook?apartmentId=abc').expect(400);

    expect(service.list).not.toHaveBeenCalled();
  });

  it('answers 404 on GET /logbook/:id when missing', async () => {
    service.get.mockRejectedValue(new NotFoundException('Log entry 99 not found'));

    await request(app.getHttpServer()).get('/logbook/99').expect(404);
  });

  it('answers 201 on POST /logbook', async () => {
    service.create.mockResolvedValue({ ...sampleEntry, type: 'PARCEL' });

    await request(app.getHttpServer()).post('/logbook').send(payload).expect(201);

    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('answers 400 for an unknown entry type', async () => {
    await request(app.getHttpServer())
      .post('/logbook')
      .send({ ...payload, type: 'DELIVERY' })
      .expect(400);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('answers 400 when recordedBy is missing', async () => {
    await request(app.getHttpServer())
      .post('/logbook')
      .send({ type: 'VISIT', details: 'Someone', apartmentId: 3 })
      .expect(400);
  });

  it('answers 200 on PATCH /logbook/:id', async () => {
    service.update.mockResolvedValue({ ...sampleEntry, details: 'Corrected details' });

    await request(app.getHttpServer())
      .patch('/logbook/1')
      .send({ details: 'Corrected details' })
      .expect(200);

    expect(service.update).toHaveBeenCalledWith(1, { details: 'Corrected details' });
  });

  it('answers 204 on DELETE /logbook/:id', async () => {
    service.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/logbook/1').expect(204);
  });
});
