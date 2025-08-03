import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return await this.categoryService.findAll();
  }

  @Post()
  async create(@Body('name') name: string) {
    if (!name) throw new BadRequestException('No name provided!');
    const categoryName = name.toLowerCase().trim();
    const cat = await this.categoryService.findOneBy({ name: categoryName });
    if (cat) {
      throw new ConflictException('Category already exists');
    }
    return await this.categoryService.create({ name: categoryName });
  }
}
