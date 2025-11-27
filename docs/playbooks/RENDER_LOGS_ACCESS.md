# Render Logs Access Guide

**Date:** 2025-11-27
**Status:** Documented with limitations

---

## 📋 Overview

This document describes how to access Render deployment logs via the Render API, including authentication, endpoints, and discovered limitations in the Claude Code browser environment.

## 🔑 Authentication

All Render API requests require authentication via API key in the `Authorization` header:

```bash
Authorization: Bearer <RENDER_API_KEY>
```

**API Key Management:**
- Create API keys in Render Dashboard → Account Settings → API Keys
- API key provides access to all workspaces you belong to
- Keep API keys secure - never commit to version control
- Revoke and recreate if compromised

**Environment Variable:**
```bash
export RENDER_API_KEY=rnd_xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📡 API Endpoints

### Base URL
```
https://api.render.com/v1
```

### List Services
```bash
GET /services
```

**Response:**
```json
[
  {
    "service": {
      "id": "srv-xxxxx",
      "name": "was-orchestrator-api",
      "type": "web_service",
      "repo": "Robs-Git-Hub/website-design-tool",
      "branch": "claude/design-tool-refinement-017rygcdKmhUKTgjuWsrzPAG",
      "autoDeploy": "yes",
      "serviceDetails": {
        "url": "https://was-orchestrator-apiapp-orchestrator-api.onrender.com"
      }
    }
  }
]
```

### List Logs
```bash
GET /services/{serviceId}/logs?limit=100
```

**Query Parameters:**
- `limit` (optional): Number of logs to fetch (default: 100)
- `startTime` (optional): ISO timestamp for pagination
- `endTime` (optional): ISO timestamp for pagination

**Response:**
```json
{
  "logs": [
    {
      "id": "log-xxxxx",
      "text": "🚀 WAS Orchestrator API v0.1.0 running on http://localhost:3001",
      "timestamp": "2025-11-27T12:00:00Z"
    }
  ],
  "hasMore": true,
  "nextStartTime": "2025-11-27T12:00:01Z",
  "nextEndTime": "2025-11-27T12:00:02Z"
}
```

## 🔧 Implementation

### Node.js/TypeScript Script

A TypeScript utility script has been created at:
```
tooling/src/utils/render-logs.ts
```

**Usage:**
```bash
# List all services
npx tsx src/utils/render-logs.ts

# Fetch logs for specific service
npx tsx src/utils/render-logs.ts srv-xxxxx
```

**Features:**
- Lists all Render services with details
- Fetches recent logs (last 100 entries)
- Displays logs with timestamps
- Handles pagination indicators

### curl Examples

**List Services:**
```bash
curl -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Accept: application/json" \
  https://api.render.com/v1/services
```

**Fetch Logs:**
```bash
curl -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Accept: application/json" \
  "https://api.render.com/v1/services/srv-xxxxx/logs?limit=100"
```

## ⚠️ Environment Limitations

### Claude Code Browser Environment

**Issue:** TLS certificate verification failures when accessing external HTTPS endpoints

**Error:**
```
TLS_error:|268435581:SSL routines:OPENSSL_internal:CERTIFICATE_VERIFY_FAILED
```

**Impact:**
- Cannot access Render API directly from Claude Code browser
- Cannot access production deployment health endpoints
- Cannot programmatically fetch logs in this environment

**Affected Operations:**
- ❌ `curl` to Render API endpoints
- ❌ `curl` to production deployment (https://was-orchestrator-apiapp-orchestrator-api.onrender.com)
- ❌ Node.js `fetch()` to external HTTPS APIs

## ✅ Working Alternatives

### 1. Render Dashboard (Web UI)
**Recommended for most cases**

Navigate to:
```
https://dashboard.render.com/web/<service-name>
```

Features:
- Real-time log streaming
- Filter by severity (info, warn, error)
- Search log content
- Download log archives
- View deployment history
- Monitor resource usage

### 2. Local Development Environment
**For automated access**

Run the `render-logs.ts` script from a local terminal with proper network access:

```bash
# From project root
export RENDER_API_KEY=rnd_xxxxx
cd tooling
npx tsx src/utils/render-logs.ts
```

This works in:
- Local developer machines
- CI/CD pipelines (GitHub Actions, etc.)
- Docker containers with network access
- WSL/Linux environments

### 3. GitHub Actions Workflow
**For automated monitoring**

Create `.github/workflows/check-logs.yml`:

```yaml
name: Check Render Logs

