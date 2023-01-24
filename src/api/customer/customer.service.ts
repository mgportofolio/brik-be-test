import { CustomerDto } from 'src/api/customer/dto/customer.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { resultStatus } from 'src/helper/resultStatus';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  async checkCustomer(cust: CustomerDto){
    let validCustomerData = cust;
    validCustomerData["is_new"] = true;

    //Check if id for database-checking valid or if it's 0, check if the name valid for create new customer
    if(cust.id === 0 && cust.name === ""){
      return resultStatus("Failed to create customer!", false, validCustomerData);
    }

    //if name valid but cust id isn't greater than 0, return the original data
    if(cust.id > 0 === false){
      return resultStatus("New customer detected!", true, validCustomerData);
    }

    //if the id more than 0, check database
    const customerFromDb = await this.prisma.customer.findUnique({
        where: {
          id: cust.id
        }
    })
    
    //in case the customer exist in database return customer data from database
    if(customerFromDb){
      validCustomerData = customerFromDb;
      validCustomerData["is_new"] = false;
      return resultStatus("Existed customer detected!", true, validCustomerData);
    }

    //case data customer from database is not exist, return original data
    return resultStatus("New customer detected!", true, validCustomerData);
  }
}
