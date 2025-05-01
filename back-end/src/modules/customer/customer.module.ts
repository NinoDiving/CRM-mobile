import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { VerifyToken } from 'src/middleware/verifyToken';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthorisation } from 'src/middleware/adminAuthorisation';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, VerifyToken],
})
export class CustomerModule {
  configure(consumer: MiddlewareConsumer) {
    const blockedRoutes = ['customer', 'employee'];
    consumer
      .apply(VerifyToken)
      .forRoutes({ path: blockedRoutes.join(','), method: RequestMethod.POST });
    consumer
      .apply(AdminAuthorisation)
      .forRoutes({ path: 'customer', method: RequestMethod.POST });
  }
}
