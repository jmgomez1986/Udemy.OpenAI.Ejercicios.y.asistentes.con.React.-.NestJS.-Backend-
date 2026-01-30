import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  ProsConsDiscusserStreamDto,
} from './dtos';
import type { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserStreamDto: ProsConsDiscusserStreamDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(
      prosConsDiscusserStreamDto,
    );

    res.setHeader('Content-Type', 'aplication/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece);
    }

    res.end();
  }
}
