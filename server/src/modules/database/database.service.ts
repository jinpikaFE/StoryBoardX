import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { HistoryCreateRequest, HistoryItem } from '../../common/interfaces/storyboard.interface';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('database.url');
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port');
    const user = this.configService.get<string>('database.user');
    const password = this.configService.get<string>('database.password');
    const database = this.configService.get<string>('database.database');

    if (databaseUrl) {
      this.pool = new Pool({
        connectionString: databaseUrl,
        ssl: this.configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : undefined,
      });
      return;
    }

    if (!host || !user || !database) {
      throw new Error('Postgres database config not configured');
    }

    this.pool = new Pool({
      host,
      port: port ?? 5432,
      user,
      password,
      database,
      ssl: this.configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : undefined,
    });
  }

  private async ensureSchema(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS storyboard_history (
        id SERIAL PRIMARY KEY,
        brief TEXT NOT NULL,
        duration INTEGER NOT NULL,
        aspect_ratio TEXT NOT NULL,
        visual_style TEXT NOT NULL,
        narrative_pace TEXT NOT NULL,
        include_dialogue INTEGER NOT NULL DEFAULT 0,
        dialogue_language TEXT NOT NULL DEFAULT 'auto',
        narration_style TEXT NOT NULL DEFAULT 'none',
        music_style TEXT NOT NULL DEFAULT 'auto',
        model TEXT NOT NULL,
        prompt_mode TEXT NOT NULL DEFAULT 'scene',
        result JSONB,
        start_frame TEXT,
        end_frame TEXT,
        start_frame_desc TEXT,
        end_frame_desc TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS storyboard_history_created_at_idx
      ON storyboard_history (created_at);
    `);
  }

  async getHistoryList(): Promise<HistoryItem[]> {
    await this.ensureSchema();
    const result = await this.pool.query<HistoryItem>(`
      SELECT
        id,
        brief,
        duration,
        aspect_ratio,
        visual_style,
        narrative_pace,
        include_dialogue,
        dialogue_language,
        narration_style,
        music_style,
        model,
        prompt_mode,
        result,
        start_frame,
        end_frame,
        start_frame_desc,
        end_frame_desc,
        created_at::text AS created_at
      FROM storyboard_history
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return result.rows;
  }

  async createHistory(body: HistoryCreateRequest): Promise<HistoryItem> {
    await this.ensureSchema();
    const result = await this.pool.query<HistoryItem>(
      `
        INSERT INTO storyboard_history (
          brief,
          duration,
          aspect_ratio,
          visual_style,
          narrative_pace,
          include_dialogue,
          dialogue_language,
          narration_style,
          music_style,
          model,
          prompt_mode,
          result,
          start_frame,
          end_frame,
          start_frame_desc,
          end_frame_desc
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16
        )
        RETURNING
          id,
          brief,
          duration,
          aspect_ratio,
          visual_style,
          narrative_pace,
          include_dialogue,
          dialogue_language,
          narration_style,
          music_style,
          model,
          prompt_mode,
          result,
          start_frame,
          end_frame,
          start_frame_desc,
          end_frame_desc,
          created_at::text AS created_at
      `,
      [
        body.brief,
        body.duration,
        body.aspectRatio,
        body.visualStyle,
        body.narrativePace,
        body.includeDialogue ? 1 : 0,
        body.dialogueLanguage || 'auto',
        body.narrationStyle || 'none',
        body.musicStyle || 'auto',
        body.model,
        body.promptMode || 'scene',
        body.result ?? null,
        body.startFrame ?? null,
        body.endFrame ?? null,
        body.startFrameDesc ?? null,
        body.endFrameDesc ?? null,
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Failed to create history');
    return row;
  }

  async deleteHistory(id?: string): Promise<{ success: boolean; message?: string }> {
    await this.ensureSchema();
    if (id) {
      const parsedId = Number.parseInt(id, 10);
      if (!Number.isFinite(parsedId)) {
        throw new Error('Invalid history id');
      }
      await this.pool.query(`DELETE FROM storyboard_history WHERE id = $1`, [parsedId]);
      return { success: true };
    }

    await this.pool.query(`DELETE FROM storyboard_history`);
    return { success: true, message: '已清空所有历史记录' };
  }
}
