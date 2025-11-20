# **TASKS.md — Running Checklist**

---

# **PHASE 01 — FOUNDATIONS**

## **Task Group 1: Repository Setup**

* [ ] Establish directory structure (`/layer1`, `/layer2`, `/layer3`, `/layer4`, `/sources`, `/docs`)
* [ ] Add skeletal README files for root + each layer
* [ ] Finalise naming conventions (IDs, slugs, folder names, file names)
* [ ] Define TOML formatting conventions (ordering, spacing, quoting)
* [ ] Document JSON ↔ TOML interoperability rules (for agent prompts)
* [ ] Add `REPO_STRUCTURE.md`

---

## **Task Group 2: Layer 1 (Axes)**

* [x] Design dimension model (6 axes, categorical/ordinal/compound)
* [x] Write `layer1_dimensions_schema.toml`
* [x] Populate `layer1_dimensions.toml`
* [x] Create `layer1_registry.toml`
* [ ] Add validation instructions + rules (enum enforcement, drift prevention)
* [ ] Add per-dimension README with guidance

---

## **Task Group 3: Layer 2 (Core Styles)**

* [ ] Finalise the list of 25–40 canonical styles (based on research dataset)
* [ ] Write `layer2_styles_schema.toml`
* [ ] Populate `layer2_styles.toml` (initial entries)
* [ ] Write `layer2_styles_registry.toml`
* [ ] Document style-definition process (evidence rules, naming rules)
* [ ] Add README for Layer 2

---

## **Task Group 4: Layer 3 (Style Lexicon)**

* [x] Write `layer3_style_lexicon_schema.toml`
* [x] Populate `layer3_style_lexicon.toml` (~60 terms)
* [ ] Add internal consistency validation (cross-links to L1 + L2)
* [ ] Write README for Layer 3 (kinds, domains, expected use cases)

---

## **Task Group 5: Layer 4 (Societal Trends)**

* [x] Write `layer4_societal_trends_schema.toml`
* [ ] Create `layer4_trends.toml` (initial entries)
* [ ] Build taxonomy rules for trend kinds (lifestyle, subculture, etc.)
* [ ] Add README for Layer 4
* [ ] Import examples from uploaded PDF dataset

---

## **Task Group 6: Sources Registry**

* [ ] Write schema for `sources_registry.toml`
* [ ] Populate `sources_registry.toml` with initial entries
* [ ] Link L3 + L4 sources to registry entries
* [ ] Add README describing citation standards

---

## **Task Group 7: Conventions & Validation**

* [ ] Document axis-bias encoding rules (weights vs lists)
* [ ] Document style-affinity + lexicon-affinity mappings
* [ ] Write `VALIDATION_RULES.md`
* [ ] Define cross-layer consistency checks (ID collisions, missing links)

---

## **Task Group 8: Phase Documentation**

* [x] Write `MASTERPLAN.md`
* [x] Write `PHASE_01_FOUNDATIONS.md`
* [ ] Write `PHASE_02_POPULATION_AND_MAPPING.md`
* [ ] Update MASTERPLAN with dependency graph for layers

---

# **PHASE 02 — DATASETS & CURATION**

(Outline only — details to be filled in Phase 02 plan.)

## **Task Group 1: Populate Layer 2 Dataset**

* [ ] Curate evidence-backed styles
* [ ] Expand style metadata (axes bias, lexicon affinity, examples)

## **Task Group 2: Populate Layer 4 Dataset**

* [ ] Extract trends from research dataset
* [ ] Write full TOML entries for each trend
* [ ] Link to L1/L2/L3

## **Task Group 3: Tooling**

* [ ] Build cross-layer lookup utilities (TOML → JSON transformers)
* [ ] Create generation templates for AI designers/coders
* [ ] Create validation scripts (schema linting)
