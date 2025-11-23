/**
 * OpenRouter API Service
 *
 * Handles communication with OpenRouter API for generating WAS bundles
 */

import axios from 'axios';
import type { WASBundle } from '../types/was';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface GenerateOptions {
  systemPrompt: string;
  userInput: string;
  model?: string;
}

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate a WAS bundle from user input
   */
  async generateWASBundle(options: GenerateOptions): Promise<WASBundle> {
    const { systemPrompt, userInput, model = 'anthropic/claude-3.5-sonnet' } = options;

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userInput,
            },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'WAS Orchestrator UI',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const bundle = JSON.parse(content);

      return bundle as WASBundle;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `OpenRouter API error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw error;
    }
  }
}
