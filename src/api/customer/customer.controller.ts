import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get Customers' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 404, description: 'Bad Request.' })
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Customer By Id' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 404, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }
}
