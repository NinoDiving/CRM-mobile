import { Injectable } from '@nestjs/common';
import { Employee } from './employee.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }
}
