#!/usr/bin/env node
/**
 * API Health Check with Retry Logic
 *
 * Polls the API health endpoint with exponential backoff to handle cold starts.
 * Useful for verifying deployments and waiting for service availability.
 *
 * Usage:
 *   npx tsx src/utils/health-check.ts [url]
 *   npm run health-check [url]
 *
 * Default URL: Production deployment on Render
 */

import { execSync } from 'child_process';

const DEFAULT_URL = 'https://was-orchestrator-apiapp-orchestrator-api.onrender.com/api/v1/health';
const MAX_RETRIES = 12;
const INITIAL_DELAY = 5000; // 5 seconds
const MAX_DELAY = 30000; // 30 seconds

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  version?: string;
  environment?: string;
  uptime?: number;
  openRouterConfigured?: boolean;
}

function checkHealth(url: string): { success: boolean; data?: HealthResponse; elapsed: number; error?: string } {
  const startTime = Date.now();

  try {
    // Use curl with timeout
    const result = execSync(`curl -s --max-time 60 "${url}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const elapsed = Date.now() - startTime;

    try {
      const data = JSON.parse(result) as HealthResponse;
      return { success: true, data, elapsed };
    } catch {
      return { success: false, error: 'Invalid JSON response', elapsed };
    }
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    const errorMessage = error.message || String(error);
    return { success: false, error: errorMessage, elapsed };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function healthCheckWithRetry(url: string): Promise<void> {
  console.log('🔍 Checking API health...');
  console.log(`   URL: ${url}`);
  console.log('');

  let attempt = 0;
  let delay = INITIAL_DELAY;

  while (attempt < MAX_RETRIES) {
    attempt++;

    console.log(`⏳ Attempt ${attempt}/${MAX_RETRIES}...`);

    const result = checkHealth(url);

    if (result.success && result.data) {
      console.log('');
      console.log('✅ API is healthy!');
      console.log('');
      console.log(`   Status: ${result.data.status}`);
      if (result.data.version) console.log(`   Version: ${result.data.version}`);
      if (result.data.environment) console.log(`   Environment: ${result.data.environment}`);
      if (result.data.uptime !== undefined) console.log(`   Uptime: ${Math.floor(result.data.uptime)}s`);
      if (result.data.openRouterConfigured !== undefined) {
        console.log(`   OpenRouter: ${result.data.openRouterConfigured ? '✓ Configured' : '✗ Not configured'}`);
      }
      console.log(`   Response time: ${result.elapsed}ms`);

      if (result.elapsed > 10000) {
        console.log('');
        console.log('💡 Slow response detected (>10s). This was likely a cold start.');
        console.log('   Render free tier sleeps after 15 minutes of inactivity.');
      }

      console.log('');
      return; // Success!

    } else {
      const errorMessage = result.error || 'Unknown error';
      console.log(`   ❌ Failed: ${errorMessage} (${result.elapsed}ms)`);

      if (attempt < MAX_RETRIES) {
        console.log(`   ⏸️  Waiting ${delay / 1000}s before retry...`);
        console.log('');
        await sleep(delay);

        // Exponential backoff with max cap
        delay = Math.min(delay * 1.5, MAX_DELAY);
      } else {
        console.log('');
        console.log('❌ API health check failed after all retries.');
        console.log('');
        console.log('Troubleshooting:');
        console.log('  1. Check if the service is deployed: https://dashboard.render.com');
        console.log('  2. Verify the URL is correct');
        console.log('  3. Check Render logs for errors');
        console.log('  4. Try accessing the URL in a browser');
        console.log('');
        process.exit(1);
      }
    }
  }
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;

  console.log('');
  console.log('━'.repeat(80));
  console.log('  WAS Orchestrator API - Health Check');
  console.log('━'.repeat(80));
  console.log('');

  await healthCheckWithRetry(url);
}

// Run if called directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
