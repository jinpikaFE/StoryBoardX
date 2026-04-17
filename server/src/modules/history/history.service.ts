import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HistoryCreateRequest, HistoryItem } from '../../common/interfaces/storyboard.interface';

@Injectable()
export class HistoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getList(): Promise<HistoryItem[]> {
    return this.databaseService.getHistoryList();
  }

  async create(body: HistoryCreateRequest): Promise<HistoryItem> {
    return this.databaseService.createHistory(body);
  }

  async delete(id?: string): Promise<{ success: boolean; message?: string }> {
    return this.databaseService.deleteHistory(id);
  }
}
