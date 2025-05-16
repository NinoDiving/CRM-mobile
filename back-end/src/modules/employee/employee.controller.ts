import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuthorizationGuard } from 'src/middleware/adminAuthorization.guard';
import { AuthGuard } from 'src/middleware/verifyToken.guard';
import { EmployeeService } from './employee.service';

@Controller('employee')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  @UseGuards(AdminAuthorizationGuard)
  findEmployees() {
    return this.employeeService.findAll();
  }

  @Get('name')
  @UseGuards(AdminAuthorizationGuard)
  async findByName(@Query('name') name: string) {
    if (!name) {
      return [];
    }
    const employees = await this.employeeService.findByName(name);
    console.log('Employees found:', employees); // Debug
    return employees;
  }
}
