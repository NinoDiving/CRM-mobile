import { Inject, Injectable } from '@nestjs/common';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';

import { Customer } from 'src/types/customer/customer';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createCustomer(customerDto: CustomerDto) {
    const { data, error }: PostgrestResponse<Customer> = await this.supabase
      .from('customers')
      .insert([customerDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCustomers() {
    const { data, error }: PostgrestResponse<Customer> =
      await this.supabase.from('customers').select(`
        *,
        employee_affected:employees (
          firstname,
          lastname
        )
      `);

    if (error) throw error;
    return data;
  }

  async getCustomerById(id: string) {
    const { data, error }: PostgrestResponse<Customer> = await this.supabase
      .from('customers')
      .select(
        `
        *,
        employee_affected:employees (
          firstname,
          lastname
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
  async findByName(name: string) {
    const { data, error }: PostgrestResponse<Customer> = await this.supabase
      .from('customers')
      .select('*')
      .or(`fullname.ilike.%${name}%`);

    if (error) throw error;
    return data;
  }
  async findByEmployee(employeeId: string) {
    const { data, error }: PostgrestResponse<Customer> = await this.supabase
      .from('customers')
      .select('*')
      .eq('employee_affected', employeeId);

    if (error) throw error;
    return data;
  }
}
