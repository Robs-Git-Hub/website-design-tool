/**
 * OpenRouter API Service
 *
 * Handles communication with OpenRouter API for generating WAS bundles
 */

import axios from 'axios';
import type { WASBundle, ImageData } from '../types/was.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface GenerateOptions {
  systemPrompt: string;
  userInput: string;
  model?: string;
  image?: ImageData;
}

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Extract JSON from LLM response, handling various formats
   */
  private extractJSON(content: string): WASBundle {
    let jsonStr = content.trim();

    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to find JSON object boundaries
    const startIdx = jsonStr.indexOf('{');
    const endIdx = jsonStr.lastIndexOf('}');

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('No JSON object found in response');
    }

    jsonStr = jsonStr.substring(startIdx, endIdx + 1);

    try {
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse JSON:', jsonStr);
      throw new Error(`Invalid JSON in response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a WAS bundle from user input
   */
  async generateWASBundle(options: GenerateOptions): Promise<WASBundle> {
    const { systemPrompt, userInput, model = 'anthropic/claude-3.5-sonnet', image } = options;

    // Build message content
    const messageContent: any[] = [];

    // Add image if provided
    if (image) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: `data:${image.mediaType};base64,${image.base64}`
        }
      });
    }

    // Add text prompt
    const promptText = image
      ? `Analyze this website screenshot and generate a WAS Bundle that captures its aesthetic.\n\n${userInput || 'Describe the visual style, color scheme, typography, and overall design approach.'}`
      : userInput;

    messageContent.push({
      type: 'text',
      text: promptText
    });

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
              content: messageContent.length === 1 ? messageContent[0].text : messageContent,
            },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/yourusername/website-design-tool',
            'X-Title': 'WAS Orchestrator API',
          },
        }
      );

      const content = response.data.choices[0].message.content;

      // Extract JSON from the response (handle markdown, extra text, etc.)
      const bundle = this.extractJSON(content);

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
