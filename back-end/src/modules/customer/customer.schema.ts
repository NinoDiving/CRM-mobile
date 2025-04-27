import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop()
  fullname: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  zipCode: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop({ type: ObjectId, ref: 'Employee', required: true })
  employeeAffected: ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
