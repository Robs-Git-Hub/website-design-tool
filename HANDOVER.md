# Session Handover Document

**Date:** 2025-11-27
**Branch:** `claude/design-tool-refinement-017rygcdKmhUKTgjuWsrzPAG`
**Status:** Phase 02 near complete (validator + converters remain)

---

## 🎯 Quick Context

We're building the **Website Aesthetic Schema (WAS)** system - a structured taxonomy for capturing and translating website aesthetics from abstract intent to concrete implementation specs.

**Current Architecture:**
```
Orchestrator UI (React) → Backend API (Express/Render.com) → OpenRouter → Claude/GPT
                                  ↑
                          Claude Code (curl testing)
```

**What we have:**
- 4-layer ontology (L1: Axes, L2: Styles, L3: Lexicon, L4: Trends)
- TOML instance data with 37 trends, 20 styles, 27 lexicon terms
- Working prompt generator that auto-generates LLM system prompts
- Full-featured Orchestrator UI for generating WAS bundles
- **Backend API (v0.1.0)** deployed to Render.com with secure API key storage
- **Parallel testing capability:** Humans test UI, Claude Code tests API

---

## 📂 Repository Structure

```
website-design-tool/
├── data/                           # Instance data (TOML)
│   ├── layer1_dimensions_instances.toml
│   ├── layer2_website_style_family_instances.toml
│   ├── layer3_style_lexicon_instances.toml
│   └── layer4_societal_trends_instances.toml
├── schema/                         # Schemas defining structure
├── prompts/                        # Generated system prompts
│   ├── orchestrator_template.md   # Template with placeholders
│   └── orchestrator_system_prompt.md  # Generated output
├── tooling/                        # TypeScript tools
│   └── src/generators/
│       └── generate_prompt.ts     # Prompt generator
├── app/                           # Applications
│   ├── orchestrator-ui/          # React UI (Vite)
│   └── orchestrator-api/         # **Backend API (Express + TS)**
├── work/                          # Working directory
│   └── design-tool-refinement/   # Current session workspace
├── docs/                          # Documentation
│   ├── playbooks/                # Operational guides
│   │   ├── VALIDATION_RULES.md
│   │   ├── DRIFT_MEASUREMENT.md  # Future phase
│   │   ├── PARALLEL_EXECUTION_PLAYBOOK.md  # **NEW**
│   │   └── API_DESIGN_SPECIFICATION.md     # **NEW**
│   ├── project-management/
│   │   ├── TASKS.md              # Running checklist
│   │   └── phases/
│   │       ├── phase_01_foundations.md (✅ Complete)
│   │       ├── phase_02_tooling.md     (🟡 95% Complete)
│   │       ├── phase_03_the_second_link.md (📋 Planned)
│   │       └── phase_05_drift_measurement.md (📋 Future)
│   └── strategy/                 # Vision docs
└── examples/                     # Sample bundles
```

---

## 📖 **MUST READ FILES** (Start Here)

**For Orientation:**
1. **`docs/project-management/phases/phase_02_tooling.md`** - Current phase status, see Section 2.3 for backend API
2. **`docs/project-management/TASKS.md`** - Task checklist with Task Group 2.5 (Backend API completion status)
3. **`app/orchestrator-api/README.md`** - Backend API setup, endpoints, deployment instructions

**For Context:**
4. **`docs/playbooks/PARALLEL_EXECUTION_PLAYBOOK.md`** - How human UI testing and Claude Code API testing work in parallel
5. **`docs/playbooks/API_DESIGN_SPECIFICATION.md`** - Complete API reference with schemas

**For Quick Reference:**
6. **`docs/reference/QUICK-REFERENCE-ENVIRONMENTS.md`** - Environment setup for local/browser/production
7. **`docs/reference/ARCHITECTURE-AND-DEPLOYMENT-OPTIONS.md`** - Frontend/backend architecture rationale

---

## ✅ What's Complete (Phase 02)

### 1. Prompt Generator ✅
**Location:** `tooling/src/generators/generate_prompt.ts`

- Reads TOML instance data
- Generates system prompt from template
- Validates hardcoded examples against instances
- Adds rich descriptions for L2/L3/L4
- Alphabetical sorting for readability

**Run with:** `npm run generate:prompt` (from `tooling/` directory)

### 2. WAS Orchestrator UI ✅
**Location:** `app/orchestrator-ui/`

**Tech Stack:** Vite + React + TypeScript

**Features:**
- Text input for design descriptions
- Image upload (click, drag-drop, paste from clipboard)
- Model selector (Claude 3.5 Sonnet, Opus, Haiku, GPT-4, GPT-4o)
- System prompt auto-loading with file watcher
- Real-time bundle generation via backend API
- Robust JSON extraction (handles markdown, extra text)
- Copy to clipboard
- Save/download to `data/output/`
- Quick summary of bundle attributes
- 5 example prompts

