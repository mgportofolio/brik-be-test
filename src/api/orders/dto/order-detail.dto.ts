import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class OrderDetailDto {
  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Qty of ordered product must be more than 0' })
  product_id: number;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Qty of ordered product must be more than 0' })
  qty: number;
}
