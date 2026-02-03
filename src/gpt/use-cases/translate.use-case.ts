import { OpenAI } from 'openai';
import { TranslateResponse } from '../interfaces';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
    ],
    model: 'gpt-5-nano',
  });

  const content: TranslateResponse = {
    content: response.choices[0]?.message?.content ?? '',
  };

  return content;
};
