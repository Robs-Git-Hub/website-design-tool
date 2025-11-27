/**
 * Logs Endpoint
 *
 * Provides access to application logs and runtime statistics.
 * Useful for monitoring deployment status, errors, and application health.
 */

import { Router } from 'express';
import { logger } from '../services/logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();

// Get version and deployment info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

/**
 * GET /api/v1/logs
 *
 * Returns recent application logs with deployment information
 */
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const level = req.query.level as 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | undefined;
    const category = req.query.category as string | undefined;

    const logs = logger.getLogs({ limit, level, category });
    const stats = logger.getStats();

    res.json({
      deployment: {
        version: packageJson.version,
        environment: process.env.NODE_ENV || 'development',
        gitCommit: process.env.RENDER_GIT_COMMIT || 'unknown',
        gitBranch: process.env.RENDER_GIT_BRANCH || 'unknown',
        deployedAt: process.env.RENDER_SERVICE_DEPLOY_TIME || stats.startTime,
      },
      runtime: {
        uptime: stats.uptime,
        startTime: stats.startTime,
        nodeVersion: process.version,
        platform: process.platform,
      },
      stats: {
        totalLogs: stats.totalLogs,
        byLevel: stats.byLevel,
        memoryUsage: {
          heapUsed: Math.round(stats.memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          heapTotal: Math.round(stats.memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          rss: Math.round(stats.memoryUsage.rss / 1024 / 1024) + ' MB',
        },
      },
      logs: logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        category: log.category,
        message: log.message,
        metadata: log.metadata,
      })),
      filters: {
        applied: {
          limit,
          level: level || 'all',
          category: category || 'all',
        },
        available: {
          levels: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
          categories: Array.from(new Set(logger.getLogs({ limit: 1000 }).map(l => l.category))),
        },
      },
    });
  } catch (error) {
    logger.error('logs', 'Failed to retrieve logs', { error: String(error) });
    res.status(500).json({
      error: {
        message: 'Failed to retrieve logs',
        details: error instanceof Error ? error.message : String(error),
      },
    });
  }
});

/**
 * GET /api/v1/logs/errors
 *
 * Returns only error logs (convenience endpoint)
 */
router.get('/errors', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const errors = logger.getLogs({ limit, level: 'ERROR' });

    res.json({
      count: errors.length,
      errors: errors.map(log => ({
        timestamp: log.timestamp.toISOString(),
        category: log.category,
        message: log.message,
        metadata: log.metadata,
      })),
    });
  } catch (error) {
    logger.error('logs', 'Failed to retrieve error logs', { error: String(error) });
    res.status(500).json({
      error: {
        message: 'Failed to retrieve error logs',
        details: error instanceof Error ? error.message : String(error),
      },
    });
  }
});

export default router;
