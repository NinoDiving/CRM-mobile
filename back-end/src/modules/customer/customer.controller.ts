import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
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

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(id);
  }

  @Get('name')
  findByName(@Query('name') name: string) {
    return this.customerService.findByName(name);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.customerService.findByEmployee(employeeId);
  }
}
