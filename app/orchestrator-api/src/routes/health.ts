/**
 * Health Check Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { HealthResponse } from '../types/was.js';

const router = Router();
const startTime = Date.now();

// Get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const VERSION = packageJson.version;

router.get('/', (req: Request, res: Response) => {
  const uptime = Date.now() - startTime;
  const openRouterConfigured = !!process.env.OPENROUTER_API_KEY;

  const response: HealthResponse = {
    status: openRouterConfigured ? 'healthy' : 'unhealthy',
    version: VERSION,
    environment: process.env.NODE_ENV || 'development',
    uptime,
    openRouterConfigured,
  };

  res.json(response);
});

export default router;
