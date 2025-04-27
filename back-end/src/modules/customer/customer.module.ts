import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { VerifyToken } from 'src/middleware/verifyToken';
import { JwtModule } from '@nestjs/jwt';

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
    consumer
      .apply(VerifyToken)
      .forRoutes({ path: 'customer', method: RequestMethod.POST });
  }
}
