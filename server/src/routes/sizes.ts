import { Router, Request, Response } from 'express';
import { DEFAULT_SIZE_TABLE } from '../../../shared/constants.js';
import { sizeTableSchema } from '../../../shared/validation.js';

export const sizesRouter = Router();

// In-memory configurable size table store
let currentSizeTable = { ...DEFAULT_SIZE_TABLE };

// GET standard size table
sizesRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: currentSizeTable });
});

// PUT update size table
sizesRouter.put('/', (req: Request, res: Response) => {
  try {
    const parsed = sizeTableSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }
    currentSizeTable = parsed.data;
    res.json({ success: true, message: 'Size table updated successfully', data: currentSizeTable });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST reset to factory default
sizesRouter.post('/reset', (_req: Request, res: Response) => {
  currentSizeTable = { ...DEFAULT_SIZE_TABLE };
  res.json({ success: true, message: 'Reset to default apparel size table', data: currentSizeTable });
});
