import { Router, Request, Response } from 'express';
import { gradeGarment } from '../../../shared/gradingEngine.js';
import { gradeRequestSchema } from '../../../shared/validation.js';
import { createDefaultBasicTShirt } from '../../../shared/constants.js';

export const gradeRouter = Router();

// POST /api/grade
// Grades the entire garment as ONE object
gradeRouter.post('/', (req: Request, res: Response) => {
  try {
    const parsed = gradeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    const targetSize = parsed.data.targetSize;
    const garment = parsed.data.garment || createDefaultBasicTShirt();

    const gradingResult = gradeGarment(garment, targetSize);

    res.json({
      success: true,
      data: gradingResult,
      message: `Grading Complete — ${garment.currentSize} → ${targetSize}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
