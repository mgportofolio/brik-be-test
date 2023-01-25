import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { response } from 'src/helper/response';
import { CustomerService } from './customer.service';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @HttpCode(200)
  @HttpCode(400)
  @ApiOperation({ summary: 'Get Customers' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll() {
    const result = await this.customerService.findAll();
    if (!result.meta.success) {
      throw new HttpException(
        response(
          HttpStatus.BAD_REQUEST,
          result.meta.message,
          result.meta.success,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
    return response(
      HttpStatus.OK,
      result.meta.message,
      result.meta.success,
      result.data,
    );
  }

  @Get(':id')
  @HttpCode(200)
  @HttpCode(400)
  @ApiOperation({ summary: 'Get Customer By Id' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findOne(@Param('id') id: string) {
    const result = await this.customerService.findOne(+id);
    if (!result.meta.success) {
      throw new HttpException(
        response(
          HttpStatus.BAD_REQUEST,
          result.meta.message,
          result.meta.success,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
    return response(
      HttpStatus.OK,
      result.meta.message,
      result.meta.success,
      result.data,
    );
  }
}
