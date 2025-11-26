#!/usr/bin/env node
/**
 * WAS Orchestrator Prompt Generator
 *
 * Reads schema and data files from the repo and generates the full
 * orchestrator system prompt by replacing placeholders in the template.
 *
 * Usage: npm run generate:prompt
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as TOML from '@iarna/toml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '../../..');

// File paths
const PATHS = {
  template: join(REPO_ROOT, 'prompts/orchestrator_template.md'),
  output: join(REPO_ROOT, 'prompts/orchestrator_system_prompt.md'),
  layer1_instances: join(REPO_ROOT, 'data/layer1_dimensions_instances.toml'),
  layer2_instances: join(REPO_ROOT, 'data/layer2_website_style_family_instances.toml'),
  layer3_instances: join(REPO_ROOT, 'data/layer3_lexicon_instances.toml'),
  layer4_instances: join(REPO_ROOT, 'data/layer4_societal_trends_instances.toml'),
};

// Placeholders
const SCHEMA_PLACEHOLDER = '{{WAS_BUNDLE_SCHEMA}}';
const VALUES_PLACEHOLDER = '{{WAS_ALLOWED_VALUES}}';

interface DimensionValue {
  id: string;
  label: string;
  summary: string;
  position?: number;
}

interface Dimension {
  id: string;
  label: string;
  type: string;
  description: string;
  scale_explanation?: string;
  values: DimensionValue[];
}

interface LexiconTerm {
  id: string;
  label: string;
  kind: string;
  domain: string;
  definition: string;
}

interface Trend {
  id: string;
  label?: string;
}

/**
 * Read and parse a TOML file
 */
function readToml(path: string): any {
  try {
    const content = readFileSync(path, 'utf-8');
    return TOML.parse(content);
  } catch (error: any) {
    console.error(`\n❌ TOML Parsing Error in: ${path}`);
    console.error(`   ${error.message || error}\n`);

    if (error.line) {
      console.error(`   Problem at line ${error.line}, column ${error.col}`);
      console.error(`   This usually means:`);
      console.error(`   - Multiple key-value pairs on one line (need line breaks)`);
      console.error(`   - Invalid TOML syntax (unclosed quotes, brackets, etc.)`);
      console.error(`\n   Please fix the TOML file formatting and try again.\n`);
    }

    process.exit(1);
  }
}

/**
 * Generate the WAS Bundle Schema section
 */
function generateBundleSchema(): string {
  return `\`\`\`json
{
  "meta": {
    "intent_keywords": ["keyword1", "keyword2"],
    "reasoning_notes": "Brief explanation of your interpretation"
  },
  "layer1_axes": {
    "tone": "neutral",
    "lightness": "dark",
    "color_strategy": "neutral_plus_accent",
    "geometry_depth": {
      "shape": "rounded",
      "depth": "soft_shadow"
    },
    "density": "balanced",
    "decoration": "subtle"
  },
  "layer2_styles": {
    "glassmorphism": 0.8,
    "minimalism": 0.4
  },
  "layer3_lexicon": {
    "visual_atmosphere": "glass_and_glow",
    "palette_trait": "neon_accents",
    "surface_texture": "glass_panel",
    "component_styling": "ghost_chrome",
    "depth_technique": "diffuse_shadow",
    "typography_mechanics": "grotesque_sans",
    "motion_mechanics": "springy_motion"
  },
  "layer4_trends": {
    "saas_2020_dark_mode": 0.7
  }
}
\`\`\``;
}

/**
 * Generate Layer 1 allowed values section
 */
