import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  lastname: string;

  @IsString()
  firstname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['admin', 'commercial'])
  role: string;
}
