# Layer 3: The Lexicon (The Atoms)

**Granular Visual Terms & Component Traits.**

---

## 1. Concept
Layer 3 is the **"Vocabulary"** of the system. It consists of the specific visual atoms that make up a style. While Layer 2 says "Glassmorphism," Layer 3 says "Mesh Gradient" and "Backdrop Blur."

This layer is crucial for **Search Agents** (finding specific examples) and **Coding Agents** (implementing specific tokens).

## 2. Kinds of Terms
To keep the lexicon organized, every term belongs to a specific `kind`:

| Kind | Description | Examples |
| :--- | :--- | :--- |
| `color_strategy` | Specific palette types. | `pastel_palette`, `duotone` |
| `texture_pattern` | Surface treatments. | `grain_texture`, `mesh_gradient` |
| `component_chrome` | UI element styling. | `pill_button`, `ghost_button` |
| `typography_style` | Font treatment. | `mono_ui_type`, `display_serif` |
| `motion_style` | Animation behavior. | `springy_motion`, `parallax` |

## 3. Mapping (Affinity & Bias)
Every Term maps to the layers above it.
*   **Axes Bias:** `pill_button` implies `geometry_depth.shape = rounded`.
*   **Style Affinity:** `pill_button` is highly correlated with `mobile_app_design` (hypothetical).

## 4. Usage in Bundles
Layer 3 terms act as **Micro-Instructions**.

```toml
[layer3_lexicon]
button_style = "ghost_button"
background_texture = "grain_texture"
```

This gives the Orchestrator fine-grained control over specific UI elements without rewriting the entire style definition.