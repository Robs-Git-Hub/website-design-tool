/**
 * Health Check Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import type { HealthResponse } from '../types/was.js';

const router = Router();
const startTime = Date.now();

router.get('/', (req: Request, res: Response) => {
  const uptime = Date.now() - startTime;
  const openRouterConfigured = !!process.env.OPENROUTER_API_KEY;

  const response: HealthResponse = {
    status: openRouterConfigured ? 'healthy' : 'unhealthy',
    uptime,
    openRouterConfigured,
  };

  res.json(response);
});

export default router;
