import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { HistoryCreateRequest, HistoryItem } from '../../common/interfaces/storyboard.interface';

@Injectable()
export class HistoryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getList(): Promise<HistoryItem[]> {
    return this.supabaseService.getHistoryList();
  }

  async create(body: HistoryCreateRequest): Promise<HistoryItem> {
    return this.supabaseService.createHistory(body);
  }

  async delete(id?: string): Promise<{ success: boolean; message?: string }> {
    return this.supabaseService.deleteHistory(id);
  }
}
