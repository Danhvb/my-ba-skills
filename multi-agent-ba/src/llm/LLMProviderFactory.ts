import type { ILLMProvider, LLMConfig } from '../types/index.js';
import { GeminiProvider } from './GeminiProvider.js';
import { ClaudeProvider } from './ClaudeProvider.js';

/**
 * Factory for creating LLM providers
 */
export class LLMProviderFactory {
  static createProvider(config: LLMConfig): ILLMProvider {
    switch (config.provider) {
      case 'gemini':
        return new GeminiProvider(config);
      case 'claude':
        return new ClaudeProvider(config);
      default:
        throw new Error(`Unknown LLM provider: ${config.provider}`);
    }
  }

  static createFromEnv(): ILLMProvider {
    const provider = (process.env.DEFAULT_LLM_PROVIDER || 'gemini') as 'gemini' | 'claude';
    
    const config: LLMConfig = {
      provider,
      apiKey: provider === 'gemini' 
        ? process.env.GEMINI_API_KEY || ''
        : process.env.ANTHROPIC_API_KEY || '',
      model: provider === 'gemini'
        ? process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'
        : process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      maxTokens: parseInt(process.env.MAX_TOKENS || '8000'),
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    };

    if (!config.apiKey) {
      throw new Error(`API key not found for provider: ${provider}`);
    }

    return this.createProvider(config);
  }
}
