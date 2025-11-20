# Phase 01 — Foundations
**Status:** Complete
**Version:** 1.0

---

# 1. Goal of this Phase

Establish the foundational structure of the Website Aesthetic Schema (WAS) repository.
This means:

- Creating directories and naming conventions
- Writing all four schemas (L1–L4)
- Creating initial instance files (Seed Data)
- Setting up registries to prevent data drift
- Setting up planning & task documents
- Ensuring a clean TOML-based architecture

This phase focused on **structure and logic**, paving the way for tooling.

---

# 2. Deliverables (Delivered)

### **2.1 Repository Structure**
Directories created:
- `/schema` (The Rules)
- `/data` (The Instances)
- `/registries` (The Allowed Lists)
- `/docs` (The Manual)
- `/examples` (Sample Bundles)

### **2.2 TOML Schemas**
- `schema/layer1_dimensions_schema.toml`
- `schema/layer2_web_style_family_schema.toml`
- `schema/layer3_style_lexicon_schema.toml`
- `schema/layer4_societal_trends_schema.toml`
- `schema/sources_registry_schema.toml`

### **2.3 Instance Files (Seed Data)**
- `data/layer1_dimensions_instances.toml`
- `data/layer2_website_style_family_instances.toml`
- `data/layer3_style_lexicon_instances.toml`
- `data/layer4_societal_trends_instances.toml`

### **2.4 Registries**
- `registries/layer2_website_style_family_registry.toml`

### **2.5 Documentation**
- `masterplan.md` (v0.2)
- `docs/vision/design_note_vision.md`
- `docs/user_stories.md`
- `docs/conventions/` (Formatting & Interop)
- Layer-specific READMEs

---

# 3. Tasks & Task Groups

## **Task Group 1 — Repo & Directory Setup**
- [x] Create folder structure
- [x] Add naming conventions (`_schema`, `_instances`)
- [x] Add root README
- [x] Configure `.gitignore`

## **Task Group 2 — Schema Creation**
- [x] Finalise Layer 1 Dimensions Schema
- [x] Finalise Layer 2 Style Family Schema
- [x] Finalise Layer 3 Lexicon Schema
- [x] Finalise Layer 4 Societal Trends Schema

## **Task Group 3 — Instance Files**
- [x] Populate L1 Dimensions
- [x] Populate L2 Styles (Seed set)
- [x] Populate L3 Lexicon (Seed set)
- [x] Populate L4 Trends (Seed set)

## **Task Group 4 — Planning Docs**
- [x] Add masterplan.md
- [x] Add user_stories.md
- [x] Add design_note_vision.md
- [x] Create TASKS.md

---

# 4. Completion Criteria

Phase 01 is complete when:

- [x] All schema files exist.
- [x] All instance files exist with seed data.
- [x] The repo is ready for tooling development.
- [x] Documentation is sufficient for an AI (or human) to onboard instantly.
- [x] The project can transition into **Phase 02 — Tooling & MVP Workflows**.

---

# 5. Notes

The strategy was pivoted during this phase:
*   **Original Plan:** Phase 02 was "Deep Curation" (More Data).
*   **New Plan:** Phase 02 is "Tooling" (Making the data work).
*   **Reasoning:** We have enough data to build the engine; adding more data now yields diminishing returns without a way to visualize or test it.