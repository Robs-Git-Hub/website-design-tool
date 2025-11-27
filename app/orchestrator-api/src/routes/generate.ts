/**
 * Generate WAS Bundle Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { OpenRouterService } from '../services/openrouter.js';
import { promptLoader } from '../services/promptLoader.js';
import { validateGenerateRequest } from '../middleware/validateRequest.js';
import type { GenerateRequest, GenerateResponse } from '../types/was.js';
import { logger } from '../services/logger.js';

const router = Router();

router.post('/', validateGenerateRequest, async (req: Request, res: Response) => {
  const { userInput, model, image } = req.body as GenerateRequest;
  const startTime = Date.now();

  try {
    // Check if API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      logger.error('generate', 'OPENROUTER_API_KEY not configured');
      res.status(500).json({
        error: {
          code: 'CONFIGURATION_ERROR',
          message: 'OPENROUTER_API_KEY not configured',
        },
        timestamp: Date.now(),
      });
      return;
    }

    logger.info('generate', 'Starting bundle generation', {
      model: model || 'anthropic/claude-3.5-sonnet',
      hasImage: !!image,
      inputLength: userInput?.length || 0,
    });

    // Load system prompt
    const systemPrompt = await promptLoader.getPrompt();

    // Generate bundle
    const service = new OpenRouterService(apiKey);
    const bundle = await service.generateWASBundle({
      systemPrompt,
      userInput: userInput || '',
      model: model || 'anthropic/claude-3.5-sonnet',
      image,
    });

    const generationTime = Date.now() - startTime;
    const response: GenerateResponse = {
      bundle,
      generationTime,
      model: model || 'anthropic/claude-3.5-sonnet',
    };

    logger.info('generate', 'Bundle generated successfully', {
      model: model || 'anthropic/claude-3.5-sonnet',
      generationTime,
      hasImage: !!image,
    });

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate bundle';

    logger.error('generate', 'Bundle generation failed', {
      error: errorMessage,
      model: model || 'anthropic/claude-3.5-sonnet',
      hasImage: !!image,
      duration: Date.now() - startTime,
    });

    res.status(500).json({
      error: {
        code: 'GENERATION_ERROR',
        message: errorMessage,
      },
      timestamp: Date.now(),
    });
  }
});

export default router;
