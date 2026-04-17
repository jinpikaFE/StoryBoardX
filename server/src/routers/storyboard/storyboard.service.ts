import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto } from './dto/create-history.dto';
import { StoryboardHistory } from './entities/storyboard-history.entity';

@Injectable()
export class StoryboardService {
  constructor(
    @InjectRepository(StoryboardHistory)
    private readonly storyboardHistoryRepository: Repository<StoryboardHistory>,
  ) {}

  async getHistoryList(): Promise<StoryboardHistory[]> {
    return this.storyboardHistoryRepository.find({
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async createHistory(body: CreateHistoryDto): Promise<StoryboardHistory> {
    const history = this.storyboardHistoryRepository.create({
      brief: body.brief,
      duration: body.duration,
      aspect_ratio: body.aspectRatio,
      visual_style: body.visualStyle,
      narrative_pace: body.narrativePace,
      include_dialogue: body.includeDialogue ? 1 : 0,
      dialogue_language: body.dialogueLanguage || 'auto',
      narration_style: body.narrationStyle || 'none',
      music_style: body.musicStyle || 'auto',
      model: body.model || 'doubao-seed-1-8-251228',
      prompt_mode: body.promptMode || 'scene',
      result: body.result ?? null,
      start_frame: body.startFrame ?? null,
      end_frame: body.endFrame ?? null,
      start_frame_desc: body.startFrameDesc ?? null,
      end_frame_desc: body.endFrameDesc ?? null,
    });
    return this.storyboardHistoryRepository.save(history);
  }

  async deleteHistory(id?: string): Promise<{ success: boolean; message?: string }> {
    if (id) {
      const parsedId = Number.parseInt(id, 10);
      if (!Number.isFinite(parsedId)) {
        throw new Error('Invalid history id');
      }
      await this.storyboardHistoryRepository.delete({ id: parsedId });
      return { success: true };
    }

    await this.storyboardHistoryRepository.clear();
    return { success: true, message: '已清空所有历史记录' };
  }
}