function generateLayer1Values(): string {
  const data = readToml(PATHS.layer1_instances);
  const dimensions = data.dimensions as Dimension[];

  let output = '### Layer 1: Allowed Dimension Values\n\n';

  for (const dim of dimensions) {
    const typeInfo = dim.type === 'ordinal' ? ' (ordinal)' : dim.type === 'compound' ? ' (compound)' : ' (categorical)';
    output += `**${dim.id}**${typeInfo}:\n`;

    if (dim.type === 'compound') {
      // Group compound dimension values by subdimension
      const shapeValues = dim.values.filter((v: any) => v.subdimension === 'shape');
      const depthValues = dim.values.filter((v: any) => v.subdimension === 'depth');

      if (shapeValues.length > 0) {
        output += `- **shape**: ${shapeValues.map(v => `\`${v.id}\``).join(', ')}\n`;
      }
      if (depthValues.length > 0) {
        output += `- **depth**: ${depthValues.map(v => `\`${v.id}\``).join(', ')}\n`;
      }
    } else {
      // Regular dimension
      for (const val of dim.values) {
        const positionInfo = val.position !== undefined ? ` (${val.position})` : '';
        output += `- \`${val.id}\`${positionInfo}: ${val.summary}\n`;
      }
    }

    output += '\n';
  }

  return output;
}

/**
 * Generate Layer 2 allowed values section
 */
function generateLayer2Values(): string {
  const data = readToml(PATHS.layer2_instances);

  if (!data.styles || !Array.isArray(data.styles)) {
    return '### Layer 2: Allowed Style Families\n\n(No styles defined)\n\n';
  }

  // Sort styles alphabetically by id
  const styles = [...data.styles].sort((a: any, b: any) => a.id.localeCompare(b.id));

  let output = '### Layer 2: Allowed Style Families\n\n';
  output += 'Available styles (sorted alphabetically):\n\n';

  for (const style of styles) {
    // Use notes field or display_name as brief description
    let description = '';
    if (style.notes) {
      // Take first sentence
      const firstSentence = style.notes.split(/\.\s+/)[0];
      description = firstSentence.length > 120
        ? firstSentence.substring(0, 117) + '...'
        : firstSentence + '.';
    } else if (style.display_name && style.display_name !== style.id) {
      description = style.display_name;
    }

    if (description) {
      output += `- \`${style.id}\` - ${description}\n`;
    } else {
      output += `- \`${style.id}\`\n`;
    }
  }

  output += '\n';
  return output;
}

/**
 * Generate Layer 3 allowed values section
 */
function generateLayer3Values(): string {
  const data = readToml(PATHS.layer3_instances);
  const terms = data.terms as LexiconTerm[];

  // Group terms by kind with full term objects
  const byKind: Record<string, any[]> = {};
  for (const term of terms) {
    if (!byKind[term.kind]) {
      byKind[term.kind] = [];
    }
    byKind[term.kind].push(term);
  }

  let output = '### Layer 3: Lexicon Terms\n\n';
  output += 'Specific visual traits grouped by category. Each term includes a brief definition.\n\n';

  // Kind descriptions
  const kindDescriptions: Record<string, string> = {
    visual_atmosphere: 'Overall mood, lighting quality, or aesthetic tone',
    palette_trait: 'Color approach and palette characteristics',
    surface_texture: 'Material qualities and texture effects',
    component_styling: 'UI component shapes and styling approaches',
    depth_technique: 'Shadow and depth rendering methods',
    typography_mechanics: 'Font selection and text rendering approaches',
    illustration_style: 'Illustration and graphic rendering styles',
    motion_mechanics: 'Animation and motion behavior patterns'
  };

  // Sort kinds alphabetically for consistency
  const kinds = Object.keys(byKind).sort();

  for (const kind of kinds) {
    const label = kind.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const description = kindDescriptions[kind] || '';

    output += `**${label}**`;
    if (description) {
      output += ` (${description})`;
    }
    output += ':\n';

    // Sort terms within kind alphabetically
    const sortedTerms = byKind[kind].sort((a, b) => a.id.localeCompare(b.id));

    for (const term of sortedTerms) {
      // Extract brief definition (first sentence, max 100 chars)
      let briefDef = '';
      if (term.definition) {
        const firstSentence = term.definition.split(/\.\s+/)[0];
        briefDef = firstSentence.length > 100
          ? firstSentence.substring(0, 97) + '...'
          : firstSentence;
      }

      if (briefDef) {
        output += `- \`${term.id}\` - ${briefDef}\n`;
      } else {
        output += `- \`${term.id}\`\n`;
      }
    }
    output += '\n';
  }

  output += '(Note: Use only IDs that exist above. If uncertain about a term, omit it.)\n\n';

  return output;
}

