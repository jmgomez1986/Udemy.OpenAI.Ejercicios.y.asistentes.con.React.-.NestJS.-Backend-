import { Injectable } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  translateUseCase,
} from './use-cases';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  ProsConsDiscusserStreamDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import { OrthographyCheckResponse, TranslateResponse } from './interfaces';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  constructor() {}

  async orthographyCheck(
    orthographyDto: OrthographyDto,
  ): Promise<OrthographyCheckResponse> {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDiscusserStream(
    prosConsDiscusserStreamDto: ProsConsDiscusserStreamDto,
  ) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserStreamDto.prompt,
    });
  }

  async translate({ prompt, lang }: TranslateDto): Promise<TranslateResponse> {
    return await translateUseCase(this.openai, {
      prompt,
      lang,
    });
  }
}
