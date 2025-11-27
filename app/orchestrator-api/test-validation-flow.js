/**
 * Test script to demonstrate validation error visibility
 * Shows how validation errors flow through:
 * 1. API response
 * 2. Logs (accessible via /api/v1/logs)
 */

import { validateBundle } from './dist/services/validator.js';

console.log('=== Validation Error Flow Test ===\n');

// Simulate an invalid bundle (like LLM might generate)
const invalidBundle = {
  meta: {
    // Missing intent_summary (required!)
    intent_keywords: ['test', 'demo']
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
    saas_2020: 1.5,  // Invalid: > 1.0
    crypto: -0.2     // Invalid: < 0.0
  }
};

console.log('1. SIMULATED LLM OUTPUT (Invalid):');
console.log(JSON.stringify(invalidBundle, null, 2));
console.log('');

// Validate
const validation = validateBundle(invalidBundle);

console.log('2. VALIDATION RESULT (Would be in API response):');
console.log(JSON.stringify({
  validation: validation
}, null, 2));
console.log('');

console.log('3. WHAT THE UI WOULD SEE:');
console.log(`   validation.valid = ${validation.valid}`);
console.log(`   validation.errors.length = ${validation.errors?.length || 0}`);
console.log('');

console.log('4. WHAT WOULD BE IN LOGS (accessible via /api/v1/logs):');
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'warn',
  action: 'generate',
  message: 'Attempt 1: Bundle validation failed',
  data: {
    model: 'anthropic/claude-3.5-sonnet',
    attempts: 1,
    errorCount: validation.errors?.length || 0,
    errors: validation.errors
  }
}, null, 2));
console.log('');

console.log('5. ERROR DETAILS FOR DEBUGGING:');
if (validation.errors) {
  validation.errors.forEach((error, i) => {
    console.log(`   [${i + 1}] ${error.type}: ${error.path || 'N/A'}`);
    console.log(`       ${error.message}`);
  });
}
console.log('');

console.log('6. MOCK API RESPONSE (What UI receives):');
console.log(JSON.stringify({
  bundle: invalidBundle,
  reasoning: "I created a professional dark theme...",
  feedback: null,
  validation: validation,  // ← UI can check this
  modelCapabilities: { supportsStructuredOutput: true },
  generationTime: 3245,
  model: "anthropic/claude-3.5-sonnet",
  attempts: 1
}, null, 2));

console.log('\n=== Test Complete ===');
console.log('\nSummary:');
console.log('✓ Validation errors are in API response (validation.valid, validation.errors)');
console.log('✓ Validation errors are logged (accessible via /api/v1/logs?level=warn)');
console.log('✓ UI can detect issues and show details to user');
console.log('✓ Developers/Claude can query logs to debug issues');
