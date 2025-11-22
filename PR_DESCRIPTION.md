# Remove Duplicate Registry Files - Simplify to Single Source of Truth

## Summary

This PR removes all layer registry files and simplifies the architecture to use instance files as the canonical source of allowed values. This eliminates data duplication and makes the system easier to maintain.

## Motivation

During Phase 02 development, we discovered that registry files were duplicating data already present in instance files:

- **Layer 1**: Both `layer1_dimensions_registry.toml` and `layer1_dimensions_instances.toml` maintained identical dimension lists
- **Layer 2**: `layer2_website_style_family_registry.toml` was completely empty while instances were fully populated
- **Layer 3 & 4**: No registry files existed at all

This duplication created unnecessary maintenance burden and potential for drift between registries and instances.

## Changes

### 🗑️ Deleted Files
- `registries/README.md`
- `registries/layer1_dimensions_registry.toml`
- `registries/layer2_website_style_family_registry.toml`
- Entire `/registries` directory

### 🔧 Code Changes

**`tooling/src/generators/generate_prompt.ts`**
- Removed `layer1_registry` and `layer2_registry` from PATHS object
- Simplified `generateLayer2Values()` to extract directly from instances (removed fallback logic)
- Generator now uses instance files as canonical source for all layers

### 📝 Schema & Data Updates

**`data/layer1_dimensions_instances.toml`**
- Updated header comment to emphasize canonical status

**`schema/layer1_dimensions_schema.toml`**
- Changed "canonical list of dimensions lives in the registry + instances file" → "instances file"

**`schema/site_bundle_schema.toml`**
- Updated 3 comments to reference instance files instead of registries:
  - L1 axes values reference
  - L2 style keys reference
  - L4 trend keys reference

### 📚 Documentation Updates

**Core Documentation:**
- `README.md`: Removed `/registries` from directory structure diagram
- `docs/REPO_STRUCTURE.md`:
  - Removed registries section entirely
  - Removed registry naming convention
  - Added note clarifying instances are canonical source
- `docs/VALIDATION_RULES.md`:
  - Renamed "Registry Validation" → "Instance Validation"
  - Updated all validation logic to reference instance files
  - Updated runtime bundle validation rules

**Layer Documentation:**
- `docs/layer1/README.md`: Changed "defined in the Registry" → "defined in `layer1_dimensions_instances.toml`"

**Planning Documentation:**
- `docs/masterplan.md`: Updated 4 registry references to instance files
- `docs/phases/phase_01_foundations.md`: Removed registry deliverables section, clarified instances as canonical source

**Tooling Documentation:**
- `prompts/README.md`: Changed "Allowed registries" → "Allowed values from instance files"
- `tooling/GENERATOR_README.md`:
  - Updated "What It Does" section
  - Updated data sources table (removed registry rows)
  - Updated troubleshooting sections

**Task Tracking:**
- `docs/TASKS.md`: Added and completed registry removal task with all subtasks marked ✅

## Testing

✅ **Generator Verified**: Ran `npm run generate:prompt` successfully without registry dependencies
✅ **Output Validated**: Generated orchestrator system prompt remains complete and valid
✅ **No Regressions**: All existing functionality preserved

## Benefits

1. **Single Source of Truth**: Instance files are now the canonical source for all allowed values
2. **Reduced Maintenance**: No need to update both registries and instances
3. **Eliminated Drift Risk**: Can't have mismatches between duplicated data
4. **Cleaner Architecture**: Simpler mental model - schema defines structure, instances define data
5. **Easier Validation**: Validators only need to check against one source

## Migration Notes

For anyone who was referencing registry files in custom code:
- Replace `registries/layer1_dimensions_registry.toml` → `data/layer1_dimensions_instances.toml`
- Replace `registries/layer2_website_style_family_registry.toml` → `data/layer2_website_style_family_instances.toml`
- Extract allowed IDs from the `dimensions` or `styles` arrays in instance files

## Related Tasks

This completes the "Remove Registry Files (Simplification)" subtask under Phase 02, Task Group 1 (The WAS Engine).

Next up: **Option D Schema Generation** - dynamically generating complete schema reference from TOML schema files.

## Commits Included

- `5498ddb` - refactor: remove duplicate registry files and simplify to single source of truth
- `3d1ceaa` - docs: mark registry removal task as completed
