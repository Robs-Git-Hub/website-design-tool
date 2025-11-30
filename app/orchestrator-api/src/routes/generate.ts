/**
 * Generate WAS Bundle Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { OpenRouterService } from '../services/openrouter.js';
import { promptLoader } from '../services/promptLoader.js';
import { validateGenerateRequest } from '../middleware/validateRequest.js';
import { WASBundleValidator } from '../../../../tooling/src/validators/bundle_validator.js';
import type { GenerateRequest, GenerateResponse, WASBundle, ValidationError } from '../../common/src/types/was.js';
import { logger } from '../services/logger.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const MAX_ATTEMPTS = 3;

// Initialize the authoritative WAS Bundle Validator
const dataDir = path.resolve(__dirname, '../../../../data');
const validator = new WASBundleValidator(dataDir);

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
    let initialValidationErrors: ValidationError[] | null = null;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      attempts = i + 1;

      try {
        // Attempt 1: Initial try
        // Attempt 2: Vanilla retry (same prompt)
        // Attempt 3: Retry with error feedback appended to userInput
        let currentUserInput = userInput || '';

        if (i === 2 && lastValidation && !lastValidation.isValid) {
          // Third attempt: add error feedback
          const errorFeedback = WASBundleValidator.formatErrorsForLLM(lastValidation.errors || []);
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

        // Validate bundle using authoritative validator
        const validationResult = validator.validate(lastBundle);

        // Store first attempt's errors for transparency
        if (i === 0 && !validationResult.isValid) {
          initialValidationErrors = validationResult.errors;
        }

        // Convert ValidationResult to API format
        lastValidation = {
          valid: validationResult.isValid,
          errors: validationResult.errors.length > 0 ? validationResult.errors : undefined,
        };

        if (validationResult.isValid) {
          logger.info('generate', `Attempt ${attempts}: Valid bundle generated`, {
            model: selectedModel,
            attempts,
          });
          break; // Success! Exit retry loop
        } else {
          logger.warn('generate', `Attempt ${attempts}: Bundle validation failed`, {
            model: selectedModel,
            attempts,
            errorCount: validationResult.errors.length,
            errors: validationResult.errors,
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
      initialValidationErrors: initialValidationErrors,
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
