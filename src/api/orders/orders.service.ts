import { OrderDetailDto } from './dto/order-detail.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomerDto } from '../customer/dto/customer.dto';
import { resultStatus } from 'src/helper/resultStatus';


@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  getMapOrderDetail(data: OrderDetailDto[]){
    const orderMap = new Map();
    data.forEach(item => {
      if(orderMap.has(item.product_id)){
        orderMap[item.product_id] += item.qty;
      }
      else{
        orderMap.set(item.product_id, item.qty);
      }
    })
    return orderMap;
  }

  async create(productsReq: OrderDetailDto[], customerReq: CustomerDto) {
    let total_order = 0;
    let customerData = { id: 0, name: "" };
    let mapOrderDetail = this.getMapOrderDetail(productsReq);
    let data = {};
    const products = await this.prisma.product.findMany({ 
      where:{
        AND:[
          {id: {in: Array.from(mapOrderDetail.keys())}},
          {row_status: "ACTIVE"}
        ]
      }
    })

    if(products.length === 0 ){
      return resultStatus("Product not found", false);
    }

    const calculatedOrder = [];

    products.forEach((product) => {
      let data = {
        product_id: product.id,
        sub_total: product.price * mapOrderDetail.get(product.id),
      }
      total_order += data.sub_total;
      calculatedOrder.push(data);
    })

    try{
      await this.prisma.$transaction(async (tx) =>{
        if(customerReq["is_new"] === true){
          const newCustomer = await tx.customer.create({
            data: {
              name: customerReq.name,
              created_by: customerReq.name,
              updated_by: customerReq.name
            }
          })
          customerData = newCustomer;
        }
        else{
          customerData = customerReq;
        }
        data["customer"] = customerData;
        
        const orders = await tx.order.create({
          data: {
            customer_id: customerData.id,
            total_price: total_order,
            created_by: customerData.name,
            updated_by: customerData.name
          }
        })
        data["orders"] = orders;

        calculatedOrder.forEach(data => {
          data.order_id = orders.id
        })

        const orderDetail = await tx.orderDetail.createMany({
          data: calculatedOrder
        })

        data["orders"]["detail"] = calculatedOrder;
        data["orderDetailCount"] = orderDetail;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );
    } catch (err) {
      return resultStatus("Order failed to saved", false, err);
    }
    return resultStatus("Order Success", true, data);
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
