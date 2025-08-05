import { Controller, Post, RawBody, Req, Res, UseGuards } from '@nestjs/common';
import { InjectStripe } from './stripe.module';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/decorators/public.decorator';
import { OrderService } from '../Order/order.service';
import { PaymentService } from './payment.service';

@Controller('stripe-webhooks')
export class StripeWebhookController {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @Public()
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @RawBody() rawBody,
  ) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const orderId = event.data.object.metadata.orderId;
        const paymentId = event.data.object.metadata.paymentId;

        await this.orderService.updateOrder(orderId, { status: 'paid' });
        await this.paymentService.updatePayment(paymentId, {
          paidAt: new Date(),
          status: 'completed',
        });
        console.log('Checkout session completed:', event.data.object.metadata);
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
