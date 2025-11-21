# WAS Orchestrator Artifact — For Claude Chat

## Overview

This is a **single-page React artifact** you can paste into **Claude Chat** to test the WAS Orchestrator system prompt interactively.

## Features

- Input design ideas (text descriptions)
- Calls Claude API via `window.claude.complete()` (no API key needed!)
- Displays the generated WAS Bundle JSON
- Includes example prompts to try
- Shows the full system prompt (collapsible)
- Copy JSON output to clipboard

## How to Use

1. Open **Claude Chat** (claude.ai)
2. Paste the code below into a message and ask Claude to "Create an artifact with this code"
3. The artifact will appear in the side panel
4. Enter a design idea and click "Generate WAS Bundle"
5. The usage counts against YOUR Claude plan (no extra charges)

---

## Artifact Code

```jsx
import React, { useState } from 'react';
import { AlertCircle, Sparkles, Copy, ChevronDown, ChevronUp } from 'lucide-react';

// Orchestrator System Prompt (condensed for artifact)
const SYSTEM_PROMPT = `You are the WAS Orchestrator. Translate design ideas into structured WAS Bundles.

## Output Format (JSON only, no markdown):
{
  "meta": {
    "intent_keywords": ["keyword1", "keyword2"],
    "reasoning_notes": "Brief explanation"
  },
  "layer1_axes": {
    "tone": "neutral|playful|friendly|serious|premium",
    "lightness": "light|dark|hybrid|adaptive",
    "color_strategy": "monochrome|analogous|complementary|triadic|neutral_accent|pastel_harmony|high_chroma",
    "geometry_depth": {
      "shape": "sharp|rounded|organic",
      "depth": "flat|soft_embossed|layered|glass"
    },
    "density": "sparse|balanced|compact|dense",
    "decoration": "plain|subtle|decorative|maximalist"
  },
  "layer2_styles": {
    "style_id": 0.0-1.0
  },
  "layer3_lexicon": {
    "visual_atmosphere": "golden_hour|glass_and_glow|clinical_sterile|warm_minimalism",
    "palette_trait": "duotone_palette|pastel_palette|neon_accents|muted_earth_tones",
    "surface_texture": "mesh_gradient|grain_texture|glass_panel",
    "component_styling": "pill_shape|sharp_corner|ghost_chrome|filled_chrome",
    "depth_technique": "hard_shadow|diffuse_shadow|inner_shadow",
    "typography_mechanics": "mono_ui|display_serif|grotesque_sans",
    "motion_mechanics": "springy_motion|linear_instant"
  },
  "layer4_trends": {
    "trend_id": 0.0-1.0
  }
}

## Allowed Values:
**L2 Styles:** glassmorphism, minimalism, brutalism, neobrutalism, material_design, flat_design, swiss_style, art_deco, art_nouveau, memphis_design, corporate_memphis, cyberpunk, retro_futurism, neumorphism, claymorphism, grunge, psychedelic_design, maximalism

**L3 Lexicon Examples:** golden_hour, glass_and_glow, clinical_sterile, warm_minimalism, duotone_palette, pastel_palette, neon_accents, mesh_gradient, grain_texture, glass_panel, pill_shape, sharp_corner, ghost_chrome, hard_shadow, diffuse_shadow, mono_ui, display_serif, grotesque_sans, isometric_scene, flat_spot_illustration, 3d_blob, springy_motion, linear_instant

**L4 Trends:** saas_2020_dark_mode, y2k_revival, dark_academia, cottagecore, cyberpunk_2077_influence

## Reasoning Strategy:
1. Context Analysis (purpose, audience, emotion)
2. Derive L1 Axes (physics first)
3. Map L2 Styles (named references)
4. Select L3 Lexicon (visual atoms)
5. Add L4 Trends (cultural context)

