import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { GenerateService } from './generate.service';
import { StoryboardConfig } from '../../common/interfaces/storyboard.interface';

@Controller('api/generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async generate(@Body() config: StoryboardConfig, @Res() res: Response) {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const chunk of this.generateService.generate(config)) {
        if (chunk.content) {
          res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
        } else if (chunk.error) {
          res.write(`data: ${JSON.stringify({ error: chunk.error })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('Generate API error:', error);
      res.write(`data: ${JSON.stringify({ error: '生成失败' })}\n\n`);
      res.end();
    }
  }
}
