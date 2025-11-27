/**
 * OpenRouter API Service
 *
 * Handles communication with OpenRouter API for generating WAS bundles
 */

import axios from 'axios';
import type { WASBundle, ImageData, ModelCapabilities } from '../types/was.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Models that support structured JSON output
const STRUCTURED_OUTPUT_MODELS = [
  'openai/gpt-4',
  'openai/gpt-4-turbo',
  'openai/gpt-4o',
  'openai/gpt-3.5-turbo',
  'google/gemini-pro',
  'google/gemini-1.5-pro',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3-opus',
  'anthropic/claude-3-sonnet',
  'anthropic/claude-3-haiku',
];

export interface GenerateOptions {
  systemPrompt: string;
  userInput: string;
  model?: string;
  image?: ImageData;
}

export interface LLMResponse {
  bundle: WASBundle;
  reasoning: string | null;
  feedback: string | null;
  modelCapabilities: ModelCapabilities;
}

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Detect if a model supports structured JSON output
   */
  private getModelCapabilities(model: string): ModelCapabilities {
    const supportsStructuredOutput = STRUCTURED_OUTPUT_MODELS.some(m => model.includes(m.split('/')[1]));
    return { supportsStructuredOutput };
  }

  /**
   * Extract JSON from LLM response, handling various formats
   * Expects two-tier structure: {bundle, reasoning, feedback_optional}
   */
  private extractJSON(content: string): { bundle: WASBundle; reasoning: string | null; feedback: string | null } {
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
      const parsed = JSON.parse(jsonStr);

      // Extract two-tier structure
      return {
        bundle: parsed.bundle || parsed, // Fall back to parsed if no bundle field (backwards compat)
        reasoning: parsed.reasoning || null,
        feedback: parsed.feedback_optional || null
      };
    } catch (error) {
      console.error('Failed to parse JSON:', jsonStr);
      throw new Error(`Invalid JSON in response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a WAS bundle from user input
   */
  async generateWASBundle(options: GenerateOptions): Promise<LLMResponse> {
    const { systemPrompt, userInput, model = 'anthropic/claude-3.5-sonnet', image } = options;

    // Get model capabilities
    const modelCapabilities = this.getModelCapabilities(model);

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

    // Build request body
    const requestBody: any = {
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
    };

    // Add structured output mode if supported
    if (modelCapabilities.supportsStructuredOutput) {
      requestBody.response_format = { type: 'json_object' };
    }

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        requestBody,
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
      const { bundle, reasoning, feedback } = this.extractJSON(content);

      return {
        bundle,
        reasoning,
        feedback,
        modelCapabilities
      };
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
