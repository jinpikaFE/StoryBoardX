import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { LlmService } from '../../services/llm/llm.service';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, LlmService],
})
export class GenerateModule {}
