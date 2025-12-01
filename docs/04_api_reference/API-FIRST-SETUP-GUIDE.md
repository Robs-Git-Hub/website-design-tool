# API-First Architecture Setup Guide

**Complete setup instructions for the refactored WAS Orchestrator with API-first design.**

---

## 🎯 What Changed?

### Before (Frontend-Only)
```
Browser → OpenRouter API
        (API key in browser)
```

### After (API-First)
```
Browser → Backend API → OpenRouter API
        (API key on server)
```

**Benefits:**
1. ✅ **Test Parity** - Claude Code can test via curl, you verify in browser
2. ✅ **Security** - API keys stay on server, not in browser
3. ✅ **Flexibility** - Easy to add rate limiting, caching, logging
4. ✅ **Scalability** - Can add mobile app, CLI, etc. using same API

---

## 🚀 Setup Instructions

### Step 1: Backend Setup

```bash
# Navigate to backend
cd app/orchestrator-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# Get one at: https://openrouter.ai/keys
echo "OPENROUTER_API_KEY=sk-or-v1-your-actual-key" >> .env

# Start backend server
npm run dev
```

**Expected output:**
```
🚀 WAS Orchestrator API running on http://localhost:3001
📝 API Documentation: http://localhost:3001/api/v1/health
🔑 OpenRouter API Key: ✓ Configured
```

### Step 2: Verify Backend Health

**Option A: Browser**
Open `http://localhost:3001/api/v1/health`

**Option B: Command Line (Claude Code)**
```bash
curl http://localhost:3001/api/v1/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "uptime": 12345,
  "openRouterConfigured": true
}
```

### Step 3: Frontend Setup

```bash
# Open a new terminal (keep backend running)
cd app/orchestrator-ui

# Install dependencies (if not already done)
npm install

# Create .env file (optional - defaults to localhost:3001)
cp .env.example .env

# Start frontend
npm run dev
```

**Expected output:**
```
VITE ready in 234 ms
➜  Local:   http://localhost:5173/
```

### Step 4: Test the Full Stack

**Human (Browser):**
1. Open `http://localhost:5173`
2. Type a design prompt: "A minimal blog"
3. Click "Generate WAS Bundle"
4. Verify bundle is generated

**Agent (Command Line):**
```bash
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A minimal blog"}' \
  | jq '.bundle.meta.intent_keywords'
```

**Expected output:**
```json
["minimal", "blog", "clean", "simple", "readable"]
```

---

## 📁 New File Structure

```
website-design-tool/
├── app/
│   ├── orchestrator-api/          # 🆕 Backend API
│   │   ├── src/
│   │   │   ├── index.ts           # Express server
│   │   │   ├── routes/            # API endpoints
│   │   │   ├── services/          # Business logic
│   │   │   ├── middleware/        # Express middleware
│   │   │   └── types/             # TypeScript types
│   │   ├── .env                   # 🔑 API key here
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── orchestrator-ui/           # ✏️ Modified frontend
│       ├── src/
│       │   ├── services/
│       │   │   ├── api.ts         # 🆕 Backend API client
│       │   │   └── openrouter.ts  # (Deprecated - kept for types)
│       │   └── App.tsx            # ✏️ Uses apiService now
│       └── .env                   # 🔗 Points to backend URL
│
├── docs/
│   ├── api-design.md              # 🆕 API specification
│   ├── PARALLEL-EXECUTION-PLAYBOOK.md  # 🆕 Human/Agent testing guide
│   └── API-FIRST-SETUP-GUIDE.md   # 🆕 This file
│
└── prompts/
    └── orchestrator_system_prompt.md
```

---

## 🔄 Migration Checklist

If you're upgrading from the old frontend-only version:

- [ ] Install backend dependencies: `cd app/orchestrator-api && npm install`
- [ ] Create backend `.env` with `OPENROUTER_API_KEY`
- [ ] Start backend: `npm run dev` (port 3001)
- [ ] Update frontend `.env` with `VITE_API_BASE_URL=http://localhost:3001/api/v1`
- [ ] Start frontend: `cd app/orchestrator-ui && npm run dev` (port 5173)
- [ ] Test health endpoint: `curl http://localhost:3001/api/v1/health`
- [ ] Test UI: Open `http://localhost:5173` and generate a bundle
- [ ] Verify Claude Code can test API: `curl -X POST http://localhost:3001/api/v1/generate ...`

---

## 🧪 Testing Workflow

### For Claude Code (AI Agent)

**1. Test API endpoints directly:**
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Generate bundle
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A dark sci-fi dashboard"}' \
  | jq '.bundle.meta.intent_keywords'
