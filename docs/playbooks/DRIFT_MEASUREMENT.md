# Drift Measurement Strategy

**Status:** Planned (Phase 03)
**Purpose:** Validate WAS system fidelity through round-trip aesthetic translation
**Version:** 0.1

---

## 1. Overview

### 1.1 The Problem
The WAS system involves multiple transformations that can introduce information loss:
```
User Input (text/image) → WAS Bundle₁ → Visual Rendering → WAS Bundle₂
```

**Drift** is the degree of difference between Bundle₁ and Bundle₂. Measuring drift validates:
- **Schema expressiveness** - Can WAS capture the design?
- **LLM consistency** - Does the orchestrator interpret reliably?
- **Visual fidelity** - Does rendering preserve aesthetic information?
- **Round-trip stability** - Can we reconstruct the original design?

### 1.2 What Drift Tells Us
- **Low drift (>0.85):** High confidence in system components
- **Medium drift (0.65-0.85):** Acceptable variance, may need tuning
- **High drift (<0.65):** Indicates problems, but cause is ambiguous

---

## 2. Multi-Level Scoring System

Drift is measured hierarchically across WAS layers, with weights reflecting criticality.

### 2.1 Level 1: Critical Invariants (30%)
**Binary gates for identity-defining properties that should NEVER flip**

```python
critical_violations = {
    'lightness_flip':
        lightness₁ ∈ {'light','dark'} ∧ lightness₂ ∈ {'light','dark'} ∧ lightness₁ ≠ lightness₂,

    'tone_reversal':
        |tone_ordinal₁ - tone_ordinal₂| ≥ 3,  # playful→premium is catastrophic

    'geometry_contradiction':
        (shape₁='sharp' ∧ shape₂='organic') ∨ vice versa,

    'density_inversion':
        |density_ordinal₁ - density_ordinal₂| ≥ 2  # airy→maximal is catastrophic
}

# Penalty: -25% per violation (floor at 0)
L1_score = max(0, 1.0 - (num_violations × 0.25))
```

**Rationale:** A dark premium glass dashboard becoming light playful organic is total failure.

### 2.2 Level 2: Ordinal Axis Drift (20%)
**Continuous measurement for ordinal dimensions**

For axes with natural ordering (tone, density, decoration):

```python
ordinal_maps = {
    'tone': {'playful': -2, 'friendly': -1, 'neutral': 0, 'serious': 1, 'premium': 2},
    'density': {'airy': -1, 'balanced': 0, 'dense': 1, 'maximal': 2},
    'decoration': {'plain': -1, 'subtle': 0, 'decorative': 1, 'experimental': 2}
}

def ordinal_drift(axis_name, value₁, value₂):
    pos₁ = ordinal_maps[axis_name][value₁]
    pos₂ = ordinal_maps[axis_name][value₂]
    max_distance = max(ordinal_maps[axis_name].values()) - min(ordinal_maps[axis_name].values())

    return 1 - (|pos₁ - pos₂| / max_distance)

L2_score = mean([ordinal_drift(axis, val₁, val₂) for axis in ordinal_axes])
```

### 2.3 Level 3: Categorical Axis Matching (20%)
**Binary matching for categorical dimensions**

For axes without ordering (color_strategy, geometry_depth subfields):

```python
categorical_axes = [
    'color_strategy',
    'geometry_depth.shape',
    'geometry_depth.depth'
]

def categorical_match(value₁, value₂):
    return 1.0 if value₁ == value₂ else 0.0

L3_score = mean([categorical_match(axis₁, axis₂) for axis in categorical_axes])
```

### 2.4 Level 4: Style Vector Similarity (15%)
**L2 style weights as sparse vectors**

```python
def style_drift(styles₁, styles₂):
    all_styles = set(styles₁.keys()) | set(styles₂.keys())

    # Cosine similarity approach
    v₁ = [styles₁.get(s, 0.0) for s in all_styles]
    v₂ = [styles₂.get(s, 0.0) for s in all_styles]

    return cosine_similarity(v₁, v₂)

    # Alternative: Weighted overlap for interpretability
    shared = set(styles₁.keys()) & set(styles₂.keys())
    overlap_score = len(shared) / max(len(styles₁), len(styles₂))

    if shared:
        weight_mse = mean([(styles₁[s] - styles₂[s])² for s in shared])
        return overlap_score × (1 - weight_mse)
    else:
        return 0.0
```

**Key insight:** `glassmorphism: 0.9 → 0.7` is minor drift. Disappearing entirely is major.

### 2.5 Level 5: Trend Vector Similarity (10%)
**L4 trend weights (same approach as styles)**

```python
def trend_drift(trends₁, trends₂):
    # Identical logic to style_drift()
    all_trends = set(trends₁.keys()) | set(trends₂.keys())
    v₁ = [trends₁.get(t, 0.0) for t in all_trends]
    v₂ = [trends₂.get(t, 0.0) for t in all_trends]

    return cosine_similarity(v₁, v₂)
```

### 2.6 Level 6: Lexicon Preservation (5%)
**L3 term matching across lexicon kinds**

