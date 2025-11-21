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

# PHASE 02 — THE FIRST LINK (IDEA → VIBE)

**Goal:** Validate that a High-Intelligence Reasoning LLM can consistently translate "Ideas" into valid "WAS Bundles" (Vibe Specs).

## Task Group 1: The Orchestrator & Knowledge Base

*   [ ] **Construct System Prompt:**
    *   [ ] Inject condensed L1-L4 Schemas.
    *   [ ] Inject Registries (Allowed lists).
    *   [ ] Define "Reasoning Strategy" (e.g., "Analyze context first, then derive physics").
*   [ ] **Create Example Shots:**
    *   [ ] Write 3-5 "Gold Standard" input/output pairs (Idea -> TOML) to teach the LLM the "Vibe" logic.
    *   [ ] Ensure examples cover edge cases (e.g., "Golden Hour" mapping to L3).

## Task Group 2: Tooling & Validation (The Guardrails)

*   [ ] **Set up TypeScript Environment:** (Node.js/TS scripts).
*   [ ] **Implement Converters:**
    *   [ ] `toml_to_json`: To feed the LLM.
    *   [ ] `json_to_toml`: To save the output.
*   [ ] **Implement Validator (`bundle_validator.ts`):**
    *   [ ] Define Zod schemas matching `site_bundle_schema.toml`.
    *   [ ] Implement Registry lookups (Check if `glassmorphism` exists).
    *   [ ] Implement Logic Checks (e.g., weights sum to 1.0, no missing required axes).

## Task Group 3: The Consistency Test Suite (Scientific Method)

*   [ ] **Define the Test Set:**
    *   [ ] 5 Text Prompts (Vague to Specific).
    *   [ ] 5 Image Inputs (Screenshots/Moodboards).
*   [ ] **Build the Harness:**
    *   [ ] Script to run each input 10x through the Orchestrator (GPT-4o/Claude 3.5).
    *   [ ] Script to compare semantic similarity of outputs.
*   [ ] **Analyze & Tune:**
    *   [ ] Calculate Inter-Annotator Agreement scores.
    *   [ ] Refine System Prompt until consistency >80%.

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

**Goal:** Turn the scripts into a usable web interface.

## Task Group 1: The Playground (React/Next.js)

*   [ ] **Bundle Builder UI:** Form/Chat interface to interact with the Orchestrator.
*   [ ] **Live JSON Preview:** See the `site_bundle.toml` generated in real-time.
*   [ ] **Coal Face Export:** Buttons to generate/download `theme.json` and `blueprint.json`.

## Task Group 2: The Visualizers

*   [ ] **Theme Visualizer:** Simple CSS variable playground that updates live.
*   [ ] **Wireframe Renderer:** Simple block renderer for the Blueprint JSON.

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