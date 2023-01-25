import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/providers/prisma.service';
import { CustomerService } from '../customer/customer.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService, CustomerService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
