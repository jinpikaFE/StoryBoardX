import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HistoryCreateRequest, HistoryItem } from '../../common/interfaces/storyboard.interface';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.COZE_SUPABASE_URL;
    const key = process.env.COZE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase credentials not configured');
    }

    this.client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async getHistoryList(): Promise<HistoryItem[]> {
    const { data, error } = await this.client
      .from('storyboard_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createHistory(body: HistoryCreateRequest): Promise<HistoryItem> {
    const { data, error } = await this.client
      .from('storyboard_history')
      .insert({
        brief: body.brief,
        duration: body.duration,
        aspect_ratio: body.aspectRatio,
        visual_style: body.visualStyle,
        narrative_pace: body.narrativePace,
        include_dialogue: body.includeDialogue ? 1 : 0,
        dialogue_language: body.dialogueLanguage || 'auto',
        narration_style: body.narrationStyle || 'none',
        music_style: body.musicStyle || 'auto',
        model: body.model,
        prompt_mode: body.promptMode || 'scene',
        result: body.result || null,
        start_frame: body.startFrame || null,
        end_frame: body.endFrame || null,
        start_frame_desc: body.startFrameDesc || null,
        end_frame_desc: body.endFrameDesc || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteHistory(id?: string): Promise<{ success: boolean; message?: string }> {
    if (id) {
      const { error } = await this.client
        .from('storyboard_history')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } else {
      const { error } = await this.client
        .from('storyboard_history')
        .delete()
        .neq('id', 0);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: '已清空所有历史记录' };
    }
  }
}
