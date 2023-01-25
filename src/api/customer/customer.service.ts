import { CustomerDto } from 'src/api/customer/dto/customer.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { resultStatus } from 'src/helper/resultStatus';
import { RowStatus } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(name?: string) {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
    };
    if (name) {
      if (name) queryFilter['name'] = { contains: name };
    }

    try {
      const customers = await this.prisma.customer.findMany({
        where: queryFilter,
      });
      if (customers.length === 0) {
        return resultStatus('Customers is empty!', false);
      }
      return resultStatus('Success Finding Customers!', true, customers);
    } catch (error) {
      console.log(error);
      return resultStatus('Failed Finding Customers!', false, error);
    }
  }

  async findOne(id: number) {
    const queryFilter = {
      row_status: RowStatus.ACTIVE,
      id: id,
    };
    try {
      const customer = await this.prisma.customer.findFirst({
        where: queryFilter,
      });
      if (!customer) {
        return resultStatus('Customer not found!', false);
      }
      return resultStatus('Success Finding Customer By Id!', true, customer);
    } catch (error) {
      return resultStatus('Failed Finding Customer By Id!', false, error);
    }
  }

  async checkCustomer(cust: CustomerDto) {
    let validCustomerData = cust;
    validCustomerData['is_new'] = true;

    //Check if id for database-checking valid or if it's 0, check if the name valid for create new customer
    if (cust.id === 0 && cust.name === '') {
      return resultStatus(
        'Failed to create customer!',
        false,
        validCustomerData,
      );
    }

    //if name valid but cust id isn't greater than 0, return the original data
    if (cust.id > 0 === false) {
      return resultStatus('New customer detected!', true, validCustomerData);
    }

    //if the id more than 0, check database
    const customerFromDb = await this.prisma.customer.findUnique({
      where: {
        id: cust.id,
      },
    });

    //in case the customer exist in database return customer data from database
    if (customerFromDb) {
      validCustomerData = customerFromDb;
      validCustomerData['is_new'] = false;
      return resultStatus(
        'Existed customer detected!',
        true,
        validCustomerData,
      );
    }

    //case data customer from database is not exist, return original data
    return resultStatus('New customer detected!', true, validCustomerData);
  }
}
