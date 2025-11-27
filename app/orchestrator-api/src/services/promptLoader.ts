/**
 * System Prompt Loader Service
 *
 * Loads the WAS Orchestrator system prompt from file system
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the system prompt file (adjust based on your project structure)
const PROMPT_PATH = join(__dirname, '../../../..', 'prompts', 'orchestrator_system_prompt.md');

class PromptLoaderService {
  private cachedPrompt: string | null = null;
  private lastLoadTime: number = 0;

  /**
   * Load the system prompt from file
   */
  async loadPrompt(): Promise<string> {
    try {
      const content = await readFile(PROMPT_PATH, 'utf-8');
      this.cachedPrompt = content;
      this.lastLoadTime = Date.now();
      return content;
    } catch (error) {
      throw new Error(`Failed to load system prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get cached prompt or load if not cached
   */
  async getPrompt(): Promise<string> {
    if (!this.cachedPrompt) {
      await this.loadPrompt();
    }
    return this.cachedPrompt!;
  }

  /**
   * Get the last load time
   */
  getLastLoadTime(): number {
    return this.lastLoadTime;
  }

  /**
   * Clear cache (useful for hot-reloading)
   */
  clearCache(): void {
    this.cachedPrompt = null;
  }
}

export const promptLoader = new PromptLoaderService();
