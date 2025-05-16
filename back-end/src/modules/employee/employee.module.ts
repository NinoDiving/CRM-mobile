import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database.module';
import { AdminAuthorizationGuard } from '../../middleware/adminAuthorization.guard';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [DatabaseModule],
  providers: [EmployeeService, AdminAuthorizationGuard],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
