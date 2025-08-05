import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from '../Order/order.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post('checkout')
  async createCheckoutSession(
    @UserId() userId: string,
    @Body('orderId') orderId: string,
  ) {
    if (!orderId) throw new BadRequestException('Order ID is required!');
    return await this.paymentService.createCheckoutSession(userId, orderId);
  }
}
