import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { response } from 'src/helper/response';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const result = await this.customerService.checkCustomer(createOrderDto.customer);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    try{
      const data = await this.ordersService.create(createOrderDto.products, result.data);
      if(!data.meta.success){
        throw new HttpException(response(HttpStatus.BAD_REQUEST, data.meta.message, data.meta.success), HttpStatus.BAD_REQUEST);
      }
      return response(HttpStatus.OK, data.meta.message, data.meta.success, data.data);
    }
    catch(err){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, "Failed to create customer!", false), HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get Orders' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get Order By Id' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
