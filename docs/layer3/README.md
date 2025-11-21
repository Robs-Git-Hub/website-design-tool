# Layer 3: Visual Traits (The Atoms)

**Atomic aesthetic qualities that define the Skin.**

---

## 1. Concept

Layer 3 is the **"Vocabulary"** of the Vibe. It consists of the specific visual atoms that color the design. While Layer 2 says "Glassmorphism" (The School), Layer 3 says "Frosted Glass Panel" and "Mesh Gradient" (The Ingredients).

### The "Skin vs. Skeleton" Rule (v0.2)

Layer 3 is strictly scoped to **Visual Aesthetics**.

*   **INCLUDED:** Texture, Shape Character, Color Dynamics, Light Mood. (Things that go into `theme.json` or `tailwind.config.js`).
*   **EXCLUDED:** Layout Patterns (Sidebars, Grids). These belong to the **Blueprint** (Skeleton).

## 2. The 8 Kinds of Visual Traits

To keep the lexicon organized, every term belongs to a specific `kind` that maps to a domain of the Theme Specification.

| Kind                   | Description                                          | Examples                                     |
| :--------------------- | :--------------------------------------------------- | :------------------------------------------- |
| `visual_atmosphere`    | The sensory environment, lighting, and air density.  | `golden_hour`, `clinical_sterile`, `misty`   |
| `palette_trait`        | The mood or dynamic of the colors (not specific hex codes). | `neon_accents`, `pastel_palette`, `muted_earth` |
| `surface_texture`      | The tactile quality of backgrounds and containers.   | `glass_panel`, `grain_texture`, `mesh_gradient` |
| `component_styling`    | The geometric character of interactive elements.     | `pill_shape`, `sharp_corner`, `ghost_outline` |
| `depth_technique`      | The approach to elevation and shadows.               | `hard_shadow`, `diffuse_glow`, `inner_shadow` |
| `typography_mechanics` | Stylistic categorization of type.                    | `mono_ui`, `display_serif`, `uppercase_headers` |
| `motion_mechanics`     | The physics personality of transitions.              | `spring_bouncy`, `linear_instant`            |
| `illustration_style`   | Art direction for imagery.                           | `isometric_3d`, `flat_spot`, `collage`       |

## 3. Mappings (The Connective Tissue)

Layer 3 Terms are "Smart Atoms." They carry metadata that helps the Orchestrator translate them into Specs.

*   **Axes Bias:** A term like `neon_accents` automatically biases the L1 Physics towards `color_strategy="high_chroma"` and `tone="playful"`.
*   **Style Affinity:** A term like `glass_panel` has a 1.0 affinity with the `glassmorphism` L2 Style.

## 4. Usage in Bundles

In a `site_bundle.toml`, Layer 3 acts as the **Fine-Tuning** layer. It tells the Coal Face agents exactly how to interpret the high-level Vibe.

```toml
[layer3_lexicon]
visual_atmosphere = "clinical_sterile"
component_styling = "sharp_corner"
typography_mechanics = "grotesque_sans"
```

**Translation Logic:**

*   **Code Agent** sees `sharp_corner` -> Sets `--radius-base: 0px`.
*   **Image Agent** sees `clinical_sterile` -> Prompts "High-key lighting, white laboratory aesthetic."