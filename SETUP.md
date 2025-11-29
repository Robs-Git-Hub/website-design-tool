# Setup Instructions

## Quick Start

### Prerequisites
1. Node.js 18+ installed
2. OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Backend API Setup

1. **Navigate to the backend directory:**
   ```bash
   cd app/orchestrator-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your OpenRouter API key to `.env`:**
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   PORT=3001
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
   ```

5. **Start the backend:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 WAS Orchestrator API v0.1.0 running on http://localhost:3001
   🔑 OpenRouter API Key: ✓ Configured
   ```

### Frontend UI Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd app/orchestrator-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v7.x.x  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open the app in your browser:**
   - Navigate to http://localhost:5173/
   - Check the browser console for diagnostic messages

## Verifying Setup

### Check Backend Health
```bash
curl http://localhost:3001/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123,
  "openRouterConfigured": true
}
```

### Check Frontend Connection
1. Open http://localhost:5173/ in your browser
2. Open DevTools Console (F12)
3. Look for these messages:
   - `[App] WAS Orchestrator UI started`
   - `[API] Initialized with base URL: http://localhost:3001/api/v1`

## Troubleshooting

### CORS Errors
**Error:** `Access to XMLHttpRequest ... has been blocked by CORS policy`

**Solution:**
- Ensure frontend is running on port **5173** (not 5174 or other)
- If port 5173 is in use, kill the process using it:
  ```bash
  # Find process
  lsof -i :5173
  # Kill it
  kill -9 <PID>
  ```
- Restart the frontend dev server

### share-modal.js Error
**Error:** `Cannot read properties of null (reading 'addEventListener')`

**Explanation:** This is a browser extension injecting scripts. It won't affect your app functionality - you can safely ignore it.

### OpenRouter API Key Not Configured
**Error:** `OPENROUTER_API_KEY not configured`

**Solution:**
1. Verify `.env` file exists in `app/orchestrator-api/`
2. Check that the key starts with `sk-or-v1-`
3. Restart the backend server after changing `.env`

### Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
- The Vite config now uses `strictPort: true` - it will fail instead of auto-incrementing
- Kill the process using the port or choose a different port in `vite.config.ts`

## Console Logging

The app now includes extensive console logging to help debug issues:

### Frontend Logs
- `[App]` - Application lifecycle events
- `[API]` - API requests, responses, and errors

### Backend Logs
- Request/response logging with timing
- Access logs at `/api/v1/logs`

### Viewing Logs

**Browser Console:**
```javascript
// Filter by category
console.log('[API]') // See all API logs
```

**Backend Logs:**
```bash
# Real-time logs
curl http://localhost:3001/api/v1/logs | jq

# Filter by level
curl "http://localhost:3001/api/v1/logs?level=ERROR" | jq

# Only errors
curl http://localhost:3001/api/v1/logs/errors | jq
```

## Testing Example 1

1. Start both backend and frontend
2. Open http://localhost:5173/
3. Click "Example 1" button
4. Click "Generate WAS Bundle"
5. Watch the console logs to see the request/response cycle

Expected console output:
```
[API] POST /generate - Request: { url: "...", model: "...", inputLength: 123 }
[API] POST /generate - Success: { duration: "20000ms", model: "..." }
```

## Next Steps

- Read `CLAUDE.md` for Claude Code-specific instructions
- Read `docs/project-management/HANDOVER.md` for project context
- Try the example prompts in the UI
