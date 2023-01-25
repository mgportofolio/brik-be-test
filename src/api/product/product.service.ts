import { resultStatus } from './../../helper/resultStatus';
import { Injectable } from '@nestjs/common';
import { RowStatus } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryString } from './dto/product-query-string.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          image_url: createProductDto.image_url,
          created_by: 'ADMIN',
          updated_by: 'ADMIN',
        },
      });
      return resultStatus('Success Creating Product!', true, product);
    } catch (error) {
      return resultStatus('Failed Creating Product!', false, error);
    }
  }

  async checkProduct(createProductDto: CreateProductDto) {
    const queryFilter = {
      name: createProductDto.name,
      description: createProductDto.description,
      row_status: RowStatus.ACTIVE,
    };

    try {
      const product = await this.prisma.product.findFirst({
        where: queryFilter,
      });
      if (product) {
        return resultStatus(
          'Produc with same name and description already exists!',
          false,
        );
      }
    } catch (error) {
      return resultStatus('Failed Finding Products!', false, error);
    }
    return resultStatus('Product is unique', true);
  }

  async findAll(filter?: ProductQueryString) {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
    };
    console.log(filter);
    if (filter) {
      if (filter.name) queryFilter['name'] = { contains: filter.name };
      if (filter.description)
        queryFilter['description'] = { contains: filter.description };
      if (filter.priceRangeStart)
        queryFilter['price'] = { gte: +filter.priceRangeStart };
      if (filter.priceRangeEnd)
        queryFilter['price'] = { lte: +filter.priceRangeEnd };
    }
    console.log(queryFilter);
    try {
      const products = await this.prisma.product.findMany({
        where: queryFilter,
      });
      if (products.length === 0) {
        return resultStatus('Products is empty!', false);
      }
      return resultStatus('Success Finding Products!', true, products);
    } catch (error) {
      console.log(error);
      return resultStatus('Failed Finding Products!', false, error);
    }
  }

  async findOne(id: number) {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
      id: id,
    };
    try {
      const product = await this.prisma.product.findFirst({
        where: queryFilter,
      });
      if (!product) {
        return resultStatus('Products not found!', false);
      }
      return resultStatus('Success Finding Product By Id!', true, product);
    } catch (error) {
      return resultStatus('Failed Finding Product By Id!', false, error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id: id },
        data: {
          price: updateProductDto.price,
          name: updateProductDto.name,
          description: updateProductDto.description,
          updated_by: 'ADMIN',
        },
      });
      return resultStatus('Success Updating Product!', true, updatedProduct);
    } catch (error) {
      return resultStatus('Failed Updating Products!', false, error);
    }
  }

  async softDelete(id: number) {
    try {
      const deletedProduct = await this.prisma.product.update({
        where: { id: id },
        data: {
          row_status: RowStatus.DELETED,
          updated_by: 'ADMIN',
        },
      });
      return resultStatus('Success Deleting Product!', true, deletedProduct);
    } catch (error) {
      return resultStatus('Failed Deleting Products!', false, error);
    }
  }

  async hardDelete(id: number) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id: id },
      });
      return resultStatus('Success Deleting Product!', true, deletedProduct);
    } catch (error) {
      return resultStatus('Failed Deleting Products!', false, error);
    }
  }
}
