import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DocumentModule } from './modules/document/document.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { VisitModule } from './modules/visit/visit.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EmployeeModule,
    CustomerModule,
    DocumentModule,
    VisitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
