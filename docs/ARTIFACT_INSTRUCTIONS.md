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
import { AlertCircle, Sparkles, Copy, ChevronDown, ChevronUp, Image } from 'lucide-react';

// VERSION: 1.0.6
// Last updated: 2025-11-21
// Changes: Added image upload for screenshot analysis

// Orchestrator System Prompt (condensed for artifact)
const SYSTEM_PROMPT = `You are the WAS Orchestrator. Translate design ideas into structured WAS Bundles.

## Output Format (JSON only, no markdown):
{
  "meta": {
    "intent_keywords": ["keyword1", "keyword2"],
    "reasoning_notes": "Brief explanation"
  },
  "layer1_axes": {
    "tone": "playful|friendly|neutral|serious|premium",
    "lightness": "light|dark|hybrid|adaptive",
    "color_strategy": "monochrome|neutral_plus_accent|duotone|brand_multicolor|gradient_heavy|high_chroma|low_saturation",
    "geometry_depth": {
      "shape": "sharp|slightly_rounded|rounded|organic",
      "depth": "flat|soft_shadow|neumorphic|glass|bold_3d"
    },
    "density": "airy|balanced|dense|maximal",
    "decoration": "plain|subtle|decorative|experimental"
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

**L4 Trends:** saas_2020_dark_mode, saas_startup_2018, y2k_futurism, dark_academia, cottagecore, cyberpunk, hygge_2016, minimalist_living, vaporwave, and others (37 total)

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
  const [debugInfo, setDebugInfo] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data URL prefix
      setUploadedImage({
        base64,
        mediaType: file.type,
        preview: reader.result
      });
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  const generateBundle = async () => {
    if (!input.trim() && !uploadedImage) return;

    setLoading(true);
    setError(null);
    setOutput(null);
    setDebugInfo(null);

    try {
      // Build the message content
      const messageContent = [];
      
      // Add image if uploaded
      if (uploadedImage) {
        messageContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: uploadedImage.mediaType,
            data: uploadedImage.base64
          }
        });
      }

      // Add text prompt
      const promptText = uploadedImage 
        ? `Analyze this website screenshot and generate a WAS Bundle that captures its aesthetic.\n\n${input || 'Describe the visual style, color scheme, typography, and overall design approach.'}\n\nGenerate a WAS Bundle (JSON only, no markdown):`
        : `Design Idea:\n${input}\n\nGenerate a WAS Bundle (JSON only, no markdown):`;
      
      messageContent.push({
        type: "text",
        text: promptText
      });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [
            { 
              role: "user", 
              content: messageContent
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Result:', result);

      // Extract text from the response
      const jsonStr = result.content[0].text.trim();

      // Remove markdown code blocks if present
      const cleanedStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      console.log('JSON string to parse:', cleanedStr);
      
      // Store debug info
      setDebugInfo({
        rawResponse: cleanedStr,
        responseLength: cleanedStr.length
      });

      const parsed = JSON.parse(cleanedStr);
      setOutput(parsed);
    } catch (err) {
      console.error('Error details:', err);
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
          Translate design ideas or website screenshots into Website Aesthetic Schema (WAS) Bundles
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

      {/* Image Upload Section */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Upload Website Screenshot (Optional)
        </label>
        
        {!uploadedImage ? (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#1a1a1a',
                border: '1px dashed #666',
                borderRadius: '8px',
                color: '#e0e0e0',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#1f1f2e';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#666';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <Image size={18} />
              Choose Screenshot
            </label>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Upload a screenshot to analyze its aesthetic
            </p>
          </div>
        ) : (
          <div style={{
            padding: '16px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <img
                src={uploadedImage.preview}
                alt="Uploaded screenshot"
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  borderRadius: '4px',
                  border: '1px solid #333'
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>
                  Screenshot uploaded ✓
                </p>
                <button
                  onClick={clearImage}
                  style={{
                    padding: '6px 12px',
                    background: '#2a1a1a',
                    border: '1px solid #ff4444',
                    borderRadius: '6px',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Design Idea {uploadedImage && '(Optional - adds context to image)'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={uploadedImage 
            ? "Add optional context or specific aspects to focus on..." 
            : "Describe the aesthetic you want (e.g., 'A dark-mode SaaS dashboard with glass panels and neon accents...')"}
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
        disabled={loading || (!input.trim() && !uploadedImage)}
        style={{
          padding: '12px 24px',
          background: loading ? '#333' : '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'wait' : 'pointer',
          opacity: (!input.trim() && !uploadedImage) ? 0.5 : 1,
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

      {/* Debug Info */}
      {debugInfo && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#1a1a1a',
          border: '1px solid #ff9800',
          borderRadius: '8px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#ff9800' }}>
            Debug Info
          </h4>
          {debugInfo.rawResponse !== undefined && (
            <>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                Response length: {debugInfo.responseLength} characters
              </p>
              <pre style={{
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                color: '#ff9800',
                maxHeight: '300px',
                whiteSpace: 'pre-wrap'
              }}>
                {debugInfo.rawResponse || '(empty response)'}
              </pre>
            </>
          )}
          {debugInfo.result && (
            <>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                Raw API result structure:
              </p>
              <pre style={{
                padding: '12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                color: '#ff9800',
                maxHeight: '300px',
                whiteSpace: 'pre-wrap'
              }}>
                {debugInfo.result}
              </pre>
            </>
          )}
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

      {/* Version Footer */}
      <div style={{
        marginTop: '48px',
        paddingTop: '24px',
        borderTop: '1px solid #333',
        textAlign: 'center',
        fontSize: '11px',
        color: '#666'
      }}>
        WAS Orchestrator v1.0.6 • Last updated: 2025-11-21
      </div>
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
