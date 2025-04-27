import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from '../employee/dto/createEmployee.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.authService.register(createEmployeeDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const employee = await this.authService.validateEmployee(
      body.email,
      body.password,
    );

    const { access_token } = await this.authService.login(employee);

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });
    console.log(access_token);
    return { message: 'Logged in successfully' };
  }
}
