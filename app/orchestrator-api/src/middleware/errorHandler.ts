/**
 * Error Handler Middleware
 */

import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse } from '../types/was.js';
import { logger } from '../services/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Log the error with context
  logger.error('error-handler', err.message, {
    errorName: err.name,
    statusCode,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const errorResponse: ErrorResponse = {
    error: {
      code: err.name || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    timestamp: Date.now(),
  };

  res.status(statusCode).json(errorResponse);
}
