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

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/generate', generateRouter);
app.use('/api/v1/prompt', promptRouter);
app.use('/api/v1/models', modelsRouter);
app.use('/api/v1/health', healthRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'WAS Orchestrator API',
    version: VERSION,
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/v1/health',
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
  console.log(`🚀 WAS Orchestrator API v${VERSION} running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔑 OpenRouter API Key: ${process.env.OPENROUTER_API_KEY ? '✓ Configured' : '✗ Missing'}`);
});
