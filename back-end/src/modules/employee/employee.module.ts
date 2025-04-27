import { Module } from '@nestjs/common';
import { Employee, EmployeeSchema } from './employee.schema';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
