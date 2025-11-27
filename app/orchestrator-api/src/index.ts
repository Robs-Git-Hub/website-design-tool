/**
 * WAS Orchestrator API Server
 */

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { errorHandler } from './middleware/errorHandler.js';
import generateRouter from './routes/generate.js';
import promptRouter from './routes/prompt.js';
import modelsRouter from './routes/models.js';
import healthRouter from './routes/health.js';
import logsRouter from './routes/logs.js';
import { logger } from './services/logger.js';

// Load environment variables
config();

// Get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const VERSION = packageJson.version;

const app = express();
const PORT = process.env.PORT || 3001;

// Parse allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log request
  logger.debug('request', `${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'ERROR' : res.statusCode >= 300 ? 'WARN' : 'INFO';

    logger[level.toLowerCase() as 'info' | 'warn' | 'error'](
      'request',
      `${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
      }
    );
  });

  next();
});

// Routes
app.use('/api/v1/generate', generateRouter);
app.use('/api/v1/prompt', promptRouter);
app.use('/api/v1/models', modelsRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/logs', logsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'WAS Orchestrator API',
    version: VERSION,
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/v1/health',
      logs: '/api/v1/logs',
      generate: 'POST /api/v1/generate',
      prompt: 'GET /api/v1/prompt',
      models: 'GET /api/v1/models',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  const environment = process.env.NODE_ENV || 'development';
  const openRouterConfigured = !!process.env.OPENROUTER_API_KEY;

  // Log to stdout (for Render logs)
  console.log(`🚀 WAS Orchestrator API v${VERSION} running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${environment}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/v1/health`);
  console.log(`📊 Logs Endpoint: http://localhost:${PORT}/api/v1/logs`);
  console.log(`🔑 OpenRouter API Key: ${openRouterConfigured ? '✓ Configured' : '✗ Missing'}`);

  // Log to application logger
  logger.info('startup', `WAS Orchestrator API v${VERSION} started`, {
    version: VERSION,
    environment,
    port: PORT,
    openRouterConfigured,
    gitCommit: process.env.RENDER_GIT_COMMIT || 'unknown',
    gitBranch: process.env.RENDER_GIT_BRANCH || 'unknown',
    nodeVersion: process.version,
  });
});
