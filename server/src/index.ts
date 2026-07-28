import app from './app';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const useMock = process.env.USE_MOCK_AI === 'true';
const hasApiKey = Boolean(process.env.OPENAI_API_KEY?.trim());

if (!useMock && !hasApiKey) {
  console.error(
    '[Ask Annie] Server cannot start.\n' +
      'OPENAI_API_KEY is required when USE_MOCK_AI is not "true".\n' +
      'Add USE_MOCK_AI=true to your .env file for local development.'
  );
  process.exit(1);
}

app.listen(PORT, () => {
  const mode = useMock ? 'mock AI' : `OpenAI (${process.env.OPENAI_MODEL ?? 'gpt-5.6-terra'})`;
  console.log(`[Ask Annie] Server listening on port ${PORT} — ${mode}`);
});
