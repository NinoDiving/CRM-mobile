import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customer.schema';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async createCustomer(customerDto: CustomerDto) {
    const customer = await this.customerModel.create(customerDto);
    return customer;
  }

  async getCustomers() {
    const customers = await this.customerModel
      .find()
      .populate('employeeAffected', 'firstname lastname email')
      .exec();
    return customers;
  }
}
