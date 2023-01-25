import { CustomerService } from './../customer/customer.service';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/providers/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, CustomerService],
})
export class OrdersModule {}
