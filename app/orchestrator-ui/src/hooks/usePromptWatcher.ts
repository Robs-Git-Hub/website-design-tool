/**
 * Prompt File Watcher Hook
 *
 * Watches for changes to the system prompt file and reloads it automatically
 */

import { useEffect, useState, useCallback } from 'react';
import { promptLoader } from '../services/promptLoader';

const POLL_INTERVAL = 3000; // Check every 3 seconds

export function usePromptWatcher() {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<number>(0);

  const loadPrompt = useCallback(async () => {
    try {
      setLoading(true);
      const loadedPrompt = await promptLoader.loadPrompt();
      setPrompt(loadedPrompt);
      setLastModified(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompt');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForUpdates = useCallback(async () => {
    try {
      // Fetch the prompt to check if it has changed
      const response = await fetch('/prompts/orchestrator_system_prompt.md');
      if (!response.ok) return;

      const newPrompt = await response.text();
      const cachedPrompt = promptLoader.getCachedPrompt();

      // If the content has changed, update
      if (newPrompt !== cachedPrompt) {
        console.log('🔄 Prompt file changed, reloading...');
        setPrompt(newPrompt);
        setLastModified(Date.now());
        promptLoader.clearCache();
      }
    } catch (err) {
      // Silently fail - we don't want to spam errors on every poll
      console.warn('Failed to check for prompt updates:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPrompt();
  }, [loadPrompt]);

  // Set up polling for changes
  useEffect(() => {
    const interval = setInterval(checkForUpdates, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkForUpdates]);

  return {
    prompt,
    loading,
    error,
    lastModified,
    reload: loadPrompt,
  };
}
