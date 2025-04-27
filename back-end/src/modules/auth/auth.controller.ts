import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from '../employee/dto/createEmployee.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.authService.register(createEmployeeDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const employee = await this.authService.validateEmployee(
      body.email,
      body.password,
    );

    const { access_token } = await this.authService.login(employee);

    console.log(access_token);
    return { message: 'Logged in successfully' };
  }
}
