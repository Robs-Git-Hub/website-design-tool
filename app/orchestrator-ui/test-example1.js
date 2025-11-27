/**
 * Test script to run Example 1 through the OpenRouter service
 * This tests if the API key works and the system can generate bundles
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.VITE_OPENROUTER_API_KEY;

// Example 1 from the app
const EXAMPLE_1 = "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron.";

/**
 * Extract JSON from LLM response
 */
function extractJSON(content) {
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Try to find JSON object boundaries
  const startIdx = jsonStr.indexOf('{');
  const endIdx = jsonStr.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('No JSON object found in response');
  }

  jsonStr = jsonStr.substring(startIdx, endIdx + 1);

  return JSON.parse(jsonStr);
}

/**
 * Generate WAS Bundle
 */
async function generateWASBundle(systemPrompt, userInput) {
  console.log('🚀 Sending request to OpenRouter...\n');

  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'WAS Orchestrator UI Test',
        'Host': 'openrouter.ai',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  return extractJSON(content);
}

/**
 * Main test function
 */
async function main() {
  console.log('='.repeat(80));
  console.log('WAS Orchestrator UI - Example 1 Test');
  console.log('='.repeat(80));
  console.log();

  // Check API key
  if (!API_KEY) {
    console.error('❌ Error: VITE_OPENROUTER_API_KEY not found in environment');
    process.exit(1);
  }
  console.log('✅ API Key found');

  // Read system prompt
  const promptPath = path.join(__dirname, '../../prompts/orchestrator_system_prompt.md');
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8');
  console.log('✅ System prompt loaded');
  console.log();

  // Display test input
  console.log('📝 Test Input (Example 1):');
  console.log(`   "${EXAMPLE_1}"`);
  console.log();

  try {
    // Generate bundle
    const bundle = await generateWASBundle(systemPrompt, EXAMPLE_1);

    console.log('✅ Bundle generated successfully!\n');
    console.log('='.repeat(80));
    console.log('Generated WAS Bundle:');
    console.log('='.repeat(80));
    console.log();
    console.log(JSON.stringify(bundle, null, 2));
    console.log();
    console.log('='.repeat(80));

    // Quick summary
    console.log();
    console.log('📊 Quick Summary:');
    console.log(`   Reasoning: ${bundle.meta?.reasoning_notes}`);
    console.log(`   Tone: ${bundle.layer1_axes?.tone}`);
    console.log(`   Lightness: ${bundle.layer1_axes?.lightness}`);
    console.log(`   Color Strategy: ${bundle.layer1_axes?.color_strategy}`);
    if (bundle.layer2_styles) {
      console.log(`   Styles: ${Object.entries(bundle.layer2_styles).map(([k, v]) => `${k} (${v})`).join(', ')}`);
    }
    console.log();
    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Error generating bundle:');
    if (error.response) {
      console.error('   API Response:', error.response.data);
    } else {
      console.error('   ', error.message);
    }
    process.exit(1);
  }
}

// Run the test
main();
