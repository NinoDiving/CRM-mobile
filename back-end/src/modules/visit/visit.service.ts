import { Inject, Injectable } from '@nestjs/common';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { CreateVisitDto, VisitDto } from './dto/visit.dto';

@Injectable()
export class VisitService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createVisit(createVisitDto: CreateVisitDto) {
    try {
      console.log('Creating visit with data:', createVisitDto);

      const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
        .from('visits')
        .insert([
          {
            customer_id: createVisitDto.customer_id,
            employee_id: createVisitDto.employee_id,
            status: createVisitDto.status,
            visit_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      console.log('Visit created successfully:', data);
      return data;
    } catch (error) {
      console.error('Service error:', error);
      throw new Error(`Erreur lors de la création de la visite}`);
    }
  }

  async getAllVisits() {
    const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
      .from('visits')
      .select('*');

    if (error) throw error;
    return data;
  }

  async getVisitById(id: string) {
    const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
      .from('visits')
      .select(
        `
        *,
        customer:customers (
          id,
          fullname,
          email,
          phone,
          address,
          city,
          zipcode
        ),
        employee:employees (
          id,
          firstname,
          lastname,
          email
        ),
        documents:documents (
          id,
          type,
          uri,
          name
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getVisitsByEmployee(employeeId: string) {
    const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
      .from('visits')
      .select(
        `
        *,
        customer:customers (
          id,
          firstname,
          lastname,
          email,
          phone,
          address
        ),
        documents:documents (
          id,
          type,
          uri,
          name
        )
      `,
      )
      .eq('employee_id', employeeId);

    if (error) throw error;
    return data;
  }

  async getVisitByCustomerId(customerId: string) {
    const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
      .from('visits')
      .select()
      .eq('customer_id', customerId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateVisitStatus(id: string, status: string) {
    const { data, error }: PostgrestResponse<VisitDto> = await this.supabase
      .from('visits')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
