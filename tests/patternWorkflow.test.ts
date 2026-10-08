import { describe, it, expect } from 'vitest';
import {
  PATTERN_DEFINITIONS,
  getPatternDefinition,
  validatePatternMeasurements,
  generatePatternFromMeasurements,
} from '../shared/patternCatalog';

describe('Pattern Generation Workflow Requirements', () => {
  it('Pattern Selection Catalog: provides complete archetype library with pattern-specific specs', () => {
    expect(PATTERN_DEFINITIONS.length).toBeGreaterThanOrEqual(13);

    const patternIds = PATTERN_DEFINITIONS.map(p => p.id);
    expect(patternIds).toContain('shirt');
    expect(patternIds).toContain('trouser');
    expect(patternIds).toContain('basic-bodice');
    expect(patternIds).toContain('basic-tshirt');
    expect(patternIds).toContain('polo');
    expect(patternIds).toContain('bootcut-pant');
    expect(patternIds).toContain('denim-jeans');
    expect(patternIds).toContain('flared-skirt');
    expect(patternIds).toContain('sheath-dress');
    expect(patternIds).toContain('suit-jacket');
    expect(patternIds).toContain('double-breasted-blazer');
    expect(patternIds).toContain('trench-coat');
    expect(patternIds).toContain('bomber-jacket');
  });

  it('Requirement 4 & 5: Patterns show ONLY pattern-specific measurements and no irrelevant ones', () => {
    // Trouser should only have lower-body measurements, no bust/chest or sleeve
    const trouserDef = getPatternDefinition('trouser');
    expect(trouserDef).toBeDefined();
    const trouserKeys = trouserDef!.measurements.map(m => m.key);
    expect(trouserKeys).toContain('waist');
    expect(trouserKeys).toContain('hip');
    expect(trouserKeys).toContain('inseam');
    expect(trouserKeys).not.toContain('chest');
    expect(trouserKeys).not.toContain('bust');
    expect(trouserKeys).not.toContain('sleeveLength');
    expect(trouserKeys).not.toContain('neckGirth');

    // Shirt should only have upper-body measurements, no inseam/outseam
    const shirtDef = getPatternDefinition('shirt');
    expect(shirtDef).toBeDefined();
    const shirtKeys = shirtDef!.measurements.map(m => m.key);
    expect(shirtKeys).toContain('chest');
    expect(shirtKeys).toContain('neckGirth');
    expect(shirtKeys).toContain('sleeveLength');
    expect(shirtKeys).not.toContain('inseam');
    expect(shirtKeys).not.toContain('outseam');

    // Flared skirt should have waist, hip, skirtLength, no sleeve or neck
    const skirtDef = getPatternDefinition('flared-skirt');
    expect(skirtDef).toBeDefined();
    const skirtKeys = skirtDef!.measurements.map(m => m.key);
    expect(skirtKeys).toContain('waist');
    expect(skirtKeys).toContain('hip');
    expect(skirtKeys).toContain('skirtLength');
    expect(skirtKeys).not.toContain('sleeveLength');
    expect(skirtKeys).not.toContain('neckGirth');
  });

  it('Requirement 8 & 9: Validation catches missing and non-positive measurements with appropriate error messages', () => {
    const shirtDef = getPatternDefinition('shirt')!;

    // Empty measurements
    const emptyResult = validatePatternMeasurements(shirtDef, {});
    expect(emptyResult.valid).toBe(false);
    expect(Object.keys(emptyResult.errors).length).toBe(shirtDef.measurements.length);
    expect(emptyResult.errors['chest']).toMatch(/required/i);

    // Partial measurements
    const partialResult = validatePatternMeasurements(shirtDef, {
      chest: 104,
      waist: 90,
    });
    expect(partialResult.valid).toBe(false);
    expect(partialResult.errors['chest']).toBeUndefined();
    expect(partialResult.errors['neckGirth']).toMatch(/required/i);

    // Negative or zero value
    const negativeResult = validatePatternMeasurements(shirtDef, {
      chest: -10,
      waist: 0,
      neckGirth: 40,
      shoulderWidth: 46,
      sleeveLength: 64,
      shirtLength: 76,
      armholeDepth: 26,
      cuffWidth: 11,
      collarWidth: 4.5,
    });
    expect(negativeResult.valid).toBe(false);
    expect(negativeResult.errors['chest']).toMatch(/greater than 0/i);
    expect(negativeResult.errors['waist']).toMatch(/greater than 0/i);
  });

  it('Requirement 10 & 14: When valid, generates ONLY the selected pattern using the exact entered measurements', () => {
    const shirtDef = getPatternDefinition('shirt')!;
    const inputMeasurements = {
      chest: 108,
      waist: 94,
      neckGirth: 42,
      shoulderWidth: 48,
      sleeveLength: 66,
      shirtLength: 78,
      armholeDepth: 28,
      cuffWidth: 12,
      collarWidth: 5,
    };

    const valResult = validatePatternMeasurements(shirtDef, inputMeasurements);
    expect(valResult.valid).toBe(true);
    expect(Object.keys(valResult.errors).length).toBe(0);

    const garment = generatePatternFromMeasurements('shirt', inputMeasurements, 'cm');
    expect(garment.category).toBe('shirt');
    expect(garment.name).toContain("Shirt");
    expect(garment.measurements).toEqual(inputMeasurements);

    // Verify shirt components exist
    const componentNames = garment.components.map(c => c.name);
    expect(componentNames).toContain("Men's Shirt (Front Piece)");
    expect(componentNames).toContain("Men's Shirt (Back Piece)");
    expect(componentNames).toContain("Men's Shirt (Sleeve)");
    expect(componentNames).toContain("Collar Stand");

    // Verify exact measurement is used in component metadata
    const frontPanel = garment.components.find(c => c.name === "Men's Shirt (Front Piece)")!;
    expect(frontPanel.measurements.chest).toBe(108);
    expect(frontPanel.measurements.length).toBe(78);
    expect(frontPanel.paths.length).toBeGreaterThan(4);
  });

  it('Generates trouser pattern with exact entered measurements', () => {
    const trouserDef = getPatternDefinition('trouser')!;
    const inputMeasurements = {
      waist: 86,
      hip: 104,
      inseam: 82,
      outseam: 108,
      frontRise: 26,
      backRise: 38,
      thigh: 64,
      knee: 44,
      hemWidth: 20,
    };

    const valResult = validatePatternMeasurements(trouserDef, inputMeasurements);
    expect(valResult.valid).toBe(true);

    const garment = generatePatternFromMeasurements('trouser', inputMeasurements, 'cm');
    expect(garment.category).toBe('trouser');
    expect(garment.measurements).toEqual(inputMeasurements);
    const componentNames = garment.components.map(c => c.name);
    expect(componentNames).toContain('Front Trouser Leg');
    expect(componentNames).toContain('Back Trouser Leg');
    expect(componentNames).toContain('Curved Waistband');
  });

  it('Requirement 11 & 12: Does not generate default basic-bodice when another pattern is requested', () => {
    const jeansDef = getPatternDefinition('denim-jeans')!;
    const jeansMeasurements: Record<string, number> = {};
    jeansDef.measurements.forEach(m => {
      jeansMeasurements[m.key] = m.defaultValue ?? 80;
    });

    const garment = generatePatternFromMeasurements('denim-jeans', jeansMeasurements, 'cm');
    expect(garment.name).toContain('Jeans');
    expect(garment.category).toBe('trouser');
    expect(garment.measurements).toEqual(jeansMeasurements);
    // Must NOT be basic bodice
    expect(garment.name).not.toContain('Bodice');
  });
});
