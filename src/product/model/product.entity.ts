import { ProdManufacturing } from 'src/prod-manufacturing/model/prod-manufacturing.entity';
import { QualityControlQueue } from 'src/quality-control/model/quality-control-queue.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ProductDetail } from './product-detail.entity';

@Entity()
@Unique(['serial_number'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @PrimaryColumn() // disabled this because it might create the both productId and productSerialNumber on default with the relation declaration
  @Column()
  serial_number: string;

  @Column()
  product_code: string;

  @Column({ nullable: true, default: null })
  quality_passed: boolean | null;

  //
  // ─── PROD MANUFACTURING ─────────────────────────────────────────────────────────
  //
  @Column({ nullable: true, default: null })
  prod_manufact_code: string | null; // default null

  @ManyToOne((type) => ProdManufacturing)
  @JoinColumn({ name: 'prod_manufact_code', referencedColumnName: 'generated_key' })
  product_manufacturing: ProdManufacturing;
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PROD DETAIL ────────────────────────────────────────────────────────────────
  //
  @ManyToOne((type) => ProductDetail, { cascade: true, onDelete: 'CASCADE' }) // If product-detail got removed -> remove all the product entitites with that product code [DANGER] //TODO require disscussion [but later]
  @JoinColumn({ name: 'product_code', referencedColumnName: 'product_code' })
  product_detail: ProductDetail;
  // ────────────────────────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
