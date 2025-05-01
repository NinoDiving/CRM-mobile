import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  findEmployees() {
    return this.employeeService.findAll();
  }

  @Get('name')
  async findByName(@Query('name') name: string) {
    if (!name) {
      return [];
    }
    const employees = await this.employeeService.findByName(name);
    console.log('Employees found:', employees); // Debug
    return employees;
  }
}