**Important:** UI now calls backend API (not OpenRouter directly) for security

### 3. WAS Orchestrator API Backend ✅ **NEW**
**Location:** `app/orchestrator-api/`
**Version:** 0.1.0
**Deployed:** https://was-orchestrator-apiapp-orchestrator-api.onrender.com

**Tech Stack:** Express + TypeScript + OpenRouter integration

**Features:**
- Secure API key storage (backend .env, not browser)
- REST API endpoints: `/api/v1/generate`, `/api/v1/health`, `/api/v1/prompt`, `/api/v1/models`
- Image upload support (base64 encoding)
- Request validation and error handling
- CORS configuration for frontend
- Version tracking and deployment monitoring
- Auto-deploy on branch push to Render.com

**Why it exists:**
- OpenRouter API (openrouter.ai) is blocked in Claude Code browser environment
- Backend stores API keys securely (not exposed in DevTools)
- Enables parallel testing: humans test UI, Claude Code tests backend API

**Tested:**
- ✅ Health endpoint with version info
- ✅ Text generation (Example 1: SaaS dashboard)
- ✅ Image upload with multimodal analysis (base64 PNG)
- ✅ Accessible from Claude Code browser via curl

**Deployment:**
- **Platform:** Render.com (free tier)
- **Branch:** `claude/design-tool-refinement-017rygcdKmhUKTgjuWsrzPAG`
- **Build Command:** `npm install --include=dev && npm run build` (⚠️ `--include=dev` is critical!)
- **Start Command:** `npm start`
- **Environment:** `OPENROUTER_API_KEY`, `NODE_ENV`, `PORT`
- **Note:** Free tier sleeps after 15 min inactivity (30s cold start)

### 4. Documentation ✅
- Phase 02 updated with backend API section (2.3)
- TASKS.md includes Task Group 2.5 (Backend API complete)
- Deployment guides (Render setup, build commands)
- Architecture documentation (frontend/backend separation)
- API specification (endpoints, schemas)
- Parallel execution playbook

---

## 📋 **TASKS FOR NEXT SESSION**

### Task 1: Check Render Logs via API ⚙️
**Goal:** Verify we can programmatically access Render deployment logs

**Why:** Enables automated deployment verification and debugging

**Steps:**
1. Research Render API documentation for log access
2. Test API authentication (Render API key may be needed)
3. Write simple script to fetch recent logs
4. Verify we can see version info and startup messages
5. Document findings in `app/orchestrator-api/README.md`

**Resources:**
- Render API docs: https://api-docs.render.com/
- Deployment URL: https://was-orchestrator-apiapp-orchestrator-api.onrender.com

---

### Task 2: Bundle Validator 🔴 **CRITICAL BLOCKER**
**Location:** `tooling/src/validators/bundle_validator.ts` (to be created)

**Why it's critical:** Phase 03 translates WAS bundles → industry specs (theme.json, blueprints). We need to ensure bundles are valid before translation.

**What it needs:**
1. **Zod schemas** matching `site_bundle_schema.toml` structure
2. **ID validation** - Check style/lexicon/trend IDs exist in TOML instances
3. **Enum validation** - Check L1 axis values are valid
4. **Range validation** - Check weights are 0.0-1.0
5. **Structure validation** - Check required fields present

**Implementation approach:**
- Define Zod schemas for WASBundle type
- Load TOML instances to build lookup maps (valid IDs)
- Create validation function that returns detailed errors
- Add CLI command: `npm run validate-bundle <file.json>`
- Write tests with known good/bad bundles from `data/output/`

**Dependencies:**
- `zod` (already in package.json)
- `@iarna/toml` (already in use)

**Test bundles available in:**
- `data/output/` (if UI has been used)
- `examples/bundles/` (seed bundles)
- Can generate new ones via API or UI

---

### Task 3: TOML/JSON Converters 🔧
**Location:** `tooling/src/converters/` (to be created)

**Goal:** Simple bidirectional conversion between TOML and JSON bundle formats

**What to build:**
1. **`toml_to_json.ts`** - Parse TOML bundles → JSON
2. **`json_to_toml.ts`** - Serialize JSON bundles → TOML

**Implementation approach:**
- **Use established packages** (do NOT write custom parsers):
  - `@iarna/toml` (already in use for reading TOML)
  - `@iarna/toml` also has `stringify()` for writing TOML
- Simple wrapper scripts that:
  - Read file from CLI argument
  - Convert format
  - Write to output file or stdout
- Add CLI commands: `npm run toml2json <file>` and `npm run json2toml <file>`

**Example usage:**
```bash
# Convert TOML bundle to JSON
npm run toml2json examples/bundles/site_01_nebula_ai.toml

# Convert JSON bundle to TOML
npm run json2toml data/output/bundle_2025-11-27.json
```

**Test with:**
- Existing TOML bundles in `examples/bundles/`
- Generated JSON bundles from UI/API

---

## 🔧 Development Environment

