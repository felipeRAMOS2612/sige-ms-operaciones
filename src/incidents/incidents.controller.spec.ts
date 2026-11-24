import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app.js';
import { IncidentsController } from './incidents.controller.js';
import { IncidentsService } from './incidents.service.js';
import type { INestApplication } from '@nestjs/common';

const sampleIncident = {
  id: 1,
  title: 'Elevator out of service',
  description: 'The main hall elevator does not respond',
  status: 'OPEN',
  apartmentId: 3,
  createdAt: new Date('2026-11-23T10:00:00.000Z').toISOString(),
};

const payload = {
  title: 'Elevator out of service',
  description: 'The main hall elevator does not respond',
  apartmentId: 3,
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

describe('IncidentsController', () => {
  let app: INestApplication;
  let service: ReturnType<typeof createFakeService>;

  beforeEach(async () => {
    service = createFakeService();
    const moduleRef = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [{ provide: IncidentsService, useValue: service }],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('answers 200 on GET /incidents', async () => {
    service.list.mockResolvedValue([sampleIncident]);

    const response = await request(app.getHttpServer()).get('/incidents').expect(200);

    expect(response.body).toEqual([sampleIncident]);
  });

  it('answers 404 on GET /incidents/:id when missing', async () => {
    service.get.mockRejectedValue(new NotFoundException('Incident 99 not found'));

    await request(app.getHttpServer()).get('/incidents/99').expect(404);
  });

  it('answers 201 on POST /incidents', async () => {
    service.create.mockResolvedValue(sampleIncident);

    await request(app.getHttpServer()).post('/incidents').send(payload).expect(201);

    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('answers 400 when the status is sent on create', async () => {
    await request(app.getHttpServer())
      .post('/incidents')
      .send({ ...payload, status: 'OPEN' })
      .expect(400);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('answers 400 when the description is empty', async () => {
    await request(app.getHttpServer())
      .post('/incidents')
      .send({ ...payload, description: '   ' })
      .expect(400);
  });

  it('changes the status on PATCH /incidents/:id', async () => {
    service.update.mockResolvedValue({ ...sampleIncident, status: 'CLOSED' });

    await request(app.getHttpServer()).patch('/incidents/1').send({ status: 'CLOSED' }).expect(200);

    expect(service.update).toHaveBeenCalledWith(1, { status: 'CLOSED' });
  });

  it('answers 400 for an unknown status', async () => {
    await request(app.getHttpServer()).patch('/incidents/1').send({ status: 'PAUSED' }).expect(400);

    expect(service.update).not.toHaveBeenCalled();
  });

  it('answers 204 on DELETE /incidents/:id', async () => {
    service.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/incidents/1').expect(204);
  });
});
