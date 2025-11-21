# Generator Quick Start

## One-Click Command

```bash
cd tooling && npm run generate:prompt
```

This regenerates the orchestrator system prompt from your latest schema/data files.

---

## What Was Implemented

✅ **Template System** - `prompts/orchestrator_template.md` with two placeholders
✅ **Generator Script** - Extracts from all L1-L4 TOML files
✅ **npm Script** - Simple one-command workflow
✅ **Full Documentation** - See `GENERATOR_README.md`

---

## ⚠️ Action Required

**The layer3 TOML file has formatting issues that need to be fixed:**

File: `data/layer3_lexicon_instances.toml`

**Problem:** Multiple key-value pairs on single lines (invalid TOML syntax)

**Example from line 8:**
```toml
[meta]id = "layer3_style_lexicon_instances"version = "0.2.1"description = "..."
```

**Should be:**
```toml
[meta]
id = "layer3_style_lexicon_instances"
version = "0.2.1"
description = "..."
```

**Same issue on lines:** 12, 13, 14, 19, 20, etc. (most term definitions)

---

## How to Fix

### Option 1: Manual Fix
Add line breaks between key-value pairs throughout the file.

### Option 2: Ask me to fix it
I can reformat the file if you'd like.

### Option 3: Use a TOML formatter
```bash
# If you have prettier with TOML support
npx prettier --write data/layer3_lexicon_instances.toml
```

---

## Once Fixed, Test the Generator

```bash
cd tooling
npm run generate:prompt
```

**Expected output:**
```
🔧 WAS Orchestrator Prompt Generator

📖 Reading template...
🔍 Checking for placeholders...
✅ Both placeholders found

🎨 Generating WAS Bundle Schema...
📋 Extracting Layer 1 values...
📋 Extracting Layer 2 values...
📋 Extracting Layer 3 values...
📋 Extracting Layer 4 values...

🔄 Replacing placeholders...
💾 Writing output...
✅ Generated: /path/to/prompts/orchestrator_system_prompt.md

✨ Done!
```

Then check the output: `cat ../prompts/orchestrator_system_prompt.md`

---

## Future Workflow

1. **Edit schemas/data** when you add new dimensions, styles, lexicon terms, or trends
2. **Run `npm run generate:prompt`** to regenerate the system prompt
3. **Copy the updated prompt** into your Claude Chat artifact
4. **Test** the orchestrator with your examples
5. **Commit** the changes

That's it!

---

## Need Help?

- Full documentation: `tooling/GENERATOR_README.md`
- Forgot the command: It's in this file at the top!
- Generator errors: Check the error message - it tells you what to fix
