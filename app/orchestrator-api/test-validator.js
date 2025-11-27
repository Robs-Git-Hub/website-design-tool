/**
 * Test script for validator service
 */

import { validateBundle, formatErrorsForLLM } from './dist/services/validator.js';

console.log('=== Testing WAS Bundle Validator ===\n');

// Test 1: Valid bundle with all required fields
console.log('Test 1: Valid bundle (Layer 4 with weights)');
const validBundle = {
  meta: {
    intent_summary: 'A modern dark-mode dashboard with glassmorphic elements',
    intent_keywords: ['modern', 'dark', 'glass', 'dashboard']
  },
  layer1_axes: {
    tone: 'professional',
    lightness: 'dark',
    color_strategy: 'monochromatic_with_accent',
    density: 'moderate',
    decoration: 'subtle',
    geometry_depth: {
      shape: 'rounded',
      depth: 'elevated'
    }
  },
  layer2_styles: {
    glassmorphism: 0.8,
    minimalist: 0.6
  },
  layer4_trends: {
    saas_2020_dark_mode: 0.9,
    web3_aesthetic: 0.3
  }
};

const result1 = validateBundle(validBundle);
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors || 'None');
console.log('');

// Test 2: Missing required meta fields
console.log('Test 2: Missing intent_summary');
const invalidBundle1 = {
  meta: {
    intent_keywords: ['test']
  },
  layer1_axes: {
    tone: 'professional',
    lightness: 'dark',
    color_strategy: 'monochromatic',
    density: 'moderate',
    decoration: 'subtle',
    geometry_depth: {
      shape: 'rounded',
      depth: 'elevated'
    }
  }
};

const result2 = validateBundle(invalidBundle1);
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors);
console.log('');

// Test 3: Layer 4 with invalid weight values (should fail)
console.log('Test 3: Layer 4 with invalid weights');
const invalidBundle2 = {
  meta: {
    intent_summary: 'Test bundle',
    intent_keywords: ['test']
  },
  layer1_axes: {
    tone: 'professional',
    lightness: 'dark',
    color_strategy: 'monochromatic',
    density: 'moderate',
    decoration: 'subtle',
    geometry_depth: {
      shape: 'rounded',
      depth: 'elevated'
    }
  },
  layer4_trends: {
    saas_2020: 1.5, // Invalid: > 1.0
    crypto_nft: -0.2 // Invalid: < 0.0
  }
};

const result3 = validateBundle(invalidBundle2);
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors);
console.log('');

// Test 4: Format errors for LLM
console.log('Test 4: Format errors for LLM feedback');
if (result3.errors) {
  const formatted = formatErrorsForLLM(result3.errors);
  console.log(formatted);
}
console.log('');

// Test 5: Layer 2 with invalid weights
console.log('Test 5: Layer 2 with invalid weights');
const invalidBundle3 = {
  meta: {
    intent_summary: 'Test bundle',
    intent_keywords: ['test']
  },
  layer1_axes: {
    tone: 'professional',
    lightness: 'dark',
    color_strategy: 'monochromatic',
    density: 'moderate',
    decoration: 'subtle',
    geometry_depth: {
      shape: 'rounded',
      depth: 'elevated'
    }
  },
  layer2_styles: {
    minimalist: 'high' // Invalid: should be number
  }
};

const result4 = validateBundle(invalidBundle3);
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors);
console.log('');

console.log('=== All Tests Complete ===');
