import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from '../Cart/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
