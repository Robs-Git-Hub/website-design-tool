# Claude Code Guide

**For Claude Code agents working on the Website Aesthetic Schema (WAS) project.**

## Quick Reference

→ **See `AGENTS.md`** for the main agent documentation index.

This file contains Claude Code-specific setup and workflows.

## Environment

- **Platform**: Claude Code Browser
- **Working Directory**: `/home/user/website-design-tool`
- **Git Workflow**: Feature branches (`claude/*`)
- **Backend API**: Deployed to Render.com (handles cold starts)

## First Steps in New Session

1. **Read HANDOVER.md**: `docs/project-management/HANDOVER.md`
   - Current project state
   - Active branch
   - Known issues
   - Next steps

2. **Check Branch**: Verify you're on the correct working branch (see HANDOVER.md)

3. **Install Dependencies** (if needed):
   ```bash
   cd tooling && npm install
   cd ../app/orchestrator-api && npm install
   cd ../app/orchestrator-ui && npm install
   ```

4. **Review Lessons Learned**: `docs/project-management/LESSONS_LEARNED.md`
   - Avoid past mistakes (cold starts, documentation, etc.)

## Key Capabilities & Limitations

### ✅ What Claude Code Can Do

- Access deployed Render services via HTTPS (curl)
- Test backend API endpoints
- Run validation, conversion, and generation scripts
- Git operations (commit, push, branch)
- File operations (read, write, edit)

### ⚠️ Important Notes

- **Cold Starts**: Render free tier sleeps after 15 min → First request takes 20-30s
- **Health Check**: Always use `npm run health-check` before manual API testing
- **OpenRouter**: Direct access blocked → Use backend API proxy instead
- **TLS Issues**: Some external APIs may have cert issues → Use custom endpoints

## Common Workflows

### Testing Backend API

```bash
# RECOMMENDED: Patient health check (handles cold starts)
cd tooling
npm run health-check

# Manual health check (wait up to 60s)
curl --max-time 60 https://was-orchestrator-apiapp-orchestrator-api.onrender.com/api/v1/health

# Check deployment info
curl --max-time 60 https://was-orchestrator-apiapp-orchestrator-api.onrender.com/api/v1/logs | jq '.deployment'
```

### Validating Bundles

```bash
cd tooling
npm run validate-bundle ../examples/bundles/test_valid_bundle.json
```

### Converting Formats

```bash
cd tooling
npm run convert:toml-to-json ../examples/bundles/site_02_corp_finance.toml
npm run convert:json-to-toml ../examples/bundles/test_valid_bundle.json
```

### Generating System Prompt

```bash
cd tooling
npm run generate:prompt
```

## Git Workflow

```bash
# Check current branch
git branch --show-current

# Stage and commit
git add <files>
git commit -m "message"

# Push to remote (branch name must start with 'claude/' and end with session ID)
git push -u origin <branch-name>

# Check deployment triggered (if branch is configured in Render)
# Wait ~5-10 minutes for build, then check health endpoint
```

## Project-Specific Patterns

See `docs/coding_assistant_guides/` for:
- ES modules patterns (`import.meta.url` not `require.main`)
- Git path management (use absolute paths from repo root)
- Structured logging patterns
- API testing with retry logic

## Need Help?

1. **Current State**: `docs/project-management/HANDOVER.md`
2. **Lessons Learned**: `docs/project-management/LESSONS_LEARNED.md`
3. **Phase Docs**: `docs/project-management/phases/`
4. **Architecture**: `docs/architecture/`
5. **General Agent Guide**: `AGENTS.md`

---

**Last Updated:** 2025-11-28
