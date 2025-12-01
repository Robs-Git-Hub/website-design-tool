# Prompts Directory

System prompts and example datasets for WAS LLM workflows.

## Files

### `orchestrator_system_prompt.md`
**Status:** ✅ Complete
**Purpose:** The master system prompt for the WAS Orchestrator LLM

This prompt guides a high-intelligence reasoning model (GPT-4, Claude 3.5, etc.) to translate raw design ideas into valid WAS Bundles.

**Includes:**
- Complete L1-L4 schema summaries
- Allowed values from instance files (valid IDs only)
- Step-by-step reasoning strategy
- Output format specification
- Edge case handling

**Usage:**
Inject this entire prompt into the system message of your LLM API call.

---


## Future Files

- `few_shot_examples.json` — Generated gold-standard input/output pairs
- `consistency_test_inputs.md` — Test set for inter-annotator agreement
- `edge_cases.md` — Documented challenging inputs and expected behaviors

---

## Usage in Phase 02 Workflow

```
Input → Orchestrator Prompt → LLM → JSON Bundle → Validator → TOML Storage
```

The prompts in this directory define the "Orchestrator Prompt" stage.
