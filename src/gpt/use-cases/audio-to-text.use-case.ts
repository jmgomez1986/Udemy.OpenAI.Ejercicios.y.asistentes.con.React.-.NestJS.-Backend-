import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  audioFile: Express.Multer.File;
  prompt?: string;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt, // Mismo idioma que el audio
    language: 'es',
    response_format: 'verbose_json',
  });

  return response;
};
