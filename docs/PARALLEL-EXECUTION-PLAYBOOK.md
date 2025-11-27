# Parallel Human/Agent Execution Playbook

**API-First Testing Strategy for WAS Orchestrator**

## 🎯 Goal

Enable Claude Code (or any AI agent) and human developers to run, test, and improve the orchestrator-ui app **in parallel** with **test parity** — meaning if the agent's API tests pass, the human's UI interactions will work identically.

---

## 📐 Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Human User    │         │  Claude Code    │
│   (Browser UI)  │         │  (API Client)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │   Button Click            │   HTTP POST
         │   "Generate Bundle"       │   curl/axios
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Backend API         │
         │   (Express Server)    │
         │   Port 3001           │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   OpenRouter API      │
         │   (LLM Provider)      │
         └───────────────────────┘
```

**Key Principle**: Every UI action has a corresponding API endpoint.

---

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend
cd app/orchestrator-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your OpenRouter API key
echo "OPENROUTER_API_KEY=sk-or-v1-..." >> .env

# Start the backend
npm run dev
```

**Backend should be running on:** `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd app/orchestrator-ui

# Install dependencies
npm install

# Create .env file (optional - uses default backend URL)
cp .env.example .env

# Start the frontend
npm run dev
```

**Frontend should be running on:** `http://localhost:5173`

### 3. Verify Health

**Human (Browser):**
- Open `http://localhost:3001/api/v1/health` in browser

**Agent (Command Line):**
```bash
curl http://localhost:3001/api/v1/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "uptime": 12345,
  "openRouterConfigured": true
}
```

---

## 🎭 Parallel Action Map

Every UI action has an API equivalent. Here's the complete mapping:

### Action 1: Generate WAS Bundle from Text Prompt

| Who | Action | Command |
|-----|--------|---------|
| **Human** | 1. Type prompt in textarea<br>2. Select model<br>3. Click "Generate WAS Bundle" | *Interactive UI* |
| **Agent** | Send POST request with JSON payload | See below ⬇️ |

**Agent Command:**
```bash
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents",
    "model": "anthropic/claude-3.5-sonnet"
  }'
```

**Expected Response:**
```json
{
  "bundle": {
    "meta": {
      "intent_keywords": ["premium", "dark-mode", "SaaS", "AI", "glass"],
      "reasoning_notes": "..."
    },
    "layer1_axes": { ... },
    "layer2_styles": { ... }
  },
  "generationTime": 3421,
  "model": "anthropic/claude-3.5-sonnet"
}
```

---

### Action 2: Generate WAS Bundle from Image + Text

| Who | Action | Command |
|-----|--------|---------|
| **Human** | 1. Upload/paste screenshot<br>2. Optionally add text context<br>3. Click "Generate" | *Interactive UI* |
| **Agent** | Send POST with base64 image | See below ⬇️ |

**Agent Command:**
```bash
# First, encode image to base64
BASE64_IMAGE=$(base64 -i screenshot.png | tr -d '\n')

# Then send request
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d "{
    \"userInput\": \"Analyze this website and capture its aesthetic\",
    \"model\": \"anthropic/claude-3.5-sonnet\",
    \"image\": {
      \"base64\": \"$BASE64_IMAGE\",
      \"mediaType\": \"image/png\"
    }
  }"
```

---

### Action 3: Load System Prompt

| Who | Action | Command |
|-----|--------|---------|
| **Human** | Click "System Prompt" toggle to view | *Interactive UI* |
| **Agent** | GET request to prompt endpoint | See below ⬇️ |

**Agent Command:**
```bash
curl http://localhost:3001/api/v1/prompt
```

**Expected Response:**
```json
{
  "prompt": "You are a Website Aesthetic Schema (WAS) expert...",
  "lastModified": 1732742400000,
  "version": "1.0"
}
```

---

### Action 4: List Available Models

| Who | Action | Command |
|-----|--------|---------|
| **Human** | View dropdown menu options | *Interactive UI* |
| **Agent** | GET request to models endpoint | See below ⬇️ |

**Agent Command:**
```bash
curl http://localhost:3001/api/v1/models
```

**Expected Response:**
```json
{
  "models": [
    {
      "id": "anthropic/claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "recommended": true,
      "description": "Best balance of quality and speed"
    }
  ]
}
```

---

## 🔄 Test-Driven Development Loop

### For Claude Code (Agent)

