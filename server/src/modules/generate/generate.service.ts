import { Injectable } from '@nestjs/common';
import { LlmService } from '../../services/llm/llm.service';
import { StoryboardConfig } from '../../common/interfaces/storyboard.interface';

@Injectable()
export class GenerateService {
  constructor(private readonly llmService: LlmService) {}

  async *generate(config: StoryboardConfig) {
    if (!config.brief || !config.brief.trim()) {
      yield { error: '请输入创意简报' };
      return;
    }

    yield* this.llmService.generateStoryboard(config);
  }
}
