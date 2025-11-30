# Test User Inputs - Index

**Purpose:** Multimodal test inputs for WAS Orchestrator validation and consistency testing

**Last Updated:** 2025-11-28

---

## Overview

This directory contains 3 real-world website examples, each with 4 different input types that can be used individually or in combination to test the WAS Orchestrator's ability to generate bundles from varied inputs.

**Total Test Cases:**
- 3 example sites
- 4 input types per site
- 12 base test cases (or more with combinations)

---

## Example Sites

### 1. BrainScript AI
**Theme:** Dark-mode AI SaaS with neon accents
**Aesthetic:** Tech, futuristic, modern, glowing UI elements
**Target Use Case:** AI software platform, developer tools

**Files:**
- `brainscriptai_description.md` - Natural language description from user perspective
- `brainscriptai_url.md` - Live site URL
- `brainscriptai_website.png` - Landing page screenshot (1101×636px)
- `brainscriptai_blocks.png` - Multi-page mockup (1101×689px)

**Expected WAS Characteristics:**
- **Tone:** techy/serious
- **Lightness:** dark
- **Color Strategy:** duotone_palette
- **Notable Styles:** Glassmorphism, dark mode, neon accents

---

### 2. Greentech
**Theme:** Green eco-friendly fintech/consulting
**Aesthetic:** Calm, professional, corporate, trustworthy
**Target Use Case:** Financial services, consulting, professional services

**Files:**
- `greentech_description.md` - Natural language description from user perspective
- `greentech_url.md` - Live site URL
- `greentech_website.png` - Landing page screenshot
- `greentech_blocks.png` - Multi-page mockup

**Expected WAS Characteristics:**
- **Tone:** serious/professional
- **Lightness:** light
- **Color Strategy:** monochromatic_palette (green-focused)
- **Notable Styles:** Clean layouts, spacious, people-focused

---

### 3. NeurAIGency
**Theme:** Clean AI startup with blue/white scheme
**Aesthetic:** Professional, modern, polished, minimal color palette
**Target Use Case:** AI solutions company, digital consulting

**Files:**
- `neuraiagency_description.md` - Natural language description from user perspective
- `neuraiagency_url.md` - Live site URL
- `neuraiagency_website.png` - Landing page screenshot
- `neuraiagency_blocks.png` - Multi-page mockup

**Expected WAS Characteristics:**
- **Tone:** serious/professional
- **Lightness:** light
- **Color Strategy:** analogous_palette (blue tones)
- **Notable Styles:** Clean, modern, grid layouts, illustrations

---

## File Naming Convention

Each example follows a consistent pattern:
```
{site_name}/
├── {site_name}_description.md    # Text-only user input
├── {site_name}_url.md             # URL reference
├── {site_name}_website.png        # Landing page screenshot
├── {site_name}_blocks.png         # Multi-page mockup
└── other_info/                    # Metadata (not for testing)
```

---

## Input Types

### 1. Description (Text-Only)
**File:** `*_description.md`
**Format:** Natural language paragraph describing the site's aesthetic
**Use Case:** Test LLM's ability to interpret vague, subjective descriptions
**Example Test:** Text-only input → WAS bundle

### 2. URL Reference
**File:** `*_url.md`
**Format:** Single line with live site URL
**Use Case:** Test URL-based analysis (if fetching enabled)
**Example Test:** URL → WAS bundle

### 3. Landing Page Screenshot
**File:** `*_website.png`
**Format:** PNG image of homepage
**Use Case:** Test visual analysis via vision-enabled LLM
**Example Test:** Image-only → WAS bundle

### 4. Multi-Page Mockup
**File:** `*_blocks.png`
**Format:** PNG showing multiple page sections
**Use Case:** Test analysis of broader site patterns
**Example Test:** Multi-page image → WAS bundle

---

## Test Scenarios

### Single-Input Tests
Run each input type independently:
1. Description only → bundle
2. URL only → bundle
3. Landing page image only → bundle
4. Multi-page image only → bundle

**Expected:** All should generate valid bundles

### Multi-Modal Tests
Combine inputs for richer context:
1. Description + landing page → bundle
2. URL + description → bundle
3. Description + multi-page → bundle

**Expected:** Combined inputs produce more detailed/accurate bundles

### Consistency Tests
Run same input multiple times (10x):
1. Same description → 10 bundles
2. Same image → 10 bundles

**Expected:** >80% consistency on Layer 1 axes across runs

---

## Usage

### Manual Testing via UI
1. Open Orchestrator UI (http://localhost:5173)
2. Upload image from `examples/test_user_inputs/{site}/`
3. Add description text from corresponding `*_description.md`
4. Generate bundle
5. Verify validation passes

### Automated Testing (Planned)
```bash
# Generate test payloads from inputs
npm run test:generate-payloads

# Run full test suite
npm run test:orchestrator

# Analyze consistency
npm run test:consistency
```

### API Testing via curl
```bash
# Test with image (base64 encoded)
curl -X POST http://localhost:3001/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Analyze this website",
    "image": {
      "base64": "...",
      "mediaType": "image/png"
    }
  }'
```

---

## Test Outputs Location

**Planned:** `examples/test_outputs/`

```
examples/test_outputs/
├── brainscriptai/
│   ├── description_only.json
│   ├── url_only.json
│   ├── landing_page_only.json
│   ├── multipage_only.json
│   ├── description_plus_image.json
│   └── consistency_run_{1-10}.json
├── greentech/
│   └── [same structure]
└── neuraiagency/
    └── [same structure]
```

---

## Diversity Coverage

These 3 examples cover:

**Tone Range:**
- Serious/professional (all 3)
- Tech/futuristic (brainscriptai)
- Corporate/trustworthy (greentech, neuraiagency)

**Lightness:**
- Dark mode (brainscriptai)
- Light mode (greentech, neuraiagency)

**Color Strategies:**
- Duotone (brainscriptai - dark + neon)
- Monochromatic (greentech - green focus)
- Analogous (neuraiagency - blue tones)

**Industries:**
- AI/Tech (brainscriptai, neuraiagency)
- Finance/Consulting (greentech)

**Visual Styles:**
- Futuristic/glowing (brainscriptai)
- Clean/minimal (neuraiagency)
- Professional/spacious (greentech)

---

## Related Documentation

- **Test Plan:** [TEST_PLAN.md](TEST_PLAN.md) - Detailed test scenarios and success criteria
- **Testing Overview:** [docs/05_guides_and_playbooks/testing/testing_overview.md](../../docs/05_guides_and_playbooks/testing/testing_overview.md) - Complete testing strategy
- **Validation Rules:** [docs/05_guides_and_playbooks/testing/validation_rules.md](../../docs/05_guides_and_playbooks/testing/validation_rules.md) - Schema compliance requirements

---

## Future Additions

To improve test coverage, consider adding:
- [ ] Playful/friendly tone example (currently all serious)
- [ ] Portfolio/personal site (currently all corporate/tech)
- [ ] E-commerce example
- [ ] Blog/content-focused site
- [ ] More color strategy variety (complementary, triadic)
- [ ] Experimental/artistic example (high decoration axis)

---

**Version:** 1.0
**Status:** Ready for automated testing implementation
