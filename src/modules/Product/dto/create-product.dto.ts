import { IsDecimal, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsUUID()
  categoryId: string;

  @IsUrl()
  imageUrl: string;

  @IsNumber()
  stockQuantity: number;
}
