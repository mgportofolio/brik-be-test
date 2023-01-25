import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { CustomerDto } from 'src/api/customer/dto/customer.dto';
import { OrderDetailDto } from './order-detail.dto';

export class CreateOrderDto {
  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  products: OrderDetailDto[];

  @ApiProperty({ type: CustomerDto })
  @IsObject()
  @Type(() => CustomerDto)
  customer: CustomerDto;
}
