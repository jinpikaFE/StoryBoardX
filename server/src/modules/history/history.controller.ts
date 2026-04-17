import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryCreateRequest } from '../../common/interfaces/storyboard.interface';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async getList() {
    const data = await this.historyService.getList();
    return { data };
  }

  @Post()
  async create(@Body() body: HistoryCreateRequest) {
    const data = await this.historyService.create(body);
    return { data };
  }

  @Delete()
  async delete(@Query('id') id?: string) {
    return this.historyService.delete(id);
  }
}
