import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { UserRole } from './users.schemas.js';

const toBoolean = {
  to: (value: boolean) => (value ? 1 : 0),
  from: (value: number) => Number(value) === 1,
};

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'RUT', type: 'varchar2', length: 12, unique: true })
  rut!: string;

  @Column({ name: 'NAME', type: 'varchar2', length: 120 })
  name!: string;

  @Column({ name: 'EMAIL', type: 'varchar2', length: 160, unique: true })
  email!: string;

  @Column({ name: 'ROLE', type: 'varchar2', length: 20 })
  role!: UserRole;

  @Column({ name: 'ACTIVE', type: 'number', precision: 1, scale: 0, transformer: toBoolean })
  active!: boolean;
}
