import { existsSync } from 'node:fs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module.js';
import { ApartmentsModule } from './apartments/apartments.module.js';
import { IncidentsModule } from './incidents/incidents.module.js';
import { LogbookModule } from './logbook/logbook.module.js';
import { UsersModule } from './users/users.module.js';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      connectString: process.env.DB_CONNECT_STRING,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true',
    }),
    UsersModule,
    ApartmentsModule,
    IncidentsModule,
    AnnouncementsModule,
    LogbookModule,
  ],
})
export class AppModule {}
