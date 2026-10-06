import { describe, it, expect, beforeEach } from 'vitest';
import { useCADStore } from '../client/src/store/useCADStore';
import { calculateGarmentBounds } from '../shared/gradingEngine';

import { PatternComponent, MetricComparison } from '../shared/types';

describe('End-to-End Workflow: Basic T-Shirt S → M Grading', () => {
  beforeEach(() => {
    useCADStore.getState().createNewProject('E2E Basic T-Shirt Grading Session');
  });

  it('completes the workflow: Select Garment → Current Size S → Target Size M → Grade Entire Garment', async () => {
    const store = useCADStore.getState();

    // 1. Invariant: ONE GARMENT = ONE GRADING OBJECT
    // Verify default selection is Entire Garment
    expect(store.selectedComponentId).toBe('entire');
    expect(store.garment.name).toBe('Basic T-Shirt');
    expect(store.garment.components).toHaveLength(3);

    // Capture initial S state for Front, Back, and Sleeve
    const frontS = store.garment.components.find((c: PatternComponent) => c.id === 'front')!;
    const backS = store.garment.components.find((c: PatternComponent) => c.id === 'back')!;
    const sleeveS = store.garment.components.find((c: PatternComponent) => c.id === 'sleeve')!;

    const initialBounds = calculateGarmentBounds(store.garment);

    // Initial measurements verification
    expect(frontS.measurements.halfChest).toBe(48.0);
    expect(frontS.measurements.bodyLength).toBe(66.0);
    expect(backS.measurements.bodyLength).toBe(66.0);
    expect(sleeveS.measurements.sleeveLength).toBe(20.5);
    expect(sleeveS.measurements.sleeveCapLength).toBe(46.2);

    // 2. Select Current Size (Base = S) and Target Size (Grade To = M)
    store.setCurrentSize('S');
    store.setTargetSize('M');

    expect(useCADStore.getState().currentSize).toBe('S');
    expect(useCADStore.getState().targetSize).toBe('M');

    // 3. User attempts to click a single component (e.g. front)
    store.setSelectedComponent('front');
    expect(useCADStore.getState().selectedComponentId).toBe('front');

    // Prominent "Select Entire Garment" is triggered
    store.selectEntireGarment();
    expect(useCADStore.getState().selectedComponentId).toBe('entire');

    // 4. Execute "Grade Entire Garment"
    const gradingResult = await store.executeGrading('M');

    // 5. Verify "Grading Complete — S → M" notification status
    const stateAfterGrade = useCADStore.getState();
    expect(stateAfterGrade.gradingNotification).toContain('Grading Complete — S → M');
    expect(stateAfterGrade.currentSize).toBe('M');

    // 6. Verify Front, Back, and Sleeve ALL changed together automatically!
    const frontM = stateAfterGrade.garment.components.find((c: PatternComponent) => c.id === 'front')!;
    const backM = stateAfterGrade.garment.components.find((c: PatternComponent) => c.id === 'back')!;
    const sleeveM = stateAfterGrade.garment.components.find((c: PatternComponent) => c.id === 'sleeve')!;

    // Front checks
    expect(frontM.measurements.halfChest).toBe(50.0); // +2.0 cm half-chest
    expect(frontM.measurements.bodyLength).toBe(68.0); // +2.0 cm length

    // Back checks
    expect(backM.measurements.halfChest).toBe(50.0); // +2.0 cm half-chest
    expect(backM.measurements.bodyLength).toBe(68.0); // +2.0 cm length

    // Sleeve checks
    expect(sleeveM.measurements.sleeveLength).toBe(21.5); // +1.0 cm sleeve length
    expect(sleeveM.measurements.sleeveCapLength).toBe(47.2); // proportional expansion matching armhole scye

    // 7. Verify unified 1-Object Bounding Box updated to enclose expanded pieces
    const newBounds = calculateGarmentBounds(stateAfterGrade.garment);
    expect(newBounds.width).toBeGreaterThan(initialBounds.width);
    expect(newBounds.height).toBeGreaterThan(initialBounds.height);

    // 8. Verify relative positioning maintained so pieces do not overlap
    expect(backM.offset.x).toBeGreaterThan(frontM.offset.x + 250);
    expect(sleeveM.offset.x).toBeGreaterThan(backM.offset.x + 250);

    // 9. Verify dimensional metrics comparison returned accurately
    const bustMetric = gradingResult.metricsComparison.find((m: MetricComparison) => m.label === 'Total Bust Circumference');
    expect(bustMetric?.beforeCm).toBe(92.0);
    expect(bustMetric?.afterCm).toBe(96.0);
    expect(bustMetric?.deltaCm).toBe(4.0);

    const lengthMetric = gradingResult.metricsComparison.find((m: MetricComparison) => m.label === 'Center Back Body Length');
    expect(lengthMetric?.beforeCm).toBe(66.0);
    expect(lengthMetric?.afterCm).toBe(68.0);
    expect(lengthMetric?.deltaCm).toBe(2.0);

    // 10. Verify moving Entire Garment moves Front, Back, Sleeve together
    stateAfterGrade.moveEntireGarment(100, 50);
    const stateAfterMove = useCADStore.getState();
    expect(stateAfterMove.garment.position.x).toBe(100);
    expect(stateAfterMove.garment.position.y).toBe(50);
  });
});
