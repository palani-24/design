import { describe, it, expect } from 'vitest';
import {
  garmentSchema,
  projectSchema,
  sizeTableSchema,
  gradeRequestSchema,
} from '../shared/validation';
import { createDefaultBasicTShirt, DEFAULT_SIZE_TABLE } from '../shared/constants';

describe('JSON Project & Data Validation (Zod)', () => {
  it('validates standard apparel size table successfully', () => {
    const parseResult = sizeTableSchema.safeParse(DEFAULT_SIZE_TABLE);
    expect(parseResult.success).toBe(true);
  });

  it('rejects invalid size measurements with negative values', () => {
    const invalidTable = {
      ...DEFAULT_SIZE_TABLE,
      S: {
        ...DEFAULT_SIZE_TABLE.S,
        bust: -50,
      },
    };
    const parseResult = sizeTableSchema.safeParse(invalidTable);
    expect(parseResult.success).toBe(false);
  });

  it('validates a complete garment model with components', () => {
    const garment = createDefaultBasicTShirt();
    const parseResult = garmentSchema.safeParse(garment);
    expect(parseResult.success).toBe(true);
  });

  it('validates project JSON payload with metadata and garment', () => {
    const project = {
      id: 'proj-test-001',
      title: 'Validation Test Project',
      garment: createDefaultBasicTShirt(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const parseResult = projectSchema.safeParse(project);
    expect(parseResult.success).toBe(true);
  });

  it('rejects project without title or garment', () => {
    const corruptedProject = {
      id: 'proj-bad',
      title: '',
    };
    const parseResult = projectSchema.safeParse(corruptedProject);
    expect(parseResult.success).toBe(false);
  });

  it('validates grade requests for valid target size', () => {
    expect(gradeRequestSchema.safeParse({ targetSize: 'M' }).success).toBe(true);
    expect(gradeRequestSchema.safeParse({ targetSize: 'INVALID' }).success).toBe(false);
  });
});
