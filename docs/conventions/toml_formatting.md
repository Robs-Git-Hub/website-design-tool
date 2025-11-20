# TOML Formatting Conventions

**Status:** Active  
**Version:** 1.0

To ensure the WAS taxonomy remains machine-readable and easy for humans to curate, all TOML files in this repository must adhere to the following style guide.

---

## 1. General Syntax

### 1.1 Indentation
*   Use **2 spaces** for indentation.
*   Do not use tabs.

### 1.2 Line Endings
*   Use Unix-style line endings (`\n`).

### 1.3 Quoting
*   Use **double quotes** `"` for all strings.
*   Use **literal strings** `'` only if the string contains many special characters or backslashes (rare).
*   Use **triple quotes** `"""` for multi-line descriptions.

---

## 2. Structural Conventions

### 2.1 Array of Tables
For repeating items (like styles, terms, or dimensions), use the `[[double_bracket]]` syntax to keep the file flat and readable.

**Correct:**
```toml
[[styles]]
id = "glassmorphism"

[[styles]]
id = "brutalism"
```

**Incorrect:**
```toml
# Avoid inline arrays of objects for complex data
styles = [
  { id = "glassmorphism" },
  { id = "brutalism" }
]
```

### 2.2 Key Ordering
Within a table, order keys by logical importance:
1.  `id` / `label` (Identity)
2.  `kind` / `type` / `status` (Classification)
3.  `definition` / `summary` (Content)
4.  `axes_bias` / `style_affinity` (Mappings)
5.  `tags` (Metadata)

### 2.3 Comments
*   Use header blocks `# ===` to separate major sections.
*   Use inline comments `#` sparingly, primarily for explaining *why* a specific value was chosen (e.g., specific weights).
*   **Note:** Comments are stripped during JSON conversion, so critical info must be in `notes = "..."`.

---

## 3. Data Types

### 3.1 Weights (Floats)
*   Use decimal notation: `0.5`, `1.0`.
*   Do not use integers (`1`) for weights where a float is expected by schema.

### 3.2 Lists
*   Place short lists on a single line: `synonyms = ["one", "two"]`.
*   Place long lists (sources) across multiple lines with trailing commas.

```toml
example_references = [
  "https://example.com/one",
  "https://example.com/two",
]
```