import { QualityControlQueue } from 'src/quality-control/model/quality-control-queue.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ProductDetail } from './product-detail.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @PrimaryColumn() // disabled this because it might create the both productId and productSerialNumber on default with the relation declaration
  @Column()
  serial_number: string;

  @Column()
  product_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
