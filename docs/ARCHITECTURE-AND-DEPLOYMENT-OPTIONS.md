# Architecture & Deployment Options

**Reference guide for understanding frontend/backend architecture, deployment strategies, and environment-specific adaptations for AI-assisted development.**

---

## 🎯 Project Goal

**Create a secure development workflow enabling both human developers and AI coding assistants (e.g., Claude Code) to:**

1. **Experience parallel interactions** with the application
2. **Deploy → Run → Interact → Test → Learn → Improve → Redeploy** in a virtuous loop
3. **Iterate until the desired end state** is achieved

### Core Requirements

- ✅ **Security:** API keys never exposed to browser
- ✅ **Test Parity:** Human UI actions = AI API calls (same results)
- ✅ **Visibility:** AI can inspect logs, debug, and understand system behavior
- ✅ **Flexibility:** Adaptable across development environments

---

## 🏗️ Frontend vs Backend: The Basics

### What is a Frontend?

**Frontend = The User Interface**

```
┌─────────────────────────────┐
│     Browser (Client)        │
│  ┌───────────────────────┐  │
│  │   React Components    │  │
│  │   - Buttons           │  │
│  │   - Forms             │  │
│  │   - Displays          │  │
│  └───────────────────────┘  │
│         ↕️                   │
│   JavaScript runs here      │
└─────────────────────────────┘
```

**Characteristics:**
- Runs **in the browser** on user's device
- Written in: HTML, CSS, JavaScript/TypeScript (React)
- **Cannot securely store secrets** - everything is visible to user
- Examples: Buttons, forms, animations, UI feedback

**Our Frontend:**
- Built with: React + Vite + TypeScript
- Location: `app/orchestrator-ui/`
- Runs on: `http://localhost:5173` (development)

---

### What is a Backend?

**Backend = The Server Logic**

```
┌─────────────────────────────┐
│      Server (Backend)       │
│  ┌───────────────────────┐  │
│  │   Business Logic      │  │
│  │   - API Endpoints     │  │
│  │   - Data Processing   │  │
│  │   - Secret Keys       │  │
│  └───────────────────────┘  │
│         ↕️                   │
│   Node.js runs here         │
└─────────────────────────────┘
```

**Characteristics:**
- Runs **on a server** (your computer or cloud)
- Written in: Node.js (Express), Python, Go, etc.
- **Can securely store secrets** - not accessible to users
- Examples: API routes, database queries, authentication

**Our Backend:**
- Built with: Node.js + Express + TypeScript
- Location: `app/orchestrator-api/`
- Runs on: `http://localhost:3001` (development)

---

### How They Work Together

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │  HTTP   │   Backend    │  HTTP   │  OpenRouter  │
│   (Browser)  │ ──────> │   (Server)   │ ──────> │     API      │
│              │         │              │         │              │
│  User clicks │         │ Has API key  │         │  Returns AI  │
│  "Generate"  │ <────── │ Processes    │ <────── │  response    │
└──────────────┘         └──────────────┘         └──────────────┘
     Port 5173               Port 3001             openrouter.ai
```

**Flow:**
1. User clicks button in **browser** (frontend)
2. Frontend sends HTTP request to **backend**
3. Backend adds API key, calls **OpenRouter**
4. OpenRouter returns AI-generated bundle
5. Backend sends bundle to **frontend**
6. Frontend displays result to **user**

---

## 🌍 Three Development Environments

Our solution must adapt to three different setups:

### Environment 1: Local Development with Claude Code CLI

**Setup:**
```
┌────────────────────────────────────────┐
│      Your Computer (localhost)         │
├────────────────────────────────────────┤
│  VS Code + Claude Code CLI             │
│  ├─ Can run: npm run dev               │
│  ├─ Can execute: curl commands         │
│  ├─ Can access: .env files             │
│  └─ Can use: ANY API keys               │
│                                         │
│  Frontend: localhost:5173               │
│  Backend:  localhost:3001               │
└────────────────────────────────────────┘
```

**Characteristics:**
- ✅ Full file system access
- ✅ Can read `.env` files
- ✅ Can use OpenRouter API key directly
- ✅ No network restrictions
- ✅ Complete control

**What We Built:**
- Backend stores API key in `.env`
- Claude CLI can test via `curl http://localhost:3001/api/v1/generate`
- Human tests via browser at `http://localhost:5173`
- **Test parity achieved!** ✅

