# Validation Rules (v0.1)

**Status:** Active  
**Scope:** Applied by `tools/validate_bundle.py` (Planned Phase 02)

To maintain integrity across the 4-layer ontology, all data files and runtime bundles must pass the following validation logic.

---

## 1. Structural Validation (Schema Compliance)

*   **File Extension:** Must be `.toml`.
*   **Root Meta:** Every file must have a `[meta]` table with `id` and `version`.
*   **Required Fields:** Must match the `_schema.toml` definition for that layer.

## 2. Instance Validation (Drift Prevention)

*   **Layer 1 (Dimensions):**
    *   Keys in `axes_bias` must exist in `layer1_dimensions_instances.toml`.
    *   Values for categorical axes (e.g., `lightness`) must match allowed IDs (e.g., `dark`, `light`).
*   **Layer 2 (Styles):**
    *   IDs used in `style_affinity` or `layer2_styles` (in bundles) must exist in `layer2_website_style_family_instances.toml`.
*   **Layer 3 (Lexicon):**
    *   IDs used in `lexicon_affinity` must exist in `layer3_style_lexicon_instances.toml`.

## 3. Logic & Range Validation

### 3.1 Weights (Bias & Affinity)
*   All weights must be **floats** between `0.0` and `1.0`.
*   `0.0` (or absent) = No influence.
*   `1.0` = Total dominance/definition.

### 3.2 Axes Bias (L3 -> L1 Mapping)
*   A Lexicon term (L3) mapping to L1 Axes must follow the specific structure of the axis type.
    *   **Ordinal Axis (Tone):** Can map to multiple buckets.
        *   *Valid:* `tone = { serious = 0.8, premium = 0.4 }`
    *   **Compound Axis (Geometry):** Must specify sub-dimension.
        *   *Valid:* `geometry_depth_shape = { rounded = 1.0 }`
        *   *Invalid:* `geometry_depth = { rounded = 1.0 }`

## 4. Consistency Checks

*   **Unique IDs:** No two entries in the same layer can share an `id`.
*   **MECE Kinds:** Every L3 Term must belong to exactly one `kind` defined in the schema.
*   **Source Traceability:** (Post-MVP) Every entry with `evidence_count > 0` must list `sources` that exist in the `sources_registry`.

---

## 5. Bundle Validation (Runtime)

When an Orchestrator generates a `site_bundle.toml`:
1.  **Check:** All L2 keys exist in layer2_website_style_family_instances.toml.
2.  **Check:** All L3 keys exist in layer3_style_lexicon_instances.toml.
3.  **Check:** L1 Axes values are valid enums from layer1_dimensions_instances.toml.
4.  **Warning:** If `intent_summary` is missing.