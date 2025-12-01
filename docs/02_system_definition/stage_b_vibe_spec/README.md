# Stage B: The Vibe Spec (WAS Bundle)

The **WAS Bundle** (`site_bundle.toml`) is the structured output of Stage A translation. It is the "genetic code" of a website's aesthetic — a machine-readable specification that drives all downstream production.

---

## The Four Layers

The Vibe Spec is organized into four hierarchical layers:

| Layer | Name | Description |
|-------|------|-------------|
| [Layer 1](./layer1/) | **The Axes (Physics)** | Universal dimensions: Tone, Density, Geometry, etc. |
| [Layer 2](./layer2/) | **Style Families (Canon)** | Named schools: Swiss, Brutalism, Glassmorphism, etc. |
| [Layer 3](./layer3/) | **Visual Traits (Atoms)** | Aesthetic atoms: Glass Panel, Neon Accent, Grain, etc. |
| [Layer 4](./layer4/) | **Societal Trends (Context)** | Cultural moments: SaaS 2020, Dark Academia, etc. |

---

## Example Bundle

```toml
[layer1_axes]
tone = "serious"
density = "balanced"
geometry = { shape = "rounded", depth = "subtle" }

[layer2_style_families]
primary = "swiss_international"
secondary = "minimalism"

[layer3_visual_traits]
texture = ["subtle_grain"]
color_dynamics = ["muted_palette"]

[layer4_societal_trends]
active = ["corporate_rebrand_2024"]
```

---

## See Also

- [Stage A: The Input](../stage_a_the_input/) — Raw user intent
- [Stage C: Coal Face Specs](../stage_c_coal_face/) — Design tokens and blueprints
- [Bundle Schema](../../../schema/site_bundle_schema.toml) — TOML schema definition
