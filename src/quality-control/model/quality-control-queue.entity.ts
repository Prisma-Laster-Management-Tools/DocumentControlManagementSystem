import { Product } from 'src/product/model/product.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { QualityControlProtocol } from './quality-control-protocol.entity';

@Entity()
export class QualityControlQueue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // If product got delete this will too -> cascade on
  @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true, onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
