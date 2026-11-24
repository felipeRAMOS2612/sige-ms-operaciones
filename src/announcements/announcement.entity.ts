import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ANNOUNCEMENTS')
export class Announcement {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 150 })
  title!: string;

  @Column({ name: 'BODY', type: 'varchar2', length: 2000 })
  body!: string;

  @CreateDateColumn({ name: 'PUBLISHED_AT', type: 'timestamp' })
  publishedAt!: Date;
}
