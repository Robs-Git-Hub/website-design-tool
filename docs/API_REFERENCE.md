# WAS Orchestrator API Reference

## Overview

The WAS Orchestrator API generates Website Aesthetic Schema (WAS) bundles from user input using Large Language Models. It includes built-in validation, retry logic, and programmatic metadata injection.

## Base URL

**Development:** `http://localhost:3001`
**Production:** `https://website-design-tool.onrender.com`

## Endpoints

### Health Check

**GET** `/api/v1/health`

Returns the current health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "environment": "development",
  "uptime": 12345,
  "openRouterConfigured": true
}
```

---

### Generate WAS Bundle

**POST** `/api/v1/generate`

Generates a WAS bundle from user input using an LLM. Includes automatic validation and retry logic.

**Request Body:**
```json
{
  "userInput": "Create a modern dark-mode dashboard with glassmorphic elements",
  "model": "anthropic/claude-3.5-sonnet",
  "image": {
    "base64": "...",
    "mediaType": "image/png"
  }
}
```

**Parameters:**
- `userInput` (string, optional): Natural language description of desired aesthetic
- `model` (string, optional): OpenRouter model identifier. Defaults to `anthropic/claude-3.5-sonnet`
- `image` (object, optional): Base64-encoded image for visual analysis
  - `base64` (string): Base64-encoded image data
  - `mediaType` (string): MIME type (e.g., `image/png`, `image/jpeg`)

**Response:**
```json
{
  "bundle": {
    "meta": {
      "bundle_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2025-11-27T19:00:00.000Z",
      "intent_summary": "A modern dark-mode dashboard with glassmorphic elements and subtle neon accents",
      "intent_keywords": ["modern", "dark", "glass", "dashboard"]
    },
    "layer1_axes": {
      "tone": "professional",
      "lightness": "dark",
      "color_strategy": "monochromatic_with_accent",
      "density": "moderate",
      "decoration": "subtle",
      "geometry_depth": {
        "shape": "rounded",
        "depth": "elevated"
      }
    },
    "layer2_styles": {
      "glassmorphism": 0.9,
      "minimalist": 0.7
    },
    "layer3_lexicon": {
      "primary_bg": "#1a1a2e",
      "accent": "#00d4ff"
    },
    "layer4_trends": {
      "saas_2020_dark_mode": 0.9,
      "neo_brutalism": 0.2
    }
  },
  "reasoning": "I chose dark mode with glassmorphism because it creates depth while maintaining modern aesthetic. The subtle neon accent provides visual interest without overwhelming the professional tone.",
  "feedback": null,
  "validation": {
    "valid": true
  },
  "modelCapabilities": {
    "supportsStructuredOutput": true
  },
  "generationTime": 3245,
  "model": "anthropic/claude-3.5-sonnet",
  "attempts": 1
}
```

**Response Fields:**
- `bundle` (object): The generated WAS bundle
  - `meta.bundle_id` (string): UUID, programmatically generated
  - `meta.created_at` (string): ISO-8601 timestamp, programmatically generated
  - `meta.intent_summary` (string): LLM-generated summary
  - `meta.intent_keywords` (array): LLM-generated keywords
  - `layer1_axes` (object): Core aesthetic axes (required)
  - `layer2_styles` (object, optional): Style weights (0.0-1.0)
  - `layer3_lexicon` (object, optional): Design tokens
  - `layer4_trends` (object, optional): Cultural trend weights (0.0-1.0)
- `reasoning` (string|null): LLM's explanation of design choices
- `feedback` (string|null): LLM's flagged issues or uncertainties
- `validation` (object): Validation results
  - `valid` (boolean): Whether bundle passes schema validation
  - `errors` (array, optional): Validation errors if invalid
- `modelCapabilities` (object): Model feature support
  - `supportsStructuredOutput` (boolean): Whether model supports JSON mode
- `generationTime` (number): Generation time in milliseconds
- `model` (string): Model used for generation
- `attempts` (number): Number of retry attempts (1-3)

---

### Get Logs

**GET** `/api/v1/logs`

Returns structured application logs.

**Query Parameters:**
- `limit` (number, optional): Maximum number of log entries. Default: 100, Max: 1000
- `level` (string, optional): Filter by log level (`info`, `warn`, `error`)
- `action` (string, optional): Filter by action type (e.g., `generate`, `startup`)

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2025-11-27T19:00:00.000Z",
      "level": "info",
      "action": "generate",
      "message": "Bundle generation complete",
      "data": {
        "model": "anthropic/claude-3.5-sonnet",
        "generationTime": 3245,
        "attempts": 1,
        "valid": true
      }
    }
  ],
  "count": 1,
  "environment": "production"
}
```