on:
  workflow_dispatch:  # Manual trigger
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  check-logs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: tooling
        run: npm install
      - name: Fetch logs
        working-directory: tooling
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: npx tsx src/utils/render-logs.ts
```

## 📊 What to Look For in Logs

### Successful Deployment
```
🚀 WAS Orchestrator API v0.1.0 running on http://localhost:3001
🌍 Environment: production
📝 API Documentation: http://localhost:3001/api/v1/health
🔑 OpenRouter API Key: ✓ Configured
```

### Version Information
Verify deployed version matches expected version:
```
v0.1.0
```

### Startup Errors
Common issues to check:
```
❌ OpenRouter API Key: ✗ Not configured
Error: ENOENT: no such file or directory, open 'prompts/orchestrator_system_prompt.md'
TypeError: Cannot read property 'map' of undefined
```

### Request Logs
Monitor API usage:
```
POST /api/v1/generate - 200 - 2.3s
GET /api/v1/health - 200 - 5ms
```

## 🎯 Use Cases

### Development Verification
After pushing code, verify deployment succeeded:
1. Check Render Dashboard for build status
2. Look for version string in startup logs
3. Verify "✓ Configured" messages
4. Check for any error messages

### Debugging Production Issues
When API returns errors:
1. Fetch recent logs (last 100 entries)
2. Search for error messages or stack traces
3. Check timestamp correlation with reported issues
4. Verify environment variables are set

### Monitoring API Usage
Track API performance:
1. Review request logs for response times
2. Identify slow endpoints
3. Monitor error rates
4. Check for cold start patterns (15 min sleep)

### Deployment Validation
After automated deploy:
1. Wait 30s for cold start (if needed)
2. Check logs for startup messages
3. Verify version number updated
4. Test health endpoint separately

## 📚 Resources

- **Render API Documentation:** https://api-docs.render.com/
- **Authentication Guide:** https://api-docs.render.com/reference/authentication
- **List Logs Endpoint:** https://api-docs.render.com/reference/list-logs
- **Render Dashboard:** https://dashboard.render.com/
- **Log Streams Documentation:** https://render.com/docs/log-streams

## 🔮 Future Enhancements

### Potential Improvements

1. **Log Analysis Script**
   - Parse logs for errors/warnings
   - Generate summary reports
   - Alert on specific patterns
   - Track deployment frequency

2. **Dashboard Integration**
   - Webhook notifications for deployments
   - Slack/Discord integration
   - Email alerts for errors
   - Metrics dashboard (Grafana, etc.)

3. **Automated Testing**
   - Post-deploy smoke tests
   - Log validation checks
   - Performance regression detection
   - Uptime monitoring

4. **Log Aggregation**
   - Forward logs to external service (Datadog, Loggly)
   - Long-term log storage
   - Advanced search and filtering
   - Cross-service correlation

## ✅ Task Completion Summary

**Task:** Check Render logs via API

**Findings:**
- ✅ Render API documented (endpoints, authentication)
- ✅ TypeScript utility script created (`tooling/src/utils/render-logs.ts`)
- ✅ Alternative access methods documented (Dashboard, local, CI/CD)
- ⚠️  API access blocked in Claude Code browser environment (TLS certificate issues)
- ✅ Workarounds provided for all use cases

**Recommendation:**
Use Render Dashboard for manual log access in Claude Code sessions. Use the TypeScript script from local environments or CI/CD for automated access.

---

**Last Updated:** 2025-11-27
**Next Review:** When deploying to different environments or if TLS issues are resolved
