import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_rates')
export class Rates extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: number;

  @Column({ type: 'jsonb' })
  rates: any;
}
