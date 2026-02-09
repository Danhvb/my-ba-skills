import Anthropic from '@anthropic-ai/sdk';
import type { ILLMProvider, LLMConfig } from '../types/index.js';

/**
 * Claude LLM Provider implementation
 */
export class ClaudeProvider implements ILLMProvider {
  private client: Anthropic;
  private defaultConfig: LLMConfig;

  constructor(config: LLMConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.defaultConfig = config;
  }

  async generateCompletion(prompt: string, config?: Partial<LLMConfig>): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };

    const message = await this.client.messages.create({
      model: finalConfig.model,
      max_tokens: finalConfig.maxTokens || 8000,
      temperature: finalConfig.temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response type from Claude');
  }
}
