import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { LogEntryType } from './logbook.schemas.js';

@Entity('LOGBOOK')
export class LogEntry {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'ENTRY_TYPE', type: 'varchar2', length: 15 })
  type!: LogEntryType;

  @Column({ name: 'DETAILS', type: 'varchar2', length: 500 })
  details!: string;

  @Column({ name: 'APARTMENT_ID', type: 'number', precision: 10, scale: 0 })
  apartmentId!: number;

  @Column({ name: 'RECORDED_BY', type: 'number', precision: 10, scale: 0 })
  recordedBy!: number;

  @CreateDateColumn({ name: 'RECORDED_AT', type: 'timestamp' })
  recordedAt!: Date;
}
