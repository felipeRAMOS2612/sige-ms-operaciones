import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntry } from './log-entry.entity.js';
import { LogbookController } from './logbook.controller.js';
import { LogbookRepository } from './logbook.repository.js';
import { LogbookService } from './logbook.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntry])],
  controllers: [LogbookController],
  providers: [LogbookService, LogbookRepository],
  exports: [LogbookService],
})
export class LogbookModule {}
