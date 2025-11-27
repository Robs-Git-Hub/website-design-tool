# Quick Reference: Environment Setups

**One-page cheat sheet for development environments and deployment options.**

---

## 🖥️ Environment 1: Local CLI (Current Setup)

```
┌─────────────────────────────────────────────────────────┐
│  Your Computer                                          │
│  ┌────────────────┐         ┌────────────────┐         │
│  │   Frontend     │   →     │    Backend     │   →  🌐 │
│  │   :5173        │ HTTP    │    :3001       │  OpenRouter
│  └────────────────┘         └────────────────┘         │
│        ↑                            ↑                   │
│   Browser Test              Claude Code Tests           │
│   (Human)                   (curl commands)             │
└─────────────────────────────────────────────────────────┘

Status: ✅ WORKING
Restriction: None
API Key: .env file (backend)
Test Parity: Perfect ✅
```

---

## 🌐 Environment 2: Browser Claude (Needs Adaptation)

```
┌─────────────────────────────────────────────────────────┐
│  Claude Code Browser                                     │
│  ┌────────────────┐         ┌────────────────┐         │
│  │  Claude Tests  │   →     │   ❌ Blocked   │         │
│  │  curl commands │ HTTP    │  openrouter.ai │         │
│  └────────────────┘         │  Not on list   │         │
│                             └────────────────┘         │
└─────────────────────────────────────────────────────────┘

Problem: ❌ openrouter.ai NOT on network allowlist

SOLUTION: Deploy backend to cloud
┌─────────────────────────────────────────────────────────┐
│  Claude Code Browser                                     │
│  ┌────────────────┐         ┌────────────────┐         │
│  │  Claude Tests  │   →     │  Vercel/Render │   →  🌐 │
│  │  curl commands │ HTTPS   │    Backend     │  OpenRouter
│  └────────────────┘         └────────────────┘         │
│                                    ↓                    │
│                             GET /api/v1/logs            │
│                             (debugging info)            │
└─────────────────────────────────────────────────────────┘

Status: 🔄 NEEDS WORK
Restriction: Network allowlist
API Key: Cloud env vars
Test Parity: Via deployed API
```

---

## 🚀 Environment 3: Production Deployment

```
┌─────────────────────────────────────────────────────────┐
│  Internet                                                │
│  ┌────────────────┐         ┌────────────────┐         │
│  │   Real Users   │   →     │   Vercel App   │   →  🌐 │
│  │   (Browsers)   │ HTTPS   │  Frontend +    │  OpenRouter
│  └────────────────┘         │  API Functions │         │
│                             └────────────────┘         │
│                                    ↑                    │
│                          Custom Domain (optional)       │
└─────────────────────────────────────────────────────────┘

Status: 🎯 READY
Restriction: None (deployed)
API Key: Platform env vars
Test Parity: Full e2e tests
```

---

## 📊 Deployment Options Comparison

### Option A: Render + Vercel (Easiest)

```
Frontend (Vercel)  →  Backend (Render)  →  OpenRouter
   Static Site         Native Node.js        External API

Changes:  None ✅
Deploy:   Two platforms
Free Tier: Yes (with cold starts)
Best For: Learning, quick setup
```

### Option B: All Vercel (Best for Production)

```
Frontend (Vercel)  →  API Routes (Vercel)  →  OpenRouter
   Static Site        Serverless Functions    External API

Changes:  Convert Express → Functions
Deploy:   Single platform
Free Tier: Yes (no cold starts)
Best For: Production, scale
```

### Option C: Via Lovable (Prototyping)

```
Develop in Lovable  →  Export  →  Deploy to Vercel
   AI-assisted                    Manual conversion

Changes:  Backend → Functions (manual)
Deploy:   Export + external platform
Free Tier: Depends on export target
Best For: Rapid prototyping
```

---

## 🔑 API Key Security

### ✅ SECURE (Current Setup)

```
Backend .env file:
OPENROUTER_API_KEY=sk-or-v1-xxx

Cloud env vars:
OPENROUTER_API_KEY=sk-or-v1-xxx

→ Never sent to browser
→ Never in frontend code
→ Safe from inspection
```

### ❌ INSECURE (Never Do This)

```
Frontend .env file:
VITE_OPENROUTER_API_KEY=sk-or-v1-xxx

→ Bundled into JavaScript
→ Visible in DevTools
→ Anyone can steal key
→ NOT SAFE
```

---

## 🎯 The Goal: Virtuous Development Loop

```
┌──────────────────────────────────────────┐
│  1. Claude Code: Test via API            │
│     curl POST /api/v1/generate           │
│                 ↓                        │
│  2. Detect issue, analyze logs           │
│     curl GET /api/v1/logs                │
│                 ↓                        │
│  3. Fix code, redeploy                   │
│     git push → auto-deploy               │
│                 ↓                        │
│  4. Test again via API                   │
│     curl POST /api/v1/generate           │
│                 ↓                        │
│  5. ✅ Passes → Human verifies UI         │
│                 ↓                        │
│  6. ✅ UI matches → Commit & Continue     │
│                 ↓                        │
│         (Repeat cycle)                   │
└──────────────────────────────────────────┘

Local CLI:     Cycle time ~30 seconds
Cloud Deploy:  Cycle time ~2 minutes
```

---

## 🛠️ Commands Cheat Sheet

### Local Development

```bash
# Start backend
cd app/orchestrator-api
npm run dev          # → http://localhost:3001

# Start frontend
cd app/orchestrator-ui
npm run dev          # → http://localhost:5173

# Test backend (Claude Code)
curl http://localhost:3001/api/v1/health
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d @test-request.json

# Test frontend (Human)
# Open browser: http://localhost:5173
```

### Cloud Deployment

```bash
# Deploy to Vercel
npm install -g vercel
vercel                # Follow prompts

# Deploy to Render
# → Use Render dashboard, connect GitHub repo

# Environment variables (both platforms)
OPENROUTER_API_KEY=sk-or-v1-your-key
PORT=3001
NODE_ENV=production
```

---

## 📝 Required Changes for Browser Claude

Add these endpoints for debugging:

```typescript
// GET /api/v1/logs
// Returns recent activity logs

// GET /api/v1/metrics
// Returns performance metrics

// GET /api/v1/health/debug
// Returns detailed system status

// All respond with JSON
// All accessible without auth (dev only)
```

---

## 🎓 Decision Tree

```
Q: Where are you developing?
├─ Local computer with VS Code
│  └─ ✅ Current setup works (no changes)
│
├─ Browser (Claude Code web)
│  └─ 🔄 Deploy to Render/Vercel
│     └─ Add logging endpoints
│
└─ Ready for production?
   ├─ Quick MVP
   │  └─ Use Render + Vercel (no changes)
   │
   └─ Real production
      └─ Convert to Vercel Functions
         └─ Single platform, best perf
```

---

## 📚 Related Documents

- `ARCHITECTURE-AND-DEPLOYMENT-OPTIONS.md` - Full details
- `PARALLEL-EXECUTION-PLAYBOOK.md` - Testing workflow
- `API-FIRST-SETUP-GUIDE.md` - Initial setup guide
- `api-design.md` - API specification

---

**Quick Status Check:**

- ✅ Local CLI: Working perfectly
- 🔄 Browser Claude: Needs cloud deployment + logging
- 🎯 Production: Ready (choose platform)
