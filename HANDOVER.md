# Session Handover Document

**Date:** 2025-11-26
**Branch:** `claude/test-prompt-generator-01ADRuBkZuc2VMQgPugwsjVi`
**Status:** Phase 02 in progress (validator needed to complete)

---

## 🎯 Quick Context

We're building the **Website Aesthetic Schema (WAS)** system - a structured taxonomy for capturing and translating website aesthetics from abstract intent to concrete implementation specs.

**What we have:**
- 4-layer ontology (L1: Axes, L2: Styles, L3: Lexicon, L4: Trends)
- TOML instance data with 37 trends, 20 styles, 27 lexicon terms
- Working prompt generator that auto-generates LLM system prompts
- **NEW:** Full-featured Orchestrator UI for generating WAS bundles

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
│   └── orchestrator-ui/          # **NEW** React UI (Vite)
├── docs/                          # Documentation
│   ├── playbooks/                # Operational guides
│   │   ├── VALIDATION_RULES.md
│   │   └── DRIFT_MEASUREMENT.md  # Future phase
│   ├── project-management/
│   │   ├── TASKS.md              # Running checklist
│   │   └── phases/
│   │       ├── phase_01_foundations.md (✅ Complete)
│   │       ├── phase_02_tooling.md     (🟡 In Progress)
│   │       ├── phase_03_the_second_link.md (📋 Planned)
│   │       └── phase_05_drift_measurement.md (📋 Future)
│   └── strategy/                 # Vision docs
└── examples/                     # Sample bundles
```

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

**Tech Stack:** Vite + React + TypeScript + OpenRouter API

**Features:**
- Text input for design descriptions
- Image upload (click, drag-drop, **paste from clipboard**)
- Model selector (Claude 3.5 Sonnet, Opus, Haiku, GPT-4, GPT-4o)
- System prompt auto-loading with file watcher (polls every 3 seconds)
- Real-time bundle generation via OpenRouter
- Robust JSON extraction (handles markdown, extra text)
- Copy to clipboard
- Save/download to `data/output/`
- Quick summary of bundle attributes
- 5 example prompts

**Setup:**
1. `cd app/orchestrator-ui`
2. `cp .env.example .env`
3. Add `VITE_OPENROUTER_API_KEY=your_key` to `.env`
4. `npm install`
5. `npm run dev`

**Note:** OpenRouter API key will be in environment variables for next session.

### 3. Documentation ✅
- Phase 01 marked complete
- Phase 02 updated with accurate status
- Phase 03 (The Second Link) documented
- Phase 05 (Drift Measurement) planned
- TASKS.md updated with current status

---

## ⚠️ Critical Blocker for Phase 03

### Bundle Validator (NOT BUILT)
**Location:** `tooling/src/validators/bundle_validator.ts` (to be created)

**Why it's critical:** Phase 03 translates WAS bundles → industry specs (theme.json, blueprints). We need to ensure bundles are valid before translation.

**What it needs:**
1. **Zod schemas** matching `site_bundle_schema.toml`
2. **ID validation** - Check style/lexicon/trend IDs exist in instances
3. **Enum validation** - Check L1 axis values are valid
4. **Range validation** - Check weights are 0.0-1.0
5. **Structure validation** - Check required fields present

**Implementation estimate:** 1-2 days

**Dependencies:**
- `zod` (already in package.json)
- `@iarna/toml` (already in use)

---

## 📋 Immediate Next Steps

### Priority 1: Complete Phase 02
**Estimated time:** 2-3 days

1. **Build Bundle Validator** (1-2 days)
   - Create Zod schemas for WASBundle type
   - Implement ID lookups against TOML instances
   - Add validation to orchestrator UI
   - Write tests with known good/bad bundles

2. **TOML/JSON Converters** (1 day)
   - `toml_to_json`: Parse TOML bundles → JSON
   - `json_to_toml`: Serialize JSON → TOML
   - Add to tooling CLI

3. **Update Phase 02 Status** (30 mins)
   - Mark as complete once validator done
   - Document what was deferred to Phase 04

### Priority 2: Begin Phase 03
**Prerequisites:** Validator complete

**Track A: Theme Spec** (First priority)
- Research W3C Design Tokens spec
- Map L3 lexicon → token values
- Build theme generator prompt

---

## 🔧 Development Environment

### Working Branch
```bash
git checkout claude/test-prompt-generator-01ADRuBkZuc2VMQgPugwsjVi
```

**Branch is 9 commits ahead of main:**
1. Orchestrator UI base
2. Enhanced features (model selector, drag-drop, paste)
3. JSON extraction fix
4. Merge from main (doc reorganization)
5. Drift measurement docs
6. Status updates

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

**Git:**
```bash
git status
git add .
git commit -m "message"
git push -u origin claude/test-prompt-generator-01ADRuBkZuc2VMQgPugwsjVi
```

---

## 🐛 Known Issues

### 1. No Bundle Validation
**Impact:** Generated bundles might have invalid IDs or structures
**Fix:** Build the validator (Priority 1 above)

### 2. No TOML Export
**Impact:** Can't save bundles as TOML (only JSON download)
**Fix:** Build json_to_toml converter

### 3. No Visual Preview
**Impact:** Can't see what the design will look like
**Fix:** Deferred to Phase 04 (visual playground)

---

## 📖 Key Documentation

**Must Read:**
- `docs/project-management/phases/phase_02_tooling.md` - Current phase status
- `docs/project-management/TASKS.md` - Task checklist
- `app/orchestrator-ui/README.md` - UI setup instructions

**Reference:**
- `docs/playbooks/VALIDATION_RULES.md` - Validation logic
- `docs/playbooks/DRIFT_MEASUREMENT.md` - Future validation strategy
- `docs/project-management/phases/phase_03_the_second_link.md` - Next phase plan

---

## 🎯 Success Metrics

**Phase 02 Complete When:**
- [x] Prompt generator works
- [x] Orchestrator UI generates bundles
- [x] Handles text + image input
- [ ] **Bundle validator validates output** ← Current blocker
- [ ] TOML/JSON converters work

**Phase 03 Ready When:**
- [ ] Bundle validator complete
- [ ] Converters working
- [ ] Test suite with 10+ validated bundles

---

## 💡 Tips for Next Session

1. **OpenRouter API Key:** Will be in environment variables - no need to set up .env manually

2. **Testing the UI:**
   ```bash
   cd app/orchestrator-ui
   npm run dev
   # Try example prompts
   # Test image upload (paste screenshots!)
   # Switch between models
   ```

3. **Building the Validator:**
   - Start with Zod schema definition
   - Read TOML instances to build lookup maps
   - Test with bundles in `data/output/`
   - Add CLI command: `npm run validate-bundle <file.json>`

4. **Iterative Development:**
   - Build → Test → Commit → Repeat
   - Use the orchestrator UI to generate test bundles
   - Validate manually, then automate

---

## 📞 Questions to Clarify

1. **Example Shots:** Still waiting on Rob's input for gold standard bundles
2. **Phase Priority:** Complete Phase 02 fully before Phase 03, or parallel tracks?
3. **Drift Measurement:** Stay as Phase 05, or integrate earlier?

---

## 🚀 Long-Term Vision

**Phase 02:** WAS bundle generation ✅ (almost done)
**Phase 03:** WAS → Industry specs (theme.json, layouts)
**Phase 04:** Production deployment, visual playground
**Phase 05:** Drift measurement & validation
**Phase 06:** Deep curation (expand data)

**End Goal:** Complete aesthetic operating system from intent → implementation

---

**Last Updated:** 2025-11-26
**Next Session Focus:** Build bundle validator to unblock Phase 03
