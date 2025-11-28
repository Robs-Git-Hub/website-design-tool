# DESIGN NOTE (v0.2)

**Title:** The Vibe & The Coal Face: A Scientific Architecture for AI Design  
**Date:** 2025-11-21  
**Status:** Active Philosophy  
**Previous Version:** v0.1

---

## 1. Purpose of This Document

This note captures the core philosophy, technical reasoning, and multi-agent vision behind the **Website Aesthetic Schema (WAS)**. It describes a system where:

*   **Humans** can express intuitive intent ("vibes" or "unrefined ideas").
*   **The System** translates that intent into a structured **Vibe Spec** (WAS).
*   **Worker Agents** at the **"Coal Face"** convert that spec into professional assets (Code, Layouts, Imagery, Copy).

This document serves as the conceptual backbone for the project, defining not just *how* we build websites, but *how we measure* the consistency of AI design agents.

---

## 2. Motivation: The Translation Gap

### 2.1 The Human Problem
Most non-designers think in aesthetic categories and cultural references:
*   *“Sleek and modern”*
*   *“Like Apple but darker”*
*   *“Serious financial dashboard”*

There is an enormous gap between these "Vibes" and the technical definitions required to build them (`border-radius: 4px`, `grid-template-columns: 1fr 1fr`).

### 2.2 The AI Problem
Without a shared schema, AI models hallucinate inconsistencies. If you ask an Image Agent and a Code Agent for "Cyberpunk," one might generate "Gritty Dystopia" and the other "Clean Neon Purple."

**The Solution:** WAS acts as the **Governance Layer**. It turns taste into data (TOML/JSON), allowing a single "Vibe Spec" to drive all downstream production.

---

## 3. Architecture: Input → Middle → Output

We view the design process as a pipeline with three distinct stages.

### Stage A: The Input (Unrefined Idea)
*   **Nature:** Vague, subjective, multimodal.
*   **Format:** Natural language prompts, mood board images, raw URLs.
*   **Role:** The raw material.

### Stage B: The Middle (The Vibe Spec)
This is the **WAS Bundle (`site_bundle.toml`)**. It is the "Genetic Code" of the project.
*   **Layer 1 (Physics):** Universal dimensions (Tone, Density, Geometry).
*   **Layer 2 (Canon):** Named styles (Swiss, Brutalism).
*   **Layer 3 (Visual Traits):** Aesthetic atoms (Grain, Glass, Monospace).
*   **Layer 4 (Context):** Cultural trends (SaaS 2020, Dark Academia).

### Stage C: The Coal Face (Execution Specs)
The WAS Bundle is compiled into strict, domain-specific specifications for the "Worker Agents."

1.  **The Skin (Theme Spec):** Formal design tokens (Colors, Fonts, Spacing). Targets: *W3C Design Tokens / Tailwind.*
2.  **The Skeleton (Blueprint):** A layout structure (Hero, Grid, Navbar). Targets: *SDUI / Relume-style JSON.*
3.  **The Imagery:** Visual briefs for photographers or GenAI. Targets: *Midjourney Prompts.*
4.  **The Copy:** Tone-of-voice guidelines. Targets: *Copywriting LLMs.*

---

## 4. The Skin & The Skeleton

A key distinction in v0.2 is the separation of **Aesthetics** (Skin) from **Structure** (Skeleton).

*   **Layer 3 (Lexicon)** has been refactored to contain only **Visual Traits** (e.g., "Glass Panel", "Neon Accent").
*   **Layout Patterns** (e.g., "Sidebar", "Masonry Grid") have been moved to the **Blueprint System**.

This ensures that WAS describes *how it feels*, while the Blueprint describes *what it is*. The Orchestrator combines them to generate the final product.

---

## 5. The Scientific Method for Design

WAS is not just a taxonomy; it is a scientific instrument for validating AI behavior. Because we have a structured schema, we can run three specific tests:

### 5.1 The Input Consistency Test (Inter-Annotator Agreement)
*   **Hypothesis:** If WAS is objective, independent observers should describe the same site identically.
*   **Test:** Feed the same website image to 3 different LLMs. Do they generate the same WAS Bundle?
*   **Goal:** Validate that the taxonomy is grounded in reality, not hallucination.

### 5.2 The Mapping Reality Check (Empirical Grounding)
*   **Hypothesis:** Our definitions of styles (e.g., "Swiss Style") must match real-world usage.
*   **Test:** Analyze real datasets to confirm that sites labeled "Swiss Style" actually use "Grids" and "Grotesque Type."

### 5.3 The Output Determinism Test
*   **Hypothesis:** A Vibe Spec should produce predictable code.
*   **Test:** Feed the same WAS Bundle to different Code Agents. Do the resulting `theme.json` files look mathematically similar?

### ⚠️ The "Three Moving Parts" Warning
When validation fails (e.g., a bundle yields bad code), we must isolate the cause among three variables:
1.  **The Schema:** Is the taxonomy itself flawed or missing concepts?
2.  **The Prompt:** Did the system prompt fail to explain the schema to the model?
3.  **The Model:** Is the LLM inherently incapable of the reasoning required?

---

## 6. Why JSON & TOML?

We continue to separate **Authorship** from **Operation**.

*   **TOML (The Knowledge):** Used for the Knowledge Graph (L1-L4 definitions). Readable, comment-friendly.
*   **JSON (The Operation):** Used for the Coal Face (Theme Specs, Blueprints). Strict, machine-parsable.

---

## 7. Conclusion

This project turns **Taste into Data**.

1.  **Idea** → WAS Bundle (Vibe)
2.  **Bundle** → Coal Face Specs (Skin + Skeleton)
3.  **Specs** → Production Assets

It allows a solo builder to act as a Creative Director, managing a team of AI specialists via a single, rigorous source of truth.