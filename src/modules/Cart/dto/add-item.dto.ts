import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class AddItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
