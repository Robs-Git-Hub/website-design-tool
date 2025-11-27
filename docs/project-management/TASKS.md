# **TASKS.md — Running Checklist**

---

# **PHASE 01 — FOUNDATIONS (COMPLETE)**

## **Task Group 1: Repository Setup**

* [x] Establish directory structure (`data/`, `schema/`, `registries/`, `docs/`, `examples/`)
* [x] Add skeletal README files for root
* [x] Finalise naming conventions (`_schema`, `_instances`, `_registry` suffixes)
* [x] Define TOML formatting conventions (ordering, spacing, quoting)
* [x] Document JSON ↔ TOML interoperability rules (for agent prompts)
* [x] Add `REPO_STRUCTURE.md`

---

## **Task Group 2: Layer 1 (Axes)**

* [x] Design dimension model (6 axes, categorical/ordinal/compound)
* [x] Write `layer1_dimensions_schema.toml`
* [x] Populate `layer1_dimensions_instances.toml`
* [x] Create `layer1_dimensions_registry.toml`
* [x] Add validation instructions + rules (enum enforcement, drift prevention)
* [x] Add per-dimension README with guidance

---

## **Task Group 3: Layer 2 (Core Styles)**

* [x] Finalise the list of canonical styles
* [x] Write `layer2_web_style_family_schema.toml`
* [x] Populate `layer2_website_style_family_instances.toml` (MVP seed set complete)
* [x] Write `layer2_website_style_family_registry.toml`
* [x] Document style-definition process (evidence rules, naming rules)
* [x] Add README for Layer 2

---

## **Task Group 4: Layer 3 (Style Lexicon)**

* [x] Write `layer3_style_lexicon_schema.toml`
* [x] Populate `layer3_style_lexicon_instances.toml` (MVP seed set complete)
* [x] Add internal consistency validation (cross-links to L1 + L2)
* [x] Write README for Layer 3 (kinds, domains, expected use cases)

---

## **Task Group 5: Layer 4 (Societal Trends)**

* [x] Write `layer4_societal_trends_schema.toml`
* [x] Create `layer4_societal_trends_instances.toml` (MVP seed set complete)
* [x] Build taxonomy rules for trend kinds (lifestyle, subculture, etc.)
* [x] Add README for Layer 4

---

## **Task Group 6: Sources Registry**

* [x] Write schema for `sources_registry.toml`
* [x] Populate `sources_registry.toml` (Deferred to Post-MVP)
* [x] Link L3 + L4 sources to registry entries (Deferred)
* [x] Add README describing citation standards

---

## **Task Group 7: Conventions & Validation**

* [x] Document axis-bias encoding rules (weights vs lists)
* [x] Document style-affinity + lexicon-affinity mappings
* [x] Write `VALIDATION_RULES.md`
* [x] Define cross-layer consistency checks (ID collisions, missing links)

---

## **Task Group 8: Phase Documentation**

* [x] Write `MASTERPLAN.md` (Updated to v0.2)
* [x] Write `PHASE_01_FOUNDATIONS.md`
* [x] Write `docs/vision/design_note_vision.md` (Core Philosophy)
* [x] Write `docs/user_stories.md`
* [x] Write `docs/phases/phase_02_tooling.md`
* [x] Update MASTERPLAN with dependency graph for layers

## **Task Group 9: Examples & Bundles**

* [x] Create directory `examples/bundles/`
* [x] Create sample bundle `site_01_nebula_ai.toml`
* [x] Create sample bundle `site_02_corp_finance.toml`

---

# PHASE 02 — TOOLING & MVP WORKFLOWS

**Goal:** Build the Engine to make the WAS taxonomy usable by humans and agents.

**Reference:** See [Phase 02 Plan](phases/phase_02_tooling.md) for high-level milestones.

