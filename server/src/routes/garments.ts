import { Router, Request, Response } from 'express';
import { createDefaultBasicTShirt, DEFAULT_SIZE_TABLE } from '../../../shared/constants.js';
import { Garment } from '../../../shared/types.js';

export const garmentsRouter = Router();

// GET default basic t-shirt
garmentsRouter.get('/default', (_req: Request, res: Response) => {
  try {
    const garment = createDefaultBasicTShirt();
    res.json({ success: true, data: garment });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET all template definitions (Basic T-Shirt, Polo T-Shirt, Shirts, Trousers etc.)
garmentsRouter.get('/templates', (_req: Request, res: Response) => {
  try {
    const defaultTee = createDefaultBasicTShirt();

    // Reusable architecture templates for future garments
    const templates = [
      {
        id: defaultTee.id,
        name: 'Basic T-Shirt',
        category: 't-shirt',
        status: 'ACTIVE',
        version: 'v1.4',
        componentsCount: defaultTee.components.length,
        componentNames: defaultTee.components.map((c) => c.name),
        baseSize: defaultTee.baseSize,
        supportedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'garment-polo-002',
        name: 'Polo T-Shirt',
        category: 'polo',
        status: 'READY',
        version: 'v2.1',
        componentsCount: 4,
        componentNames: ['Front Component (Placket)', 'Back Component', 'Sleeve (Ribbed)', 'Collar Block'],
        baseSize: 'M',
        supportedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'garment-shirt-003',
        name: 'Fitted Dress Shirt',
        category: 'shirt',
        status: 'BASE',
        version: 'v1.0',
        componentsCount: 6,
        componentNames: ['Front Left/Right', 'Back Yoke', 'Back Body', 'Long Sleeve', 'Cuff', 'Collar & Stand'],
        baseSize: 'M',
        supportedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'garment-trouser-004',
        name: 'Tailored Trousers',
        category: 'trouser',
        status: 'BASE',
        version: 'v1.0',
        componentsCount: 4,
        componentNames: ['Front Leg Panel', 'Back Leg Panel', 'Waistband', 'Pocket Bag'],
        baseSize: 'M',
        supportedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ];

    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