1. **Write API Test**
   ```bash
   # Test generate endpoint
   curl -X POST http://localhost:3001/api/v1/generate \
     -H "Content-Type: application/json" \
     -d '{"userInput": "A minimalist blog", "model": "anthropic/claude-3.5-sonnet"}' \
     | jq '.bundle.meta.intent_keywords'
   ```

2. **Verify Response Structure**
   - Check for `bundle` object
   - Validate `meta`, `layer1_axes`, etc.
   - Ensure `generationTime` is reasonable

3. **Fix Backend Issues**
   - If test fails, identify error in backend code
   - Edit `/app/orchestrator-api/src/routes/*.ts`
   - Restart backend: `npm run dev`

4. **Re-test**
   - Run curl command again
   - Verify fix worked

### For Human (Developer)

1. **Perform UI Action**
   - Open `http://localhost:5173`
   - Type prompt
   - Click "Generate WAS Bundle"

2. **Verify UI Behavior**
   - Check for loading state
   - Verify bundle appears
   - Ensure no errors shown

3. **Compare with Agent Results**
   - If agent's API test passed but UI fails → frontend bug
   - If both fail → backend bug
   - If both pass → success! ✅

---

## 🧪 Example Testing Workflow

### Scenario: Testing the Generate Endpoint

**Step 1: Agent Tests First**
```bash
# Agent runs this
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "A brutalist blog for tech reviews",
    "model": "anthropic/claude-3.5-sonnet"
  }' | jq '.bundle.meta.reasoning_notes'
```

**Possible Outcomes:**

✅ **Success (200 OK):**
```json
{
  "bundle": { ... },
  "generationTime": 2340,
  "model": "anthropic/claude-3.5-sonnet"
}
```
→ **Agent reports:** "API test passed. Bundle generated successfully."
→ **Human action:** Open UI, test same prompt, expect identical result.

---

❌ **Failure (500 Error):**
```json
{
  "error": {
    "code": "GENERATION_ERROR",
    "message": "OpenRouter API error: Invalid API key"
  }
}
```
→ **Agent identifies:** "Backend configuration error: API key invalid"
→ **Agent fixes:** Edit `.env` file, restart backend
→ **Re-test:** Run curl again

---

❌ **Failure (400 Error):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Either userInput or image must be provided"
  }
}
```
→ **Agent identifies:** "Request validation error"
→ **Agent fixes:** Add `userInput` to request
→ **Re-test:** Run curl again

---

## 🔍 Debugging Guide

### When Agent Tests Pass but UI Fails

**Symptom:** API works via curl, but UI shows errors

**Possible Causes:**
1. **CORS issue** - Check browser console for CORS errors
   - **Fix:** Add frontend origin to backend's `ALLOWED_ORIGINS` in `.env`
2. **Frontend not pointing to backend** - Check `VITE_API_BASE_URL`
   - **Fix:** Ensure frontend `.env` has `VITE_API_BASE_URL=http://localhost:3001/api/v1`
3. **Frontend API service bug** - Check `/app/orchestrator-ui/src/services/api.ts`
   - **Fix:** Compare request format with working curl command

### When Both Agent and Human Tests Fail

**Symptom:** Both API and UI fail

**Possible Causes:**
1. **Backend not running** - Check `http://localhost:3001/api/v1/health`
2. **OpenRouter API key missing** - Check backend `.env` file
3. **System prompt not found** - Check backend logs for file path errors
4. **Backend bug** - Check backend console for errors

---

## 📊 Success Criteria

### Agent-Side Success
- ✅ `/api/v1/health` returns `status: "healthy"`
- ✅ `/api/v1/prompt` returns prompt text
- ✅ `/api/v1/models` returns model list
- ✅ `/api/v1/generate` returns valid WAS bundle (200 OK)
- ✅ Response time < 10 seconds
- ✅ Bundle contains all required fields

### Human-Side Success
- ✅ UI loads without errors
- ✅ Can type in textarea
- ✅ Can upload/paste images
- ✅ "Generate" button enables when valid input provided
- ✅ Loading state shows during generation
- ✅ Bundle displays after generation
- ✅ Can copy/save bundle

### **Test Parity Achievement**
- ✅ Agent's curl command produces same bundle structure as UI
- ✅ Timing is similar (agent: ~3s, UI: ~3s)
- ✅ Errors are consistent (same validation, same error messages)

---

## 🛠 Advanced Agent Operations

### Scripting Test Suite

**Agent can create automated tests:**

