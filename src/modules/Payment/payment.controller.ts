import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from '../Order/order.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Get('my')
  async getUserPayments(@UserId() userId: string) {
    if (!userId) throw new BadRequestException('User ID is required!');
    return await this.paymentService.getUserPayments(userId);
  }

  @Get(':id')
  async getPaymentById(@Body('id', new ParseUUIDPipe()) id: string) {
    if (!id) throw new BadRequestException('Payment ID is required!');
    return await this.paymentService.getPaymentById(id);
  }

  @Post('checkout')
  async createCheckoutSession(
    @UserId() userId: string,
    @Body('orderId') orderId: string,
  ) {
    if (!orderId) throw new BadRequestException('Order ID is required!');
    return await this.paymentService.createCheckoutSession(userId, orderId);
  }
}
