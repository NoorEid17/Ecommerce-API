import { Module } from '@nestjs/common';
import { StripeModule } from './stripe.module';
import { OrderModule } from '../Order/order.module';
import { StripeWebhookController } from './stripe-webhook.controller';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

@Module({
  imports: [
    StripeModule.registerAsync(),
    OrderModule,
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [StripeWebhookController, PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
