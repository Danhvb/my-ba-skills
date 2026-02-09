import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ILLMProvider, LLMConfig } from '../types/index.js';

/**
 * Gemini LLM Provider implementation
 */
export class GeminiProvider implements ILLMProvider {
  private client: GoogleGenerativeAI;
  private defaultConfig: LLMConfig;

  constructor(config: LLMConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.defaultConfig = config;
  }

  async generateCompletion(prompt: string, config?: Partial<LLMConfig>): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const model = this.client.getGenerativeModel({ 
      model: finalConfig.model 
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
      },
    });

    const response = result.response;
    return response.text();
  }
}
