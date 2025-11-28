# JSON ↔ TOML Interoperability Conventions

**Status:** Active  
**Version:** 1.0

The WAS system uses **TOML for Authorship** (human/storage) and **JSON for Operations** (agents/APIs). This document defines the rules for converting between the two to ensure no data is lost.

---

## 1. General Strategy

*   **TOML** is the "Cold Storage" format. It allows comments, sparse tables, and human-friendly formatting.
*   **JSON** is the "Hot Transmission" format. It is strict, compact, and used in prompts.

## 2. Conversion Rules

### 2.1 Tables to Objects
*   TOML `[table]` becomes JSON `{ object }`.
*   TOML `[[array_of_tables]]` becomes JSON `[ {object}, {object} ]`.

### 2.2 Enums and Strings
*   All keys generally map 1:1.
*   All string values map 1:1.

### 2.3 Handling `axes_bias` (The Weights)
In TOML, we write concise key-value pairs:
```toml
[terms.axes_bias]
tone = { serious = 0.5 }
```

In JSON, this **MUST** be fully expanded for agents:
```json
"axes_bias": {
  "tone": {
    "serious": 0.5
  }
}
```

### 2.4 Handling Comments
*   **TOML comments (`#`) are STRIPPED** during conversion to JSON.
*   **Critical context** that agents *must* see should be moved from comments into a `notes` or `description` field in the schema.

### 2.5 Date Objects
*   TOML supports native Date objects.
*   **Rule:** Convert all Dates to ISO-8601 Strings (`"YYYY-MM-DD"`) in JSON.

---

## 3. Agent Prompting Standard

When injecting a bundle into an LLM prompt, use the JSON representation.

**Correct:**
> "You are a UI designer. Interpret the following aesthetic bundle:"
> ```json
> { "layer1_axes": { "tone": "serious" } }
> ```

**Incorrect:**
> "Interpret this TOML:"
> (While many LLMs read TOML, JSON is significantly more token-efficient and reliable for structure parsing).