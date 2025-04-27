import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Document } from 'mongoose';

@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'commercial'] })
  role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