### Working Branch
```bash
git checkout claude/design-tool-refinement-017rygcdKmhUKTgjuWsrzPAG
```

**Branch is 8 commits ahead of main** (backend API work)

### Key Commands

**Prompt Generator:**
```bash
cd tooling
npm install  # First time only
npm run generate:prompt
```

**Orchestrator UI:**
```bash
cd app/orchestrator-ui
npm install  # First time only
npm run dev  # Development server
npm run build  # Production build
```

**Backend API (Local):**
```bash
cd app/orchestrator-api
npm install  # First time only
cp .env.example .env  # Add OPENROUTER_API_KEY
npm run dev  # Development with hot reload
npm run build && npm start  # Production mode
```

**Test Backend API:**
```bash
# Health check (local)
curl http://localhost:3001/api/v1/health

# Health check (production)
curl https://was-orchestrator-apiapp-orchestrator-api.onrender.com/api/v1/health

# Generate bundle (with test payload)
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d @work/design-tool-refinement/test-generate.json
```

**Git:**
```bash
git status
git add .
git commit -m "message"
git push -u origin claude/design-tool-refinement-017rygcdKmhUKTgjuWsrzPAG
```

---

## 🐛 Known Issues

### 1. No Bundle Validation
**Impact:** Generated bundles might have invalid IDs or structures
**Fix:** **Task 2** above (Priority 1)

### 2. No TOML Export
**Impact:** Can't save bundles as TOML (only JSON download)
**Fix:** **Task 3** above (converters)

### 3. No Visual Preview
**Impact:** Can't see what the design will look like
**Fix:** Deferred to Phase 04 (visual playground)

### 4. Render Free Tier Cold Starts
**Impact:** First request after 15 min idle takes 30 seconds
**Fix:** Accept limitation or upgrade to paid tier (future decision)

---

## 🎯 Success Metrics

**Phase 02 Complete When:**
- [x] Prompt generator works
- [x] Orchestrator UI generates bundles
- [x] Handles text + image input
- [x] Backend API deployed and tested
- [ ] **Bundle validator validates output** ← Task 2
- [ ] **TOML/JSON converters work** ← Task 3

**Phase 03 Ready When:**
- [ ] Bundle validator complete
- [ ] Converters working
- [ ] Test suite with 10+ validated bundles

---

## 💡 Tips for Next Session

1. **OpenRouter API Key:** Already in environment variables and Render deployment - no manual setup needed

2. **Testing the Backend API:**
   - Deployment URL: https://was-orchestrator-apiapp-orchestrator-api.onrender.com
   - Test payloads in `work/design-tool-refinement/test-*.json`
   - First request may take 30s (cold start)
   - Check logs at Render dashboard

3. **Building the Validator:**
   - Start with Zod schema matching `schema/site_bundle_schema.toml`
   - Use bundles in `data/output/` and `examples/bundles/` for testing
   - Test both valid and invalid bundles
   - Return structured errors (field path + error message)

4. **Building the Converters:**
   - Keep it simple - wrapper around `@iarna/toml` package
   - Don't write custom parsers
   - Test round-trip: TOML → JSON → TOML should be identical
   - Handle file I/O and CLI arguments

5. **Accessing Render Logs:**
   - May require Render API key (check environment)
   - Could use `curl` to test API endpoints
   - Document any limitations found

6. **Parallel Testing Pattern:**
   - Use curl to test API endpoints (fast, scriptable)
   - Use browser to verify UI experience (visual, UX)
   - Both should produce identical WAS bundles

---

## 📞 Questions to Clarify

1. **Example Shots:** Still waiting on Rob's input for gold standard bundles
2. **Validator Strictness:** How strict should validation be? (Warnings vs errors)
3. **Render Logs:** Is automated log access needed, or manual dashboard review sufficient?

---

## 🚀 Long-Term Vision

**Phase 02:** WAS bundle generation (95% complete - validator + converters remain)
**Phase 03:** WAS → Industry specs (theme.json, layouts)
**Phase 04:** Production deployment, visual playground
**Phase 05:** Drift measurement & validation
**Phase 06:** Deep curation (expand data)

**End Goal:** Complete aesthetic operating system from intent → implementation

---

## 📊 Current State Summary

**✅ Complete:**
- Prompt generator
- Orchestrator UI with image support
- Backend API (v0.1.0) deployed to Render.com
- Parallel testing infrastructure
- Comprehensive documentation

**🔨 In Progress:**
- Bundle validator (next session - Task 2)
- TOML/JSON converters (next session - Task 3)
- Render logs API access (next session - Task 1)

**🚫 Blocked:**
- Phase 03 work (blocked by validator completion)

**📋 Waiting:**
- Rob's input for example shots (deferred)

---

**Last Updated:** 2025-11-27
**Next Session Focus:**
1. Check Render logs via API
2. Build bundle validator (critical blocker)
3. Build TOML/JSON converters (simple wrappers)
