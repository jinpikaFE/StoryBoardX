import { Body, Controller, Delete, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from 'src/pipe/validation.pipe';
import { CreateHistoryDto } from './dto/create-history.dto';
import { StoryboardService } from './storyboard.service';

@ApiTags('storyboard')
@Controller('api/history')
export class HistoryController {
  constructor(private readonly storyboardService: StoryboardService) {}

  @Get()
  async getList() {
    const data = await this.storyboardService.getHistoryList();
    return { data };
  }

  @Post()
  @UsePipes(new MyValidationPipe())
  async create(@Body() body: CreateHistoryDto) {
    const data = await this.storyboardService.createHistory(body);
    return { data };
  }

  @Delete()
  async delete(@Query('id') id?: string) {
    const data = await this.storyboardService.deleteHistory(id);
    return { data };
  }
}

