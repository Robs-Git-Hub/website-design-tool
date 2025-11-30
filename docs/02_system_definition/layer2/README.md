# Layer 2: Website Style Families (The Canon)

**Evidence-Backed Design Schools & Movements.**

---

## 1. Concept
Layer 2 describes the **"Canon"**—named visual styles that are widely recognized by the design community. Unlike Layer 1 (which measures raw physics), Layer 2 describes specific combinations of physics that define a named "look."

If Layer 1 is "Ingredients" (Flour, Water, Heat), Layer 2 is "Dishes" (Pizza, Pasta, Bread).

## 2. Criteria for Inclusion
To be added to Layer 2, a style must be **Evidence-Backed**. It cannot be a made-up term.
*   Must have 2+ credible sources (Nielsen Norman, Smashing Mag, Awwwards, Design History books).
*   Must be distinct from existing styles (MECE).

**Examples:**
*   `glassmorphism` (Valid: widely documented trend)
*   `swiss_style` (Valid: historical movement)
*   `cool_blue_vibes` (Invalid: vague adjective, not a movement)

## 3. Structure of a Style
Every style in `layer2_website_style_family_instances.toml` contains:
*   **Definitions:** Clear text explaining the style.
*   **Core Characteristics:** Bullet points for prompting (e.g., "Frosted glass," "Vibrant blurs").
*   **Sources:** Citations proving its existence.

## 4. Usage in Bundles
Layer 2 styles act as **Macro-Instructions** for agents.

```toml
[layer2_styles]
glassmorphism = 0.8
minimalism = 0.2
```

This tells the **Image Agent**: "Make it look like Glassmorphism."
This tells the **Coding Agent**: "Apply the `geometry_depth` settings associated with Glassmorphism."

