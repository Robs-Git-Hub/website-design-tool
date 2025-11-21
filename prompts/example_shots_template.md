# Example Shots Template — Input Data Needed

**Status:** 🚧 **ROB TO COMPLETE**
**Purpose:** Provide 3-5 raw design ideas to create "gold standard" WAS Bundle examples
**Deadline:** Before validator development begins

---

## Instructions

For each example below, provide **ONE** of the following input types:

1. **Text Prompt**: A natural language description of the desired aesthetic
2. **Reference URL**: A link to a website with the vibe you want
3. **Image Path**: Path to a screenshot/moodboard in this repo
4. **Hybrid**: Combination of text + reference

The more specific and varied the examples, the better the LLM will learn the WAS reasoning process.

---

## Example 1: [Give it a name]

**Input Type:** [Text / URL / Image / Hybrid]

**Content:**
```
[Paste your description, URL, or image path here]

Example text:
"A premium SaaS dashboard for financial analytics. Dark mode, glass panels,
subtle neon accents. Professional but modern. Think Stripe meets Tron."

Example URL:
https://example.com

Example image:
/research/moodboards/example_01.png
```

**Context Notes (optional):**
- Target audience: [who is this for?]
- Use case: [marketing site / dashboard / portfolio / etc.]
- Cultural references: [any specific eras, brands, or movements?]

---

## Example 2: [Give it a name]

**Input Type:** [Text / URL / Image / Hybrid]

**Content:**
```
[Your input here]
```

**Context Notes (optional):**
- Target audience:
- Use case:
- Cultural references:

---

## Example 3: [Give it a name]

**Input Type:** [Text / URL / Image / Hybrid]

**Content:**
```
[Your input here]
```

**Context Notes (optional):**
- Target audience:
- Use case:
- Cultural references:

---

## Example 4 (Optional): [Give it a name]

**Input Type:** [Text / URL / Image / Hybrid]

**Content:**
```
[Your input here]
```

**Context Notes (optional):**
- Target audience:
- Use case:
- Cultural references:

---

## Example 5 (Optional): [Give it a name]

**Input Type:** [Text / URL / Image / Hybrid]

**Content:**
```
[Your input here]
```

**Context Notes (optional):**
- Target audience:
- Use case:
- Cultural references:

---

## Diversity Guidelines

Try to cover a range of:
- **Tone**: playful → serious → premium
- **Lightness**: light mode, dark mode, hybrid
- **Complexity**: vague prompts (test interpretation) vs specific prompts (test precision)
- **Input Types**: at least one text-only, one URL reference, and ideally one image

---

## What Happens Next?

Once you fill this in, I (Claude) will:
1. Process each input through the WAS Orchestrator system prompt
2. Generate "gold standard" WAS Bundle JSON outputs
3. Create human-readable explanations of each mapping
4. Save these as training examples for consistency testing

These examples will become the **few-shot learning corpus** that teaches the LLM how to reason about aesthetics using the WAS framework.

---

## Questions?

If you need inspiration, check:
- Existing bundles: `/examples/bundles/`
- Layer 3 lexicon: `/data/layer3_lexicon_instances.toml`
- Your own bookmarks/favorite sites

**Status:** Ready for your input! 🎨
