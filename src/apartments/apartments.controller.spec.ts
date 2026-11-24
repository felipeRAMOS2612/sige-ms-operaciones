import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app.js';
import { ApartmentsController } from './apartments.controller.js';
import { ApartmentsService } from './apartments.service.js';
import type { INestApplication } from '@nestjs/common';

const sampleApartment = { id: 1, number: '101', floor: 1, residentId: null };

function createFakeService() {
  return {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

describe('ApartmentsController', () => {
  let app: INestApplication;
  let service: ReturnType<typeof createFakeService>;

  beforeEach(async () => {
    service = createFakeService();
    const moduleRef = await Test.createTestingModule({
      controllers: [ApartmentsController],
      providers: [{ provide: ApartmentsService, useValue: service }],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('answers 200 on GET /apartments', async () => {
    service.list.mockResolvedValue([sampleApartment]);

    const response = await request(app.getHttpServer()).get('/apartments').expect(200);

    expect(response.body).toEqual([sampleApartment]);
  });

  it('answers 404 on GET /apartments/:id when missing', async () => {
    service.get.mockRejectedValue(new NotFoundException('Apartment 99 not found'));

    await request(app.getHttpServer()).get('/apartments/99').expect(404);
  });

  it('answers 201 on POST /apartments', async () => {
    service.create.mockResolvedValue(sampleApartment);

    await request(app.getHttpServer())
      .post('/apartments')
      .send({ number: '101', floor: 1 })
      .expect(201);

    expect(service.create).toHaveBeenCalledWith({ number: '101', floor: 1 });
  });

  it('answers 400 when floor is not a number', async () => {
    await request(app.getHttpServer())
      .post('/apartments')
      .send({ number: '101', floor: 'ground' })
      .expect(400);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('answers 409 when the number is duplicated', async () => {
    service.create.mockRejectedValue(new ConflictException('duplicate'));

    await request(app.getHttpServer())
      .post('/apartments')
      .send({ number: '101', floor: 1 })
      .expect(409);
  });

  it('assigns a resident on PATCH /apartments/:id', async () => {
    service.update.mockResolvedValue({ ...sampleApartment, residentId: 7 });

    await request(app.getHttpServer()).patch('/apartments/1').send({ residentId: 7 }).expect(200);

    expect(service.update).toHaveBeenCalledWith(1, { residentId: 7 });
  });

  it('accepts a null resident to unassign', async () => {
    service.update.mockResolvedValue(sampleApartment);

    await request(app.getHttpServer()).patch('/apartments/1').send({ residentId: null }).expect(200);

    expect(service.update).toHaveBeenCalledWith(1, { residentId: null });
  });

  it('answers 204 on DELETE /apartments/:id', async () => {
    service.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/apartments/1').expect(204);
  });
});
