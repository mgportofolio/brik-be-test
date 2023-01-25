import { ApiProperty } from '@nestjs/swagger';

export class ProductQueryString {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  priceRangeStart: number;

  @ApiProperty({ required: false })
  priceRangeEnd: number;
}
