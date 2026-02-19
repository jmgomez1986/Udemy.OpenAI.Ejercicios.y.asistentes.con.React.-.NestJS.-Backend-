import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  ProsConsDiscusserStreamDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import { OrthographyCheckResponse, TranslateResponse } from './interfaces';
import { ImageGenerationDto } from './dtos/image-generation.dto';

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

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt,
      voice,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );
    const wasFound = fs.existsSync(filePath);
    if (!wasFound) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }
    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;

    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  getImageGeneration(fileName: string) {
    const filePath = path.resolve('./', './generated/images', fileName);

    const wasFound = fs.existsSync(filePath);
    if (!wasFound) {
      throw new NotFoundException(`File with ID ${fileName} not found`);
    }
    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, { baseImage });
  }
}