```

**2. Report results:**
- ✅ "API test passed. Bundle generated with keywords: [...]"
- ❌ "API test failed. Error: OpenRouter API key invalid"

### For Human Developer

**1. Verify Claude's API tests in browser:**
- Open `http://localhost:5173`
- Enter same prompt Claude used
- Click "Generate"
- Verify same result

**2. Confirm test parity:**
- ✅ If Claude's API test passed AND UI works → Perfect!
- ❌ If Claude passed but UI fails → Frontend bug (CORS, env, etc.)
- ❌ If both fail → Backend bug (API key, prompt loading, etc.)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Connection refused" at localhost:3001

**Cause:** Backend not running

**Solution:**
```bash
cd app/orchestrator-api
npm run dev
```

---

### Issue 2: "CORS policy" error in browser console

**Cause:** Frontend origin not allowed

**Solution:**
Edit `app/orchestrator-api/.env`:
```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### Issue 3: "OPENROUTER_API_KEY not configured"

**Cause:** Missing or invalid API key

**Solution:**
1. Get API key from https://openrouter.ai/keys
2. Add to `app/orchestrator-api/.env`:
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key
   ```
3. Restart backend

---

### Issue 4: "Failed to load system prompt"

**Cause:** Prompt file not found

**Solution:**
Verify file exists:
```bash
ls -la prompts/orchestrator_system_prompt.md
```

If missing, check the correct path in `app/orchestrator-api/src/services/promptLoader.ts`

---

### Issue 5: Frontend shows "Failed to generate bundle"

**Debugging steps:**

1. **Check backend logs:**
   Look at terminal running `npm run dev` in orchestrator-api

2. **Test API directly:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/generate \
     -H "Content-Type: application/json" \
     -d '{"userInput": "test"}' \
     | jq '.'
   ```

3. **Check browser console:**
   Open DevTools → Console → Network tab
   - Look for request to `localhost:3001/api/v1/generate`
   - Check request payload and response

4. **Verify environment:**
   ```bash
   # Backend .env should have:
   cat app/orchestrator-api/.env | grep OPENROUTER_API_KEY

   # Frontend .env should have (optional):
   cat app/orchestrator-ui/.env | grep VITE_API_BASE_URL
   ```

---

## 🎯 Quick Validation Tests

Run these to verify everything works:

```bash
# Test 1: Backend is alive
curl http://localhost:3001/api/v1/health | jq '.status'
# Expected: "healthy"

# Test 2: Prompt is loaded
curl http://localhost:3001/api/v1/prompt | jq '.prompt | length'
# Expected: Large number (e.g., 20000+)

# Test 3: Models are available
curl http://localhost:3001/api/v1/models | jq '.models | length'
# Expected: 5

# Test 4: Generate works (requires valid API key)
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A minimal blog"}' \
  | jq '.bundle.meta.intent_keywords'
# Expected: Array of keywords
```

---

## 📚 Additional Resources

- **[API Design Specification](./api-design.md)** - Complete API endpoint documentation
- **[Parallel Execution Playbook](./PARALLEL-EXECUTION-PLAYBOOK.md)** - Detailed guide for human/agent parallel testing
- **[Backend README](../app/orchestrator-api/README.md)** - Backend-specific documentation

---

## 🎉 Success Criteria

You'll know the setup is complete when:

1. ✅ Backend starts without errors on port 3001
2. ✅ Frontend starts without errors on port 5173
3. ✅ `curl http://localhost:3001/api/v1/health` returns "healthy"
4. ✅ Browser at `http://localhost:5173` loads successfully
5. ✅ Generating a bundle in UI works
6. ✅ Claude Code can generate bundles via curl
7. ✅ Results are identical between UI and API

---

## 🔄 Development Workflow

### For New Features

1. **Design API endpoint first**
   - Define request/response schemas
   - Add to `docs/04_api_reference/api_reference.md`

2. **Claude Code implements API**
   - Add route in `app/orchestrator-api/src/routes/`
   - Test with curl

3. **Claude Code updates frontend**
   - Add method to `app/orchestrator-ui/src/services/api.ts`
   - Update UI components

4. **Claude tests API, human verifies UI**
   - Claude: `curl` tests pass ✅
   - Human: Browser tests pass ✅
   - Test parity achieved! 🎉

---

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify both backend and frontend are running
3. Check console logs in both terminals
4. Refer to the Parallel Execution Playbook for detailed debugging

---

**End of Setup Guide**

*You're now ready to develop with API-first architecture and parallel human/agent testing!*
