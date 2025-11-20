# Registries

This directory contains the **Gatekeeper Files** for the WAS Taxonomy.

## Purpose

In a multi-agent system, "Drift" is a common failure mode:
*   *Agent A* generates a style called "Glassmorphism".
*   *Agent B* references it as "Glass-morphism".
*   *Agent C* calls it "Frosted Glass UI".

Without a central registry, these are treated as three different concepts.

## How It Works

1.  **The Source of Truth:** The `*_registry.toml` files list the **Canonical IDs** for every entity in the system.
2.  **Validation:** Before a Bundle is processed, the system checks all IDs against these registries.
3.  **Constraint:** If an Agent tries to invent a new style (e.g., "Cyber-Cottagecore") that isn't in the registry, the validator rejects it.

## The Registries

*   **`layer1_dimensions_registry.toml`**: The fixed physics of the system (Tone, Lightness, etc.). Changing this requires a major version update.
*   **`layer2_website_style_family_registry.toml`**: The allowed list of recognized design schools.
*   **`sources_registry.toml`** (Post-MVP): The bibliography of evidence backing our definitions.

## Contributing

To add a new Style or Trend:
1.  Add the definition to the `data/` instances file.
2.  Add the ID to the corresponding `registry` file.
3.  Run the validation script (Phase 02).