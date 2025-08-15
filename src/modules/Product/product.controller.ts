import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '../Category/category.service';
import { Query } from '@nestjs/common';
import { Between, Like } from 'typeorm';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('minPrice', new ParseFloatPipe()) minPrice = 0,
    @Query('maxPrice', new ParseFloatPipe()) maxPrice = 1_000_0000,
    @Query('page', new ParseIntPipe()) page = 1,
  ) {
    return this.productService.findAll({
      relations: {
        category: true,
      },
      where: {
        price: Between(minPrice, maxPrice),
        ...(categoryId && { category: { id: categoryId } }),
        ...(search && { search: Like(`%${search}%`) }),
      },
      take: page,
    });
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productService.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const { categoryId } = createProductDto;
    const category = await this.categoryService.findOneBy({ id: categoryId });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.productService.create(createProductDto);
  }
}
