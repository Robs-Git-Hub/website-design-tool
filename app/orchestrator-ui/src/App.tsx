import { useState } from 'react';
import { usePromptWatcher } from './hooks/usePromptWatcher';
import { OpenRouterService } from './services/openrouter';
import { downloadBundle, saveBundleToHistory } from './utils/bundleSaver';
import type { WASBundle } from './types/was';
import './App.css';

function App() {
  const { prompt, loading: promptLoading, error: promptError, lastModified } = usePromptWatcher();
  const [userInput, setUserInput] = useState('');
  const [generatedBundle, setGeneratedBundle] = useState<WASBundle | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please set VITE_OPENROUTER_API_KEY in your .env file');
      return;
    }

    if (!userInput.trim()) {
      setError('Please enter a design description');
      return;
    }

    if (!prompt) {
      setError('System prompt not loaded yet');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const service = new OpenRouterService(apiKey);
      const bundle = await service.generateWASBundle({
        systemPrompt: prompt,
        userInput: userInput.trim(),
      });

      setGeneratedBundle(bundle);
      saveBundleToHistory(bundle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bundle');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedBundle) {
      downloadBundle(generatedBundle);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>WAS Orchestrator</h1>
        <div className="status-bar">
          {promptLoading && <span className="status loading">Loading prompt...</span>}
          {promptError && <span className="status error">Prompt error: {promptError}</span>}
          {!promptLoading && !promptError && (
            <span className="status success">
              Prompt loaded (last updated: {formatTimestamp(lastModified)})
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        <section className="input-section">
          <h2>Design Intent</h2>
          <textarea
            className="input-area"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your website aesthetic (e.g., 'A futuristic glass cockpit dashboard for AI analytics')"
            rows={6}
            disabled={generating || promptLoading}
          />
          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={generating || promptLoading || !prompt}
          >
            {generating ? 'Generating...' : 'Generate WAS Bundle'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </section>

        {generatedBundle && (
          <section className="output-section">
            <div className="output-header">
              <h2>Generated WAS Bundle</h2>
              <button className="save-button" onClick={handleSave}>
                Save Bundle
              </button>
            </div>
            <div className="bundle-display">
              <pre>{JSON.stringify(generatedBundle, null, 2)}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
