import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Exclude({ toPlainOnly: true }) // exclude during response not the instance it self
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true }) // exclude during response not the instance it self
  @Column()
  salt: string;

  @Column({ nullable: false, default: 'user' })
  role: string;

  @Column()
  position: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // @Overided - to make the Exclude decorator works
  toJSON() {
    return classToPlain(this);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
