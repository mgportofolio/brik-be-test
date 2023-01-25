import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50, {
    message: 'Product name must not be more than 50 characters',
  })
  @MinLength(5, { message: 'Product name must not be less than 5 characters' })
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200, {
    message: 'Product name must not be more than 200 characters',
  })
  @MinLength(5, {
    message: 'Product description must not be less than 5 characters',
  })
  description: string;

  @ApiProperty()
  @IsInt()
  @Max(1000000000000, {
    message: 'Product price must not be greater than 1.000.000.000.000',
  })
  @Min(1, { message: 'Product price must not be less than 0' })
  price: number;

  @ApiProperty()
  @IsString()
  image_url: string;
}