```bash
#!/bin/bash
# test-orchestrator.sh

echo "Testing WAS Orchestrator API..."

# Test 1: Health check
echo "1. Health check..."
HEALTH=$(curl -s http://localhost:3001/api/v1/health)
if echo "$HEALTH" | jq -e '.status == "healthy"' > /dev/null; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  exit 1
fi

# Test 2: Generate bundle
echo "2. Generate bundle..."
RESULT=$(curl -s -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A minimal blog", "model": "anthropic/claude-3.5-sonnet"}')

if echo "$RESULT" | jq -e '.bundle.meta' > /dev/null; then
  echo "✅ Bundle generation passed"
  echo "$RESULT" | jq '.bundle.meta.intent_keywords'
else
  echo "❌ Bundle generation failed"
  echo "$RESULT" | jq '.error'
  exit 1
fi

echo "All tests passed! 🎉"
```

**Run with:**
```bash
chmod +x test-orchestrator.sh
./test-orchestrator.sh
```

---

## 📝 Iteration Workflow

### Agent's Development Loop

```bash
# 1. Make code change
vim app/orchestrator-api/src/routes/generate.ts

# 2. Backend auto-reloads (tsx watch)
# Check terminal for restart confirmation

# 3. Test immediately
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Test prompt"}' | jq '.'

# 4. Verify fix
# If ✅ → Move to next task
# If ❌ → Repeat from step 1
```

### Human's Verification Loop

```
1. Agent reports: "Fix deployed, API tests passing"
2. Human refreshes UI at http://localhost:5173
3. Human tests same action in browser
4. Human confirms: "UI matches API behavior ✅"
```

---

## 🎯 Best Practices

### For Agents
1. **Always test the API endpoint first** before claiming a feature works
2. **Use `jq` to validate JSON structure** and extract specific fields
3. **Check HTTP status codes** (200, 400, 500) not just response body
4. **Save successful requests as test cases** for regression testing
5. **Report generation times** to catch performance regressions

### For Humans
1. **Trust the agent's API tests** - if API works, UI should work
2. **Check browser console** if UI differs from API behavior
3. **Use Network tab** to inspect actual requests being sent
4. **Compare request payloads** between agent's curl and browser's fetch
5. **Verify CORS and environment variables** if API works but UI doesn't

---

## 📚 Quick Reference

### Essential API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/health` | GET | Check if backend is alive |
| `/api/v1/prompt` | GET | Get current system prompt |
| `/api/v1/models` | GET | List available AI models |
| `/api/v1/generate` | POST | Generate WAS bundle |

### Essential Files

| File | Purpose |
|------|---------|
| `app/orchestrator-api/.env` | Backend config (API keys) |
| `app/orchestrator-ui/.env` | Frontend config (API URL) |
| `app/orchestrator-api/src/routes/generate.ts` | Main generation logic |
| `app/orchestrator-ui/src/services/api.ts` | Frontend API client |

### Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 3001 | `http://localhost:3001` |
| Frontend UI | 5173 | `http://localhost:5173` |

---

## 🏁 Success Example

**Agent (Claude Code) runs:**
```bash
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A dark sci-fi dashboard", "model": "anthropic/claude-3.5-sonnet"}' \
  | jq '.bundle.meta.intent_keywords'
```

**Output:**
```json
[
  "dark",
  "sci-fi",
  "dashboard",
  "futuristic",
  "technical"
]
```

**Human verifies in UI:**
1. Opens `http://localhost:5173`
2. Types: "A dark sci-fi dashboard"
3. Clicks "Generate WAS Bundle"
4. Sees bundle with keywords: `["dark", "sci-fi", "dashboard", "futuristic", "technical"]`

**Result:** ✅ **Test Parity Achieved!** Agent's API test matches human's UI result perfectly.

---

## 🔗 Next Steps

1. **Start both servers** (backend + frontend)
2. **Agent tests all API endpoints** using curl commands above
3. **Human verifies each action in UI** after agent confirms API works
4. **Iterate together** when bugs are found:
   - Agent: Test API, identify issue, propose fix
   - Human: Verify fix in UI, provide feedback
5. **Build confidence** that "API working = UI working"

---

## 📧 Troubleshooting

**Issue:** "Connection refused" errors

**Solution:** Ensure backend is running on port 3001
```bash
cd app/orchestrator-api && npm run dev
```

**Issue:** "CORS policy" errors in browser

**Solution:** Check `ALLOWED_ORIGINS` in backend `.env`
```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Issue:** "OpenRouter API error: Invalid API key"

**Solution:** Add valid API key to backend `.env`
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-key
```

---

**End of Playbook**

*This playbook enables true parallel development where agents and humans work in harmony, with API tests providing the contract between them.*
