import { IsNumber, Max, Min } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
