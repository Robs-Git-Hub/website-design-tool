/**
 * Generate WAS Bundle Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { OpenRouterService } from '../services/openrouter.js';
import { promptLoader } from '../services/promptLoader.js';
import { validateGenerateRequest } from '../middleware/validateRequest.js';
import type { GenerateRequest, GenerateResponse } from '../types/was.js';

const router = Router();

router.post('/', validateGenerateRequest, async (req: Request, res: Response) => {
  const { userInput, model, image } = req.body as GenerateRequest;
  const startTime = Date.now();

  try {
    // Check if API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: {
          code: 'CONFIGURATION_ERROR',
          message: 'OPENROUTER_API_KEY not configured',
        },
        timestamp: Date.now(),
      });
      return;
    }

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

    const response: GenerateResponse = {
      bundle,
      generationTime: Date.now() - startTime,
      model: model || 'anthropic/claude-3.5-sonnet',
    };

    res.json(response);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: {
        code: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate bundle',
      },
      timestamp: Date.now(),
    });
  }
});

export default router;
