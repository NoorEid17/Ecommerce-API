import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '../Category/category.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async findAll() {
    return this.productService.findAll({ relations: ['category'] });
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
