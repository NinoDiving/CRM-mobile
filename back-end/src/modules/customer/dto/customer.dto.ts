import { IsEmail, IsMongoId, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  zipcode: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsMongoId()
  employee_affected: string;
}
