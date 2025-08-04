import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserId } from '../../common/decorators/user-id.decorator';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

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

  @Patch('/items/:productId')
  async updateCartItem(
    @UserId() userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return await this.cartService.updateCartItem(
      userId,
      productId,
      updateItemDto.quantity,
    );
  }

  @Delete('/items/:productId')
  async deleteCartItem(
    @UserId() userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    await this.cartService.deleteCartItem(userId, productId);
    return { message: 'Item removed from cart successfully' };
  }
}