**Status:** ✅ **Working perfectly** with current architecture

---

### Environment 2: Development with Claude Code Browser

**Setup:**
```
┌────────────────────────────────────────┐
│    Browser Environment (Sandboxed)     │
├────────────────────────────────────────┤
│  Claude Code in Browser                 │
│  ├─ Can run: npm commands               │
│  ├─ Can execute: limited curl           │
│  ├─ CANNOT access: arbitrary domains   │
│  └─ Network allowlist restrictions      │
│                                         │
│  ⚠️  openrouter.ai NOT on allowlist     │
└────────────────────────────────────────┘
```

**The Core Issue:**

According to Claude Code documentation, browser environments have **network access restrictions**:

**Allowed Domains (Default):**
- ✅ github.com
- ✅ npmjs.com
- ✅ pypi.org
- ✅ docker.io
- ✅ Cloud platforms (AWS, GCP, Azure)
- ❌ **openrouter.ai NOT included**

**What This Means:**
- Backend on localhost **cannot** call OpenRouter API directly
- HTTP proxy strips `Authorization` header for non-allowlisted domains
- Errors: `401 No cookie auth credentials found`

**Adapted Solution: Deploy to Cloud During Development**

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Claude Code │  Test   │   Vercel     │  Call   │  OpenRouter  │
│   (Browser)  │ ──────> │  (Backend)   │ ──────> │     API      │
│              │         │              │         │              │
│  curl test   │         │ Has API key  │         │  Returns     │
│  commands    │ <────── │ in env vars  │ <────── │  response    │
└──────────────┘         └──────────────┘         └──────────────┘
    In browser          Deployed cloud           Allowed domain
