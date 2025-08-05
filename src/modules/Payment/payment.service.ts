import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectStripe } from './stripe.module';
import Stripe from 'stripe';
import { OrderService } from '../Order/order.service';
import { Payment } from './payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly orderService: OrderService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {}

  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) throw new NotFoundException();
    return payment;
  }

  async getUserPayments(userId: string) {
    return this.paymentRepository.find({
      where: { userId },
      order: { paidAt: 'DESC' },
    });
  }

  async createPayment(paymentData: Partial<Payment>) {
    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }

  async updatePayment(id: string, updateData: Partial<Payment>) {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) throw new NotFoundException();

    Object.assign(payment, updateData);
    return this.paymentRepository.save(payment);
  }

  async createCheckoutSession(userId: string, orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order || order.userId !== userId) throw new NotFoundException();

    const paymentData: Partial<Payment> = {
      amount: order.totalAmount,
      userId: userId,
      orderId: orderId,
      transactionUrl: '',
      paidAt: null,
    };

    const payment = await this.createPayment(paymentData);

    const FRONTEND_URL = this.configService.get<string>('FRONTEND_URL');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.product.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      metadata: { orderId, paymentId: payment.id },
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment/cancel`,
    });

    await this.updatePayment(payment.id, {
      transactionUrl: session.url,
    });

    return { url: session.url };
  }
}
