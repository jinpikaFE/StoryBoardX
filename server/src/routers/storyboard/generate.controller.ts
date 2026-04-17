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

    let closed = false;
    res.on('close', () => {
      closed = true;
    });

    for await (const chunk of this.llmService.generateStoryboard(body)) {
      if (closed) break;
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    if (!closed) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
}

