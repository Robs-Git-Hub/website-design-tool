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

**🔄 CURRENT WORK (2025-11-22):**
- [x] TypeScript environment setup
- [x] Prompt generator (one-click schema sync)
- [x] Claude Artifact playground prototype
- [ ] **IN PROGRESS:** Option D schema generation (dynamic schema + validated example)
- [ ] Example shots creation - **ROB TO PROVIDE INPUT DATA**

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
*   [ ] **Implement Converters:**
    *   [ ] `toml_to_json`: Parse TOML bundles to JSON.
    *   [ ] `json_to_toml`: Serialize JSON bundles to TOML.
*   [ ] **Implement Validator (`bundle_validator.ts`):**
    *   [ ] Define Zod schemas matching `site_bundle_schema.toml`.
    *   [ ] Implement Registry lookups (validate style/lexicon IDs exist).
    *   [ ] Implement Logic Checks (e.g., all L1 axes required, valid enum values).

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