/**
 * Generate Layer 4 allowed values section
 */
function generateLayer4Values(): string {
  try {
    const data = readToml(PATHS.layer4_instances);

    // Check if trends exist in the data
    if (!data.trends || !Array.isArray(data.trends) || data.trends.length === 0) {
      console.warn('⚠️  Warning: No trends found in layer4_societal_trends_instances.toml');
      console.warn('   The file may not be populated yet. Skipping Layer 4.\n');
      return '### Layer 4: Trend Context\n\n(No trends defined yet)\n\n';
    }

    const trends = data.trends as any[];

    // Sort trends alphabetically by id
    const sortedTrends = [...trends].sort((a, b) => a.id.localeCompare(b.id));

    let output = '### Layer 4: Trend Context\n\n';
    output += 'Cultural and societal trends that influence aesthetics (sorted alphabetically).\n';
    output += 'Each trend includes context about its visual characteristics and cultural moment.\n\n';

    for (const trend of sortedTrends) {
      // Extract brief summary (first 2 sentences, max 150 chars)
      let briefSummary = '';
      if (trend.summary) {
        const sentences = trend.summary.split(/\.\s+/);
        const firstTwo = sentences.slice(0, 2).join('. ');
        briefSummary = firstTwo.length > 150
          ? firstTwo.substring(0, 147) + '...'
          : firstTwo + (firstTwo.endsWith('.') ? '' : '.');
      }

      // Add label if available
      const label = trend.label ? ` (${trend.label})` : '';

      if (briefSummary) {
        output += `- \`${trend.id}\`${label} - ${briefSummary}\n`;
      } else {
        output += `- \`${trend.id}\`${label}\n`;
      }
    }

    output += '\n';
    return output;
  } catch (error) {
    console.warn('⚠️  Warning: Could not read layer4_societal_trends_instances.toml');
    console.warn('   Skipping Layer 4.\n');
    return '### Layer 4: Trend Context\n\n(File not available)\n\n';
  }
}

/**
 * Generate the complete allowed values section
 */
function generateAllowedValues(): string {
  let output = '';

  output += generateLayer1Values();
  output += generateLayer2Values();
  output += generateLayer3Values();
  output += generateLayer4Values();

  return output.trim();
}

/**
 * Validate that hardcoded example uses only valid IDs from instance data
 */
