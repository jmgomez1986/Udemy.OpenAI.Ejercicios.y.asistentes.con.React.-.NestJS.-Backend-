import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(runId, {
    thread_id: threadId,
  });

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  // Esperar antes de volver a consultar el estado del run
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperar 1 segundo

  return await checkCompleteStatusUseCase(openai, options);
};
