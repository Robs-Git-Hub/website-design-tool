# Repository Structure

This document outlines the organization of the Website Aesthetic Schema (WAS) repository.

---

## Root Directories

### `data/` (The Knowledge Graph)
Contains the "truth" files—the instances of our taxonomy.
*   `*_instances.toml`: The actual data definitions for Axes, Styles, Lexicon, and Trends.
*   **Rule:** Do not manually edit these without consulting the Schemas.

### `schema/` (The Rules)
Defines the structural contract for the data files.
*   `*_schema.toml`: Descriptive schemas for humans and agents.
*   **Rule:** Changes here require a version bump (v0.1 -> v0.2).

### `docs/` (The Manual)
*   `vision/`: Core philosophy and design notes.
*   `phases/`: Project management and roadmap tracking.
*   `conventions/`: Technical rules for formatting and interop.

### `examples/` (The Payload)
*   `bundles/`: Sample aesthetic bundles (TOML) representing hypothetical projects.
*   These files demonstrate how the system is used in practice.

---

## File Naming Conventions

*   **Instances:** `layer{N}_{name}_instances.toml`
*   **Schema:** `layer{N}_{name}_schema.toml`

Where `{name}` is the verbose, descriptive name of the entity (e.g., `societal_trends`).

**Note:** Instance files are the canonical source of allowed values. Validation scripts use these files to ensure IDs referenced in bundles actually exist.