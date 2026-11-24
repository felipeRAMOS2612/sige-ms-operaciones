import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { IncidentStatus } from './incidents.schemas.js';

@Entity('INCIDENTS')
export class Incident {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 150 })
  title!: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar2', length: 1000 })
  description!: string;

  @Column({ name: 'STATUS', type: 'varchar2', length: 15 })
  status!: IncidentStatus;

  @Column({ name: 'APARTMENT_ID', type: 'number', precision: 10, scale: 0 })
  apartmentId!: number;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;
}
