# WAS Orchestrator API

Backend API server for the Website Aesthetic Schema (WAS) Orchestrator UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenRouter API key to .env
# Get one at: https://openrouter.ai/keys
echo "OPENROUTER_API_KEY=sk-or-v1-your-actual-key" >> .env

# Start development server
npm run dev
```

Server will start at `http://localhost:3001`

## 📋 API Endpoints

### Health Check
```bash
GET /api/v1/health
```

### Get System Prompt
```bash
GET /api/v1/prompt
```

### List Available Models
```bash
GET /api/v1/models
```

### Generate WAS Bundle
```bash
POST /api/v1/generate
Content-Type: application/json

{
  "userInput": "A dark sci-fi dashboard",
  "model": "anthropic/claude-3.5-sonnet",
  "image": {
    "base64": "...",
    "mediaType": "image/png"
  }
}
```

## 🧪 Testing with curl

```bash
# Test health
curl http://localhost:3001/api/v1/health

# Get system prompt
curl http://localhost:3001/api/v1/prompt | jq '.prompt'

# List models
curl http://localhost:3001/api/v1/models | jq '.models'

# Generate bundle
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"userInput": "A minimal blog"}' \
  | jq '.'
```

## 📁 Project Structure

```
orchestrator-api/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── routes/               # API route handlers
│   │   ├── generate.ts       # POST /generate
│   │   ├── prompt.ts         # GET /prompt
│   │   ├── models.ts         # GET /models
│   │   └── health.ts         # GET /health
│   ├── services/             # Business logic
│   │   ├── openrouter.ts     # OpenRouter API client
│   │   └── promptLoader.ts   # System prompt loader
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.ts  # Global error handler
│   │   └── validateRequest.ts # Request validation
│   └── types/                # TypeScript types
│       └── was.ts            # WAS Bundle types
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | Yes | - | OpenRouter API key |
| `PORT` | No | 3001 | Server port |
| `NODE_ENV` | No | development | Environment |
| `ALLOWED_ORIGINS` | No | localhost:5173 | CORS origins |

### CORS Configuration

By default, the API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)

To add more origins:
```bash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://myapp.com
```

## 📝 Development

```bash
# Start dev server with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🐛 Troubleshooting

**Issue:** "OPENROUTER_API_KEY not configured"
- **Solution:** Add your API key to `.env` file

**Issue:** "Failed to load system prompt"
- **Solution:** Ensure `prompts/orchestrator_system_prompt.md` exists in project root

**Issue:** CORS errors in browser
- **Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

## 🔗 Related Documentation

- [API Design Specification](../../docs/api-design.md)
- [Parallel Execution Playbook](../../docs/PARALLEL-EXECUTION-PLAYBOOK.md)
- [Frontend Integration Guide](../orchestrator-ui/README.md)

## 📄 License

MIT
