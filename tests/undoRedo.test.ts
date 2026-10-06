import { describe, it, expect, beforeEach } from 'vitest';
import { useCADStore } from '../client/src/store/useCADStore';
import { createDefaultBasicTShirt } from '../shared/constants';

describe('CAD Application Undo / Redo History Stack', () => {
  beforeEach(() => {
    // Reset Zustand store state to default S
    useCADStore.getState().createNewProject('Undo/Redo Test Project');
  });

  it('records history during grading and reverts state via Undo', async () => {
    const store = useCADStore.getState();
    expect(store.currentSize).toBe('S');
    expect(store.canUndo()).toBe(false);

    // Grade to M
    store.setTargetSize('M');
    await store.executeGrading();

    const gradedStore = useCADStore.getState();
    expect(gradedStore.currentSize).toBe('M');
    expect(gradedStore.canUndo()).toBe(true);

    // Perform Undo
    gradedStore.undo();

    const undoneStore = useCADStore.getState();
    expect(undoneStore.currentSize).toBe('S');
    expect(undoneStore.canRedo()).toBe(true);

    // Perform Redo
    undoneStore.redo();

    const redoneStore = useCADStore.getState();
    expect(redoneStore.currentSize).toBe('M');
  });

  it('moves entire garment together and records undo history', () => {
    const store = useCADStore.getState();
    const initialPos = { ...store.garment.position };

    store.moveEntireGarment(50, 30);

    const movedStore = useCADStore.getState();
    expect(movedStore.garment.position.x).toBe(initialPos.x + 50);
    expect(movedStore.garment.position.y).toBe(initialPos.y + 30);
    expect(movedStore.canUndo()).toBe(true);

    movedStore.undo();

    const undoneStore = useCADStore.getState();
    expect(undoneStore.garment.position.x).toBe(initialPos.x);
    expect(undoneStore.garment.position.y).toBe(initialPos.y);
  });
});
