/**
 * Generate WAS Bundle Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { OpenRouterService } from '../services/openrouter.js';
import { promptLoader } from '../services/promptLoader.js';
import { validateGenerateRequest } from '../middleware/validateRequest.js';
import { validateBundle, formatErrorsForLLM } from '../services/validator.js';
import type { GenerateRequest, GenerateResponse, WASBundle } from '../types/was.js';
import { logger } from '../services/logger.js';

const router = Router();

const MAX_ATTEMPTS = 3;

router.post('/', validateGenerateRequest, async (req: Request, res: Response) => {
  const { userInput, model, image } = req.body as GenerateRequest;
  const startTime = Date.now();
  const selectedModel = model || 'anthropic/claude-3.5-sonnet';

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
      model: selectedModel,
      hasImage: !!image,
      inputLength: userInput?.length || 0,
    });

    // Load system prompt
    const systemPrompt = await promptLoader.getPrompt();
    const service = new OpenRouterService(apiKey);

    // Retry logic: 3 attempts total
    let lastBundle: WASBundle | null = null;
    let lastReasoning: string | null = null;
    let lastFeedback: string | null = null;
    let lastValidation: any = null;
    let lastModelCapabilities: any = null;
    let attempts = 0;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      attempts = i + 1;

      try {
        // Attempt 1: Initial try
        // Attempt 2: Vanilla retry (same prompt)
        // Attempt 3: Retry with error feedback appended to userInput
        let currentUserInput = userInput || '';

        if (i === 2 && lastValidation && !lastValidation.valid) {
          // Third attempt: add error feedback
          const errorFeedback = formatErrorsForLLM(lastValidation.errors || []);
          currentUserInput = `${userInput || ''}\n\n---\nPREVIOUS ATTEMPT HAD ERRORS:\n${errorFeedback}`;

          logger.info('generate', `Attempt ${attempts}: Retrying with error feedback`, {
            model: selectedModel,
            errorCount: lastValidation.errors?.length || 0,
          });
        } else if (i > 0) {
          logger.info('generate', `Attempt ${attempts}: Vanilla retry`, {
            model: selectedModel,
          });
        }

        // Generate bundle
        const llmResponse = await service.generateWASBundle({
          systemPrompt,
          userInput: currentUserInput,
          model: selectedModel,
          image,
        });

        lastBundle = llmResponse.bundle;
        lastReasoning = llmResponse.reasoning;
        lastFeedback = llmResponse.feedback;
        lastModelCapabilities = llmResponse.modelCapabilities;

        // Validate bundle
        lastValidation = validateBundle(lastBundle);

        if (lastValidation.valid) {
          logger.info('generate', `Attempt ${attempts}: Valid bundle generated`, {
            model: selectedModel,
            attempts,
          });
          break; // Success! Exit retry loop
        } else {
          logger.warn('generate', `Attempt ${attempts}: Bundle validation failed`, {
            model: selectedModel,
            attempts,
            errorCount: lastValidation.errors?.length || 0,
            errors: lastValidation.errors,
          });
        }
      } catch (attemptError) {
        logger.error('generate', `Attempt ${attempts}: Generation error`, {
          model: selectedModel,
          attempts,
          error: attemptError instanceof Error ? attemptError.message : 'Unknown error',
        });

        // If this is the last attempt, throw the error
        if (i === MAX_ATTEMPTS - 1) {
          throw attemptError;
        }
        // Otherwise, continue to next attempt
      }
    }

    // Inject metadata (programmatic fields)
    if (lastBundle) {
      lastBundle.meta.bundle_id = randomUUID();
      lastBundle.meta.created_at = new Date().toISOString();
    }

    const generationTime = Date.now() - startTime;
    const response: GenerateResponse = {
      bundle: lastBundle as WASBundle,
      reasoning: lastReasoning,
      feedback: lastFeedback,
      validation: lastValidation,
      modelCapabilities: lastModelCapabilities,
      generationTime,
      model: selectedModel,
      attempts,
    };

    logger.info('generate', 'Bundle generation complete', {
      model: selectedModel,
      generationTime,
      hasImage: !!image,
      attempts,
      valid: lastValidation?.valid || false,
    });

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate bundle';

    logger.error('generate', 'Bundle generation failed', {
      error: errorMessage,
      model: selectedModel,
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
