# WAS Orchestrator UI

A local web application for generating Website Aesthetic Schema (WAS) bundles using the WAS Orchestrator system prompt.

## Features

- 🎨 Generate WAS bundles from natural language descriptions
- 🔄 Auto-reload system prompt when regenerated
- 💾 Save/download WAS bundles as JSON files
- 📝 Built-in history tracking (localStorage)
- 🎯 Clean, responsive UI

## Setup

### Prerequisites

- Node.js (v16 or later)
- npm
- Running backend API server (see `../orchestrator-api/README.md`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure the backend API is running:
   - The backend must be running on `http://localhost:3001` for the UI to function
   - See `../orchestrator-api/README.md` for backend setup instructions

## Running the Application

### Development Mode

```bash
npm run dev
```

This will:
- Start the Vite dev server (usually at http://localhost:5173)
- Watch for changes to the system prompt file
- Auto-reload when the prompt is regenerated

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Enter Design Intent**: Describe your website aesthetic in the text area
   - Example: "A futuristic glass cockpit dashboard for AI analytics"
   - Be descriptive about mood, style, colors, and purpose

2. **Generate Bundle**: Click "Generate WAS Bundle"
   - The UI sends your input to the backend API
   - The backend calls OpenRouter with the system prompt and handles validation/retries
   - Generated bundle will appear below

3. **Save Bundle**: Click "Save Bundle" to download as JSON
   - Files are saved with descriptive names based on keywords and timestamp
   - Example: `was_bundle_futuristic_glass_cockpit_2025-11-23T20-30-45.json`

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend API**: Express server (`../orchestrator-api`) on `http://localhost:3001`
- **LLM Provider**: OpenRouter (Claude 3.5 Sonnet by default)
- **Request Flow**: UI → Backend API → OpenRouter → Backend (validation/retry) → UI
- **System Prompt**: Loaded by backend from `../../prompts/orchestrator_system_prompt.md`
- **File Watching**: Polling-based detection (every 3 seconds) for prompt changes

## Project Structure

```
src/
├── hooks/
│   └── usePromptWatcher.ts     # File watcher hook
├── services/
│   ├── openrouter.ts           # OpenRouter API client
│   └── promptLoader.ts         # Prompt file loader
├── types/
│   └── was.ts                  # WAS Bundle types
├── utils/
│   └── bundleSaver.ts          # Save/download utilities
├── App.tsx                      # Main application
├── App.css                      # Application styles
└── index.css                    # Base styles
```

## Regenerating the System Prompt

If you modify the WAS data files or template, regenerate the system prompt:

```bash
# From repo root
cd tooling
npm run generate:prompt
```

The UI will automatically detect the change and reload the prompt within 3 seconds.

## Notes

- OpenRouter API key is securely stored in the backend server (never exposed to browser)
- Bundle history is stored in browser localStorage (last 20 bundles)
- The backend uses Claude 3.5 Sonnet by default (configurable in backend settings)
