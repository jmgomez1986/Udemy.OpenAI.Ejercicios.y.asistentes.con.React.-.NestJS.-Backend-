import { OpenAI } from 'openai';
import { ProsConsDiscusserResponse } from '../interfaces';

interface Options {
  prompt: string;
  maxTokens?: number;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
): Promise<ProsConsDiscusserResponse> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  return response.choices[0].message as ProsConsDiscusserResponse;
};
