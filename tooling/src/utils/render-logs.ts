#!/usr/bin/env node
/**
 * Render API Log Fetcher
 *
 * Fetches deployment logs from Render.com API
 * Usage: npx tsx src/utils/render-logs.ts [service-id]
 */

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
  serviceDetails?: {
    url?: string;
  };
}

interface Log {
  id: string;
  text: string;
  timestamp: string;
}

interface LogsResponse {
  logs: Log[];
  hasMore: boolean;
  nextStartTime?: string;
  nextEndTime?: string;
}

async function fetchServices(): Promise<Service[]> {
  const response = await fetch(`${RENDER_API_BASE}/services`, {
    headers: {
      'Authorization': `Bearer ${RENDER_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data[0]?.service ? data.map((item: any) => item.service) : [];
}

async function fetchLogs(serviceId: string, limit: number = 100): Promise<LogsResponse> {
  const url = new URL(`${RENDER_API_BASE}/services/${serviceId}/logs`);
  url.searchParams.set('limit', limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${RENDER_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function main() {
  try {
    console.log('🔍 Fetching Render services...\n');

    const services = await fetchServices();

    if (services.length === 0) {
      console.log('⚠️  No services found');
      return;
    }

    console.log(`Found ${services.length} service(s):\n`);

    for (const service of services) {
      console.log(`📦 Service: ${service.name}`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Type: ${service.type}`);
      if (service.repo) console.log(`   Repo: ${service.repo}`);
      if (service.branch) console.log(`   Branch: ${service.branch}`);
      if (service.serviceDetails?.url) console.log(`   URL: ${service.serviceDetails.url}`);
      console.log('');
    }

    // If a service ID is provided or if there's only one service, fetch logs
    const targetServiceId = process.argv[2] || (services.length === 1 ? services[0].id : null);

    if (targetServiceId) {
      const targetService = services.find(s => s.id === targetServiceId) || { name: targetServiceId };
      console.log(`\n📋 Fetching logs for: ${targetService.name || targetServiceId}\n`);
      console.log('─'.repeat(80));

      const logsData = await fetchLogs(targetServiceId, 100);

      if (logsData.logs.length === 0) {
        console.log('⚠️  No logs found');
      } else {
        for (const log of logsData.logs) {
          const timestamp = new Date(log.timestamp).toISOString();
          console.log(`[${timestamp}] ${log.text}`);
        }

        if (logsData.hasMore) {
          console.log('\n⏭️  More logs available (use API pagination to fetch)');
        }
      }
    } else if (services.length > 1) {
      console.log('💡 To fetch logs, run:');
      console.log(`   npx tsx src/utils/render-logs.ts <service-id>`);
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
