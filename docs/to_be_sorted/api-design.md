# WAS Orchestrator API Design

## API Endpoint Structure

All endpoints are prefixed with `/api/v1`

### Core Endpoints

#### 1. Generate WAS Bundle
**The primary action - replaces frontend's direct OpenRouter call**

```http
POST /api/v1/generate
Content-Type: application/json

Request:
{
  "userInput": "A dark sci-fi dashboard...",
  "model": "anthropic/claude-3.5-sonnet",
  "image": {
    "base64": "iVBORw0KG...",
    "mediaType": "image/png"
  }  // Optional
}

Response (200 OK):
{
  "bundle": {
    "meta": { ... },
    "layer1_axes": { ... },
    "layer2_styles": { ... },
    ...
  },
  "generationTime": 3421,  // ms
  "model": "anthropic/claude-3.5-sonnet"
}

Errors:
- 400: Invalid request (missing userInput, invalid image format)
- 401: Missing API key configuration
- 429: Rate limit exceeded
- 500: OpenRouter API error
```

#### 2. Get System Prompt
**Serves the current system prompt**

```http
GET /api/v1/prompt

Response (200 OK):
{
  "prompt": "You are a Website Aesthetic Schema expert...",
  "lastModified": 1732742400000,
  "version": "1.0"
}
```

#### 3. List Available Models
**Returns available AI models**

```http
GET /api/v1/models

Response (200 OK):
{
  "models": [
    {
      "id": "anthropic/claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "recommended": true,
      "description": "Best balance of quality and speed"
    },
    ...
  ]
}
```

### Optional Endpoints (For History Feature)

#### 4. Save Bundle to History
**Server-side bundle storage**

```http
POST /api/v1/bundles
Content-Type: application/json

Request:
{
  "bundle": { ... }
}

Response (201 Created):
{
  "id": "bundle_1732742400000",
  "savedAt": 1732742400000
}
```

#### 5. Get Bundle History
**Retrieve saved bundles**

```http
GET /api/v1/bundles?limit=20&offset=0

Response (200 OK):
{
  "bundles": [
    {
      "id": "bundle_1732742400000",
      "bundle": { ... },
      "savedAt": 1732742400000
    },
    ...
  ],
  "total": 45
}
```

#### 6. Get Single Bundle
```http
GET /api/v1/bundles/:id

Response (200 OK):
{
  "id": "bundle_1732742400000",
  "bundle": { ... },
  "savedAt": 1732742400000
}
```

### Health Check

#### 7. Health Status
```http
GET /api/v1/health

Response (200 OK):
{
  "status": "healthy",
  "uptime": 123456,
  "openRouterConfigured": true
}
```

---

## Request/Response Schema

### WASBundle Type
```typescript
interface WASBundle {
  meta: {
    reasoning_notes: string;
    intent_keywords: string[];
  };
  layer1_axes: {
    tone: string;
    lightness: string;
    color_strategy: string;
  };
  layer2_styles?: Record<string, number>;
  layer3_references?: {
    color_palette?: string[];
    font_families?: string[];
  };
  layer4_output?: {
    preferred_frameworks?: string[];
  };
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}
```

---

## Authentication

For now: API keys stored in backend `.env` file.

Future: Could add user authentication with per-user API keys.

---

## Rate Limiting

- **Generate endpoint**: 10 requests/minute per IP
- **Other endpoints**: 100 requests/minute per IP

---

## CORS Policy

Allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- Production domain (when deployed)