Only use valid IDs. Be conservative. Output ONLY valid JSON.`;

const EXAMPLE_PROMPTS = [
  "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron.",
  "A playful, colorful portfolio site for a children's book illustrator. Lots of rounded shapes and pastel colors.",
  "An ultra-minimal, clinical e-commerce site for luxury skincare. White backgrounds, lots of space, subtle serif fonts.",
  "A brutalist blog for tech reviews. Sharp corners, high contrast, monospace fonts, no decorations.",
  "A warm, earthy wellness app with organic shapes and muted colors. Feels like a cozy journal."
];

export default function WASOrchestrator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const generateBundle = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await window.claude.complete({
        system: SYSTEM_PROMPT,
        prompt: `Design Idea:\n${input}\n\nGenerate a WAS Bundle (JSON only, no markdown):`,
        temperature: 0.7,
      });

      // Extract JSON from response
      let jsonStr = result.completion.trim();

      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      const parsed = JSON.parse(jsonStr);
      setOutput(parsed);
    } catch (err) {
      setError(err.message || 'Failed to generate bundle');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
  };

  const loadExample = (example) => {
    setInput(example);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      background: '#0f0f0f',
      color: '#e0e0e0',
      minHeight: '100vh'
    }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '28px',
          margin: '0 0 8px 0'
        }}>
          <Sparkles size={32} color="#6366f1" />
          WAS Orchestrator
        </h1>
        <p style={{ color: '#999', margin: 0 }}>
          Translate design ideas into Website Aesthetic Schema (WAS) Bundles
        </p>
      </header>

      {/* System Prompt Toggle */}
      <div style={{
        marginBottom: '24px',
        border: '1px solid #333',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#1a1a1a',
            border: 'none',
            color: '#e0e0e0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <span>System Prompt</span>
          {showPrompt ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showPrompt && (
          <pre style={{
            padding: '16px',
            background: '#0a0a0a',
            color: '#888',
            fontSize: '11px',
            overflow: 'auto',
            maxHeight: '300px',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
            {SYSTEM_PROMPT}
          </pre>
        )}
      </div>

      {/* Example Prompts */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#999' }}>
          Try an example:
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXAMPLE_PROMPTS.map((example, i) => (
            <button
              key={i}
              onClick={() => loadExample(example)}
              style={{
                padding: '8px 12px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#999',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.color = '#e0e0e0';
              }}
              onMouseOut={e => {
                e.target.style.borderColor = '#333';
                e.target.style.color = '#999';
              }}
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Design Idea
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe the aesthetic you want (e.g., 'A dark-mode SaaS dashboard with glass panels and neon accents...')"
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#e0e0e0',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateBundle}
        disabled={loading || !input.trim()}
        style={{
          padding: '12px 24px',
          background: loading ? '#333' : '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'wait' : 'pointer',
          opacity: !input.trim() ? 0.5 : 1,
          transition: 'all 0.2s'
        }}
      >
        {loading ? 'Generating...' : 'Generate WAS Bundle'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#2a1a1a',
          border: '1px solid #ff4444',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="#ff4444" />
          <div>
            <strong style={{ color: '#ff4444' }}>Error</strong>
            <p style={{ margin: '4px 0 0', color: '#e0e0e0' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div style={{ marginTop: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Generated WAS Bundle
            </h3>
            <button
              onClick={copyOutput}
              style={{
                padding: '6px 12px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#e0e0e0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px'
              }}
            >
              <Copy size={14} />
              Copy JSON
            </button>
          </div>

          <pre style={{
            padding: '16px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px',
            color: '#00d9ff',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(output, null, 2)}
          </pre>

          {/* Quick Summary */}
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Quick Summary
            </h4>
            <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
              <p><strong>Reasoning:</strong> {output.meta?.reasoning_notes}</p>
              <p><strong>Tone:</strong> {output.layer1_axes?.tone}</p>
              <p><strong>Lightness:</strong> {output.layer1_axes?.lightness}</p>
              <p><strong>Styles:</strong> {Object.entries(output.layer2_styles || {}).map(([k, v]) => `${k} (${v})`).join(', ') || 'None'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Instructions for Claude Chat

Copy the artifact code above and paste this into **Claude Chat**:

```
Please create a React artifact with this code:

[paste the entire JSX code block above]

This is a WAS Orchestrator that lets me test aesthetic design translations interactively.
```

---

## What You Can Do With It

1. **Test the Orchestrator prompt** without setting up Node.js
2. **Try different design ideas** and see the JSON output
3. **Iterate on the system prompt** by editing the artifact in Claude Chat
4. **Share it** with your team (Artifacts can be shared via URL)
5. **Use it to generate example shots** for the template I created

---

## Limitations

- Single-page only (but perfect for this use case!)
- Uses your Claude plan usage (same as chatting)
- No file upload (text inputs only for now)
- Runs in Claude's sandbox (secure but limited)

---

## Next Steps

1. Create this artifact in Claude Chat
2. Test the orchestrator with various inputs
3. Use it to fill out `prompts/example_shots_template.md`
4. Share feedback on the system prompt quality
5. We can iterate on the prompt based on results

Let me know if you want me to adjust anything about the artifact!
