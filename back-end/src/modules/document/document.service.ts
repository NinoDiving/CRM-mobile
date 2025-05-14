import { Inject, Injectable } from '@nestjs/common';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { DocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async uploadDocument(documentDto: DocumentDto) {
    const { data, error }: PostgrestResponse<DocumentDto> = await this.supabase
      .from('documents')
      .insert([documentDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDocumentsByVisit(visitId: string) {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('visit_id', visitId);

    if (error) throw error;
    return data as DocumentDto[];
  }

  async getDocumentsByCustomer(customerId: string) {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('customer_id', customerId);

    if (error) throw error;
    return data as DocumentDto[];
  }

  async deleteDocument(id: string) {
    const { error } = await this.supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Document supprimé avec succès' };
  }
}
