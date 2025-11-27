/**
 * Error Handler Middleware
 */

import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse } from '../types/was.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

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
