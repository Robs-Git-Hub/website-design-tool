# Testing Strategy Overview

**Status:** Active
**Version:** 1.0
**Last Updated:** 2025-11-28

---

## Purpose

This document defines the comprehensive testing strategy for the Website Aesthetic Schema (WAS) project across four distinct testing levels, from high-level conceptual validation to low-level unit tests.

---

## Testing Philosophy

WAS is both a **taxonomy** and a **scientific instrument** for validating AI design agents. Our testing strategy reflects this dual nature:

1. **Scientific rigor** - Validate the theory (Does WAS capture aesthetics objectively?)
2. **Engineering reliability** - Validate the implementation (Does the system work correctly?)
3. **System fidelity** - Validate the pipeline (Is information preserved through transformations?)
4. **Component correctness** - Validate individual pieces (Do utilities work in isolation?)

---

## The Four Testing Levels

### Level 1: Scientific/Conceptual Validation
**Purpose:** Validate WAS taxonomy theory and system fidelity

#### L1A: Inter-Annotator Agreement
**Question:** If WAS is objective, do independent observers describe the same site identically?

**Test:** Feed same website image to 3+ different LLMs → Compare generated bundles

**Hypothesis:** High agreement indicates the taxonomy is grounded in reality, not hallucination

**Current Status:**
- 📋 Planned, not implemented
- **Inputs needed:** Single canonical input per test case
- **Location:** Not yet defined
- **Dependencies:** Working orchestrator (✅ Phase 2 complete)

**Success Criteria:** >80% agreement on Layer 1 axes across models

---

#### L1B: Round-Trip Fidelity (Drift Measurement)
**Question:** When we go `Input → Bundle₁ → Visual → Bundle₂`, how much information is preserved?

**Test:**
```
User Input → WAS Orchestrator → Bundle₁
Bundle₁ → Image Generator → Visual Mockup
Visual Mockup → Vision Orchestrator → Bundle₂
Compare: measure_drift(Bundle₁, Bundle₂)
```

**What Drift Measures:**
- Schema expressiveness (Can WAS capture the aesthetic?)
- LLM consistency (Does interpretation vary?)
- Visual fidelity (Does rendering preserve information?)
- Round-trip stability (Can we reconstruct the design?)

