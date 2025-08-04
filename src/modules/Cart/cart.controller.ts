import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserId } from '../../common/decorators/user-id.decorator';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@UserId() userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @Post('/items')
  async addItemToCart(
    @UserId() userId: string,
    @Body() addItemDto: AddItemDto,
  ) {
    return await this.cartService.addItemToCart(
      userId,
      addItemDto.productId,
      addItemDto.quantity,
    );
  }
}
