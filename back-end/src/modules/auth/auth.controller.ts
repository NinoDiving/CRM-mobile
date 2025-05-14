import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEmployeeDto } from '../employee/dto/createEmployee.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.authService.register(createEmployeeDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Get('session')
  getSession() {
    return this.authService.getSession();
  }
}
