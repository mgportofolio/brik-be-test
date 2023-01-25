import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { response } from 'src/helper/response';
import { validatorDto } from 'src/helper/requestValidation';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  @HttpCode(200)
  @HttpCode(400)
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const validationResult = await validatorDto(CreateOrderDto, createOrderDto);
    if (!validationResult.meta.success) {
      throw new HttpException(
        response(
          HttpStatus.BAD_REQUEST,
          validationResult.meta.message,
          validationResult.meta.success,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.customerService.checkCustomer(
      createOrderDto.customer,
    );
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
    try {
      const data = await this.ordersService.create(
        createOrderDto.products,
        result.data,
      );
      if (!data.meta.success) {
        throw new HttpException(
          response(
            HttpStatus.BAD_REQUEST,
            data.meta.message,
            data.meta.success,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      return response(
        HttpStatus.OK,
        data.meta.message,
        data.meta.success,
        data.data,
      );
    } catch (err) {
      throw new HttpException(
        response(HttpStatus.BAD_REQUEST, 'Failed to create customer!', false),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @HttpCode(200)
  @HttpCode(400)
  @ApiOperation({ summary: 'Get Orders' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll() {
    const result = await this.ordersService.findAll();
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
  @ApiOperation({ summary: 'Get Order By Id' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findOne(@Param('id') id: string) {
    const result = await this.ordersService.findOne(+id);
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
