# User Stories (v1.1)

**Theme:** Humans + AI Agents as First-Class Users  
**Core Principles:** No preference lock-in • JSON/TOML as interface • Multi-agent design system  

---

## 🧑‍💼 Epic 1: Human Creator Experience
*Focus: Intention, Visualization, and Control*

### 1. Describe vibes, not technical details
**As a** non-designer  
**I want to** describe my desired website aesthetic in ordinary language (e.g., “sleek dark sci-fi”, “warm Scandinavian”, “retro Y2K”)  
**So that** the system can translate my intent into a precise, machine-readable aesthetic specification (JSON/TOML).

### 2. Show me options visually so I can react
**As a** human who decides by seeing  
**I want to** view moodboards, mockups, and style examples  
**So that** I can choose or reject directions without knowing CSS or design theory.

### 3. Give me real-world examples
**As a** human unfamiliar with design jargon  
**I want** the system to find existing websites that match each aesthetic direction  
**So that** I can compare real implementations and learn what terms mean.

### 4. Don’t lock me into past taste
**As a** user who may try different designers or styles  
**I want** previous aesthetic bundles to be available but never assumed  
**So that** I can explore new directions without the system drifting toward previous preferences.

### 5. Use JSON so everything is reproducible
**As a** user who works with multiple AI tools  
**I want** aesthetic instructions encoded in consistent JSON  
**So that** outputs from ChatGPT, image models, and coding assistants remain stable and repeatable.

### 6. Let me switch designers easily
**As a** user experimenting with different agents or design workflows  
**I want** the ability to generate aesthetic specs independent of any particular agent  
**So that** I can hand the same JSON bundle to a human designer, an AI UI designer, or a coding agent interchangeably.

### 7. Let me start from scratch anytime
**As a** user  
**I want** a “Fresh Start Mode” that wipes all preference influence  
**So that** each new project begins clean unless I explicitly import a previous aesthetic bundle.

---

## 🤖 Epic 2: AI Agent Requirements
*Focus: Structure, Determinism, and Constraints*

### 8. Image Generator Agent — “Give me structure, not prose”
**As an** image-generation agent (e.g., DALL·E or SDXL)  
**I want** a structured JSON aesthetic spec  
**So that** I can produce consistent moodboards and UI previews without drifting across styles or misinterpreting adjectives.

### 9. UI Designer Agent — “Give me interpretable tokens”
**As a** UI-design AI  
**I want** design axes, style affinities, and lexicon terms mapped to usable design primitives  
**So that** I can produce component kits, layout structures, and theme tokens that match the described vibe.

### 10. Coding Assistant Agent — “I need deterministic mappings”
**As a** coding agent (e.g., GPT-5 Code, Claude Code)  
**I want** a consistent mapping from JSON/TOML fields to Tailwind, CSS variables, spacing, radii, elevation, and shadows  
**So that** I can generate UI code that faithfully matches the aesthetic spec and remain consistent across iterations.

### 11. Search Agent — “Give me multi-layer aesthetics”
**As a** search agent  
**I want** a full aesthetic bundle (Layers 1–4)  
**So that** I can find real websites, gallery examples, design systems, or screenshots that match the desired aesthetic.

### 12. Evaluation Agent — “I adapt only when told to”
**As an** evaluation agent  
**I want** to update aesthetic JSON bundles only when the human explicitly approves changes  
**So that** the system respects user control and avoids accidental preference-lock-in.

### 13. Preference-Inference Agent — “I store, but I never impose”
**As an** inference agent  
**I want** to cluster and store previous aesthetic bundles  
**So that** they’re available for reuse, but I must never apply them automatically or bias new projects unless the human opts in.

### 14. Token Generator Agent — “Turn semantics into variables”
**As a** design-token generator  
**I want** structured aesthetics translated into tailwind.config overrides, CSS vars, spacing scales, and radii  
**So that** other agents (design + code) can use a consistent implementation layer.

### 15. Web Builder Agent — “Give me full declarative design”
**As an** end-to-end web builder AI  
**I want** a complete aesthetic bundle describing tone, layout density, palette, depth, and decorative strategy  
**So that** I can build a fully styled web skeleton consistent with user intent and moodboard direction.

---

## 🔁 Epic 3: Cross-Agent Workflows
*Focus: Loops, Handoffs, and Alignment*

### 16. Human + Image Agent — Visual exploration loop
**As a** human  
**I want** the system to generate multiple visual variations (A/B/C)  
**So that** I can express preference by selection and the aesthetic JSON updates accordingly (only if I approve).

### 17. Human + Search Agent — Example retrieval loop
**As a** human  
**I want** to browse real-world examples and say “more like this” or “less like that”  
**So that** the system can refine the aesthetic bundle with grounded, real references.

### 18. Designer Agent + Coding Agent — No-Drift Handoff
**As** cooperating designer and coding AIs  
**We want** to rely on the same JSON/TOML specification  
**So that** the design intent stays intact when moving from mood → components → layout → code.

### 19. Orchestrator Agent — Keep agents aligned
**As an** orchestrator  
**I want** all agents to use the same aesthetic bundle  
**So that** outputs remain aligned and no agent introduces contradictory interpretations.

### 20. Human + Multi-Agent System — Conscious style reuse
**As a** human  
**I want** to optionally import previous bundles (“Use the SaaS-2018 aesthetic from last month”)  
**So that** I can reuse good directions but only when I explicitly choose to do so.

### 21. Human + Preference Agent — Preserve exploration freedom
**As a** user  
**I want** the system to support radically different design experiments from project to project  
**So that** I don’t get “locked into” a personal style unless I intentionally reuse it, ensuring creative exploration stays open.