```python
lexicon_kinds = [
    'visual_atmosphere', 'palette_trait', 'surface_texture',
    'component_styling', 'depth_technique', 'typography_mechanics',
    'illustration_style', 'motion_mechanics'
]

def lexicon_drift(lex₁, lex₂):
    kind_scores = []
    for kind in lexicon_kinds:
        term₁ = lex₁.get(kind)
        term₂ = lex₂.get(kind)

        if term₁ == term₂:  # Same (or both None)
            kind_scores.append(1.0)
        elif not term₁ or not term₂:  # One present, one absent
            kind_scores.append(0.5)  # Omission
        else:  # Both present but different
            kind_scores.append(0.0)  # Contradiction (worst)

    return mean(kind_scores)
```

**Rationale:** Contradiction (`glass_panel` → `grain_texture`) is worse than omission.

---

## 3. Composite Drift Score

```python
drift_score = (
    0.30 × L1_critical_invariants +      # Lightness, tone, geometry flips
    0.20 × L2_ordinal_axes +              # Tone, density, decoration distances
    0.20 × L3_categorical_axes +          # Color strategy, shape, depth matches
    0.15 × L4_style_similarity +          # L2 style vector cosine
    0.10 × L5_trend_similarity +          # L4 trend vector cosine
    0.05 × L6_lexicon_preservation        # L3 term matching
)

# Result: 0.0 (total failure) → 1.0 (perfect preservation)
```

---

## 4. Variance Baseline

**Challenge:** LLMs have inherent variance. Need to separate "expected variance" from "drift."

### 4.1 Control Test
Run the same input twice without visual round-trip:
```
Input → Bundle₁
Input → Bundle₂
Measure: baseline_variance = 1 - drift(Bundle₁, Bundle₂)
```

If baseline variance is 10%, then 15% round-trip drift = only 5% additional loss.

### 4.2 Statistical Approach
- Run each test **5-10 times**
- Calculate mean drift and standard deviation
- Report: `drift_mean ± drift_std`
- Compare to baseline: `additional_drift = round_trip_drift - baseline_variance`

---

## 5. Differential Diagnosis

High drift could indicate problems in multiple components. Use **ablation testing** to isolate:

### 5.1 Component Isolation Tests
```
Test 1: Text → Bundle₁, Text → Bundle₂ (same text, no image)
   → Measures: LLM consistency baseline

Test 2: Bundle → Image → Bundle (synthetic perfect bundle)
   → Measures: Visual rendering + vision extraction fidelity

Test 3: Same bundle, different image generators
   → Measures: Image generator quality comparison

Test 4: Same image, different vision models
   → Measures: Vision model extraction quality
```

### 5.2 Layer Decomposition
Report drift **by layer** to identify where information is lost:
```json
{
  "total_drift_score": 0.72,
  "breakdown": {
    "L1_critical": 0.75,      // Some violations
    "L1_ordinal": 0.85,        // Good preservation
    "L1_categorical": 0.67,    // Color strategy drifted
    "L2_styles": 0.80,         // Minor weight shifts
    "L3_lexicon": 0.40,        // Poor term preservation ← Problem area
    "L4_trends": 0.90          // Excellent preservation
  }
}
```

---

## 6. Interpretation Guidelines

| Drift Score | Interpretation | Action |
|------------|----------------|---------|
| **0.90 - 1.00** | Excellent fidelity | System is production-ready |
| **0.75 - 0.89** | Good preservation | Minor tuning recommended |
| **0.60 - 0.74** | Moderate drift | Investigate layer breakdown |
| **0.40 - 0.59** | High drift | Component diagnosis needed |
| **< 0.40** | Critical failure | System redesign required |

### 6.1 Drift Patterns
- **Uniform low drift across layers:** Schema is expressive, system works well
- **L1 critical violations:** Visual rendering is losing fundamental traits
- **L3 lexicon poor:** Vision model can't extract fine-grained details
- **L2/L4 vector drift:** Style/trend interpretation is inconsistent

---

## 7. Human Calibration

Before relying on automated scoring:

1. **Generate 20-30 test pairs** with known expected drift:
   - 10 "should be identical" pairs
   - 10 "slight variation acceptable" pairs
   - 10 "major drift" pairs

2. **Human rating:** Have 2-3 humans rate drift (0-10 scale)

3. **Calibration:** Adjust scoring weights so automated scores align with human intuition

4. **Validation:** Test on new samples to ensure generalization

---

## 8. Implementation Roadmap

See [Phase 03 - Drift Measurement](../project-management/phases/phase_03_drift_measurement.md) for detailed implementation plan.

### Quick Summary
**Tier 1 (MVP):**
- CLI tool: `npm run measure-drift <bundle1.json> <bundle2.json>`
- Output single score + layer breakdown
- Basic test suite with 5-10 known cases

**Tier 2 (Production):**
- Batch testing across multiple runs
- Statistical analysis (mean, std dev, confidence intervals)
- Automated reporting and visualization

**Tier 3 (Advanced):**
- Ablation testing framework
- Component-level diagnosis
- Integration with orchestrator UI
- Continuous monitoring dashboard

---

## 9. Open Questions

1. **Metadata drift:** Should we measure `intent_keywords` similarity? (Currently excluded)
2. **Reasoning similarity:** Use embeddings to compare `reasoning_notes`? (Computational cost)
3. **Acceptable drift thresholds:** Need real-world data to calibrate
4. **Model-specific baselines:** Different LLMs may have different variance profiles
5. **Drift over time:** Track drift metrics as schema/prompts evolve

---

**Next Steps:** See Phase 03 implementation plan for actionable tasks.
