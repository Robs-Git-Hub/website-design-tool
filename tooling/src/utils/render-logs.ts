#!/usr/bin/env node
/**
 * Render API Service Info Fetcher
 *
 * ⚠️ DEVELOPMENT TOOL ONLY ⚠️
 *
 * This script uses curl -k to bypass TLS certificate verification when accessing
 * the Render API from the Claude Code browser environment. This is a temporary
 * workaround for environment-specific certificate validation issues.
 *
 * **Security Note:**
 * The -k flag disables certificate verification, which could allow man-in-the-middle
 * attacks. This is acceptable ONLY for:
 * - Development/setup assistance by Claude Code
 * - Temporary debugging in controlled environments
 * - Non-production use cases
 *
 * For production monitoring, use:
 * - Render Dashboard: https://dashboard.render.com
 * - This script from a local machine (where TLS works correctly)
 * - Custom /api/v1/logs endpoint in your service (recommended)
 *
 * **What This Allows:**
 * - List deployed services and their details
 * - Check deployment status (branch, region, URL)
 * - Verify service configuration
 * - Get deployment timestamps
 *
 * **Note:** Render's logs API endpoint has complex parameter requirements that
 * are still being investigated. For now, this script focuses on service metadata.
 * For application logs, use the custom logging endpoint in your service.
 *
 * Usage: npx tsx src/utils/render-logs.ts [service-id]
 */

import { execSync } from 'child_process';

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_API_BASE = 'https://api.render.com/v1';

if (!RENDER_API_KEY) {
  console.error('❌ Error: RENDER_API_KEY environment variable not set');
  process.exit(1);
}

interface Service {
  id: string;
  name: string;
  type: string;
  repo?: string;
  autoDeploy?: string;
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
  serviceDetails?: {
    url?: string;
    region?: string;
    env?: string;
    buildCommand?: string;
    startCommand?: string;
  };
}

function execCurl(url: string): string {
  try {
    // Using -k to bypass TLS certificate verification (see header comment for security notes)
    const result = execSync(
      `curl -k -H "Authorization: Bearer ${RENDER_API_KEY}" -H "Accept: application/json" "${url}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return result;
  } catch (error: any) {
    throw new Error(`curl failed: ${error.message}`);
  }
}

function fetchServices(): Service[] {
  console.log('🔍 Fetching services from Render API...');
  console.log('   ⚠️  Using -k flag (bypasses certificate verification)\n');

  const response = execCurl(`${RENDER_API_BASE}/services?limit=20`);

  try {
    const data = JSON.parse(response);

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    // Render API returns array of objects with {cursor, service} structure
    return data.map((item: any) => item.service as Service);
  } catch (error) {
    console.error('❌ Error parsing response:', error instanceof Error ? error.message : error);
    console.error('Response:', response.substring(0, 200));
    throw error;
  }
}

function formatService(service: Service): void {
  console.log(`📦 ${service.name}`);
  console.log(`   ID: ${service.id}`);
  console.log(`   Type: ${service.type}`);

  if (service.branch) {
    console.log(`   Branch: ${service.branch}`);
  }

  if (service.serviceDetails?.url) {
    console.log(`   URL: ${service.serviceDetails.url}`);
  }

  if (service.serviceDetails?.region) {
    console.log(`   Region: ${service.serviceDetails.region}`);
  }

  if (service.serviceDetails?.env) {
    console.log(`   Environment: ${service.serviceDetails.env}`);
  }

  if (service.createdAt) {
    const created = new Date(service.createdAt);
    console.log(`   Created: ${created.toISOString()}`);
  }

  if (service.updatedAt) {
    const updated = new Date(service.updatedAt);
    console.log(`   Last Updated: ${updated.toISOString()}`);
  }

  console.log('');
}

async function main() {
  try {
    console.log('');
    console.log('━'.repeat(80));
    console.log('  Render API - Service Information');
    console.log('━'.repeat(80));
    console.log('');

    const services = fetchServices();

    if (services.length === 0) {
      console.log('⚠️  No services found');
      return;
    }

    console.log(`Found ${services.length} service(s):\n`);

    const targetServiceId = process.argv[2];

    if (targetServiceId) {
      // Show specific service
      const service = services.find(s => s.id === targetServiceId);
      if (!service) {
        console.error(`❌ Service ${targetServiceId} not found`);
        process.exit(1);
      }
      formatService(service);
    } else {
      // Show all services
      for (const service of services) {
        formatService(service);
      }

      console.log('💡 To see details for a specific service:');
      console.log('   npx tsx src/utils/render-logs.ts <service-id>');
      console.log('');
      console.log('📊 For application logs and deployment status, use:');
      console.log('   curl https://<your-service>.onrender.com/api/v1/logs');
      console.log('   (Custom logging endpoint - recommended approach)');
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
