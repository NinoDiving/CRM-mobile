import { CreateEmployeeDto } from './../employee/dto/createEmployee.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Employee } from '../employee/employee.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 10,
    });
  }

  async register(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const hashedPassword = await this.hashPassword(createEmployeeDto.password);

    const newEmployee = new this.employeeModel({
      ...createEmployeeDto,
      password: hashedPassword,
    });
    return newEmployee.save();
  }

  async validateEmployee(email: string, password: string): Promise<Employee> {
    const employee = await this.employeeModel.findOne({ email });
    if (!employee) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await argon2.verify(employee.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return employee;
  }

  async login(employee: Employee) {
    const payload = {
      id: employee._id,
      email: employee.email,
      lastname: employee.lastname,
      firstname: employee.firstname,
      role: employee.role,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
