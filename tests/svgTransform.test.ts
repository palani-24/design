import { describe, it, expect } from 'vitest';
import { createDefaultBasicTShirt } from '../shared/constants';
import { calculateGarmentBounds, pathCommandsToSvgString } from '../shared/gradingEngine';
import { generateGarmentSvg } from '../shared/svgExport';

describe('SVG Transformations and Export Engine', () => {
  it('computes unified 1-Object bounding box enclosing Front + Back + Sleeve', () => {
    const garment = createDefaultBasicTShirt();
    const bounds = calculateGarmentBounds(garment);

    expect(bounds.minX).toBeLessThan(bounds.maxX);
    expect(bounds.minY).toBeLessThan(bounds.maxY);
    expect(bounds.width).toBeGreaterThan(900); // 3 pieces span across horizontal workspace
    expect(bounds.height).toBeGreaterThan(600); // body length is 660mm
  });

  it('translates vector path commands to valid SVG path data syntax', () => {
    const commands = [
      { type: 'M' as const, points: [{ x: 10, y: 20 }] },
      { type: 'L' as const, points: [{ x: 50, y: 80 }] },
      {
        type: 'C' as const,
        points: [
          { x: 60, y: 90 },
          { x: 70, y: 100 },
          { x: 80, y: 110 },
        ],
      },
      { type: 'Z' as const, points: [] },
    ];

    const d = pathCommandsToSvgString(commands);
    expect(d).toBe('M 10.00 20.00 L 50.00 80.00 C 60.00 90.00, 70.00 100.00, 80.00 110.00 Z');
  });

  it('generates production-ready standalone SVG XML containing all 3 garment components', () => {
    const garment = createDefaultBasicTShirt();
    const svg = generateGarmentSvg(garment, {
      includeGrainlines: true,
      includeNotches: true,
      includeLabels: true,
      includeBounds: true,
    });

    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('id="component-front"');
    expect(svg).toContain('id="component-back"');
    expect(svg).toContain('id="component-sleeve"');
    expect(svg).toContain('GRAINLINE ↑ FOLD');
    expect(svg).toContain('FRONT');
    expect(svg).toContain('BACK');
    expect(svg).toContain('SLEEVE');
  });
});
