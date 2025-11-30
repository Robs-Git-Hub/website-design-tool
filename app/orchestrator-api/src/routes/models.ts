/**
 * Models Route
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import type { ModelInfo } from '../../common/src/types/was.js';

const router = Router();

const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    recommended: true,
    description: 'Best balance of quality and speed',
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Highest quality, slower',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fastest, lower quality',
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI GPT-4 Turbo',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI GPT-4o',
  },
];

router.get('/', (req: Request, res: Response) => {
  res.json({
    models: AVAILABLE_MODELS,
  });
});

export default router;