**Current Status:**
- ✅ Fully documented algorithm ([drift_measurement.md](drift_measurement.md))
- ❌ Not implemented
- **Inputs needed:** Validated WAS bundles + image generation capability
- **Location (planned):** `tooling/src/drift/` (doesn't exist yet)
- **Dependencies:**
  - Phase 3 complete (WAS → theme.json/blueprint generation)
  - Image generation API access (DALL-E, Midjourney, etc.)
  - Vision-enabled LLM (Claude 3.5 Sonnet, GPT-4 Vision)

**Success Criteria:**
- Mean drift score >0.75 (Good or better)
- Baseline variance <15%
- Round-trip additional drift <20%

**Drift Score Thresholds:**
- **>0.85** = Low drift (high confidence)
- **0.65-0.85** = Medium drift (acceptable variance)
- **<0.65** = High drift (problem exists, needs diagnosis)

**Reference:** See [Phase 05 Plan](../project-management/phases/phase_05_drift_measurement.md) and [Drift Measurement Playbook](drift_measurement.md)

---

#### L1C: Mapping Reality Check (Empirical Grounding)
**Question:** Do our style definitions match real-world usage?

**Test:** Analyze real datasets to confirm sites labeled "Swiss Style" actually use grids, grotesque type, etc.

**Hypothesis:** WAS definitions must align with industry consensus

**Current Status:**
- 📋 Conceptual only, no implementation plan
- **Inputs needed:** Large dataset of labeled websites
- **Location:** Not defined
- **Dependencies:** Access to design dataset (Awwwards, etc.)

**Success Criteria:** >85% alignment between WAS definitions and expert-labeled sites

---

#### L1D: Output Determinism
**Question:** Does the same WAS bundle produce consistent outputs across code agents?

**Test:** Feed same Bundle to different Code Agents → Compare resulting theme.json files

**Hypothesis:** A Vibe Spec should produce predictable, mathematically similar code

**Current Status:**
- 📋 Planned for Phase 3
- **Inputs needed:** Validated WAS bundles
- **Location:** Part of Phase 3 translation testing
- **Dependencies:** Phase 3 translation prompts (WAS → theme.json)

**Success Criteria:** Cosine similarity >0.90 between generated themes

---

### Level 2: System Integration Testing
**Purpose:** Validate end-to-end pipeline reliability

**Documented in:** [examples/test_user_inputs/TEST_PLAN.md](../../examples/test_user_inputs/TEST_PLAN.md)

#### Test Scenarios

**1. Single-Input Validation**
- Text-only input
- Image-only input (landing page)
- Image-only input (multipage mockup)
- URL reference

**2. Multi-Modal Combinations**
- Image + description
- URL + description
- Image + URL

**3. Consistency Testing**
- Run same input 10x
- Measure variance across runs
- Target: >80% consistency on L1 axes

**4. Schema Validation Pass Rate**
- All generated bundles must pass validation
- With retry logic: 100% pass rate expected

**5. Aesthetic Accuracy**
- Human review of bundle correctness
- Subjective assessment by domain expert

#### Current Status

**✅ Test Inputs Exist:**
- **Location:** `examples/test_user_inputs/`
- **3 example sites** × **4 input types** = **12 base test cases**
  - `brainscriptai/` - Dark-mode AI SaaS (tech, futuristic, neon accents)
  - `greentech/` - Green fintech (calm, professional, eco-friendly)
  - `neuraiagency/` - Clean AI startup (bright, polished, modern)
- **Each site has:**
  - `{site}_description.md` - Natural language description
  - `{site}_url.md` - URL reference
  - `{site}_website.png` - Landing page screenshot
  - `{site}_blocks.png` - Multi-page mockup

**❌ Test Infrastructure Missing:**
- No automated test runner
- No consistency measurement automation
- No test payload generation from files
- No comparison/reporting tools

**Outputs Location:** `data/output/` exists but typically empty (manual testing only)

#### Implementation Needs

**Required Tools:**
1. **Test Payload Generator** (`tooling/src/test-runners/generate-test-payloads.ts`)
   - Read test_user_inputs files
   - Generate API request JSON for each scenario
   - Output to `examples/test_payloads/`

2. **Test Runner** (`tooling/src/test-runners/run-orchestrator-tests.ts`)
   - Execute all test scenarios
   - Call `/api/v1/generate` for each
   - Validate bundles with bundle_validator
   - Save outputs to `examples/test_outputs/`
   - Generate comparison reports

3. **Consistency Analyzer** (`tooling/src/test-runners/analyze-consistency.ts`)
   - Run same input N times
   - Calculate variance metrics
   - Report stability scores

**Success Criteria:**
- [ ] All single-input tests generate valid bundles
- [ ] Multi-modal inputs produce richer bundles than single inputs
- [ ] Consistency rate >80% for Layer 1 axes
- [ ] 100% schema validation pass rate (after retries)
- [ ] Aesthetic accuracy subjectively "good" per expert review

---

### Level 3: Contract/Validation Testing
**Purpose:** Schema compliance and data integrity

**Documented in:** [validation_rules.md](validation_rules.md)

#### What It Validates

**1. Structural Validation (Schema Compliance)**
- Required fields present
- Correct types (string, number, object)
- Zod schema enforcement

**2. ID Validation**
- L2 style IDs exist in `data/layer2_website_style_family_instances.toml`
- L3 lexicon IDs exist in `data/layer3_style_lexicon_instances.toml`
- L4 trend IDs exist in `data/layer4_societal_trends_instances.toml`

**3. Enum Validation**
- L1 axis values match allowed enums from instances
- Compound axes (geometry_depth) have correct structure

**4. Range Validation**
- Weights are floats between 0.0-1.0
- No negative values or out-of-range numbers

**5. Logic Checks**
- All required L1 axes present
- Intent summary and keywords provided

#### Current Status

**✅ Complete and Production-Ready**

**Implementation:**
- **File:** `tooling/src/validators/bundle_validator.ts` (14KB, comprehensive)
- **CLI Tool:** `npm run validate-bundle <file.json>` (working)
- **API Integration:** Used in `/api/v1/generate` route with retry logic
- **Error Formatting:** Detailed error messages for LLM feedback

**Test Data:**
- `examples/bundles/test_valid_bundle.json` - Passes all checks
- `examples/bundles/test_invalid_bundle.json` - Known failures

**Input Sources:**
- TOML instance files: `data/layer{1-4}_*_instances.toml`
- Test bundles: `examples/bundles/*.json`
- Production bundles: Generated via API

**Discovered Issues:**
- ✅ Found real bugs in production bundles (missing meta fields, Layer 4 format issues)
- ✅ System prompt updated to generate compliant bundles

**Success Criteria:**
- [x] ✅ Validates structure, IDs, enums, ranges, logic
- [x] ✅ Detailed error reporting with field paths
- [x] ✅ CLI and API integration working
- [x] ✅ Tested against valid and invalid bundles

---

### Level 4: Unit Testing
**Purpose:** Component isolation and regression prevention

#### What Should Be Tested

**1. Converters**
- `toml_to_json.ts` - Parse TOML → JSON
- `json_to_toml.ts` - Serialize JSON → TOML
- Round-trip fidelity (TOML → JSON → TOML = identical)

**2. Validators**
- Parsing logic
- Error detection
- Error formatting for LLMs
- Edge cases (missing fields, wrong types)

**3. Generators**
- `generate_prompt.ts` - Template substitution
- Placeholder replacement
- Instance data extraction
- Alphabetical sorting

**4. Utilities**
- `health-check.ts` - Retry logic, exponential backoff
- Logger service - Structured logging, circular buffer
- Path resolution - Git absolute paths

#### Current Status

**⚠️ Infrastructure Exists, No Tests Written**

**What's Available:**
- ✅ `vitest` in `tooling/package.json` devDependencies
- ✅ `npm run test` script defined
- ❌ Zero `*.test.ts` or `*.spec.ts` files

**Demo Scripts (Not Formal Tests):**
- `app/orchestrator-api/test-validator.js` - Demonstrates validator
- `app/orchestrator-api/test-validation-flow.js` - Shows validation flow
- `app/orchestrator-ui/test-example1.js` - UI smoke test

#### Implementation Needs

**Required Test Files:**
- `tooling/src/converters/toml_to_json.test.ts`
- `tooling/src/converters/json_to_toml.test.ts`
- `tooling/src/validators/bundle_validator.test.ts`
- `tooling/src/generators/generate_prompt.test.ts`
- `tooling/src/utils/health-check.test.ts`

**Success Criteria:**
- [ ] Test coverage >80%
- [ ] All converters tested for round-trip fidelity
- [ ] All validators tested against valid/invalid inputs
- [ ] All generators tested for template correctness
- [ ] CI/CD integration (run tests on commit)

---

## Test Data Inventory

### Inputs Available

**Location: `examples/test_user_inputs/`**
- ✅ 3 example sites (brainscriptai, greentech, neuraiagency)
- ✅ 4 input types per site (description, URL, landing page, multipage)
- ✅ 12 base test cases ready to use

**Location: `examples/bundles/`**
- ✅ `test_valid_bundle.json` - Schema-compliant bundle
- ✅ `test_invalid_bundle.json` - Known validation failures
- ✅ `site_02_corp_finance.toml` - Production example (TOML)
- ✅ `production_test_*.json` - Real generated bundles

**Location: `data/`**
- ✅ Layer 1-4 instance TOML files (canonical allowed values)
- ✅ Schema TOML files (structural definitions)

### Outputs Locations

**Production Bundles:** `data/output/` (typically empty, manual saves)

**Test Outputs (Planned):** `examples/test_outputs/` (doesn't exist yet)
```
examples/test_outputs/
├── brainscriptai/
│   ├── description_only.json
│   ├── landing_page_only.json
│   ├── multipage_only.json
│   ├── description_plus_landing.json
│   └── consistency_run_{1-10}.json
├── greentech/
│   └── [same structure]
└── neuraiagency/
    └── [same structure]
```

---

## Dependencies Between Levels

```
Level 4 (Unit) → Level 3 (Contract)
  ↓                    ↓
Level 3 (Contract) → Level 2 (Integration)
                       ↓
                  Level 1A (Inter-Annotator)
                       ↓
                  Level 1B (Drift)
                       ↑
                  Requires: Phase 3 (WAS → Visual)
```

**Critical Path:**
1. **L4** validates individual components work
2. **L3** validates bundles comply with schema
3. **L2** validates end-to-end pipeline works
4. **L1A** validates consistency across models
5. **L1B** validates round-trip fidelity (needs Phase 3 visual rendering)

---

## Current Gaps

### Immediate (Phase 2)
- [ ] **L4 unit tests** - Zero tests written despite infrastructure existing
- [ ] **L2 automation** - Test runner for integration scenarios
- [ ] **Test payload generation** - Convert test_user_inputs to API payloads

### Near-Term (Phase 3)
- [ ] **L1D determinism** - Test theme.json consistency
- [ ] **Theme validation** - Validator for generated themes

### Future (Phase 5)
- [ ] **L1B drift measurement** - Full implementation with visual rendering
- [ ] **L1A inter-annotator** - Multi-model comparison testing
- [ ] **L1C reality check** - Dataset analysis against real sites

---

## Recommended Next Steps

### Priority 1: Enable Integration Testing (Level 2)
1. Create test payload generator from test_user_inputs
2. Build automated test runner
3. Implement consistency analyzer (10x runs)
4. Generate baseline metrics

**Why:** Test inputs exist but unused. Quick win to enable systematic testing.

### Priority 2: Add Unit Tests (Level 4)
1. Write converter tests (round-trip)
2. Write validator tests (edge cases)
3. Write generator tests (template correctness)
4. Add to CI/CD pipeline

**Why:** Prevent regressions, fast feedback loop, engineering best practice.

### Priority 3: Plan Phase 3 Testing (Level 1D)
1. Define theme.json validation rules
2. Create determinism test framework
3. Document expected variance thresholds

**Why:** Prepare for Phase 3 translation testing.

---

## Tools and Scripts

### Existing (Working)
- `npm run validate-bundle <file>` - Schema validation (L3)
- `npm run health-check` - API readiness with retry logic
- `npm run convert:toml-to-json <file>` - TOML → JSON
- `npm run convert:json-to-toml <file>` - JSON → TOML
- `npm run generate:prompt` - System prompt generation

### Needed (Not Yet Built)
- `npm run test` - Run unit tests (L4) - vitest configured but no tests
- `npm run test:integration` - Run integration tests (L2)
- `npm run test:generate-payloads` - Create test payloads from inputs
- `npm run test:consistency` - Run consistency analysis
- `npm run test:drift` - Measure drift (Phase 5)

---

## Multi-Level Use of Test Data

The `examples/test_user_inputs/` corpus serves multiple testing levels:

**Level 2 (Integration):**
- Primary use - test multimodal input scenarios
- Validate end-to-end pipeline with real inputs

**Level 1A (Inter-Annotator):**
- Secondary use - run same inputs across different models
- Measure agreement on generated bundles

**Not Applicable:**
- **L1B** - Requires visual rendering (Phase 3)
- **L3** - Uses different data (TOML instances, test bundles)
- **L4** - Component-level, uses synthetic test data

---

## Monitoring and Metrics

### Development Metrics (L4)
- Test coverage: Target >80%
- Test suite pass rate: 100%
- Build time: <2 minutes

### System Health Metrics (L2, L3)
- Validation pass rate: >95% (after retries)
- API uptime: >99%
- Generation success rate: >90%

### Scientific Metrics (L1)
- Inter-annotator agreement: >80% (L1 axes)
- Mean drift score: >0.75
- Baseline variance: <15%
- Output determinism: >90% similarity

---

## References

**Testing Documentation:**
- [Drift Measurement Playbook](drift_measurement.md) - L1B algorithm
- [Validation Rules](validation_rules.md) - L3 requirements
- [TEST_PLAN.md](../../examples/test_user_inputs/TEST_PLAN.md) - L2 scenarios

**Phase Documentation:**
- [Phase 02 - Tooling](../project-management/phases/phase_02_tooling.md) - Current phase
- [Phase 03 - The Second Link](../project-management/phases/phase_03_the_second_link.md) - Translation testing
- [Phase 05 - Drift Measurement](../project-management/phases/phase_05_drift_measurement.md) - L1B implementation

**Architecture:**
- [Design Note Vision](../our_system/system_overview_vision/system_design_note_vision.md) - Scientific method for design

---

**Version History:**
- v1.0 (2025-11-28) - Initial comprehensive testing strategy documentation
