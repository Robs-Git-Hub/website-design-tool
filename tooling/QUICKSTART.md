# Generator Quick Start

**Status:** ✅ Ready to Use (All formatting issues resolved)

## One-Click Command

```bash
cd tooling && npm run generate:prompt
```

This regenerates the orchestrator system prompt from your latest schema/data files.

---

## What Was Implemented

✅ **Template System** - `prompts/orchestrator_template.md` with two placeholders
✅ **Generator Script** - Extracts from all L1-L4 instance files (registries removed)
✅ **npm Script** - Simple one-command workflow
✅ **TOML Formatting** - All layer files properly formatted and validated
✅ **Full Documentation** - See `GENERATOR_README.md`

---

## Test the Generator

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
