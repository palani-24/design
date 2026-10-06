import { Router, Request, Response } from 'express';
import { generateGarmentSvg } from '../../../shared/svgExport.js';
import { garmentSchema } from '../../../shared/validation.js';
import { createDefaultBasicTShirt } from '../../../shared/constants.js';

export const exportRouter = Router();

// POST /api/export/svg
export const handleSvgExport = (req: Request, res: Response) => {
  try {
    let garment = createDefaultBasicTShirt();

    if (req.body.garment) {
      const parsed = garmentSchema.safeParse(req.body.garment);
      if (parsed.success) {
        garment = parsed.data;
      }
    }

    const options = {
      includeGrainlines: req.body.includeGrainlines !== false,
      includeNotches: req.body.includeNotches !== false,
      includeLabels: req.body.includeLabels !== false,
      includeBounds: req.body.includeBounds === true,
      strokeWidth: typeof req.body.strokeWidth === 'number' ? req.body.strokeWidth : 1.5,
    };

    const svgContent = generateGarmentSvg(garment, options);

    if (req.query.download === 'true') {
      const filename = `${garment.name.toLowerCase().replace(/\s+/g, '-')}-size-${garment.currentSize}.svg`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(svgContent);
    }

    res.json({
      success: true,
      data: {
        svg: svgContent,
        filename: `${garment.name.toLowerCase().replace(/\s+/g, '-')}-size-${garment.currentSize}.svg`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

exportRouter.post('/svg', handleSvgExport);
