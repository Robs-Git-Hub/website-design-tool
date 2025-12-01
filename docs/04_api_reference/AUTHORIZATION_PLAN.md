# Backend API Authorization Plan

**Status:** 📋 Planned (Not Yet Implemented)
**Last Updated:** 2025-11-29

---

## Overview

This document outlines the planned authorization strategy for the WAS Orchestrator API. The goal is to protect backend resources (OpenRouter API credits) from unauthorized use while maintaining a simple development workflow.

**Current State:** No authentication required - anyone with the backend URL can use the API.

**Planned State:** Backend API key required for all `/api/v1/generate` requests.

---

## Architecture

### Current (No Auth)
```
Frontend → Backend API → OpenRouter
            ↑
       OPENROUTER_API_KEY
       (stored in backend .env)
```

**Problem:** Anyone who discovers the backend URL can consume OpenRouter credits without restriction.

### Planned (Backend Auth)
```
Frontend (with API key input) → Backend API (validates key) → OpenRouter
                                      ↑
                                 WAS_API_KEY (backend env)
                                 OPENROUTER_API_KEY (backend env)
```

**Solution:**
1. Backend requires `Authorization: Bearer <key>` header on protected endpoints
2. Production frontend shows API key input box for users
3. Development frontend auto-fills key from environment variable
4. Claude Code Browser agents can test with key in environment

---

## Implementation Components

### 1. Backend Middleware

**File:** `app/orchestrator-api/src/middleware/auth.ts`

```typescript
/**
 * Authorization middleware
 * Validates Bearer token against WAS_API_KEY environment variable
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid Authorization header'
      },
      timestamp: Date.now()
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  const expectedKey = process.env.WAS_API_KEY;

  if (!expectedKey) {
    logger.error('auth', 'WAS_API_KEY not configured');
    return res.status(500).json({
      error: {
        code: 'CONFIGURATION_ERROR',
        message: 'Server authentication not configured'
      },
      timestamp: Date.now()
    });
  }

  if (token !== expectedKey) {
    logger.warn('auth', 'Invalid API key attempt', {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      },
      timestamp: Date.now()
    });
  }

  next();
}
```

**Apply to routes:**
```typescript
// In app/orchestrator-api/src/routes/generate.ts
import { requireAuth } from '../middleware/auth.js';

router.post('/', requireAuth, validateGenerateRequest, async (req, res) => {
  // ... existing handler
});
```

### 2. Frontend API Key Input

**File:** `app/orchestrator-ui/src/components/ApiKeyInput.tsx`

```tsx
interface ApiKeyInputProps {
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [stored, setStored] = useState(false);

  // Auto-fill from env var in development
  useEffect(() => {
    const envKey = import.meta.env.VITE_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      onApiKeyChange(envKey);
      setStored(true);
    }
  }, []);

  const handleSave = () => {
    sessionStorage.setItem('was_api_key', apiKey);
    onApiKeyChange(apiKey);
    setStored(true);
  };

  if (stored) {
    return (
      <div className="api-key-stored">
        ✓ API Key Configured
        <button onClick={() => setStored(false)}>Change</button>
      </div>
    );
  }

  return (
    <div className="api-key-input">
      <label>Backend API Key</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your WAS API key"
      />
      <button onClick={handleSave} disabled={!apiKey}>
        Save Key
      </button>
      <p className="api-key-hint">
        Your API key is stored in browser memory only and never leaves your device.
      </p>
    </div>
  );
}
```

**Integrate in App.tsx:**
```tsx
function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Show API key input if not configured
  if (!apiKey) {
    return <ApiKeyInput onApiKeyChange={setApiKey} />;
  }

  // ... rest of app
}
```

### 3. Frontend API Service Updates

**File:** `app/orchestrator-ui/src/services/api.ts`

Update to send `Authorization` header:

```typescript
class ApiService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async generateBundle(request: GenerateRequest): Promise<GenerateResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    });

    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your credentials.');
    }

    // ... rest of implementation
  }
}
```

---

## Environment Variables

### Backend (Render.com)

```bash
# Backend authentication key (new)
WAS_API_KEY=your-secret-backend-key-here

# OpenRouter integration (existing)
OPENROUTER_API_KEY=sk-or-v1-xxx

# Environment
NODE_ENV=production
PORT=3001
```

### Frontend Development

```bash
# .env.local (not committed)
VITE_API_KEY=your-secret-backend-key-here
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### Frontend Production

**No environment variables needed** - users enter key via UI.

### Claude Code Browser (Testing)

When testing API endpoints with curl:

```bash
export WAS_API_KEY="your-secret-backend-key-here"

curl -X POST https://was-orchestrator-api.onrender.com/api/v1/generate \
  -H "Authorization: Bearer $WAS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Modern dashboard"}'
```

---

## Security Considerations

### What This Protects Against
- ✅ Casual API abuse (unauthorized users discovering the URL)
- ✅ Accidental exposure of OpenRouter credits
- ✅ Basic access control for production deployment

### What This Doesn't Protect Against
- ❌ Determined attackers (key visible in browser DevTools if user enters it)
- ❌ Key sharing (users can share the backend key)
- ❌ Rate limiting (still needed as separate concern)

### Additional Recommendations

1. **Rate Limiting:** Implement per-IP rate limiting using `express-rate-limit`
2. **Key Rotation:** Plan to rotate `WAS_API_KEY` periodically
3. **Usage Monitoring:** Track API key usage via logging
4. **Multiple Keys:** Consider per-user keys for production (requires database)

---

## Development Workflow

### Local Development

1. Add `WAS_API_KEY` to backend `.env`
2. Add `VITE_API_KEY` to frontend `.env.local`
3. Frontend auto-configures on load
4. No manual key entry needed

### Production Deployment

1. Set `WAS_API_KEY` in Render environment variables
2. Deploy backend (key now required)
3. Deploy frontend (no changes needed - shows input box)
4. Share backend API key with authorized users

### Testing with Claude Code

1. Set `WAS_API_KEY` environment variable in session
2. Use in curl commands via `Authorization: Bearer $WAS_API_KEY`
3. Works identically to development workflow

---

## Migration Path

When implementing this feature:

1. **Add middleware** but make it optional initially (fallback to no-auth mode)
2. **Update frontend** with conditional rendering (show input if key required)
3. **Deploy both** simultaneously
4. **Test** with key and without key
5. **Enable enforcement** by removing fallback mode
6. **Document** the new requirement in README and HANDOVER

---

## Alternative Approaches Considered

### User-Provided OpenRouter Keys (Option A)
**Rejected:** More complex UX, users need their own OpenRouter accounts.

### OAuth/JWT (Option C)
**Rejected:** Over-engineered for single-key access control. Adds database requirement.

### IP Whitelist
**Rejected:** Not practical for distributed users and Claude Code Browser sessions.

### No Auth (Current)
**Problem:** Exposes OpenRouter credits to anyone who finds the URL.

---

## References

- Current API Reference: `docs/04_api_reference/api_reference.md`
- Backend API README: `app/orchestrator-api/README.md`
- Frontend API Service: `app/orchestrator-ui/src/services/api.ts`
- Express Auth Patterns: https://expressjs.com/en/advanced/best-practice-security.html

---

**Next Steps:**
1. Decide on API key value and rotation policy
2. Implement backend middleware
3. Implement frontend UI component
4. Test in development environment
5. Deploy to production with gradual rollout
6. Update all documentation with auth requirements
