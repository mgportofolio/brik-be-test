import { response } from 'src/helper/response';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';
import { ProductQueryString } from './dto/product-query-string.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(createProductDto);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    return response(HttpStatus.OK, result.meta.message, result.meta.success, result.data);
  }

  @Get()
  @ApiOperation({ summary: 'Get Products' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll(@Query() filter?: ProductQueryString) {
    const result = await this.productService.findAll(filter);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    return response(HttpStatus.OK, result.meta.message, result.meta.success, result.data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Product By Id' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findOne(@Param('id') id: string) {
    const result = await this.productService.findOne(+id);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    return response(HttpStatus.OK, result.meta.message, result.meta.success, result.data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Product' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const result = await this.productService.update(+id, updateProductDto);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    return response(HttpStatus.OK, result.meta.message, result.meta.success, result.data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Product' })
  @ApiResponse({ status: 200, description: 'Ok.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async remove(@Param('id') id: string) {
    const result = await this.productService.softDelete(+id);
    if(!result.meta.success){
      throw new HttpException(response(HttpStatus.BAD_REQUEST, result.meta.message, result.meta.success), HttpStatus.BAD_REQUEST);
    }
    return response(HttpStatus.OK, result.meta.message, result.meta.success, result.data);   
  }
}
