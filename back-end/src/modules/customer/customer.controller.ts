import { CustomerService } from './customer.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerDto } from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  createCustomer(@Body() customerdto: CustomerDto) {
    return this.customerService.createCustomer(customerdto);
  }

  @Get()
  getCustomers() {
    return this.customerService.getCustomers();
  }
}
