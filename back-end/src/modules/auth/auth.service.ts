import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateEmployeeDto } from '../employee/dto/createEmployee.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async register(createEmployeeDto: CreateEmployeeDto) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: createEmployeeDto.email,
        password: createEmployeeDto.password,
        options: {
          data: {
            firstname: createEmployeeDto.firstname,
            lastname: createEmployeeDto.lastname,
            role: createEmployeeDto.role,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw new BadRequestException(error.message);
      }

      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('Attempting to login with:', { email });

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new UnauthorizedException(error.message);
      }

      const role = data.user.user_metadata.role as string;

      if (!role) {
        throw new UnauthorizedException('Role not found in user metadata');
      }

      const response = {
        ...data,
        user: {
          ...data.user,
          role,
        },
      };
      console.log('Login successful:', response);
      return response;
    } catch (error) {
      console.error('Unexpected error during login:', error);
      throw error;
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const {
      data: { session },
      error,
    } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
}
