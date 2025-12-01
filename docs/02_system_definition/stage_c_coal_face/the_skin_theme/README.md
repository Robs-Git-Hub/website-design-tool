# The Skin (Theme Specification)

**Design tokens that define the visual surface of a website.**

---

## Purpose

The Skin translates WAS visual traits (Layer 3) into concrete design tokens:

- **Colors** — Primary, secondary, accent, semantic (error, success, etc.)
- **Typography** — Font families, sizes, weights, line heights
- **Spacing** — Padding, margins, gaps
- **Effects** — Shadows, borders, radii, blur

---

## Target Formats

| Format | Description |
|--------|-------------|
| `theme.json` | W3C Design Tokens specification |
| `tailwind.theme.js` | Tailwind CSS theme configuration |

---

## Research

See [existing_theme_token_formats/](./research/existing_theme_token_formats/) for research into:

- W3C Design Tokens specification
- Style Dictionary
- Tailwind CSS theme structure
- Other design token standards

**Status:** Research pending — see [Phase 03 Tasks](../../../06_project_management/TASKS.md)

---

## See Also

- [The Skeleton](../the_skeleton_blueprint/) — Layout structure specs
- [Layer 3: Visual Traits](../../stage_b_vibe_spec/layer3/) — Source aesthetic atoms
