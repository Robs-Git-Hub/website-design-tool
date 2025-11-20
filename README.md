# Website Aesthetic Schema (WAS)

**A Unified, Machine-Actionable Aesthetic Language for Human–AI Multi-Agent Design.**

![Status: Phase 01 - Foundations](https://img.shields.io/badge/Status-Phase_01_Foundations-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

**WAS (Website Aesthetic Schema)** is a structured taxonomy and protocol designed to bridge the gap between **human intent** ("I want a sleek, dark sci-fi vibe") and **machine implementation** (`border-radius: 4px; background: #0f172a`).

It provides a shared vocabulary (Lexicon) and a rigorous structure (Schema) that allows **Orchestrators, Image Generators, UI Designers, and Coding Agents** to collaborate on a website project without "drifting" or misinterpreting the aesthetic goal.

### The Problem
*   **Humans** think in vibes and cultural references (*"Make it pop," "Like Apple but darker," "Y2K aesthetic"*).
*   **AI Agents** need explicit constraints (*"Tailwind slate-900," "Gaussian blur 12px," "Space Grotesk font"*).
*   **Result:** Without a shared protocol, multi-agent workflows fragment. The coder builds something clean while the image generator draws something gritty.

### The Solution
WAS acts as the **Translation Layer**. It turns taste into data (TOML/JSON), allowing an orchestrator to lock in a specific "Aesthetic Bundle" that serves as the single source of truth for all downstream agents.

---

## 🏗 Architecture: The 4-Layer Model

The schema is organized into four hierarchical layers, moving from abstract physical properties to specific cultural contexts.

| Layer | Name | Function | Examples |
| :--- | :--- | :--- | :--- |
| **L1** | **Axes** (The Physics) | Universal, measurable dimensions of any interface. | Tone, Density, Lightness, Geometry, Color Strategy. |
| **L2** | **Styles** (The Canon) | Evidence-backed, named design schools. | Glassmorphism, Swiss Style, Brutalism, Material Design. |
| **L3** | **Lexicon** (The Atoms) | Granular visual terms and component traits. | Mesh gradients, pill buttons, monospace type, blur effects. |
| **L4** | **Trends** (The Context) | Societal and cultural moments. | AI Startup 2024, Dark Academia, Y2K Revival, Hygge. |

---

## 📂 Repository Structure

```text
.
├── data/                       # Canonical instance data (The Knowledge Graph)
│   ├── layer1_dimensions_instances.toml
│   ├── layer2_website_style_family_instances.toml
│   ├── layer3_style_lexicon_instances.toml
│   └── layer4_societal_trends_instances.toml
│
├── schema/                     # Structure definitions (The Rules)
│   ├── layer1_dimensions_schema.toml
│   ├── layer2_web_style_family_schema.toml
│   ├── layer3_style_lexicon_schema.toml
│   └── layer4_societal_trends_schema.toml
│
├── registries/                 # Allowed value lists to prevent drift
│   └── layer1_dimensions_registry.toml
│
├── docs/                       # Documentation & Vision
│   ├── design_note_vision.md   # Core philosophy
│   ├── user_stories.md         # Agile stories for agents & humans
│   ├── masterplan.md           # Long-term roadmap
│   └── phases/                 # Project phase tracking
│
└── examples/                   # Sample Bundles (Runtime payloads)
    └── bundles/
        └── site_01_nebula_ai.toml
```

---

## 🚀 Usage & Workflow

This repository is primarily a **Knowledge Base** and **Schema Definition**. In a production environment, an AI Orchestrator uses this data to generate **Aesthetic Bundles**.

### The Workflow
1.  **Human Input:** "I want a dashboard that feels like a futuristic glass cockpit."
2.  **Orchestrator:** Consults the `data/` files to map this request to L1 Axes (Dark, Geometric), L2 Styles (Glassmorphism), and L3 Lexicon (Blur, HUD-lines).
3.  **Bundle Generation:** Creates a JSON/TOML payload (The Bundle).
4.  **Execution:**
    *   **Image Agent:** Reads bundle -> Generates Moodboard.
    *   **Code Agent:** Reads bundle -> Generates `tailwind.config.js`.

### Example Bundle Snippet (TOML)
*See `examples/bundles/` for full files.*

```toml
[layer1_axes]
tone = "techy"
lightness = "dark"
geometry_depth = { shape = "sharp", depth = "glass" }

[layer2_styles]
glassmorphism = 0.8
retro_futurism = 0.4

[layer3_lexicon]
background_texture = "mesh_gradient"
button_style = "ghost_button"
typography = "mono_ui_type"
```

---

## 🔮 Roadmap

We are currently in **Phase 01: Foundations**.

- [x] **Phase 01:** Establish Schema, Directory Structure, and Core Instances.
- [ ] **Phase 02:** Deep Curation (Expand L3 Lexicon to 200+ terms, Add L4 Trends).
- [ ] **Phase 03:** Tooling (Validators, Bundle Generators, JSON Transformers).
- [ ] **Phase 04:** Agent Integration (Prompt templates for OpenAI/Claude/Midjourney).

See `docs/masterplan.md` for the detailed roadmap.

---

## 🤝 Contributing

This aesthetic ontology is curated.
1.  **New Terms:** If adding a new style or lexicon term, ensure it is distinct (MECE) and widely evidenced.
2.  **Format:** All data must be strictly typed TOML following the schemas in `schema/`.
3.  **Drift:** Do not modify Layer 1 Axes without a major version discussion.

---

## 📄 License

MIT License. See `LICENSE` for details.