function validateHardcodedExample(): void {
  const errors: string[] = [];

  // Load instance data
  const layer1Data = readToml(PATHS.layer1_instances);
  const layer2Data = readToml(PATHS.layer2_instances);
  const layer3Data = readToml(PATHS.layer3_instances);
  const layer4Data = readToml(PATHS.layer4_instances);

  // Extract valid IDs
  const validL1Values = new Set<string>();
  for (const dim of layer1Data.dimensions) {
    for (const val of dim.values) {
      validL1Values.add(val.id);
    }
  }

  const validL2Styles = new Set<string>();
  if (layer2Data.styles) {
    for (const style of layer2Data.styles) {
      validL2Styles.add(style.id);
    }
  }

  const validL3Terms = new Set<string>();
  if (layer3Data.terms) {
    for (const term of layer3Data.terms) {
      validL3Terms.add(term.id);
    }
  }

  const validL4Trends = new Set<string>();
  if (layer4Data.trends) {
    for (const trend of layer4Data.trends) {
      validL4Trends.add(trend.id);
    }
  }

  // Hardcoded values from generateBundleSchema()
  const exampleL1 = {
    tone: 'neutral',
    lightness: 'dark',
    color_strategy: 'neutral_plus_accent',
    geometry_depth_shape: 'rounded',
    geometry_depth_depth: 'soft_shadow',
    density: 'balanced',
    decoration: 'subtle'
  };

  const exampleL2 = ['glassmorphism', 'minimalism'];
  const exampleL3 = [
    'glass_and_glow',
    'neon_accents',
    'glass_panel',
    'ghost_chrome',
    'diffuse_shadow',
    'grotesque_sans',
    'springy_motion'
  ];
  const exampleL4 = ['saas_2020_dark_mode'];

  // Validate L1
  for (const [dim, value] of Object.entries(exampleL1)) {
    if (!validL1Values.has(value)) {
      errors.push(`L1 ${dim}: "${value}" is not a valid ID`);
    }
  }

  // Validate L2
  for (const style of exampleL2) {
    if (!validL2Styles.has(style)) {
      errors.push(`L2 style: "${style}" is not a valid ID`);
    }
  }

  // Validate L3
  for (const term of exampleL3) {
    if (!validL3Terms.has(term)) {
      errors.push(`L3 lexicon term: "${term}" is not a valid ID`);
    }
  }

  // Validate L4
  for (const trend of exampleL4) {
    if (!validL4Trends.has(trend)) {
      errors.push(`L4 trend: "${trend}" is not a valid ID`);
    }
  }

  // Report errors
  if (errors.length > 0) {
    console.error('\n❌ Validation Error: Hardcoded example contains invalid IDs:\n');
    for (const error of errors) {
      console.error(`   • ${error}`);
    }
    console.error('\n   Please update generateBundleSchema() with valid IDs.\n');
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔧 WAS Orchestrator Prompt Generator\n');

  // Read template
  console.log('📖 Reading template...');
  let template: string;
  try {
    template = readFileSync(PATHS.template, 'utf-8');
  } catch (error) {
    console.error(`❌ Error: Could not read template file at ${PATHS.template}`);
    console.error('   Make sure the file exists.');
    process.exit(1);
  }

  // Check for placeholders
  console.log('🔍 Checking for placeholders...');
  const hasSchemaPlaceholder = template.includes(SCHEMA_PLACEHOLDER);
  const hasValuesPlaceholder = template.includes(VALUES_PLACEHOLDER);

  if (!hasSchemaPlaceholder) {
    console.error(`❌ Error: Missing placeholder ${SCHEMA_PLACEHOLDER} in template`);
    console.error('   Add this placeholder where the WAS Bundle schema should appear.');
    process.exit(1);
  }

  if (!hasValuesPlaceholder) {
    console.error(`❌ Error: Missing placeholder ${VALUES_PLACEHOLDER} in template`);
    console.error('   Add this placeholder where the allowed values should appear.');
    process.exit(1);
  }

  console.log('✅ Both placeholders found\n');

  // Validate hardcoded example
  console.log('✅ Validating hardcoded example...');
  validateHardcodedExample();

  // Generate content
  console.log('🎨 Generating WAS Bundle Schema...');
  const bundleSchema = generateBundleSchema();

  console.log('📋 Extracting Layer 1 values...');
  console.log('📋 Extracting Layer 2 values...');
  console.log('📋 Extracting Layer 3 values...');
  console.log('📋 Extracting Layer 4 values...');
  const allowedValues = generateAllowedValues();

  // Replace placeholders
  console.log('\n🔄 Replacing placeholders...');
  let output = template;
  output = output.replace(SCHEMA_PLACEHOLDER, bundleSchema);
  output = output.replace(VALUES_PLACEHOLDER, allowedValues);

  // Write output
  console.log('💾 Writing output...');
  try {
    writeFileSync(PATHS.output, output, 'utf-8');
    console.log(`✅ Generated: ${PATHS.output}`);
  } catch (error) {
    console.error(`❌ Error writing output file:`, error);
    process.exit(1);
  }

  console.log('\n✨ Done! The orchestrator system prompt has been generated.');
  console.log('📄 Output file:', PATHS.output);
}

// Run
main();
