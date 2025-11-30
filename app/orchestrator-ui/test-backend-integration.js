/**
 * Test script for the WAS Orchestrator UI Integration.
 *
 * This script tests the full UI -> Backend -> LLM stack by calling the
 * local backend API, which is the same endpoint the frontend UI uses.
 * It confirms that the backend is running and can successfully generate a bundle.
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';
const EXAMPLE_PROMPT = "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron.";

async function main() {
  console.log('='.repeat(80));
  console.log('WAS Orchestrator - Backend Integration Test');
  console.log('='.repeat(80));
  console.log();

  // 1. Check if the backend is running
  try {
    console.log(`[1/2] Pinging backend health endpoint at ${API_BASE_URL}/health...`);
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    if (healthResponse.data.status === 'healthy') {
      console.log('✅ Backend is healthy and responding.');
      console.log(`   - Version: ${healthResponse.data.version}`);
      console.log(`   - OpenRouter Configured: ${healthResponse.data.openRouterConfigured}`);
    } else {
      throw new Error(`Backend status: ${healthResponse.data.status}`);
    }
  } catch (error) {
    console.error('❌ Backend health check failed.');
    console.error('   Please ensure the orchestrator-api server is running on port 3001.');
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }

  console.log();

  // 2. Test the /generate endpoint
  try {
    console.log(`[2/2] Sending test prompt to ${API_BASE_URL}/generate...`);
    console.log(`   Prompt: "${EXAMPLE_PROMPT}"`);

    const generateResponse = await axios.post(`${API_BASE_URL}/generate`, {
      userInput: EXAMPLE_PROMPT,
      model: 'anthropic/claude-3.5-sonnet'
    });

    const { bundle, validation, attempts } = generateResponse.data;

    if (bundle && validation.valid) {
      console.log('✅ Bundle generated successfully!');
      console.log(`   - Attempts: ${attempts}`);
      console.log(`   - Intent Summary: "${bundle.meta.intent_summary}"`);
      console.log('   - Validation: Passed');
    } else {
      throw new Error(`Bundle generation failed or was invalid. Validation: ${JSON.stringify(validation)}`);
    }
  } catch (error) {
    console.error('❌ Bundle generation test failed.');
    if (error.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   - Error: ${error.message}`);
    }
    process.exit(1);
  }

  console.log();
  console.log('🎉 All integration tests passed successfully!');
  console.log('='.repeat(80));
}

main();
