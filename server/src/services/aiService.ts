import { AnnieResponse } from '@shared/annieResponse';

/**
 * Input passed to the AI service for analysis.
 * Text, image, and context are all optional individually — the route handler
 * ensures at least one of text or image is present before calling the service.
 */
export interface AnalyseInput {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  context?: string;
}

/**
 * Generic AI service interface.
 * The mock implementation (Sprint 1) and the real OpenAI implementation (Sprint 3)
 * both satisfy this contract. All callers depend on this interface, never on a
 * concrete implementation.
 */
export interface AiService {
  analyse(input: AnalyseInput): Promise<AnnieResponse>;
}

/**
 * Factory that returns the correct AiService implementation based on environment.
 * Sprint 1–2: USE_MOCK_AI=true returns MockAiService.
 * Sprint 3:   USE_MOCK_AI=false returns the real OpenAI implementation.
 */
export async function createAiService(): Promise<AiService> {
  if (process.env.USE_MOCK_AI === 'true') {
    const { MockAiService } = await import('./mockAi');
    return new MockAiService();
  }

  // Sprint 3: real OpenAI implementation
  throw new Error(
    'Real AI service is not yet implemented. Set USE_MOCK_AI=true in your .env file.'
  );
}