```

**Approach:**
1. **Deploy backend to Vercel/Render** during development
2. **Store API key** in cloud platform's environment variables
3. **Expose logs via API** so Claude can debug:
   ```
   GET /api/v1/logs → Returns recent logs
   GET /api/v1/status → Returns system status
   ```
4. Claude Code calls **deployed backend** instead of localhost
5. Human still tests via deployed frontend URL

**Status:** 🔄 **Requires adaptation** - add logging endpoints, deploy to cloud

---

### Environment 3: Production Deployment

**Goal:** Deploy for real users, maintain security, enable monitoring.

**Characteristics:**
- Must handle real traffic
- Must be reliable (no "free tier sleep")
- Must be secure (HTTPS, rate limiting)
- Must be monitorable

---

## 🚀 Deployment Options Comparison

### Option A: Render (Backend) + Vercel (Frontend)

**Architecture:**
```
Frontend (Vercel) → Backend (Render Node.js) → OpenRouter
```

**Backend Deployment:**
- Type: **Native Node.js service** (no conversion needed)
- Platform: Render
- Process: Deploy Express app as-is
- Free Tier: Yes (with sleep after inactivity)

**Frontend Deployment:**
- Type: **Static site**
- Platform: Vercel
- Process: Vite build → Static files
- Free Tier: Yes (generous)

**Pros:**
- ✅ **No code changes** needed
- ✅ Backend runs exactly as written
- ✅ Easy to understand and debug
- ✅ Separate concerns (frontend/backend)

**Cons:**
- ❌ Two separate deployments
- ❌ Render free tier has cold starts (sleep)
- ❌ Must coordinate environment variables

**Best For:** Learning, development, MVPs

---

### Option B: All Vercel (Serverless Functions)

**Architecture:**
```
Frontend (Vercel) → API Routes (Vercel Functions) → OpenRouter
```

**Backend Conversion:**
- Type: **Edge/Serverless Functions** (auto-converted)
- Platform: Vercel
- Process: Express routes → `/api/*.ts` functions
- Free Tier: Yes (generous)

**What Changes:**
```
Before:                         After:
app/orchestrator-api/           api/
├── src/                        ├── generate.ts
│   ├── index.ts (server)       ├── prompt.ts
│   └── routes/                 └── models.ts
│       ├── generate.ts
│       ├── prompt.ts
│       └── models.ts
```

**Example Conversion:**
```typescript
// Before (Express route)
router.post('/generate', async (req, res) => {
  const { userInput } = req.body;
  // ... logic
  res.json({ bundle });
});

// After (Vercel function)
export default async function handler(req, res) {
  const { userInput } = req.body;
  // ... same logic
  res.json({ bundle });
}
```

**Pros:**
- ✅ Single deployment (one platform)
- ✅ No cold starts on free tier
- ✅ Automatic scaling
- ✅ Best developer experience

**Cons:**
- ❌ Requires code refactoring
- ❌ Different local dev experience
- ❌ Serverless limitations (timeouts, state)

**Best For:** Production, scalability, simplicity

---

### Option C: Lovable.dev Deployment

**Architecture:**
```
Frontend (Lovable) → Backend (Manual Functions) → OpenRouter
```

**Lovable Capabilities:**
- Can host frontend
- Can integrate with Supabase (optional)
- Can export code as ZIP
- Deploys to standard platforms

**The Challenge:**
- ❌ Does **NOT** auto-convert backend to edge functions
- ❌ Must manually refactor Express → Serverless
- ❌ Extra step compared to Vercel

**Workflow:**
1. Develop in Lovable (or export from our project)
2. Manually convert backend routes to functions
3. Deploy frontend to Lovable hosting
4. Deploy backend to Vercel Functions (separate)

**OR:**

1. Export entire project from Lovable
2. Deploy to Vercel (which does auto-conversion)
3. Skip Lovable hosting, use Vercel entirely

**Pros:**
- ✅ AI-first development experience
- ✅ Can iterate quickly in Lovable
- ✅ Export flexibility

**Cons:**
- ❌ No automatic backend conversion
- ❌ Extra manual work for deployment
- ❌ Not ideal for backend-heavy apps

**Best For:** Rapid prototyping, then export for real deployment

---

## 📊 Decision Matrix

| Criteria | Render + Vercel | All Vercel | Lovable |
|----------|-----------------|------------|---------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **No Code Changes** | ✅ Yes | ❌ Requires refactor | ❌ Requires refactor |
| **Free Tier** | ⭐⭐⭐ (sleep) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Production Ready** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Claude Code Friendly** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Logging/Debugging** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Backend = Native Node** | ✅ Yes | ❌ Serverless | ❌ Manual |

---

## 🛠️ What We Chose and Why

### For Local Development (CLI)
**Choice:** Native Express Backend + React Frontend

**Why:**
- ✅ Best learning experience
- ✅ Full control and visibility
- ✅ Easy debugging
- ✅ No deployment complexity
- ✅ Perfect for parallel testing

**Architecture:**
```
app/
├── orchestrator-api/      # Express backend on :3001
└── orchestrator-ui/       # React frontend on :5173
```

---

### For Browser-Based Claude Code (Future)
**Choice:** Deploy to Render (backend) + Vercel (frontend) during development

**Why:**
- ✅ Minimal code changes (add logging endpoints)
- ✅ Claude Code can call deployed API
- ✅ Avoids network allowlist issues
- ✅ Logs accessible via API for debugging

**Additional Requirements:**
```typescript
// Add to backend
GET /api/v1/logs          // Recent logs
GET /api/v1/metrics       // System metrics
GET /api/v1/health/debug  // Detailed health info
```

---

### For Production (Recommended)
**Choice:** All Vercel (after converting to serverless functions)

**Why:**
- ✅ Best performance
- ✅ Best free tier
- ✅ Single platform = simpler
- ✅ Auto-scaling
- ✅ Great DX

**Migration Path:**
1. Develop locally with Express (current setup)
2. When ready for production, convert to Vercel Functions
3. Deploy everything to Vercel
4. Enjoy single-platform simplicity

---

## 🔄 The Virtuous Development Loop

### Local Development (CLI Environment)

```
┌─────────────────────────────────────────────┐
│  1. Claude Code: Tests API via curl         │
│     curl POST /api/v1/generate              │
│                                             │
│  2. Identifies bug in response parsing      │
│                                             │
│  3. Modifies: src/services/openrouter.ts   │
│                                             │
│  4. Tests again: curl POST /api/v1/generate │
│                                             │
│  5. ✅ Test passes                           │
│                                             │
│  6. Human verifies in browser UI            │
│     Opens localhost:5173, clicks button     │
│                                             │
│  7. ✅ UI works identically                  │
│                                             │
│  8. Commit changes, continue iteration      │
└─────────────────────────────────────────────┘
```

**Cycle Time:** Seconds to minutes

---

### Browser Environment (Cloud Deployment)

```
┌─────────────────────────────────────────────┐
│  1. Claude Code: Tests deployed API         │
│     curl POST https://api.vercel.app/generate│
│                                             │
│  2. Identifies bug via logs API             │
│     curl GET https://api.vercel.app/logs    │
│                                             │
│  3. Modifies code, redeploys to Vercel      │
│     git push (triggers auto-deploy)         │
│                                             │
│  4. Tests again: curl POST to deployed API  │
│                                             │
│  5. ✅ Test passes                           │
│                                             │
│  6. Human verifies in deployed frontend     │
│     Opens vercel.app URL, tests UI          │
│                                             │
│  7. ✅ UI works identically                  │
└─────────────────────────────────────────────┘
```

**Cycle Time:** Minutes (includes deployment)

---

## 🔐 Security Across Environments

### Local Development
```
.env file (backend)
└─ OPENROUTER_API_KEY=sk-or-v1-...
   ↑
   Only accessible to backend process
   Never sent to browser
```

### Cloud Deployment
```
Vercel Environment Variables (dashboard)
└─ OPENROUTER_API_KEY=sk-or-v1-...
   ↑
   Only accessible to backend functions
   Never sent to browser
   Encrypted at rest
```

### Never Do This
```
❌ Frontend .env with VITE_ prefix
   └─ VITE_OPENROUTER_API_KEY=sk-or-v1-...
      ↑
      THIS IS BUNDLED INTO BROWSER CODE
      VISIBLE TO ALL USERS
      NEVER DO THIS FOR SECRETS
```

---

## 📝 Adding Logging for AI Debugging

For browser-based Claude Code, we need API-accessible logs:

### Backend Changes Needed

```typescript
// app/orchestrator-api/src/routes/logs.ts
import { Router } from 'express';

const router = Router();
const logs: string[] = [];

// Add logging middleware
export function logMiddleware(req, res, next) {
  const logEntry = `${new Date().toISOString()} ${req.method} ${req.path}`;
  logs.push(logEntry);
  if (logs.length > 100) logs.shift(); // Keep last 100
  next();
}

// Expose logs endpoint
router.get('/', (req, res) => {
  res.json({ logs });
});

export default router;
```

### Claude Code Usage

```bash
# Check recent logs
curl https://api.vercel.app/api/v1/logs

# Response:
{
  "logs": [
    "2024-11-27T08:00:00.000Z POST /api/v1/generate",
    "2024-11-27T08:00:03.421Z Response: 200",
    "2024-11-27T08:00:03.422Z Generation time: 3421ms"
  ]
}
```

This gives Claude Code visibility into backend behavior for debugging.

---

## 📚 Key Takeaways

### Frontend
- Runs in browser
- Cannot store secrets securely
- User interface (React components)
- Our app: `orchestrator-ui/` on port 5173

### Backend
- Runs on server
- Can store secrets securely
- Business logic (API endpoints)
- Our app: `orchestrator-api/` on port 3001

### Deployment
- **Local CLI:** Works perfectly as-is
- **Browser Claude:** Needs cloud deployment
- **Production:** Best on Vercel (serverless)

### Network Restrictions
- Claude Code Browser has allowlist
- openrouter.ai NOT on allowlist
- Solution: Deploy backend to cloud

### The Goal Achieved
- ✅ Secure (API keys on server)
- ✅ Parallel testing (API = UI)
- ✅ Virtuous loop (test → improve)
- ✅ Adaptable (3 environments covered)

---

## 🗺️ Next Steps Roadmap

### Phase 1: Current (Local CLI) ✅
- Local development working
- Parallel testing enabled
- Learning and iterating

### Phase 2: Add Logging (For Browser Claude)
- Implement `/api/v1/logs` endpoint
- Add metrics and debug info
- Deploy to Render/Vercel for testing

### Phase 3: Production Deployment
- Convert to Vercel Functions (or use Render)
- Set up monitoring
- Deploy to custom domain

### Phase 4: CI/CD
- Auto-deploy on git push
- Run tests before deployment
- Claude Code tests deployment automatically

---

**End of Architecture Reference**

*This document is your blueprint for understanding the full stack, making deployment decisions, and adapting to different development environments.*
