import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    return this.productRepository.find();
  }

  async create(productData: Partial<Product>) {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }
}
