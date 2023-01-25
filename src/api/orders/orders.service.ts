import { OrderDetailDto } from './dto/order-detail.dto';
import { Injectable } from '@nestjs/common';
import { Prisma, RowStatus } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CustomerDto } from '../customer/dto/customer.dto';
import { resultStatus } from 'src/helper/resultStatus';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  getMapOrderDetail(data: OrderDetailDto[]) {
    const orderMap = new Map();
    data.forEach((item) => {
      if (orderMap.has(item.product_id)) {
        orderMap[item.product_id] += item.qty;
      } else {
        orderMap.set(item.product_id, item.qty);
      }
    });
    return orderMap;
  }

  async create(productsReq: OrderDetailDto[], customerReq: CustomerDto) {
    let total_order = 0;
    let customerData = { id: 0, name: '' };
    const mapOrderDetail = this.getMapOrderDetail(productsReq);
    const data = {};
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { id: { in: Array.from(mapOrderDetail.keys()) } },
          { row_status: 'ACTIVE' },
        ],
      },
    });

    if (products.length === 0) {
      return resultStatus('Product not found', false);
    }

    const calculatedOrder = [];

    products.forEach((product) => {
      const data = {
        product_id: product.id,
        qty: mapOrderDetail.get(product.id),
        sub_total: product.price * mapOrderDetail.get(product.id),
      };
      total_order += data.sub_total;
      calculatedOrder.push(data);
    });

    try {
      await this.prisma.$transaction(
        async (tx) => {
          if (customerReq['is_new'] === true) {
            const newCustomer = await tx.customer.create({
              data: {
                name: customerReq.name,
                created_by: customerReq.name,
                updated_by: customerReq.name,
              },
            });
            customerData = newCustomer;
          } else {
            customerData = customerReq;
          }
          data['customer'] = customerData;

          const orders = await tx.order.create({
            data: {
              customer_id: customerData.id,
              total_price: total_order,
              created_by: customerData.name,
              updated_by: customerData.name,
            },
          });
          data['orders'] = orders;

          calculatedOrder.forEach((data) => {
            data.order_id = orders.id;
          });

          const orderDetail = await tx.orderDetail.createMany({
            data: calculatedOrder,
          });

          data['orders']['detail'] = calculatedOrder;
          data['orderDetailCount'] = orderDetail;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (err) {
      return resultStatus('Order failed to saved', false, err);
    }
    return resultStatus('Order Success', true, data);
  }

  async findAll() {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
    };
    try {
      const orders = await this.prisma.order.findMany({
        where: queryFilter,
        select: {
          id: true,
          total_price: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          order_detail: {
            select: {
              qty: true,
              sub_total: true,
              product: {
                select: {
                  name: true,
                  price: true,
                  image_url: true,
                  row_status: true,
                },
              },
            },
          },
        },
      });
      if (!orders) {
        return resultStatus('Products not found!', false);
      }
      return resultStatus('Success Finding Product By Id!', true, orders);
    } catch (error) {
      return resultStatus('Failed Finding Product By Id!', false, error);
    }
  }

  async findOne(id: number) {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
      id: id,
    };
    try {
      const order = await this.prisma.order.findFirst({
        where: queryFilter,
        select: {
          id: true,
          total_price: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          order_detail: {
            select: {
              qty: true,
              sub_total: true,
              product: {
                select: {
                  name: true,
                  price: true,
                  image_url: true,
                  row_status: true,
                },
              },
            },
          },
        },
      });
      if (!order) {
        return resultStatus('Products not found!', false);
      }
      return resultStatus('Success Finding Product By Id!', true, order);
    } catch (error) {
      return resultStatus('Failed Finding Product By Id!', false, error);
    }
  }
}
