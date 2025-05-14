import { Inject, Injectable } from '@nestjs/common';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import * as argon2 from 'argon2';
import { Employee } from 'src/types/employee/employee';
import { CreateEmployeeDto } from './dto/createEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findAll() {
    const { data, error } = await this.supabase.from('employees').select('*');

    if (error) throw error;
    return data as Employee[];
  }

  async findByName(name: string) {
    const { data, error }: PostgrestResponse<Employee> = await this.supabase
      .from('employees')
      .select('*')
      .or(`firstname.ilike.%${name}%,lastname.ilike.%${name}%`);

    if (error) throw error;
    return data;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const hashedPassword = await argon2.hash(createEmployeeDto.password, {
      type: argon2.argon2id,
      timeCost: 10,
    });

    const { data, error }: PostgrestResponse<Employee> = await this.supabase
      .from('employees')
      .insert([{ ...createEmployeeDto, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByEmail(email: string) {
    const { data, error }: PostgrestResponse<Employee> = await this.supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }
}
