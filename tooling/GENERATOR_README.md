# WAS Orchestrator Prompt Generator

Automatically generates the WAS Orchestrator system prompt by extracting schema structures and allowed values from your TOML data files.

---

## What It Does

This generator reads your schema and data files and creates a complete, up-to-date orchestrator system prompt by:

1. **Reading the template** (`prompts/orchestrator_template.md`)
2. **Extracting the WAS Bundle schema structure** from schema files
3. **Extracting allowed values** from instance data files:
   - Layer 1: Dimension values (tone, lightness, color_strategy, etc.)
   - Layer 2: Style family IDs (glassmorphism, minimalism, etc.)
   - Layer 3: Lexicon term IDs grouped by kind
   - Layer 4: Trend IDs
4. **Replacing placeholders** in the template
5. **Writing the output** (`prompts/orchestrator_system_prompt.md`)

---

## When to Run It

Run the generator whenever you:

✅ Add new dimension values to Layer 1
✅ Add new styles to Layer 2
✅ Add new lexicon terms to Layer 3
✅ Add new trends to Layer 4
✅ Update the reasoning strategy or instructions in the template

This ensures the orchestrator always has the latest valid enums and schema structure.

---

## Quick Start

### 1. Navigate to the tooling directory

```bash
cd tooling
```

### 2. Install dependencies (first time only)

```bash
npm install
```

### 3. Run the generator

```bash
npm run generate:prompt
```

That's it! The updated prompt will be written to `prompts/orchestrator_system_prompt.md`.

---

## How It Works

### Template File

The template file (`prompts/orchestrator_template.md`) contains two special placeholders:

- `{{WAS_BUNDLE_SCHEMA}}` - Replaced with the JSON schema structure
- `{{WAS_ALLOWED_VALUES}}` - Replaced with all allowed enum values from L1-L4

You can edit the template freely (instructions, reasoning strategy, examples) - just **don't remove these placeholders**!

### Data Sources

The generator reads from these files:

| Layer | File | Purpose |
|-------|------|---------|
| L1 | `data/layer1_dimensions_instances.toml` | Dimension values (canonical source) |
| L2 | `data/layer2_website_style_family_instances.toml` | Style IDs (canonical source) |
| L3 | `data/layer3_lexicon_instances.toml` | Lexicon term IDs (canonical source) |
| L4 | `data/layer4_societal_trends_instances.toml` | Trend IDs (canonical source) |

### Output

The generated file (`prompts/orchestrator_system_prompt.md`) is a **complete, ready-to-use system prompt** that can be:

- Copied into Claude Chat for the artifact
- Used with the Anthropic API
- Shared with the team
- Version controlled in git

---

## Workflow Example

### Scenario: You add a new L3 lexicon term

1. **Edit** `data/layer3_lexicon_instances.toml` to add your new term:
   ```toml
   [[terms]]
   id = "sunset_gradient"
   label = "Sunset Gradient"
   kind = "palette_trait"
   domain = "graphic"
   definition = "Warm orange-to-pink gradients..."
   ```

2. **Run the generator:**
   ```bash
   cd tooling
   npm run generate:prompt
   ```

3. **Check the output:**
   ```bash
   cat ../prompts/orchestrator_system_prompt.md
   ```

4. **Copy the updated prompt** into your Claude Chat artifact or API calls

5. **Commit the changes:**
   ```bash
   git add ../prompts/orchestrator_system_prompt.md
   git commit -m "feat(l3): add sunset_gradient lexicon term"
   ```

---

## Error Messages

### Missing Placeholder

```
❌ Error: Missing placeholder {{WAS_BUNDLE_SCHEMA}} in template
   Add this placeholder where the WAS Bundle schema should appear.
```

**Fix:** Add the missing placeholder to `prompts/orchestrator_template.md`

### TOML Parse Error

```
❌ Error reading /path/to/file.toml: TomlError: ...
```

**Fix:** Check that the TOML file has valid syntax. Common issues:
- Missing line breaks between key-value pairs
- Invalid characters in values
- Unclosed quotes or brackets

Use a TOML validator or linter to check your files.

### File Not Found

```
❌ Error: Could not read template file at prompts/orchestrator_template.md
   Make sure the file exists.
```

**Fix:** Ensure you're running the command from the `tooling/` directory or that all paths are correct.

---

## Tips

### Test Before Committing

After running the generator, always:
1. Review the output file
2. Check that allowed values match your data files
3. Test the prompt in Claude Chat to ensure it works

### Keep Templates Organized

If you want to experiment with different reasoning strategies:
1. Copy `orchestrator_template.md` to `orchestrator_template_v2.md`
2. Edit the paths in `generate_prompt.ts` to use the new template
3. Generate and compare outputs

### Automate with Git Hooks

You can add a pre-commit hook to automatically regenerate the prompt:

```bash
# .git/hooks/pre-commit
cd tooling && npm run generate:prompt && git add ../prompts/orchestrator_system_prompt.md
```

---

## Troubleshooting

### "The output looks wrong"

1. Check that your source TOML files have valid syntax
2. Verify the template placeholders are present
3. Run with verbose logging: `DEBUG=* npm run generate:prompt`

### "I updated a file but the output didn't change"

1. Make sure you're editing the source files (in `data/`), not the generated output
2. Run the generator again
3. Check for TOML parsing errors

### "The generator is too slow"

The generator reads multiple TOML files, which is typically fast (<1 second). If it's slow:
1. Check file sizes (are any files very large?)
2. Check for network drives or slow disk I/O

---

## Advanced Usage

### Custom Output Path

Edit `generate_prompt.ts` and change the `PATHS.output` value:

```typescript
const PATHS = {
  // ...
  output: join(REPO_ROOT, 'prompts/custom_output.md'),
  // ...
};
```

### Adding New Placeholders

1. Add a new placeholder to the template (e.g., `{{CUSTOM_SECTION}}`)
2. Create a generator function in `generate_prompt.ts`
3. Add a replacement call in the `main()` function

---

## Questions?

If you've forgotten how to use this tool, just read this README! It's designed to be self-contained.

**Remember:** The one-click workflow is:

```bash
cd tooling && npm run generate:prompt
```

That's it! ✨