---

## Schema Compliance & Validation

### Programmatic vs LLM-Generated Fields

The API separates concerns between what the LLM generates and what the system injects:

**Programmatically Injected (by API):**
- `bundle.meta.bundle_id` - UUID generated on successful generation
- `bundle.meta.created_at` - ISO-8601 timestamp

**LLM-Generated:**
- `bundle.meta.intent_summary` - Natural language summary
- `bundle.meta.intent_keywords` - Key descriptive terms
- All layer data (layer1_axes, layer2_styles, layer3_lexicon, layer4_trends)
- `reasoning` - Explanation of aesthetic choices
- `feedback` (optional) - Flagged uncertainties or issues

### Retry Logic

The API implements a 3-attempt retry strategy:

1. **Attempt 1:** Initial generation with user input
2. **Attempt 2:** Vanilla retry (same prompt, no modifications)
3. **Attempt 3:** Retry with error feedback appended to user input

If validation fails on all attempts, the API still returns the last bundle along with validation errors. This ensures the client always receives a response.

### Validation Errors

Validation errors are categorized into two types:

- **`json_structure`**: JSON parsing or structure issues
- **`schema_violation`**: WAS schema compliance violations

Error messages are formatted specifically for LLM consumption on retry attempts:

```
The generated bundle has validation errors:

JSON Structure Errors:
- Bundle must be an object

Schema Violations:
- layer4_trends.saas_2020: saas_2020 must be a number between 0.0 and 1.0
- meta.intent_summary: intent_summary is required and must be a string

Please correct these errors and ensure the bundle follows the WAS schema structure.
```

### Layer 4 Weights

As of Task Group 2.7, Layer 4 (`layer4_trends`) uses weights (0.0-1.0) instead of strings, matching the Layer 2 format. This aligns with LLM intuition about cultural influence strength.

---

## Model Support

### Structured Output

Models that support structured JSON output automatically receive the `response_format: {type: "json_object"}` parameter:

- OpenAI GPT-4 variants
- Google Gemini Pro
- Anthropic Claude 3.5 Sonnet
- Mistral Large
- And others (see `STRUCTURED_OUTPUT_MODELS` in source)

The `modelCapabilities.supportsStructuredOutput` field in the response indicates whether the model used supports this feature.

---

## Error Responses

### Configuration Error

```json
{
  "error": {
    "code": "CONFIGURATION_ERROR",
    "message": "OPENROUTER_API_KEY not configured"
  },
  "timestamp": 1732738800000
}
```

### Generation Error

```json
{
  "error": {
    "code": "GENERATION_ERROR",
    "message": "OpenRouter API error: Rate limit exceeded"
  },
  "timestamp": 1732738800000
}
```

---

## Rate Limits

The API uses OpenRouter which has per-model rate limits. Consult [OpenRouter documentation](https://openrouter.ai/docs) for specific limits.

---

## Examples

### Basic Text Generation

```bash
curl -X POST https://website-design-tool.onrender.com/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Modern e-commerce site with warm colors and trustworthy feel"
  }'
```

### Image Analysis

```bash
curl -X POST https://website-design-tool.onrender.com/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Analyze this screenshot and create a matching aesthetic",
    "image": {
      "base64": "iVBORw0KGgoAAAANS...",
      "mediaType": "image/png"
    }
  }'
```

### Specific Model

```bash
curl -X POST https://website-design-tool.onrender.com/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Minimalist portfolio site",
    "model": "openai/gpt-4o"
  }'
```

---

## Notes

- The API always returns a bundle, even if validation fails. Check `validation.valid` to determine if retry attempts succeeded.
- The `attempts` field shows how many tries were needed (1 = success on first try, 3 = all retries exhausted)
- The `feedback` field contains LLM-flagged issues like ambiguous input or uncertainty about choices
- Cold starts on Render free tier may take 30-60 seconds for first request after inactivity
