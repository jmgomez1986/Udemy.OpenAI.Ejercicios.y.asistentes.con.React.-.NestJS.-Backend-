import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_rFD5TUUaTwvDMm53k4dtAZED' } = options;
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: // Esto sobrescribe el asistente
  });

  return run;
};
