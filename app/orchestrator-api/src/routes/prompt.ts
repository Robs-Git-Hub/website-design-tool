/**
 * System Prompt Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { promptLoader } from '../services/promptLoader.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const prompt = await promptLoader.getPrompt();
    const lastModified = promptLoader.getLastLoadTime();

    res.json({
      prompt,
      lastModified,
      version: '1.0',
    });
  } catch (error) {
    console.error('Prompt loading error:', error);
    res.status(500).json({
      error: {
        code: 'PROMPT_LOAD_ERROR',
        message: error instanceof Error ? error.message : 'Failed to load prompt',
      },
      timestamp: Date.now(),
    });
  }
});

export default router;
