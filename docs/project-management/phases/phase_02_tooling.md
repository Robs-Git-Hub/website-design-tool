# Phase 02 — Tooling & MVP Workflows

**Status:** Active  
**Stack:** TypeScript, React, Supabase, Tailwind  
**Previous Phase:** [Phase 01 - Foundations](phase_01_foundations.md)

---

## 1. Goal
Phase 01 established the **Data** (the taxonomy in TOML).
Phase 02 builds the **Engine** (the tooling) to make that data usable by humans and agents.

We are moving from a static knowledge graph to a dynamic **Aesthetic Operating System**.

---

## 2. Core Deliverables

### 2.1 The WAS Engine (TypeScript SDK)
We will build a strongly-typed library (`@was/engine`) to handle the logic of the schema.
*   **Loaders:** Parse TOML data into TypeScript interfaces.
*   **Validators (Zod):** Runtime schemas to ensure Bundles strictly adhere to the Registries.
*   **Flattener:** A logic engine that resolves high-level L2 Styles (e.g., "Glassmorphism") into specific L1 Axes (e.g., `geometry.depth = "glass"`).

### 2.2 The Aesthetic Playground (React UI)
**Initial approach:** Claude Artifact-based prototype, then production Next.js/Vite app.

*   **Orchestrator Interface:** Chat/prompt interface to test idea → WAS Bundle translation.
*   **Dynamic System Prompt:** Auto-generated from TOML schemas (stays in sync with data).
*   **Live JSON Preview:** See the generated `site_bundle.json` in real-time.
*   **Bundle Validation:** Ensure output matches schemas and registries.

**Future expansion (Phase 4):**
*   Full Next.js/Vite deployment
*   Visual bundle builder (drag-and-drop)
*   Live CSS/Tailwind visualizer
*   Vector search integration

---

## 3. Architecture

```mermaid
graph LR
    UserInput["User Prompt"] --> EdgeFunc[Supabase Edge Function]
    EdgeFunc --> Orchestrator[LLM (OpenAI/Claude)]
    Orchestrator --> Bundle[JSON Bundle]
    Bundle --> Validator[Zod Schema]
    Validator --> Engine[WAS Engine]
    Engine --> Tokens[Design Tokens / Tailwind]
    Tokens --> UI[React Component]
```

---

## 4. Success Criteria
Phase 02 is complete when we have a deployed **Playground URL** where:
1.  A user can select "Glassmorphism" + "Dark Mode" in a UI.
2.  The preview component updates instantly to reflect those settings.
3.  The system exports a valid JSON Bundle and Tailwind Config.