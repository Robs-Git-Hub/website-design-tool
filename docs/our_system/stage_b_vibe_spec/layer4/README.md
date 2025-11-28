# Layer 4: Societal Trends (The Context)

**Cultural Vibes & Zeitgeist Moments.**

---

## 1. Concept
Layer 4 captures the **"Culture"** surrounding a design. Unlike Layer 2 (which is strictly about visual technique), Layer 4 describes *who* uses the design and *when* it was popular.

Humans often prompt using trends: *"Make it look like a 2020 SaaS startup"* or *"Give me a Dark Academia vibe."*

## 2. Taxonomy of Trends
Trends are categorized by their origin:

*   **Era Aesthetic:** `y2k_aesthetic` (Time-bound)
*   **Subculture:** `dark_academia`, `cottagecore` (Community-bound)
*   **Industry Archetype:** `saas_startup_2020`, `fintech_dashboard` (Sector-bound)
*   **Lifestyle:** `hygge`, `minimalism_lifestyle` (Value-bound)

## 3. The "Vibe-to-Spec" Pipeline
Layer 4 is the entry point for human "Vibes."

1.  Human says: "Make it **Dark Academia**." (Layer 4)
2.  System looks up `dark_academia`.
3.  System sees affinity: `serif_typography` (L3) + `serious_tone` (L1) + `skeuomorphism` (L2).
4.  System generates a bundle based on those lower-layer primitives.

## 4. Usage
This layer is primarily used by the **Orchestrator** (to interpret prompts) and the **Search Agent** (to find culturally relevant examples). It is rarely used directly by the Code Agent.