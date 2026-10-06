import { describe, it, expect } from 'vitest';
import { createDefaultBasicTShirt, DEFAULT_SIZE_TABLE } from '../shared/constants';
import { gradeGarment } from '../shared/gradingEngine';

describe('Proportional Vector Grading Engine', () => {
  it('initializes basic t-shirt in base size S with 3 child components', () => {
    const garment = createDefaultBasicTShirt();
    expect(garment.currentSize).toBe('S');
    expect(garment.baseSize).toBe('S');
    expect(garment.components).toHaveLength(3);

    const ids = garment.components.map((c) => c.id);
    expect(ids).toEqual(['front', 'back', 'sleeve']);
  });

  it('grades entire garment from S to M resizing Front, Back, and Sleeve together', () => {
    const garment = createDefaultBasicTShirt();

    // Snapshot S coordinates
    const frontS = garment.components.find((c) => c.id === 'front')!;
    const backS = garment.components.find((c) => c.id === 'back')!;
    const sleeveS = garment.components.find((c) => c.id === 'sleeve')!;

    const frontUnderarmS = frontS.paths[3].points.find((p) => p.name === 'Front Underarm')!;
    const backUnderarmS = backS.paths[3].points.find((p) => p.name === 'Back Underarm')!;
    const sleeveCrownS = sleeveS.paths[1].points.find((p) => p.name === 'Sleeve Crown Tip')!;
    const frontHemS = frontS.paths[5].points.find((p) => p.name === 'Front Side Hem')!;

    const sFrontX = frontUnderarmS.x;
    const sBackX = backUnderarmS.x;
    const sFrontHemY = frontHemS.y;

    // Execute grading S -> M
    const result = gradeGarment(garment, 'M');

    expect(result.fromSize).toBe('S');
    expect(result.toSize).toBe('M');
    expect(result.gradedGarment.currentSize).toBe('M');

    const frontM = result.gradedGarment.components.find((c) => c.id === 'front')!;
    const backM = result.gradedGarment.components.find((c) => c.id === 'back')!;
    const sleeveM = result.gradedGarment.components.find((c) => c.id === 'sleeve')!;

    const frontUnderarmM = frontM.paths[3].points.find((p) => p.name === 'Front Underarm')!;
    const backUnderarmM = backM.paths[3].points.find((p) => p.name === 'Back Underarm')!;
    const frontHemM = frontM.paths[5].points.find((p) => p.name === 'Front Side Hem')!;

    // 1/4 Bust delta for S -> M is +1.0cm = +10mm in vector space
    expect(frontUnderarmM.x).toBeCloseTo(sFrontX + 10, 1);
    expect(backUnderarmM.x).toBeCloseTo(sBackX + 10, 1);

    // Body length delta for S -> M is +2.0cm = +20mm in vector space
    expect(frontHemM.y).toBeCloseTo(sFrontHemY + 20, 1);

    // Sleeve dimensions must have updated synchronously
    expect(sleeveM.measurements.sleeveLength).toBe(21.5); // S was 20.5
    expect(frontM.measurements.bodyLength).toBe(68.0); // S was 66.0
  });

  it('strictly follows the grading sequence: Neck -> Shoulder -> Bust -> Waist -> Hip -> Hem', () => {
    const garment = createDefaultBasicTShirt();
    const result = gradeGarment(garment, 'M');

    const sequence = result.stepsSummary.map((s) => s.step);
    expect(sequence).toEqual(['neck', 'shoulder', 'bust', 'waist', 'hip', 'hem']);

    result.stepsSummary.forEach((step) => {
      expect(step.status).toBe('complete');
      expect(step.deltaMm).toBeGreaterThan(0);
      expect(step.appliedToComponents.length).toBeGreaterThan(0);
    });
  });

  it('supports grading across all sizes: XS, S, M, L, XL, XXL', () => {
    const garment = createDefaultBasicTShirt();

    const resultXS = gradeGarment(garment, 'XS');
    expect(resultXS.gradedGarment.currentSize).toBe('XS');
    expect(resultXS.metricsComparison.find((m) => m.label === 'Total Bust Circumference')?.deltaCm).toBe(-4.0);

    const resultXXL = gradeGarment(garment, 'XXL', 'S');
    expect(resultXXL.gradedGarment.currentSize).toBe('XXL');
    expect(resultXXL.metricsComparison.find((m) => m.label === 'Total Bust Circumference')?.deltaCm).toBe(18.0);
  });
});
