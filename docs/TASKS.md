No, absolutely not. In fact, a **React + Supabase** stack is arguably **better** for this vision because the ultimate goal is a visual, interactive "Aesthetic Picker" (the Playground).

Moving to TypeScript/React aligns perfectly with the "Orchestrator" concept:

1.  **React (Next.js/Vite):** Perfect for building the **Visualizer**. You can render the "Knowledge Graph" we just built (Sankey diagrams, moodboards) directly in the browser.
2.  **TypeScript (Zod):** Stronger type safety for the Schema validation than Python. We can map the TOML schemas directly to Zod schemas.
3.  **Supabase:**
    *   **Database:** Store the "Registries" and "Lexicon" in Postgres for fast querying (instead of parsing TOML files every time).
    *   **Vector Search:** Supabase `pgvector` is perfect for the **Search Agent** (Story #11) to find "websites like this."
    *   **Edge Functions:** Run the "Bundle Validator" and "Transformer" logic in Deno/Node.

### The Pivot
I will update `TASKS.md` to replace the Python utility scripts with a **TypeScript/React Tooling** plan.

Here is the updated plan.

---

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

# **PHASE 02 — TOOLING & MVP WORKFLOWS (CURRENT)**

*Stack: TypeScript, React, Supabase, Tailwind.*

## **Task Group 1: The Engine (TypeScript SDK)**

* [ ] Initialize TS/Next.js project (`/web` or separate repo)
* [ ] Install TOML parsers (`@ltd/j-toml`) and Validation libs (`zod`)
* [ ] Create `WasEngine` class:
    *   [ ] `loadRegistry()`: Ingests the TOML data files.
    *   [ ] `validateBundle(json)`: Validates a bundle against the loaded registry.
    *   [ ] `flattenBundle(json)`: Resolves L2 styles into raw L1 values.

## **Task Group 2: The Playground (React UI)**

* [ ] Build **Bundle Builder UI**:
    *   [ ] Dropdowns to select L2 Styles and L4 Trends.
    *   [ ] Live preview of the resulting JSON output.
* [ ] Build **Visualizer**:
    *   [ ] A simple component that changes CSS variables based on the live JSON (e.g. changing background color/radius).
    *   [ ] Proves the "Taste to Code" loop works in the browser.

## **Task Group 3: Agent Integration (Supabase)**

* [ ] Set up Supabase Project.
* [ ] Create Edge Function `generate-bundle`:
    *   Input: User prompt string.
    *   Output: Validated WAS Bundle JSON.
    *   (Connects to OpenAI/Claude API via Vercel AI SDK).
* [ ] Create Edge Function `generate-tailwind`:
    *   Input: WAS Bundle JSON.
    *   Output: `tailwind.config.js` string.

---

# **PHASE 03 — DATASET EXPANSION (POST-MVP)**

*Goal: Return to deep curation once the tooling is proven.*

## **Task Group 1: Deep Curation**

* [ ] Expand Layer 2 Styles (from ~15 to ~50)
* [ ] Expand Layer 3 Lexicon (from ~60 to ~200 terms)
* [ ] Expand Layer 4 Trends (Import full PDF research dataset)

## **Task Group 2: Advanced Mappings**

* [ ] Implement weighted aesthetic inheritance (Trend -> Style -> Axis)
* [ ] Populate Sources Registry with rigorous citations