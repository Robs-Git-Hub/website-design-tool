#!/usr/bin/env node
/**
 * WAS Bundle Validator
 *
 * Validates Website Aesthetic Schema (WAS) bundles against:
 * 1. Schema structure (using Zod)
 * 2. ID validity (styles, lexicon, trends exist in TOML instances)
 * 3. Enum validity (L1 axis values are valid)
 * 4. Range validity (weights are 0.0-1.0)
 *
 * Usage:
 *   npx tsx src/validators/bundle_validator.ts <bundle.json>
 *   npm run validate-bundle <bundle.json>
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import * as TOML from '@iarna/toml';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const metaSchema = z.object({
  bundle_id: z.string().optional(), // Programmatically injected by API
  created_at: z.string().optional(), // Programmatically injected by API
  intent_summary: z.string().min(1, 'intent_summary is required'),
  intent_keywords: z.array(z.string()).min(1, 'intent_keywords must have at least 1 keyword')
});

const layer1GeometryDepthSchema = z.object({
  shape: z.string(),
  depth: z.string()
});

const layer1AxesSchema = z.object({
  tone: z.string(),
  lightness: z.string(),
  color_strategy: z.string(),
  density: z.string(),
  decoration: z.string(),
  geometry_depth: layer1GeometryDepthSchema
});

const layer2StylesSchema = z.record(z.string(), z.number().min(0).max(1));

const layer3LexiconSchema = z.object({
  visual_atmosphere: z.string().optional(),
  palette_trait: z.string().optional(),
  surface_texture: z.string().optional(),
  component_styling: z.string().optional(),
  typography_mechanics: z.string().optional(),
  depth_technique: z.string().optional(),
  motion_mechanics: z.string().optional(),
  illustration_style: z.string().optional()
});

const layer4TrendsSchema = z.record(z.string(), z.number().min(0).max(1)); // Weights 0.0-1.0 (like layer2_styles)

const wasBundleSchema = z.object({
  meta: metaSchema,
  layer1_axes: layer1AxesSchema,
  layer2_styles: layer2StylesSchema,
  layer3_lexicon: layer3LexiconSchema,
  layer4_trends: layer4TrendsSchema.optional().default({})
});

export type WASBundle = z.infer<typeof wasBundleSchema>;

// ============================================================================
// VALIDATION DATA LOADER
// ============================================================================

interface DimensionValue {
  id: string;
  label: string;
  subdimension?: string;
}

interface Dimension {
  id: string;
  values?: DimensionValue[];
}

interface Style {
  id: string;
  display_name: string;
}

interface Term {
  id: string;
  label: string;
  kind: string;
}

interface Trend {
  id: string;
  label: string;
}

interface ValidationData {
  layer1Values: Map<string, Set<string>>; // dimension -> set of valid values
  layer2StyleIds: Set<string>;
  layer3LexiconIds: Set<string>;
  layer4TrendIds: Set<string>;
}

function loadValidationData(dataDir: string): ValidationData {
  // Load Layer 1 dimensions
  const layer1Path = path.join(dataDir, 'layer1_dimensions_instances.toml');
  const layer1Data: any = TOML.parse(fs.readFileSync(layer1Path, 'utf-8'));

  const layer1Values = new Map<string, Set<string>>();

  if (Array.isArray(layer1Data.dimensions)) {
    for (const dimension of layer1Data.dimensions as Dimension[]) {
      const validValues = new Set<string>();

      if (dimension.values) {
        for (const value of dimension.values) {
          // Handle compound dimensions with subdimensions
          if (value.subdimension) {
            const key = `${dimension.id}_${value.subdimension}`;
            if (!layer1Values.has(key)) {
              layer1Values.set(key, new Set());
            }
            layer1Values.get(key)!.add(value.id);
          } else {
            validValues.add(value.id);
          }
        }
      }

      // Only set the main dimension if it has non-subdimension values
      if (validValues.size > 0) {
        layer1Values.set(dimension.id, validValues);
      }
    }
  }

  // Load Layer 2 styles
  const layer2Path = path.join(dataDir, 'layer2_website_style_family_instances.toml');
  const layer2Data: any = TOML.parse(fs.readFileSync(layer2Path, 'utf-8'));

  const layer2StyleIds = new Set<string>();

  if (Array.isArray(layer2Data.styles)) {
    for (const style of layer2Data.styles as Style[]) {
      layer2StyleIds.add(style.id);
    }
  }

  // Load Layer 3 lexicon
  const layer3Path = path.join(dataDir, 'layer3_lexicon_instances.toml');
  const layer3Data: any = TOML.parse(fs.readFileSync(layer3Path, 'utf-8'));

  const layer3LexiconIds = new Set<string>();

  if (Array.isArray(layer3Data.terms)) {
    for (const term of layer3Data.terms as Term[]) {
      layer3LexiconIds.add(term.id);
    }
  }

  // Load Layer 4 trends
  const layer4Path = path.join(dataDir, 'layer4_societal_trends_instances.toml');
  const layer4Data: any = TOML.parse(fs.readFileSync(layer4Path, 'utf-8'));

  const layer4TrendIds = new Set<string>();

  if (Array.isArray(layer4Data.trends)) {
    for (const trend of layer4Data.trends as Trend[]) {
      layer4TrendIds.add(trend.id);
    }
  }

  return {
    layer1Values,
    layer2StyleIds,
    layer3LexiconIds,
    layer4TrendIds
  };
}

// ============================================================================
// VALIDATION ERRORS
// ============================================================================

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

class ValidationResult {
  errors: ValidationError[] = [];
  warnings: ValidationError[] = [];

  addError(path: string, message: string) {
    this.errors.push({ path, message, severity: 'error' });
  }

  addWarning(path: string, message: string) {
    this.warnings.push({ path, message, severity: 'warning' });
  }

  get isValid(): boolean {
    return this.errors.length === 0;
  }

  get hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
}

// ============================================================================
// VALIDATOR
// ============================================================================

export class WASBundleValidator {
  private validationData: ValidationData;

  constructor(dataDir: string) {
    this.validationData = loadValidationData(dataDir);
  }

  validate(bundle: any): ValidationResult {
    const result = new ValidationResult();

    // Step 1: Validate structure with Zod
    try {
      wasBundleSchema.parse(bundle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const issue of error.errors) {
          result.addError(issue.path.join('.'), issue.message);
        }
      }
    }

    // Step 2: Validate Layer 1 axis values (if layer1_axes exists)
    if (bundle.layer1_axes) {
      this.validateLayer1(bundle.layer1_axes, result);
    }

    // Step 3: Validate Layer 2 style IDs and weights (if layer2_styles exists)
    if (bundle.layer2_styles) {
      this.validateLayer2(bundle.layer2_styles, result);
    }

    // Step 4: Validate Layer 3 lexicon IDs (if layer3_lexicon exists)
    if (bundle.layer3_lexicon) {
      this.validateLayer3(bundle.layer3_lexicon, result);
    }

    // Step 5: Validate Layer 4 trend IDs (if layer4_trends exists)
    if (bundle.layer4_trends) {
      this.validateLayer4(bundle.layer4_trends, result);
    }

    return result;
  }

  private validateLayer1(layer1: any, result: ValidationResult) {
    // Validate simple axes
    const simpleAxes = ['tone', 'lightness', 'color_strategy', 'density', 'decoration'];

    for (const axis of simpleAxes) {
      const value = layer1[axis];
      const validValues = this.validationData.layer1Values.get(axis);

      if (!validValues) {
        result.addWarning(`layer1_axes.${axis}`, `No validation data found for axis '${axis}'`);
        continue;
      }

      if (!validValues.has(value)) {
        result.addError(
          `layer1_axes.${axis}`,
          `Invalid value '${value}'. Valid values: ${Array.from(validValues).join(', ')}`
        );
      }
    }

    // Validate geometry_depth compound axis
    if (layer1.geometry_depth) {
      // Validate shape
      const shapeValidValues = this.validationData.layer1Values.get('geometry_depth_shape');
      if (shapeValidValues && !shapeValidValues.has(layer1.geometry_depth.shape)) {
        result.addError(
          'layer1_axes.geometry_depth.shape',
          `Invalid value '${layer1.geometry_depth.shape}'. Valid values: ${Array.from(shapeValidValues).join(', ')}`
        );
      }

      // Validate depth
      const depthValidValues = this.validationData.layer1Values.get('geometry_depth_depth');
      if (depthValidValues && !depthValidValues.has(layer1.geometry_depth.depth)) {
        result.addError(
          'layer1_axes.geometry_depth.depth',
          `Invalid value '${layer1.geometry_depth.depth}'. Valid values: ${Array.from(depthValidValues).join(', ')}`
        );
      }
    }
  }

  private validateLayer2(layer2: any, result: ValidationResult) {
    for (const [styleId, weight] of Object.entries(layer2)) {
      // Validate ID exists
      if (!this.validationData.layer2StyleIds.has(styleId)) {
        result.addError(
          `layer2_styles.${styleId}`,
          `Style ID '${styleId}' not found in layer2_website_style_family_instances.toml`
        );
      }

      // Validate weight range (already done by Zod, but we can add a warning for edge cases)
      if (typeof weight === 'number' && (weight === 0 || weight === 1)) {
        result.addWarning(
          `layer2_styles.${styleId}`,
          `Weight is ${weight}. Consider if this extreme value is intentional.`
        );
      }
    }

    // Check if at least one style is defined
    if (Object.keys(layer2).length === 0) {
      result.addWarning('layer2_styles', 'No styles defined. Consider adding at least one style.');
    }
  }

  private validateLayer3(layer3: any, result: ValidationResult) {
    const definedTraits: string[] = [];

    for (const [kind, lexiconId] of Object.entries(layer3)) {
      if (!lexiconId || typeof lexiconId !== 'string') {
        continue; // Skip empty/undefined values
      }

      definedTraits.push(kind);

      // Validate ID exists
      if (!this.validationData.layer3LexiconIds.has(lexiconId as string)) {
        result.addError(
          `layer3_lexicon.${kind}`,
          `Lexicon ID '${lexiconId}' not found in layer3_lexicon_instances.toml`
        );
      }
    }

    // Warning if no traits defined
    if (definedTraits.length === 0) {
      result.addWarning('layer3_lexicon', 'No lexicon traits defined. Consider adding visual traits.');
    }
  }

  private validateLayer4(layer4: any, result: ValidationResult) {
    for (const [trendCategory, trendId] of Object.entries(layer4)) {
      // Validate ID exists
      if (!this.validationData.layer4TrendIds.has(trendId as string)) {
        result.addError(
          `layer4_trends.${trendCategory}`,
          `Trend ID '${trendId}' not found in layer4_societal_trends_instances.toml`
        );
      }
    }
  }
}

// ============================================================================
// CLI
// ============================================================================

function printValidationResult(result: ValidationResult, bundlePath: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`📋 Validation Result: ${bundlePath}`);
  console.log('='.repeat(80));

  if (result.isValid && !result.hasWarnings) {
    console.log('\n✅ Bundle is valid!');
    console.log('   All structure, ID, and range checks passed.');
    return;
  }

  if (result.errors.length > 0) {
    console.log(`\n❌ Found ${result.errors.length} error(s):\n`);

    for (const error of result.errors) {
      console.log(`   ${error.path}`);
      console.log(`   └─ ${error.message}\n`);
    }
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Found ${result.warnings.length} warning(s):\n`);

    for (const warning of result.warnings) {
      console.log(`   ${warning.path}`);
      console.log(`   └─ ${warning.message}\n`);
    }
  }

  if (result.isValid) {
    console.log('✅ Bundle structure is valid (but has warnings)');
  } else {
    console.log('❌ Bundle validation failed');
  }

  console.log('='.repeat(80) + '\n');
}

async function main() {
  const bundlePath = process.argv[2];

  if (!bundlePath) {
    console.error('Usage: npx tsx src/validators/bundle_validator.ts <bundle.json>');
    process.exit(1);
  }

  if (!fs.existsSync(bundlePath)) {
    console.error(`❌ Error: File not found: ${bundlePath}`);
    process.exit(1);
  }

  try {
    // Load bundle
    const bundleContent = fs.readFileSync(bundlePath, 'utf-8');
    const bundle = JSON.parse(bundleContent);

    // Find data directory (relative to project root)
    const projectRoot = path.resolve(__dirname, '../../..');
    const dataDir = path.join(projectRoot, 'data');

    if (!fs.existsSync(dataDir)) {
      console.error(`❌ Error: Data directory not found: ${dataDir}`);
      process.exit(1);
    }

    // Create validator and validate
    const validator = new WASBundleValidator(dataDir);
    const result = validator.validate(bundle);

    // Print results
    printValidationResult(result, bundlePath);

    // Exit with appropriate code
    process.exit(result.isValid ? 0 : 1);

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if called directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
