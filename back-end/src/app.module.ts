import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { CustomerModule } from './modules/customer/customer.module';
@Module({
  imports: [DatabaseModule, AuthModule, EmployeeModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
