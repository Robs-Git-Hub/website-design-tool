# DESIGN NOTE (v0.1)

**Title:** A Unified, Machine-Actionable Aesthetic Language for Human–AI Multi-Agent Website Creation  
**Date:** 2025-05-20  
**Status:** Foundational Concept  

---

## 1. Purpose of This Document

This note captures the core philosophy, technical reasoning, and multi-agent vision behind the **Website Aesthetic Schema (WAS)**. It describes a system where:

*   **Humans** can express intuitive intent ("vibes"),
*   **AI design agents** can interpret that intent structurally,
*   **Image generators** can render visual previews,
*   **Coding assistants** can implement reproducible UI,
*   **Search agents** can retrieve grounded examples.

This document records why JSON/TOML is the chosen foundation, how the taxonomy ties the ecosystem together, and the workflows it enables. It serves as the conceptual backbone for the project's README and technical architecture.

---

## 2. Motivation: The Human Problem × The AI Problem

### 2.1 Humans want clarity, not complexity
Most non-designers (and many professionals) do not think natively in implementation tokens like `border-radius`, `z-index`, `HSL coordinates`, or `grid-gap`.

Instead, humans think in aesthetic categories and vibes:
*   *“Sleek and modern”*
*   *“Warm Scandinavian”*
*   *“Retro-futuristic neon”*
*   *“Serious and institutional”*

There is an enormous gap between how humans express taste and how UIs are technically implemented.

### 2.2 AI models respond better to structure than prose
Across all model families (LLMs, Diffusion, Code Models), practitioners have found that AI systems perform dramatically better when guided by **structured prompts** rather than loose natural language.

**JSON/TOML structures:**
*   Remove ambiguity.
*   Prevent "hallucination" of non-existent styles.
*   Allow reusable templates (Inheritance).
*   Enable different agents to share a strict schema.
*   Make iterative refinement possible (diffing a JSON is easier than diffing a paragraph).

**The Solution:** A structured semantic language for aesthetics that bridges human "vibes" with machine "variables."

---

## 3. The Vision: A Shared Aesthetic Language Across All Agents

We are establishing a system where every actor in the website creation process speaks the same vocabulary via a shared JSON/TOML protocol.

### 3.1 Key Actors ("First-Class Citizens")

1.  **The Human (You):** Expresses intent, selects examples, rejects directions.
2.  **The Orchestrator:** The central reasoning brain; interprets human input into the WAS protocol.
3.  **The Image Generator:** Renders moodboards and visual previews based on the schema.
4.  **The Design/UI Builder:** Converts aesthetics into component structures, tokens, and palettes.
5.  **The Coding Assistant:** Translates aesthetic choices into Tailwind classes, CSS variables, and React code.
6.  **The Search Agent:** Finds real-world references that match the semantic description.
7.  **The Evaluator:** Updates the aesthetic JSON based on human feedback (preference learning).

---

## 4. The Translation Problem (and How We Solve It)

Without a shared vocabulary, multi-agent systems break down:
*   *Image Agent* draws "Cyberpunk" as gritty and dirty.
*   *Code Agent* builds "Cyberpunk" as neat purple gradients.
*   *Human* meant "High-tech corporate."

**The WAS Protocol acts as a lossless translation layer:**

*   **Layer 1: Core Axes** (The Physics)
    *   Universal dimensions: Tone, Density, Geometry, Color Strategy.
*   **Layer 2: Named Styles** (The Canon)
    *   Defined schools: Glassmorphism, Swiss Style, Brutalism.
*   **Layer 3: Lexicon** (The Atoms)
    *   Granular visuals: Mesh gradients, pill buttons, monospace type.
*   **Layer 4: Trends** (The Culture)
    *   Societal vibes: Y2K, Dark Academia, SaaS 2020.

This structure ensures **Semantic Coverage** (nothing is missing) and **MECE Structure** (no overlapping ambiguity).

---

## 5. Why JSON & TOML?

We separate **Authorship** from **Operation**.

### 5.1 TOML for Knowledge (The "Cold" Layer)
Used for taxonomies, long-term storage, human curation, and configuration.
*   **Why:** It supports comments, is highly readable, and handles complex nested tables elegantly.

### 5.2 JSON for Operations (The "Hot" Layer)
Used for agent prompting, API payloads, and runtime state.
*   **Why:** Strict validation, ubiquitous support in LLMs, easy to parse programmatically.

This mirrors modern infrastructure-as-code patterns (e.g., Terraform, Kubernetes), treating **Aesthetics as Code**.

---

## 6. User Journeys

### A) Human → Moodboard
*   *Human:* "I want a dark, glowing sci-fi look."
*   *System:* Generates JSON spec combining `Dark Mode` + `Glassmorphism` + `Neon Accents`.
*   *Image Agent:* Renders 4 distinct moodboards based on that exact JSON.

### B) Human → Real Examples
*   *Human:* "Like this, but more serious."
*   *Search Agent:* Uses the JSON spec to query a vector database of existing websites, retrieving real-world examples that match the *structure*, not just keywords.

### C) Human → Live Skeleton
*   *System:* Passes the validated JSON to the Coding Agent.
*   *Coding Agent:* Generates a `tailwind.config.js` and a `Layout.tsx` that mathematically match the `Density` and `Geometry` settings in the spec.

---

## 7. Conclusion

This project turns **Taste into Data**.

1.  Taste → JSON
2.  JSON → Design Tokens
3.  Design Tokens → UI Code
4.  UI Code → Visual Output
5.  Feedback → Updated JSON

It is a governance layer for AI design, ensuring that multiple agents can cooperate on a creative task without losing the human's original intent.