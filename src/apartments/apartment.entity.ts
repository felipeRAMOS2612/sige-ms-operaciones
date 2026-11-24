import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('APARTMENTS')
export class Apartment {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'UNIT_NUMBER', type: 'varchar2', length: 10, unique: true })
  number!: string;

  @Column({ name: 'FLOOR', type: 'number', precision: 3, scale: 0 })
  floor!: number;

  @Column({ name: 'RESIDENT_ID', type: 'number', precision: 10, scale: 0, nullable: true })
  residentId!: number | null;
}
