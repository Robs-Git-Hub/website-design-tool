# Website Aesthetic Schema (WAS)

**A Unified, Machine-Actionable Aesthetic Language for Human–AI Multi-Agent Design.**

![Status: Phase 02 - The First Link](https://img.shields.io/badge/Status-Phase_02_Active-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

**WAS (Website Aesthetic Schema)** is a structured taxonomy and protocol designed to bridge the gap between **human intent** ("I want a sleek, dark sci-fi vibe") and **machine implementation** (`border-radius: 4px; background: #0f172a`).

It provides a shared vocabulary (Lexicon) and a rigorous structure (Schema) enabling **Orchestrators** to capture design intent in a “Vibe Spec,” which becomes the single source of truth across **Image Generators, UI Designers, and Coding Agents**.

### The Problem

- **Humans** think in vibes and cultural references (*"Make it pop," "Apple but darker," "Y2K aesthetic"*).
- **AI Agents** need explicit constraints (*Tailwind slate-900, blur 12px, Space Grotesk*).
- Without a protocol, multi-agent workflows diverge: the coder builds something clean while the image generator produces something gritty.

### The Solution

WAS acts as the **Translation Layer**. It turns taste into data (TOML/JSON) through a formal **WAS Bundle** that captures the aesthetic blueprint for all downstream agents.

---

## 🏗 Architecture: The Vibe & The Coal Face

WAS distinguishes between the **Strategic Vibe** (WAS Bundle) and the **Execution Specs** (Coal Face).

| Stage | Concept | Artifact | Function |
|-------|---------|-----------|----------|
| **1. Input** | The Idea | `prompt` / image | Raw human intent. |
| **2. Middle** | The Vibe | `site_bundle.toml` | Strategic aesthetic (Layers 1–4). |
| **3. Output** | The Coal Face — Skin | `theme.json` | Design Tokens (Color, Typography). |
| **3. Output** | The Coal Face — Skeleton | `blueprint.toml` | Layout & Interaction rules (SDUI-inspired). |

---

## 🧬 The 4 Layers of the Vibe (WAS)

| Layer | Name | Function | Examples |
|-------|-------|-----------|-----------|
| **L1** | Axes (Physics) | Universal constraints. | Tone, Density, Lightness, Geometry. |
| **L2** | Styles (Canon) | Named design schools. | Glassmorphism, Swiss Style, Brutalism. |
| **L3** | Lexicon (Visuals) | Atomic design traits. | `glass_panel`, `neon_accents`. |
| **L4** | Trends (Context) | Cultural/social moments. | SaaS 2020, Y2K Revival, Dark Academia. |

---

## 📂 Repository Structure

```text
.
├── data/
│   ├── layer1_dimensions_instances.toml
│   ├── layer2_website_style_family_instances.toml
│   ├── layer3_style_lexicon_instances.toml
│   └── layer4_societal_trends_instances.toml
│
├── schema/
│   ├── layer1_dimensions_schema.toml
│   ├── layer2_web_style_family_schema.toml
│   ├── layer3_style_lexicon_schema.toml
│   ├── layer4_societal_trends_schema.toml
│   └── site_bundle_schema.toml
│
├── blueprint/
│   ├── page_blueprint_schema.toml
│   └── component_registry.toml
│
├── docs/
│   ├── vision/design_note.md
│   ├── masterplan.md
│   └── phases/
│
└── examples/
    └── bundles/
        └── site_02_corp_finance.toml
````

---

## 🚀 Usage & Workflow

WAS is a knowledge base and schema system used by an AI Orchestrator to create production-grade aesthetic specs.

### Workflow

1. **Human Input:** “A futuristic glass cockpit dashboard.”
2. **Orchestrator:** Maps keywords to a **WAS Bundle** (e.g., L1 Dark, L3 Glass Panel).
3. **Translator:** Compiles the Bundle into **Coal Face** outputs:

   * Style → Skin tokens
     `glass_panel` → `backdrop-filter: blur(10px); background: rgba(255,255,255,0.1);`
   * Axes → Layout
     Density: `dense` → `gap: 4px;`
4. **Execution:** Worker agents (Coder, Image Gen, SDUI Renderer) consume those specs.

### Example Bundle Snippet

```toml
[meta]
intent_keywords = ["cockpit", "futuristic", "hud"]

[layer1_axes]
tone = "techy"
lightness = "dark"
geometry_depth = { shape = "sharp", depth = "glass" }

[layer2_styles]
glassmorphism = 0.8
retro_futurism = 0.4

[layer3_lexicon]
visual_atmosphere = "cinematic_dark"
surface_texture = "mesh_gradient"
component_styling = "ghost_outline"
typography_mechanics = "mono_ui"
```

---

## 🔮 Roadmap

* [x] **Phase 01 — Foundations:** Core schema & directories.
* [ ] **Phase 02 — The First Link:** Idea → WAS Bundle consistency tests.
* [ ] **Phase 03 — The Second Link:** WAS Bundle → Design Tokens & Blueprints.
* [ ] **Phase 04 — Productionise:** Build the Aesthetic Engine MVP.
* [ ] **Phase 05 — Deep Curation:** Expand instances (50+ styles, 200+ lexicon terms).

See `docs/masterplan.md` for more.

---

## 🤝 Contributing

1. **New Terms:** Must be distinct and externally evidenced.
2. **Skin vs Skeleton:** Layout rules belong in Blueprint, not Lexicon.
3. **Stability:** Layer 1 Axes should not change without a major version bump.

---

## 📄 License

MIT License. See `LICENSE` for details.