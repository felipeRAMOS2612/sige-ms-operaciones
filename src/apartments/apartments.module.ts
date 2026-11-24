import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './apartment.entity.js';
import { ApartmentsController } from './apartments.controller.js';
import { ApartmentsRepository } from './apartments.repository.js';
import { ApartmentsService } from './apartments.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment])],
  controllers: [ApartmentsController],
  providers: [ApartmentsService, ApartmentsRepository],
  exports: [ApartmentsService],
})
export class ApartmentsModule {}
