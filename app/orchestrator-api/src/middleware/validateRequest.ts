/**
 * Request Validation Middleware
 */

import type { Request, Response, NextFunction } from 'express';
import type { GenerateRequest } from '../../common/src/types/was.js';

export function validateGenerateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Partial<GenerateRequest>;

  // Check if userInput or image is provided
  if (!body.userInput?.trim() && !body.image) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Either userInput or image must be provided',
      },
      timestamp: Date.now(),
    });
    return;
  }

  // Validate image format if provided
  if (body.image) {
    if (!body.image.base64 || !body.image.mediaType) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Image must include base64 and mediaType',
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Check if mediaType is valid image type
    if (!body.image.mediaType.startsWith('image/')) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid image mediaType',
        },
        timestamp: Date.now(),
      });
      return;
    }
  }

  next();
}
