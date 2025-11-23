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
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in this directory:
   ```bash
   cp .env.example .env
   ```

3. Add your OpenRouter API key to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

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
   - The app will call OpenRouter API with the system prompt
   - Generated bundle will appear below

3. **Save Bundle**: Click "Save Bundle" to download as JSON
   - Files are saved with descriptive names based on keywords and timestamp
   - Example: `was_bundle_futuristic_glass_cockpit_2025-11-23T20-30-45.json`

## Architecture

- **Frontend**: React + TypeScript + Vite
- **API**: OpenRouter (Claude 3.5 Sonnet by default)
- **System Prompt**: Loaded from `../../prompts/orchestrator_system_prompt.md`
- **File Watching**: Polling-based detection (every 3 seconds)

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

- API key is stored in browser environment variables (not sent to any server except OpenRouter)
- Bundle history is stored in browser localStorage (last 20 bundles)
- The app uses Claude 3.5 Sonnet by default (you can change this in `src/services/openrouter.ts`)