**✅ PHASE 02 COMPLETE (2025-11-27):**
- [x] TypeScript environment setup
- [x] Prompt generator (one-click schema sync + validation + descriptions)
- [x] ~~Claude Artifact playground prototype~~ → Built full Orchestrator UI instead
- [x] WAS Orchestrator UI (Vite + React + Backend API integration)
- [x] WAS Orchestrator API Backend (Express + TypeScript, deployed to Render.com)
- [x] Version tracking (v0.1.0) and deployment monitoring
- [x] Backend API testing (text generation, image upload, multimodal analysis)
- [x] **COMPLETE:** Bundle validator (Zod schemas, ID validation, enum checks, range checks)
- [x] **COMPLETE:** TOML/JSON converters (bidirectional, round-trip tested)
- [x] **COMPLETE:** Application logging system with HTTP endpoint
- [x] **COMPLETE:** Health check utility with exponential backoff
- [x] **COMPLETE:** Render logs access (custom endpoint preferred)
- [ ] **WAITING:** Example shots creation - ROB TO PROVIDE INPUT DATA
- [ ] **DEFERRED:** Option D schema generation (dynamic schema)

---

## Task Group 1: The WAS Engine (TypeScript SDK) - Milestone 2.1

*   [x] **Set up TypeScript Environment:** Node.js/TS tooling with Zod and TOML parsers.
*   [x] **Build Prompt Generator:**
    *   [x] Create template system with placeholders (`{{WAS_BUNDLE_SCHEMA}}`, `{{WAS_ALLOWED_VALUES}}`).
    *   [x] Extract L1-L4 data from TOML files.
    *   [x] Auto-generate orchestrator system prompt.
    *   [x] One-click workflow: `npm run generate:prompt`.
*   [ ] **Improve Schema Generation (Option D):**
    *   [ ] Dynamically generate complete schema reference from TOML schema files.
    *   [ ] Keep hardcoded realistic example for illustration.
    *   [ ] Validate example includes all required fields (especially all L3 kinds).
    *   [ ] Separate "Schema Structure" section from "Example Instance" in output.
*   [x] **Remove Registry Files (Simplification):**
    *   [x] Update generator to extract allowed values from instances only (not registries).
    *   [x] Delete `/registries` directory and all registry TOML files.
    *   [x] Update documentation to clarify instances are the canonical source.
    *   [x] Update schema comments and validation docs to remove registry references.
*   [x] **Implement Converters:** ✅ **COMPLETE**
    *   [x] `toml_to_json`: Parse TOML bundles to JSON.
    *   [x] `json_to_toml`: Serialize JSON bundles to TOML.
    *   [x] Round-trip tested (TOML → JSON → TOML = identical).
*   [x] **Implement Validator (`bundle_validator.ts`):** ✅ **COMPLETE**
    *   [x] Define Zod schemas matching `site_bundle_schema.toml`.
    *   [x] Implement Registry lookups (validate style/lexicon IDs exist).
    *   [x] Implement Logic Checks (all L1 axes required, valid enum values, weight ranges).
    *   [x] Tested with valid and invalid bundles.
    *   [x] Discovered real bugs in production bundles (missing meta fields, Layer 4 format).

## Task Group 2: The Aesthetic Playground (Claude Artifact) - Milestone 2.2

*   [x] **Build Claude Artifact Prototype:**
    *   [x] Create React component with orchestrator interface.
    *   [x] Embed system prompt using `window.claude.complete()`.
    *   [x] Input field for design ideas.
    *   [x] JSON output display with copy-to-clipboard.
