import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerateController } from './generate.controller';
import { HistoryController } from './history.controller';
import { LlmService } from './llm.service';
import { StoryboardHistory } from './entities/storyboard-history.entity';
import { StoryboardService } from './storyboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryboardHistory])],
  controllers: [GenerateController, HistoryController],
  providers: [LlmService, StoryboardService],
})
export class StoryboardModule {}

