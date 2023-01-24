import { Module } from '@nestjs/common';
import { CustomerModule } from './api/customer/customer.module';
import { OrdersModule } from './api/orders/orders.module';
import { ProductModule } from './api/product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ProductModule, OrdersModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
