import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthorizationGuard } from 'src/middleware/adminAuthorization.guard';
import { AuthGuard } from 'src/middleware/verifyToken.guard';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';

@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseGuards(AdminAuthorizationGuard)
  createCustomer(@Body() customerdto: CustomerDto) {
    return this.customerService.createCustomer(customerdto);
  }

  @Get()
  @UseGuards(AdminAuthorizationGuard)
  getCustomers() {
    return this.customerService.getCustomers();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.customerService.findByName(name);
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.customerService.findByEmployee(employeeId);
  }
}
