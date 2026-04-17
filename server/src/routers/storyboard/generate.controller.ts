import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { StoryboardConfigDto } from './dto/storyboard-config.dto';
import { LlmService } from './llm.service';

@ApiTags('storyboard')
@Controller('api/generate')
export class GenerateController {
  constructor(private readonly llmService: LlmService) {}

  @Post()
  async generate(@Body() body: StoryboardConfigDto, @Res() res: Response) {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const abortController = new AbortController();
    res.on('close', () => {
      abortController.abort();
    });

    try {
      const upstreamStream = await this.llmService.createGenerateStream(body, abortController.signal);
      upstreamStream.on('error', (err) => {
        if (abortController.signal.aborted) return;
        if (res.writableEnded) return;
        const message = err instanceof Error ? err.message : '生成失败';
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      });
      upstreamStream.pipe(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成失败';
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
}
