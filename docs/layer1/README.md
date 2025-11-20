# Layer 1: The Axes (The Physics)

**Universal Dimensions of User Interface Design.**

---

## 1. Concept
Layer 1 describes the **"Physics"** of a user interface. These are the fundamental, measurable dimensions that every interface possesses, regardless of its specific style or era.

Just as every physical object has mass and volume, every UI has a **Density** and a **Tone**.

## 2. The Six Canonical Axes

The system is defined by exactly six dimensions. This list is fixed (canonical) and defined in the Registry.

| Axis | Type | Description | Example Values |
| :--- | :--- | :--- | :--- |
| **Tone** | Ordinal | The emotional formality. | `playful`, `neutral`, `serious`, `premium` |
| **Lightness** | Categorical | The global brightness strategy. | `light`, `dark`, `hybrid`, `adaptive` |
| **Color Strategy** | Categorical | The scope of the palette. | `monochrome`, `neutral_plus_accent`, `high_chroma` |
| **Density** | Ordinal | Information per screen area. | `airy`, `balanced`, `dense`, `maximal` |
| **Decoration** | Ordinal | Level of ornamental detail. | `plain`, `subtle`, `decorative`, `experimental` |
| **Geometry** | Compound | Shape language + Depth simulation. | `shape: rounded`, `depth: glass` |

## 3. Usage in Bundles
In a `site_bundle.toml`, Layer 1 acts as the **Hard Constraints** for the Coding Agent.

```toml
[layer1_axes]
tone = "serious"
density = "dense"
geometry_depth = { shape = "sharp", depth = "flat" }
```

*   **Coding Agent:** Translates `density="dense"` into smaller padding variables in Tailwind.
*   **Image Agent:** Translates `lightness="dark"` into a specific background prompt.

## 4. Contributing
Do not add new axes lightly. Any addition here requires a major version update to the entire WAS protocol.