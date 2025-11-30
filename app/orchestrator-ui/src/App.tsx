import { useState, useEffect } from 'react';
import { usePromptWatcher } from './hooks/usePromptWatcher';
import { apiService } from './services/api';
import type { ImageData } from './services/openrouter';
import { downloadBundle, saveBundleToHistory } from './utils/bundleSaver';
import type { WASBundle, ValidationResult } from './types/was';
import './App.css';

const EXAMPLE_PROMPTS = [
  "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron.",
  "A playful, colorful portfolio site for a children's book illustrator. Lots of rounded shapes and pastel colors.",
  "An ultra-minimal, clinical e-commerce site for luxury skincare. White backgrounds, lots of space, subtle serif fonts.",
  "A brutalist blog for tech reviews. Sharp corners, high contrast, monospace fonts, no decorations.",
  "A warm, earthy wellness app with organic shapes and muted colors. Feels like a cozy journal."
];

const AVAILABLE_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Recommended)' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (Highest Quality)' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Fastest)' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
];

function App() {
  const { prompt, loading: promptLoading, error: promptError, lastModified } = usePromptWatcher();
  const [userInput, setUserInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [uploadedImage, setUploadedImage] = useState<(ImageData & { preview: string }) | null>(null);
  const [generatedBundle, setGeneratedBundle] = useState<WASBundle | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Startup diagnostics
  useEffect(() => {
    console.log('[App] WAS Orchestrator UI started');
    console.log('[App] Environment:', {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    });
  }, []);

  // API key is now handled by the backend

  // Process an image file (used by file input, drag-drop, and paste)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setUploadedImage({
        base64,
        mediaType: file.type,
        preview: result
      });
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  // Add paste event listener
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const clearImage = () => {
    setUploadedImage(null);
  };

  const loadExample = (example: string) => {
    setUserInput(example);
  };

  const handleGenerate = async () => {
    if (!userInput.trim() && !uploadedImage) {
      setError('Please enter a design description or upload a screenshot');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await apiService.generateBundle({
        userInput: userInput.trim(),
        model: selectedModel,
        image: uploadedImage ? { base64: uploadedImage.base64, mediaType: uploadedImage.mediaType } : undefined,
      });

      setGeneratedBundle(response.bundle);
      setValidationResult(response.validation);
      saveBundleToHistory(response.bundle);
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

  const copyToClipboard = () => {
    if (generatedBundle) {
      navigator.clipboard.writeText(JSON.stringify(generatedBundle, null, 2));
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <span className="sparkle">✨</span>
            WAS Orchestrator
          </h1>
          <p className="subtitle">
            Translate design ideas or website screenshots into Website Aesthetic Schema (WAS) Bundles
          </p>
        </div>
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
        {/* System Prompt Toggle */}
        <section className="prompt-section">
          <button
            className="prompt-toggle"
            onClick={() => setShowPrompt(!showPrompt)}
          >
            <span>System Prompt</span>
            <span className="toggle-icon">{showPrompt ? '▲' : '▼'}</span>
          </button>
          {showPrompt && (
            <div className="prompt-display">
              <pre>{prompt || 'Loading...'}</pre>
            </div>
          )}
        </section>

        {/* Example Prompts */}
        <section className="examples-section">
          <h3>Try an example:</h3>
          <div className="example-buttons">
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                className="example-button"
                onClick={() => loadExample(example)}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </section>

        {/* Image Upload */}
        <section className="upload-section">
          <label className="section-label">
            Upload Website Screenshot (Optional)
          </label>
          {!uploadedImage ? (
            <div
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                <span className="upload-icon">🖼️</span>
                {isDragging ? 'Drop image here' : 'Choose Screenshot'}
              </label>
              <p className="upload-hint">
                Or drag & drop an image, or paste from clipboard (Ctrl/Cmd+V)
              </p>
            </div>
          ) : (
            <div className="uploaded-image">
              <img
                src={uploadedImage.preview}
                alt="Uploaded screenshot"
                className="preview-image"
              />
              <div className="upload-actions">
                <p className="upload-success">Screenshot uploaded ✓</p>
                <button className="remove-button" onClick={clearImage}>
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Model Selection */}
        <section className="model-section">
          <label htmlFor="model-select" className="section-label">
            AI Model
          </label>
          <select
            id="model-select"
            className="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </section>

        {/* Input */}
        <section className="input-section">
          <label className="section-label">
            Design Idea {uploadedImage && '(Optional - adds context to image)'}
          </label>
          <textarea
            className="input-area"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              uploadedImage
                ? "Add optional context or specific aspects to focus on..."
                : "Describe your website aesthetic (e.g., 'A futuristic glass cockpit dashboard for AI analytics')"
            }
            rows={6}
            disabled={generating}
          />
          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={generating || (!userInput.trim() && !uploadedImage)}
          >
            {generating ? 'Generating...' : 'Generate WAS Bundle'}
          </button>
          {error && <div className="error-message">⚠️ {error}</div>}
        </section>

        {/* Output */}
        {generatedBundle && (
          <section className="output-section">
            <div className="output-header">
              <h2>Generated WAS Bundle</h2>
              <div className="output-actions">
                <button className="copy-button" onClick={copyToClipboard}>
                  📋 Copy JSON
                </button>
                <button className="save-button" onClick={handleSave}>
                  💾 Save Bundle
                </button>
              </div>
            </div>

            {/* Validation Results */}
            {validationResult && (
              <div className={`validation-box ${validationResult.valid ? 'validation-success' : 'validation-error'}`}>
                <h3>
                  {validationResult.valid ? '✅ Validation Passed' : '⚠️ Validation Issues'}
                </h3>
                {validationResult.valid ? (
                  <p className="validation-message">
                    All schema compliance checks passed successfully.
                  </p>
                ) : (
                  <div className="validation-errors">
                    <p className="validation-message">
                      The bundle has {validationResult.errors?.length || 0} validation error(s):
                    </p>
                    <ul className="error-list">
                      {validationResult.errors?.map((error, idx) => (
                        <li key={idx} className="error-item">
                          <span className="error-type">[{error.type}]</span>
                          {error.path && <span className="error-path">{error.path}: </span>}
                          <span className="error-message">{error.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quick Summary */}
            <div className="summary-box">
              <h3>Quick Summary</h3>
              <div className="summary-content">
                <div className="summary-item">
                  <strong>Reasoning:</strong> {generatedBundle.meta?.reasoning_notes}
                </div>
                <div className="summary-item">
                  <strong>Tone:</strong> {generatedBundle.layer1_axes?.tone}
                </div>
                <div className="summary-item">
                  <strong>Lightness:</strong> {generatedBundle.layer1_axes?.lightness}
                </div>
                <div className="summary-item">
                  <strong>Color Strategy:</strong> {generatedBundle.layer1_axes?.color_strategy}
                </div>
                {generatedBundle.layer2_styles && Object.keys(generatedBundle.layer2_styles).length > 0 && (
                  <div className="summary-item">
                    <strong>Styles:</strong>{' '}
                    {Object.entries(generatedBundle.layer2_styles)
                      .map(([k, v]) => `${k} (${v})`)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Full JSON */}
            <div className="bundle-display">
              <pre>{JSON.stringify(generatedBundle, null, 2)}</pre>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        WAS Orchestrator • Powered by OpenRouter
      </footer>
    </div>
  );
}

export default App;