*   [ ] **Enhance Artifact:**
    *   [ ] Update embedded prompt with Option D schema format.
    *   [ ] Add validation UI (show errors if output doesn't match schema).
    *   [ ] Improve example prompts based on test website screenshots.
*   [ ] **Create Example Shots:**
    *   [ ] **[ROB]** Provide 3-5 raw design ideas in `prompts/example_shots_template.md`.
    *   [ ] Process examples through artifact, generate "gold standard" bundles.
    *   [ ] Document as few-shot learning examples.

## Task Group 2.5: Monitoring & Logging Infrastructure - Milestone 2.3.5 ✅ **COMPLETE**

*   [x] **Application Logging System:**
    *   [x] Create structured logger service with in-memory circular buffer (1000 logs).
    *   [x] Implement log levels (INFO, WARN, ERROR, DEBUG) and categories.
    *   [x] Add metadata tracking for all log entries.
    *   [x] Dual output: stdout (for Render) and in-memory (for API queries).
*   [x] **Logs API Endpoint:**
    *   [x] Implement `GET /api/v1/logs` with filtering (limit, level, category).
    *   [x] Return deployment info (version, git commit, branch, deploy time).
    *   [x] Return runtime stats (uptime, memory usage, log counts).
    *   [x] Add convenience endpoint `/api/v1/logs/errors`.
*   [x] **Application Integration:**
    *   [x] Add request logging middleware (method, path, status, duration).
    *   [x] Add startup logging with environment details.
    *   [x] Add generation event logging (start, success, failure with timing).
    *   [x] Add error handler logging with full context.
*   [x] **Health Check Utility:**
    *   [x] Create health check script with exponential backoff retry logic.
    *   [x] Handle cold starts patiently (up to 12 retries, 5s-30s delays).
    *   [x] Add npm script: `npm run health-check`.
*   [x] **Render Logs Access:**
    *   [x] Research Render Management API capabilities.
    *   [x] Create utility script for accessing Render service metadata.
    *   [x] Document TLS workarounds (development only).
    *   [x] Document custom `/api/v1/logs` endpoint as recommended approach.
*   [x] **Testing & Documentation:**
    *   [x] Test logs endpoint in production deployment.
    *   [x] Verify deployment tracking (version, git info).
    *   [x] Verify request logging with accurate timing.
    *   [x] Verify generation event tracking.
    *   [x] Create comprehensive documentation in `RENDER_LOGS_ACCESS.md`.
    *   [x] Update API README with logs endpoint info.

## Task Group 2.6: WAS Orchestrator API Backend - Milestone 2.3 ✅ **COMPLETE**

*   [x] **Architecture Decision:**
    *   [x] Research Claude Code browser network restrictions (openrouter.ai blocked).
    *   [x] Design API-first architecture (backend stores API keys, frontend calls backend).
    *   [x] Document security rationale and parallel testing benefits.
*   [x] **Backend Implementation:**
    *   [x] Set up Express + TypeScript backend (`app/orchestrator-api/`).
    *   [x] Implement REST API endpoints (`/api/v1/generate`, `/api/v1/health`, `/api/v1/prompt`, `/api/v1/models`).
    *   [x] Integrate OpenRouter API for multi-model support.
    *   [x] Add image upload support (base64 encoding).
    *   [x] Implement error handling and request validation middleware.
    *   [x] Add CORS configuration for frontend integration.
*   [x] **Version Tracking:**
    *   [x] Add version field to `package.json` (v0.1.0).
    *   [x] Load version dynamically from package.json in server startup.
    *   [x] Include version in health check response and logs.
*   [x] **Deployment to Render.com:**
    *   [x] Configure Render deployment settings (build command: `npm install --include=dev && npm run build`).
    *   [x] Set environment variables (OPENROUTER_API_KEY, ALLOWED_ORIGINS).
    *   [x] Deploy to Render.com free tier with auto-deploy on branch push.
    *   [x] Verify deployment URL: https://was-orchestrator-apiapp-orchestrator-api.onrender.com
*   [x] **Frontend Integration:**
    *   [x] Update Orchestrator UI to call backend API instead of OpenRouter directly.
    *   [x] Remove frontend API key requirement (security improvement).
*   [x] **Testing & Validation:**
    *   [x] Test health endpoint (version, uptime, OpenRouter config status).
    *   [x] Test text-based generation (Example 1: SaaS dashboard prompt).
    *   [x] Test image upload with multimodal analysis (base64 PNG).
    *   [x] Verify curl-based testing from Claude Code browser environment.
    *   [x] Confirm parallel testing capability (human tests UI, AI tests backend API).
*   [x] **Documentation:**
    *   [x] Write comprehensive README with setup and deployment instructions.
    *   [x] Document API endpoints and request/response formats.
    *   [x] Add architecture diagrams showing frontend-backend-OpenRouter flow.
    *   [x] Update Phase 02 plan to reflect backend API completion.
    *   [x] Record correct Render build command in documentation.

## Task Group 2.7: Bundle Schema Compliance & Validation Refinement - Milestone 2.4 🔄 **IN PROGRESS**

**Goal:** Fix schema violations discovered by validator, implement robust validation with retry logic, and ensure LLM generates compliant bundles.

*   [ ] **Schema Updates:**
    *   [ ] Update `schema/site_bundle_schema.toml` - Change Layer 4 from string to float (weights 0.0-1.0).
    *   [ ] Document `bundle_id` and `created_at` as programmatically injected (not LLM-generated).
    *   [ ] Update validator Zod schemas to match Layer 4 float format.
    *   [ ] Add error type distinction in validator (JSON structure vs WAS schema violations).
*   [ ] **System Prompt Updates:**
    *   [ ] Remove `bundle_id` and `created_at` from LLM output format (reduce cognitive load).
    *   [ ] Update Layer 4 example to show weights (like Layer 2).
    *   [ ] Add two-tier response structure: `{bundle, reasoning, feedback_optional}`.
    *   [ ] Document escape hatch (`feedback_optional`) for LLM to flag ambiguous input.
    *   [ ] Update field requirements documentation.
*   [ ] **OpenRouter Service Enhancements:**
    *   [ ] Add model capability detection (which models support structured output).
    *   [ ] Enable `response_format: {type: "json_object"}` for all models.
    *   [ ] Update return type to include `{bundle, reasoning, feedback, modelCapabilities}`.
    *   [ ] Research OpenRouter model structured output support (GPT-4, Claude, Gemini, etc.).
*   [ ] **Metadata Injection (Programmatic):**
    *   [ ] Add `bundle_id` generation in generate route (after LLM call, before validation).
    *   [ ] Add `created_at` timestamp injection (ISO-8601 format).
    *   [ ] Ensure metadata is injected BEFORE validation runs.
*   [ ] **Retry Logic with Error Feedback:**
    *   [ ] Implement 3-attempt strategy: (1) Initial → (2) Vanilla retry → (3) Retry with error feedback.
    *   [ ] Create error formatter to distinguish JSON structure errors vs WAS schema violations.
    *   [ ] Append explicit, unambiguous error messages to prompt for attempt 3.
    *   [ ] Log feedback when LLM uses `feedback_optional` field.
    *   [ ] Log validation failures after 3 attempts (likely prompt/schema issue).
*   [ ] **Type Updates:**
    *   [ ] Update `GenerateResponse` to include validation, reasoning, feedback, capabilities, attempts.
    *   [ ] Create `ValidationError` type with error type distinction.
    *   [ ] Update `WASBundle` type if needed for Layer 4 changes.
*   [ ] **Testing & Validation:**
    *   [ ] Test with valid input (should pass on attempt 1).
    *   [ ] Test with intentionally invalid input (should retry and fix).
    *   [ ] Verify programmatic metadata injection works.
    *   [ ] Verify error feedback messages are clear and actionable.
    *   [ ] Test across multiple models (Claude, GPT-4, etc.).
    *   [ ] Validate that Layer 4 now accepts floats.
*   [ ] **Documentation:**
    *   [ ] Update API documentation with new response structure.
    *   [ ] Document retry logic and error handling.
    *   [ ] Update schema documentation for Layer 4 weights.

## Task Group 3: Testing & Validation

*   [ ] **Manual Testing:**
    *   [ ] Test artifact with BrainScript AI, Greentech, NeurAIGency examples.
    *   [ ] Verify generated bundles are valid JSON.
    *   [ ] Check that L1-L4 values match allowed enums.
*   [ ] **Consistency Testing (Future):**
    *   [ ] Define test set (5 text prompts, 5 image inputs).
    *   [ ] Run each input 10x through orchestrator.
    *   [ ] Calculate inter-annotator agreement scores.
    *   [ ] Refine system prompt until consistency >80%.

---

# PHASE 03 — THE SECOND LINK (VIBE → COAL FACE)

**Goal:** Develop the generative prompts and schemas to translate WAS Bundles into Industry Standard Specs.

## Track A: The Skin (Theme Spec)

*   [ ] **Research:** Save target `theme.json` (W3C Design Tokens) schema to repo.
*   [ ] **Develop:** Write System Prompt to translate WAS Visual Traits (L3) -> Token Values.
    *   [ ] *Constraint:* Code Agent must not change the Vibe, only interpret it.
*   [ ] **Test:** Run "Output Determinism" test (Same Bundle -> 5 Code Agents -> Compare JSON).

## Track B: The Skeleton (Layout Blueprint)

*   [ ] **Research:** Analyze DivKit, Beagle, and Relume structures.
*   [ ] **Define Schema:** Create `blueprint/page_blueprint_schema.toml` (The Hybrid Model).
*   [ ] **Define Registry:** Create `blueprint/component_registry.toml` (Hero, Navbar, etc.).
*   [ ] **Develop:** Write System Prompt to translate User Context + WAS -> Blueprint Layout.
*   [ ] **Test:** Generate blueprints for different WAS densities (High vs Low).

## Track C & D: Imagery & Copy

*   [ ] **Research (Imagery):** Define `visual_brief.json` structure (Midjourney parameters + Art Direction).
*   [ ] **Research (Copy):** Define `voice_guidelines.json` structure.
*   [ ] **Develop:** Write System Prompts for these specific domains.

---

# PHASE 04 — PRODUCTIONISE (THE MVP ENGINE)

**Goal:** Turn the scripts into a usable web interface with production deployment.

## Task Group 1: The Playground (React/Next.js)

*   [ ] **Bundle Builder UI:** Form/Chat interface to interact with the Orchestrator.
*   [ ] **Live JSON Preview:** See the `site_bundle.toml` generated in real-time.
*   [ ] **Coal Face Export:** Buttons to generate/download `theme.json` and `blueprint.json`.

## Task Group 2: The Visualizers

*   [ ] **Theme Visualizer:** Simple CSS variable playground that updates live.
*   [ ] **Wireframe Renderer:** Simple block renderer for the Blueprint JSON.

## Task Group 3: Agent API (Supabase Edge Functions)

**Note:** Moved from Phase 02 (Claude Artifacts can't expose APIs).

*   [ ] **Set up Supabase Project:**
    *   [ ] Create Supabase project for production deployment.
    *   [ ] Configure Edge Functions environment.
    *   [ ] Set up authentication and rate limiting.
*   [ ] **Implement API Endpoints:**
    *   [ ] `POST /api/generate-bundle`: Takes a natural language prompt → Returns validated Bundle JSON.
    *   [ ] `POST /api/generate-tokens`: Takes a Bundle JSON → Returns `tailwind.config.js` or CSS variables object.
    *   [ ] `POST /api/validate-bundle`: Validates a Bundle JSON against schemas and registries.
*   [ ] **Deploy & Test:**
    *   [ ] Deploy Edge Functions to Supabase.
    *   [ ] Create API documentation.
    *   [ ] Test with various inputs and edge cases.

---

# PHASE 05 — DEEP CURATION (POST-MVP)

**Goal:** Scale the Knowledge Graph.

## Task Group 1: Data Expansion

*   [ ] Expand Layer 2 Styles (from ~15 to ~50).
*   [ ] Expand Layer 3 Lexicon (from ~60 to ~200 terms).
*   [ ] Import full Research PDF dataset into L4 Trends.

## Task Group 2: Advanced Logic

*   [ ] Implement weighted aesthetic inheritance (Trend -> Style -> Axis).
*   [ ] Populate Sources Registry with rigorous citations.