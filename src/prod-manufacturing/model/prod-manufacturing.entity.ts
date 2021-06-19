import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProdManufacturing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  generated_key: string; // random generated for assigning to the product.entity itself in order to mark it as already in the pending list

  // @NOTE -> product_list.length -> can be done by querying the product table  and use where clause to find for the one that has the same generated_key

  //
  // ─── STAMPTATION ────────────────────────────────────────────────────────────────
  //
  @Column()
  product_code: string;

  @Column()
  product_name: string;

  @Column()
  total_products: number;

  @Column()
  price: number; // total price

  @Column({ nullable: true })
  shipping_status: boolean | null; // null = waiting to upload the evidence of shipping -> false = cancelled -> true = shipping successfully

  // @ NOTE FOR <shipping_status>
  // @ if @true
  /*
                -> Leave the generated_key that stamped in the product.entity as that
  */
  // @ if @false
  /*
                -> Set the column that contains the generated_key back to null [reversing-back]
  */
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── RECIEVER CREDENTIAL ────────────────────────────────────────────────────────
  //
  @Column()
  buyer_name: string; // Thiti Mahawannakit

  @Column()
  buyer_contact: string; // phone_number or fax or ... etc whatever

  // ────────────────────────────────────────────────────────────────────────────────

  @Column({ nullable: true })
  shipping_evidence: string | null; // string that contains the path to the uploaded file/photo

  @Column({ nullable: true, default: null })
  shipping_evidence_uploaded_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
