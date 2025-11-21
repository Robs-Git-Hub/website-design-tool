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
  layer1_registry: join(REPO_ROOT, 'registries/layer1_dimensions_registry.toml'),
  layer2_instances: join(REPO_ROOT, 'data/layer2_website_style_family_instances.toml'),
  layer2_registry: join(REPO_ROOT, 'registries/layer2_website_style_family_registry.toml'),
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
    "color_strategy": "neutral_accent",
    "geometry_depth": {
      "shape": "rounded",
      "depth": "layered"
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
  // Try registry first, fall back to instances
  let allowed: string[] = [];

  try {
    const registryData = readToml(PATHS.layer2_registry);
    if (registryData.styles && registryData.styles.allowed) {
      allowed = registryData.styles.allowed as string[];
    }
  } catch (error) {
    // Registry might be empty or malformed
  }

  // If registry is empty, extract from instances
  if (allowed.length === 0) {
    const instancesData = readToml(PATHS.layer2_instances);
    if (instancesData.styles && Array.isArray(instancesData.styles)) {
      allowed = instancesData.styles.map((style: any) => style.id);
    }
  }

  let output = '### Layer 2: Allowed Style Families\n\n';
  output += 'Available style IDs (use exact strings):\n';
  output += allowed.map(id => `- \`${id}\``).join('\n');
  output += '\n\n';

  return output;
}

/**
 * Generate Layer 3 allowed values section
 */
function generateLayer3Values(): string {
  const data = readToml(PATHS.layer3_instances);
  const terms = data.terms as LexiconTerm[];

  // Group terms by kind
  const byKind: Record<string, string[]> = {};
  for (const term of terms) {
    if (!byKind[term.kind]) {
      byKind[term.kind] = [];
    }
    byKind[term.kind].push(term.id);
  }

  let output = '### Layer 3: Lexicon Terms\n\n';

  // Sort kinds alphabetically for consistency
  const kinds = Object.keys(byKind).sort();

  for (const kind of kinds) {
    const label = kind.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    output += `**${label}:**\n`;
    output += `- ${byKind[kind].map(id => `\`${id}\``).join(', ')}\n\n`;
  }

  output += '(Note: Use only IDs that exist in the schema. If uncertain, omit or mark as exploratory.)\n\n';

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

    const trends = data.trends as Trend[];

    let output = '### Layer 4: Trend Context\n\n';
    output += 'Use trend IDs to capture cultural context:\n';
    output += trends.map(t => `- \`${t.id}\``).join('\n');
    output += '\n\n';

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
