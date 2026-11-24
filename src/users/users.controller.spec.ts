import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../configure-app.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import type { INestApplication } from '@nestjs/common';

const sampleUser = {
  id: 1,
  rut: '11111111-1',
  name: 'Ana Soto',
  email: 'ana@sige.cl',
  role: 'RESIDENT',
  active: true,
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

describe('UsersController', () => {
  let app: INestApplication;
  let service: ReturnType<typeof createFakeService>;

  beforeEach(async () => {
    service = createFakeService();
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('answers 200 with the list', async () => {
      service.list.mockResolvedValue([sampleUser]);

      const response = await request(app.getHttpServer()).get('/users').expect(200);

      expect(response.body).toEqual([sampleUser]);
    });
  });

  describe('GET /users/:id', () => {
    it('answers 200 with the user', async () => {
      service.get.mockResolvedValue(sampleUser);

      await request(app.getHttpServer()).get('/users/1').expect(200);

      expect(service.get).toHaveBeenCalledWith(1);
    });

    it('answers 404 when the user is missing', async () => {
      service.get.mockRejectedValue(new NotFoundException('User 99 not found'));

      await request(app.getHttpServer()).get('/users/99').expect(404);
    });

    it('answers 400 for a non numeric id', async () => {
      await request(app.getHttpServer()).get('/users/abc').expect(400);

      expect(service.get).not.toHaveBeenCalled();
    });
  });

  describe('POST /users', () => {
    const payload = {
      rut: '22222222-2',
      name: 'Luis Pino',
      email: 'luis@sige.cl',
      role: 'CONCIERGE',
    };

    it('answers 201 with the created user', async () => {
      service.create.mockResolvedValue({ ...sampleUser, ...payload, id: 2 });

      await request(app.getHttpServer()).post('/users').send(payload).expect(201);

      expect(service.create).toHaveBeenCalledWith(payload);
    });

    it('answers 400 for an invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ ...payload, email: 'not-an-email' })
        .expect(400);

      expect(service.create).not.toHaveBeenCalled();
    });

    it('answers 400 for an unknown role', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ ...payload, role: 'OWNER' })
        .expect(400);
    });

    it('answers 400 for an unknown extra field', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ ...payload, active: true })
        .expect(400);
    });

    it('answers 400 when a required field is missing', async () => {
      await request(app.getHttpServer()).post('/users').send({ name: 'Luis Pino' }).expect(400);
    });

    it('answers 409 when the identity is duplicated', async () => {
      service.create.mockRejectedValue(new ConflictException('RUT or email is already registered'));

      await request(app.getHttpServer()).post('/users').send(payload).expect(409);
    });
  });

  describe('PATCH /users/:id', () => {
    it('answers 200 with the updated user', async () => {
      service.update.mockResolvedValue({ ...sampleUser, name: 'Ana Soto Rivas' });

      await request(app.getHttpServer())
        .patch('/users/1')
        .send({ name: 'Ana Soto Rivas' })
        .expect(200);

      expect(service.update).toHaveBeenCalledWith(1, { name: 'Ana Soto Rivas' });
    });

    it('accepts the active flag', async () => {
      service.update.mockResolvedValue({ ...sampleUser, active: false });

      await request(app.getHttpServer()).patch('/users/1').send({ active: false }).expect(200);

      expect(service.update).toHaveBeenCalledWith(1, { active: false });
    });

    it('answers 400 when active is not a boolean', async () => {
      await request(app.getHttpServer()).patch('/users/1').send({ active: 'yes' }).expect(400);
    });

    it('answers 404 when the user is missing', async () => {
      service.update.mockRejectedValue(new NotFoundException('User 99 not found'));

      await request(app.getHttpServer()).patch('/users/99').send({ name: 'X' }).expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('answers 204 with no body', async () => {
      service.remove.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer()).delete('/users/1').expect(204);

      expect(response.body).toEqual({});
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('answers 404 when the user is missing', async () => {
      service.remove.mockRejectedValue(new NotFoundException('User 99 not found'));

      await request(app.getHttpServer()).delete('/users/99').expect(404);
    });
  });
});
