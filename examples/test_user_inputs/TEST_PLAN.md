# Test Plan: WAS Orchestrator Validation

## Goal
Validate the WAS Orchestrator can generate consistent, valid bundles from real user inputs across multiple modalities.

## Test Data Sources

We have 3 example sites with 4 input types each:

### 1. BrainScript AI
- **Landing page:** `examples/test_user_inputs/brainscriptai/brainscriptai_website.png`
- **Multipage mockup:** `examples/test_user_inputs/brainscriptai/brainscriptai_blocks.png`
- **URL:** https://templately.com/pack/brainscript-ai-gutenberg-multipurpose-ai-saas
- **Description:** (from metadata file)
- **Tags:** saas, ai, tech startup, modern design

### 2. NeurAIGency
- **Landing page:** `examples/test_user_inputs/neuraiagency/neuraiagency_website.png`
- **Multipage mockup:** `examples/test_user_inputs/neuraiagency/neuraiagency_blocks.png`
- **URL:** https://templately.com/pack/neuraigency-gutenberg-ai-startup-template
- **Description:** (from metadata file)
- **Tags:** ai startup, neural network, minimal color palette

### 3. Greentech
- **Landing page:** `examples/test_user_inputs/greentech/greentech_website.png`
- **Multipage mockup:** `examples/test_user_inputs/greentech/greentech_blocks.png`
- **URL:** https://templately.com/pack/greentech-gutenberg-fintech-startup-template
- **Description:** (from metadata file)
- **Tags:** fintech, finance, striking colors, professional

## Test Scenarios

### Test Group 1: Single Input Validation
**Goal:** Verify each input type generates valid bundles

For each site:
1. **Image-only test** (landing page screenshot)
   - Input: `*_website.png`
   - Prompt: "Analyze this website and create a WAS bundle"

2. **Description-only test** (text description)
   - Input: Description from metadata file
   - Prompt: (description only)

3. **Multipage analysis** (blocks screenshot)
   - Input: `*_blocks.png`
   - Prompt: "Analyze this multipage mockup and create a WAS bundle"

**Expected:** All should generate valid bundles (validation.valid = true)

### Test Group 2: Multi-Modal Input
**Goal:** Test combined inputs (more realistic user behavior)

For each site:
1. **Image + Description**
   - Input: Landing page screenshot + text description
   - Prompt: "{description}\n\nHere's the actual site:"

2. **Image + URL reference**
   - Input: Landing page screenshot
   - Prompt: "Analyze this screenshot from {url}"

**Expected:** Combined inputs should produce richer, more accurate bundles

### Test Group 3: Consistency Testing
**Goal:** Measure inter-run consistency

For each site (using landing page screenshot):
- Run 5 times with identical input
- Compare generated bundles
- Calculate consistency metrics:
  - Layer 1 exact match rate
  - Layer 2 top-3 styles overlap
  - Layer 4 trends overlap

**Expected:**
- Layer 1: >80% consistency
- Layer 2/4: High overlap in top choices

### Test Group 4: Schema Validation
**Goal:** Ensure all bundles pass validation

For all generated bundles:
- Check `validation.valid = true`
- Verify all L1 axes present and match allowed values
- Verify L2/L4 weights are 0.0-1.0
- Verify metadata fields populated correctly

**Expected:** 100% of bundles should pass schema validation (with retry logic)

### Test Group 5: Aesthetic Accuracy
**Goal:** Human review of aesthetic interpretation

For each site:
- Generate bundle from landing page screenshot
- Review Layer 1 axes for correctness
  - Does `tone` match the site's tone?
  - Does `lightness` match (dark/light)?
  - Does `color_strategy` align with actual colors?
- Review Layer 2 styles
  - Are top styles semantically correct?
  - Are weights reasonable?

**Expected:** Subjective assessment by Rob

## Test Execution

### Automated Tests
```bash
# Run all test scenarios programmatically
npm run test:orchestrator
```

### Manual Testing
```bash
# Test via API
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "...",
    "image": {
      "base64": "...",
      "mediaType": "image/png"
    }
  }'
```

### Test via UI
1. Open orchestrator UI
2. Upload image from test_user_inputs
3. Add description from metadata
4. Generate bundle
5. Verify validation passes
6. Save to `examples/test_outputs/{site_name}/`

## Success Criteria

- [ ] All single-input tests generate valid bundles
- [ ] Multi-modal inputs produce richer bundles than single inputs
- [ ] Consistency rate >80% for Layer 1 axes
- [ ] 100% schema validation pass rate (after retries)
- [ ] Aesthetic accuracy subjectively "good" per Rob's review

## Test Outputs

Store in: `examples/test_outputs/`

```
test_outputs/
  brainscriptai/
    landing_page_only.json
    description_only.json
    multipage_only.json
    combined_image_text.json
    consistency_run_1.json
    consistency_run_2.json
    ...
  neuraiagency/
    ...
  greentech/
    ...
```

## Notes

- Current metadata descriptions are polished marketing copy
- May want to create "rough user descriptions" as variants
- Test with multiple models (Claude, GPT-4) to compare outputs
- Track retry attempts and validation failures
