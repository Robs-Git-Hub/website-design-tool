/**
 * System Prompt Loader
 *
 * Loads the WAS orchestrator system prompt from the repository
 */

const PROMPT_PATH = '/prompts/orchestrator_system_prompt.md';

export class PromptLoaderService {
  private cachedPrompt: string | null = null;

  /**
   * Load the system prompt from file
   */
  async loadPrompt(): Promise<string> {
    try {
      const response = await fetch(PROMPT_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load prompt: ${response.statusText}`);
      }
      const prompt = await response.text();
      this.cachedPrompt = prompt;
      return prompt;
    } catch (error) {
      throw new Error(
        `Could not load system prompt from ${PROMPT_PATH}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get the cached prompt (if available)
   */
  getCachedPrompt(): string | null {
    return this.cachedPrompt;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cachedPrompt = null;
  }
}

export const promptLoader = new PromptLoaderService();
