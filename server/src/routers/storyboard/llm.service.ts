import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoryboardConfigDto } from './dto/storyboard-config.dto';
import { Readable } from 'stream';

@Injectable()
export class LlmService {
  constructor(private readonly configService: ConfigService) {}

  async createGenerateStream(
    body: StoryboardConfigDto,
    abortSignal?: AbortSignal,
  ): Promise<Readable> {
    const baseUrl = this.configService.get<string>('llm.baseUrl');
    const url = `${baseUrl.replace(/\/$/, '')}/api/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: abortSignal,
    });

    if (!response.ok || !response.body) {
      throw new Error('LLM service unavailable');
    }

    return Readable.fromWeb(response.body as any);
  }
}
