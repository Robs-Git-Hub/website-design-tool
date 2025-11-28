/**
 * WAS Bundle Validator Service
 *
 * Validates bundle structure and schema compliance
 */

import type { WASBundle, ValidationResult, ValidationError } from '../types/was.js';

/**
 * Validate a WAS bundle against schema requirements
 */
export function validateBundle(bundle: any): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if bundle is an object
  if (!bundle || typeof bundle !== 'object') {
    errors.push({
      type: 'json_structure',
      message: 'Bundle must be an object'
    });
    return { valid: false, errors };
  }

  // Validate meta block
  if (!bundle.meta || typeof bundle.meta !== 'object') {
    errors.push({
      type: 'schema_violation',
      path: 'meta',
      message: 'meta block is required'
    });
  } else {
    // Check required meta fields (bundle_id and created_at are programmatically injected, so optional here)
    if (!bundle.meta.intent_summary || typeof bundle.meta.intent_summary !== 'string') {
      errors.push({
        type: 'schema_violation',
        path: 'meta.intent_summary',
        message: 'intent_summary is required and must be a string'
      });
    }

    if (!Array.isArray(bundle.meta.intent_keywords) || bundle.meta.intent_keywords.length === 0) {
      errors.push({
        type: 'schema_violation',
        path: 'meta.intent_keywords',
        message: 'intent_keywords is required and must be a non-empty array'
      });
    }
  }

  // Validate layer1_axes
  if (!bundle.layer1_axes || typeof bundle.layer1_axes !== 'object') {
    errors.push({
      type: 'schema_violation',
      path: 'layer1_axes',
      message: 'layer1_axes block is required'
    });
  } else {
    const requiredFields = ['tone', 'lightness', 'color_strategy', 'density', 'decoration'];
    for (const field of requiredFields) {
      if (!bundle.layer1_axes[field] || typeof bundle.layer1_axes[field] !== 'string') {
        errors.push({
          type: 'schema_violation',
          path: `layer1_axes.${field}`,
          message: `${field} is required and must be a string`
        });
      }
    }

    // Check geometry_depth sub-object
    if (!bundle.layer1_axes.geometry_depth || typeof bundle.layer1_axes.geometry_depth !== 'object') {
      errors.push({
        type: 'schema_violation',
        path: 'layer1_axes.geometry_depth',
        message: 'geometry_depth is required and must be an object'
      });
    } else {
      if (!bundle.layer1_axes.geometry_depth.shape || typeof bundle.layer1_axes.geometry_depth.shape !== 'string') {
        errors.push({
          type: 'schema_violation',
          path: 'layer1_axes.geometry_depth.shape',
          message: 'shape is required and must be a string'
        });
      }
      if (!bundle.layer1_axes.geometry_depth.depth || typeof bundle.layer1_axes.geometry_depth.depth !== 'string') {
        errors.push({
          type: 'schema_violation',
          path: 'layer1_axes.geometry_depth.depth',
          message: 'depth is required and must be a string'
        });
      }
    }
  }

  // Validate layer2_styles (optional, but if present must be weights)
  if (bundle.layer2_styles !== undefined) {
    if (typeof bundle.layer2_styles !== 'object' || Array.isArray(bundle.layer2_styles)) {
      errors.push({
        type: 'schema_violation',
        path: 'layer2_styles',
        message: 'layer2_styles must be an object with string keys and numeric values (0.0-1.0)'
      });
    } else {
      for (const [key, value] of Object.entries(bundle.layer2_styles)) {
        if (typeof value !== 'number' || value < 0 || value > 1) {
          errors.push({
            type: 'schema_violation',
            path: `layer2_styles.${key}`,
            message: `${key} must be a number between 0.0 and 1.0`
          });
        }
      }
    }
  }

  // Validate layer3_lexicon (optional)
  if (bundle.layer3_lexicon !== undefined) {
    if (typeof bundle.layer3_lexicon !== 'object' || Array.isArray(bundle.layer3_lexicon)) {
      errors.push({
        type: 'schema_violation',
        path: 'layer3_lexicon',
        message: 'layer3_lexicon must be an object'
      });
    }
  }

  // Validate layer4_trends (optional, but if present must be weights)
  if (bundle.layer4_trends !== undefined) {
    if (typeof bundle.layer4_trends !== 'object' || Array.isArray(bundle.layer4_trends)) {
      errors.push({
        type: 'schema_violation',
        path: 'layer4_trends',
        message: 'layer4_trends must be an object with string keys and numeric values (0.0-1.0)'
      });
    } else {
      for (const [key, value] of Object.entries(bundle.layer4_trends)) {
        if (typeof value !== 'number' || value < 0 || value > 1) {
          errors.push({
            type: 'schema_violation',
            path: `layer4_trends.${key}`,
            message: `${key} must be a number between 0.0 and 1.0`
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Format validation errors for LLM feedback
 */
export function formatErrorsForLLM(errors: ValidationError[]): string {
  const jsonErrors = errors.filter(e => e.type === 'json_structure');
  const schemaErrors = errors.filter(e => e.type === 'schema_violation');

  let message = 'The generated bundle has validation errors:\n\n';

  if (jsonErrors.length > 0) {
    message += 'JSON Structure Errors:\n';
    for (const error of jsonErrors) {
      message += `- ${error.message}\n`;
    }
    message += '\n';
  }

  if (schemaErrors.length > 0) {
    message += 'Schema Violations:\n';
    for (const error of schemaErrors) {
      message += `- ${error.path}: ${error.message}\n`;
    }
  }

  message += '\nPlease correct these errors and ensure the bundle follows the WAS schema structure.';

  return message;
}
