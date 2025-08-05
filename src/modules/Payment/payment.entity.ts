import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  userId: string;

  @Column()
  orderId: string;

  @Column()
  transactionUrl: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
}
