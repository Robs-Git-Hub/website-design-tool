# Website Aesthetic Schema (WAS) — Masterplan

**Version:** 0.5  
**Status:** Active (Entering Phase 02)  

---

# 1. Purpose & Vision

**The Website Aesthetic Schema (WAS)** creates a **shared language** that bridges Human Intent ("Vibes") and Machine Execution ("Specs").

The core vision is:
> **A structured, multi-layer system that represents “the feel of a website” in a machine-actionable format that humans can understand and AI systems can execute.**

---

# 2. Architecture: The Vibe & The Coal Face

We view the design process as a pipeline with three distinct states:

1.  **Input (The Idea):** Unrefined natural language or images.
2.  **Middle (The Vibe):** The **WAS Bundle**. A strategic aesthetic definition (Layers 1–4).
3.  **Output (The Coal Face):** Domain-specific execution specs (Skin, Skeleton, Imagery, Copy).

---

# 3. Phased Roadmap

### ✅ Phase 01 — Foundations (Complete)
*   **Goal:** Establish repository structure, schemas, registries, and MVP seed data.
*   **Outputs:** L1–L4 Schemas, Instance Data, Documentation.

### 🚧 Phase 02 — The First Link (Idea → Vibe)
*   **Goal:** Validate that a **High-Intelligence Reasoning LLM** can consistently translate "Ideas" into valid "WAS Bundles."
*   **Deliverables:**
    *   **System Prompt & Knowledge Base:** A prompting strategy that injects the Schemas/Examples and guides the LLM to *reason* about the design intent before generating JSON.
    *   **Conversion Tooling:** Utilities to convert LLM JSON output to TOML for storage.
    *   **Validation Engine:** A strict Code-based tool (Zod/Pydantic) to validate the generated JSON against the Registry.
    *   **Consistency Test Suite:** A harness to run 10+ iterations of the same input to measure Inter-Annotator Agreement (simulating "scientific fine-tuning").
*   **Completion Criteria:** We have a way to generate site Vibe Specs from multimodal Idea inputs using an LLM as the engine, and we have tested it with an acceptable pass rate (low bar).

### 🔮 Phase 03 — The Second Link (Vibe → Coal Face)
*   **Goal:** Develop the generative prompts and schemas to translate WAS Bundles into Industry Standard Specs.

#### Track A: The Skin (Theme Spec)
*   **Research:** Save the target theme spec (W3C Design Tokens `theme.json`) to the repo. Document why this format was chosen over alternatives.
*   **Development:** Write System Prompts that guide an LLM to translate abstract WAS traits (e.g., "Neon Accents") into concrete W3C Token values.
*   **Testing:** Conduct the same consistency/validity testing process as Phase 02.

#### Track B: The Skeleton (Layout Blueprint)
*   **Research:** Save the best existing SDUI systems (DivKit, Beagle, Relume) into `docs/references`.
*   **Decision:** Evaluate whether to adopt an existing schema or create a hybrid. Document the decision.
*   **Development:** Create the `blueprint_schema.toml`. Write System Prompts to guide an LLM to translate WAS "Context" into Layout Structures.
*   **Testing:** Conduct consistency testing.

#### Track C: Imagery & Graphics
*   **Research:** Investigate spec formats for photographers/designers (e.g., Midjourney parameters, Art Direction briefs).
*   **Development & Testing:** Same broad steps as Track B.

#### Track D: Copywriting
*   **Research:** Investigate spec formats for copywriters (e.g., Brand Voice Guidelines).
*   **Development & Testing:** Same broad steps as Track B.

### 🔮 Phase 04 — Productionise (MVP Site)
*   **Goal:** Turn the one-off scripts and prompts into a unified "Aesthetic Engine" (Small MVP Site).
*   **Scope:** A simple interface allowing users to input an idea, view/edit the Bundle, and download the compiled Coal Face specs.

### 🔮 Phase 05 — Deep Curation
*   **Goal:** Scale the knowledge graph.
*   **Scope:** Library of gold-standard Vibe Specs, expanded Lexicon, mood board examples.

---

# 4. Guiding Principles

- **Schemas at every layer.**
- **Generative Reasoning** handles the creation; **Code** handles the validation.
- **The Vibe != The Spec:** Strategy vs. Tactics.
- **Scientific Rigour:** Validation through reproducibility tests.
</file>

### 2. Correcting Phase 02 Documentation

I am updating the Phase 02 document to remove deterministic language ("logic") and emphasize the "Generative Reasoning" workflow.

<file path="docs/phases/phase_02_tooling.md">
# Phase 02 — The First Link (Idea → Vibe)

**Status:** Active  
**Focus:** Prompt Engineering, Validation, & Consistency Testing  
**Previous Phase:** [Phase 01 - Foundations](phase_01_foundations.md)

---

## 1. Goal
To validate that a **High-Intelligence Reasoning LLM** (e.g., GPT-4o, Claude 3.5) can consistently translate unrefined "Ideas" (Text/Images) into valid, high-quality **WAS Bundles** (`site_bundle.json`).

We are testing the **Generative Reasoning** capabilities of the model when constrained by our Schema.

---

## 2. Core Deliverables

### 2.1 The Orchestrator System Prompt
A comprehensive System Prompt that acts as the "Context Window" for the LLM.
*   **Knowledge Base Injection:** It must include condensed versions of L1-L4 Schemas and Registry allowed lists.
*   **Reasoning Instructions:** It should not be a list of hard rules, but a guide on how to *interpret* vague inputs. (e.g., "Analyze the cultural context of the request before selecting Layer 1 Axes").

### 2.2 Conversion & Validation Tooling
Since the LLM outputs JSON, we need code wrappers to handle the data.
*   **`toml_json_utils`:** Simple bidirectional conversion.
*   **`validate_bundle`:** A strict script (Zod/Pydantic) that acts as the "Guardrail." It does not create content; it rejects invalid hallucinations (e.g., non-existent styles, invalid enums).

### 2.3 The Consistency Test Suite (Scientific Validation)
A reproducible test harness to measure the stability of the generative process.
*   **Input:** 10 distinct design prompts (Multimodal).
*   **Method:** Run each prompt 10 times through the LLM (Total 100 runs).
*   **Analysis:** Compare the similarity of specific fields (e.g., `layer1.tone`) across runs.
    *   *Goal:* Verify that the prompt + schema produces a stable "center of gravity" for the aesthetic, even if specific details vary slightly.

---

## 3. Workflow

1.  **User** inputs an Idea.
2.  **System** constructs the Prompt (Idea + WAS Knowledge Base).
3.  **LLM** performs Generative Reasoning to synthesize a `site_bundle.json`.
4.  **Validator** checks the output against the Schema/Registry.
    *   *If Invalid:* The system prompts the LLM to fix the specific error.
    *   *If Valid:* The JSON is accepted and saved as TOML.
5.  **Human** reviews the result for quality (The "Acceptable Pass" bar).

---

## 4. Completion Criteria

Phase 02 is complete when:
1.  [ ] We have a working **System Prompt** that guides the LLM to produce rich, reasoning-backed specifications.
2.  [ ] We have **Validation Tooling** that prevents hallucinated data from entering the system.
3.  [ ] We have executed the **Consistency Test** and confirmed that the system is stable enough for an MVP.