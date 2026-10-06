import {
  Garment,
  GarmentSize,
  GradingResult,
  GradingStepInfo,
  MetricComparison,
  PatternComponent,
  PatternPathCommand,
  Point2D,
} from './types';

/**
 * Deep clones an object
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Calculates Euclidean distance between two 2D points in millimeters
 */
export function calculateDistance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Vector Grading Engine
 *
 * Implements: ONE GARMENT = ONE GRADING OBJECT
 * Proportional grading sequence:
 * 1. Neck (Collar width and depth expansion)
 * 2. Shoulder (Shoulder slant slope and length delta)
 * 3. Bust/Chest (Bust level circumference delta sync, scye depth/armhole expansion)
 * 4. Waist (Waist curve shaping delta)
 * 5. Hip (Sweep circumference delta)
 * 6. Hem (Body vertical length drop)
 *
 * Front, Back, and Sleeve are synchronized in ONE unified vector pass.
 * Never graded independently.
 */
export function gradeGarment(
  garment: Garment,
  targetSize: GarmentSize,
  sourceSize?: GarmentSize
): GradingResult {
  const fromSize = sourceSize || garment.currentSize;
  const toSize = targetSize;

  const sizeTable = garment.sizeTable;
  const fromDims = sizeTable[fromSize];
  const toDims = sizeTable[toSize];

  if (!fromDims || !toDims) {
    throw new Error(`Size dimensions not found for ${fromSize} -> ${toSize}`);
  }

  // Calculate grading deltas in cm
  const bustDeltaCm = toDims.bust - fromDims.bust;       // e.g. +4.0 cm
  const waistDeltaCm = toDims.waist - fromDims.waist;     // e.g. +4.0 cm
  const hipDeltaCm = toDims.hip - fromDims.hip;         // e.g. +4.0 cm
  const lengthDeltaCm = toDims.length - fromDims.length; // e.g. +2.0 cm
  const sleeveDeltaCm = toDims.sleeveLength - fromDims.sleeveLength; // e.g. +1.0 cm
  const shoulderDeltaCm = toDims.shoulderWidth - fromDims.shoulderWidth; // e.g. +0.6 cm
  const neckDeltaCm = toDims.neckCircumference - fromDims.neckCircumference; // e.g. +1.5 cm

  // Convert to vector canvas units (1cm = 10 units)
  // For 1/4 body patterns (Front and Back on fold):
  // 1/4 of total bust circumference delta is added to the side seam x-direction
  const bustDeltaX = (bustDeltaCm / 4) * 10;   // e.g. +10 mm
  const waistDeltaX = (waistDeltaCm / 4) * 10; // e.g. +10 mm
  const hipDeltaX = (hipDeltaCm / 4) * 10;     // e.g. +10 mm
  const bodyLengthDeltaY = lengthDeltaCm * 10; // e.g. +20 mm
  const sleeveLengthDeltaY = sleeveDeltaCm * 10; // e.g. +10 mm
  const sleeveWidthDeltaX = (bustDeltaCm / 4) * 10; // e.g. +10 mm (half width delta = +5mm each side)
  const shoulderDeltaX = shoulderDeltaCm * 10 * 0.8; // shoulder tip shift
  const neckDeltaX = (neckDeltaCm / 6) * 10 * 0.7; // HPS shift

  const gradedGarment = clone(garment);
  gradedGarment.currentSize = toSize;
  gradedGarment.lastGradedAt = new Date().toISOString();
  gradedGarment.gradeHistory = gradedGarment.gradeHistory || [];
  gradedGarment.gradeHistory.push({
    from: fromSize,
    to: toSize,
    timestamp: new Date().toISOString(),
  });

  // Grade Front Component
  const front = gradedGarment.components.find((c) => c.id === 'front');
  if (front) {
    gradeComponent(front, {
      bustDeltaX,
      waistDeltaX,
      hipDeltaX,
      bodyLengthDeltaY,
      shoulderDeltaX,
      neckDeltaX,
      isSleeve: false,
    });
  }

  // Grade Back Component
  const back = gradedGarment.components.find((c) => c.id === 'back');
  if (back) {
    gradeComponent(back, {
      bustDeltaX,
      waistDeltaX,
      hipDeltaX,
      bodyLengthDeltaY,
      shoulderDeltaX,
      neckDeltaX,
      isSleeve: false,
    });
  }

  // Grade Sleeve Component (Synchronized with Front & Back scye modifications)
  const sleeve = gradedGarment.components.find((c) => c.id === 'sleeve');
  if (sleeve) {
    gradeSleeveComponent(sleeve, {
      sleeveWidthDeltaX,
      sleeveLengthDeltaY,
      armholeDelta: bustDeltaX * 0.4,
    });
  }

  // Maintain relative spacing so Front, Back and Sleeve never collide when expanding
  // Adjust component offsets dynamically
  if (front && back && sleeve) {
    // Keep Front at original offset
    // Adjust Back offset if front expands
    const frontWidthExpansion = Math.max(0, bustDeltaX);
    back.offset.x = 380 + frontWidthExpansion * 1.5;
    // Adjust Sleeve offset if back expands
    sleeve.offset.x = 700 + frontWidthExpansion * 3.0;
  }

  // Generate Grading Steps Breakdown
  const stepsSummary: GradingStepInfo[] = [
    {
      step: 'neck',
      name: 'Neck Circumference & HPS Point',
      deltaMm: neckDeltaCm * 10,
      deltaCm: neckDeltaCm,
      appliedToComponents: ['Front', 'Back'],
      status: 'complete',
    },
    {
      step: 'shoulder',
      name: 'Shoulder Lock & Slope',
      deltaMm: shoulderDeltaCm * 10,
      deltaCm: shoulderDeltaCm,
      appliedToComponents: ['Front', 'Back'],
      status: 'complete',
    },
    {
      step: 'bust',
      name: 'Bust / Chest & Armhole Scye',
      deltaMm: bustDeltaCm * 10,
      deltaCm: bustDeltaCm,
      appliedToComponents: ['Front', 'Back', 'Sleeve'],
      status: 'complete',
    },
    {
      step: 'waist',
      name: 'Waist Level Circumference',
      deltaMm: waistDeltaCm * 10,
      deltaCm: waistDeltaCm,
      appliedToComponents: ['Front', 'Back'],
      status: 'complete',
    },
    {
      step: 'hip',
      name: 'Hip Sweep Circumference',
      deltaMm: hipDeltaCm * 10,
      deltaCm: hipDeltaCm,
      appliedToComponents: ['Front', 'Back'],
      status: 'complete',
    },
    {
      step: 'hem',
      name: 'Body Length & Sleeve Hem',
      deltaMm: lengthDeltaCm * 10,
      deltaCm: lengthDeltaCm,
      appliedToComponents: ['Front', 'Back', 'Sleeve'],
      status: 'complete',
    },
  ];

  // Dimensional Metrics Comparison
  const metricsComparison: MetricComparison[] = [
    {
      label: 'Half-Chest Width',
      beforeCm: fromDims.width,
      afterCm: toDims.width,
      deltaCm: +(toDims.width - fromDims.width).toFixed(1),
    },
    {
      label: 'Total Bust Circumference',
      beforeCm: fromDims.bust,
      afterCm: toDims.bust,
      deltaCm: +(toDims.bust - fromDims.bust).toFixed(1),
    },
    {
      label: 'Waist Circumference',
      beforeCm: fromDims.waist,
      afterCm: toDims.waist,
      deltaCm: +(toDims.waist - fromDims.waist).toFixed(1),
    },
    {
      label: 'Hip Sweep',
      beforeCm: fromDims.hip,
      afterCm: toDims.hip,
      deltaCm: +(toDims.hip - fromDims.hip).toFixed(1),
    },
    {
      label: 'Center Back Body Length',
      beforeCm: fromDims.length,
      afterCm: toDims.length,
      deltaCm: +(toDims.length - fromDims.length).toFixed(1),
    },
    {
      label: 'Sleeve Length (Crown to Hem)',
      beforeCm: fromDims.sleeveLength,
      afterCm: toDims.sleeveLength,
      deltaCm: +(toDims.sleeveLength - fromDims.sleeveLength).toFixed(1),
    },
  ];

  return {
    gradedGarment,
    fromSize,
    toSize,
    stepsSummary,
    metricsComparison,
    gradingTimestamp: gradedGarment.lastGradedAt,
  };
}

interface ComponentGradeParams {
  bustDeltaX: number;
  waistDeltaX: number;
  hipDeltaX: number;
  bodyLengthDeltaY: number;
  shoulderDeltaX: number;
  neckDeltaX: number;
  isSleeve: boolean;
}

/**
 * Modifies vector points of Front or Back component
 */
function gradeComponent(component: PatternComponent, params: ComponentGradeParams): void {
  const { bustDeltaX, waistDeltaX, hipDeltaX, bodyLengthDeltaY, shoulderDeltaX, neckDeltaX } = params;

  // Grade vector paths
  component.paths.forEach((pathCmd: PatternPathCommand) => {
    pathCmd.points.forEach((p: Point2D) => {
      // 1. Neck zone
      if (pathCmd.zone === 'neck' || p.name?.includes('Neck') || p.name?.includes('HPS')) {
        p.x += neckDeltaX;
        p.y -= neckDeltaX * 0.2; // slight neck drop adjustment
      }
      // 2. Shoulder zone
      else if (pathCmd.zone === 'shoulder' || p.name?.includes('Shoulder')) {
        p.x += shoulderDeltaX;
        p.y += shoulderDeltaX * 0.15;
      }
      // 3. Armhole & Bust level
      else if (pathCmd.zone === 'armhole' || p.name?.includes('Underarm')) {
        p.x += bustDeltaX;
        p.y += bodyLengthDeltaY * 0.15; // armhole depth drop
      }
      // 4. Waist level
      else if (pathCmd.zone === 'waist' || p.name?.includes('Waist')) {
        p.x += waistDeltaX;
        p.y += bodyLengthDeltaY * 0.5; // waist proportional vertical position
      }
      // 5. Hip level
      else if (pathCmd.zone === 'hip' || p.name?.includes('Side Hem')) {
        p.x += hipDeltaX;
        p.y += bodyLengthDeltaY;
      }
      // 6. Hem level
      else if (pathCmd.zone === 'hem' || p.name?.includes('Hem')) {
        p.y += bodyLengthDeltaY;
      }
    });
  });

  // Grade notches
  component.notches.forEach((notch: Point2D) => {
    if (notch.name?.includes('Armhole')) {
      notch.x += bustDeltaX * 0.7;
      notch.y += bodyLengthDeltaY * 0.15;
    } else if (notch.name?.includes('Waist')) {
      notch.x += waistDeltaX;
      notch.y += bodyLengthDeltaY * 0.5;
    } else if (notch.name?.includes('Hem')) {
      notch.y += bodyLengthDeltaY;
    }
  });

  // Adjust grainline length to match body length
  component.grainline.end.y += bodyLengthDeltaY;

  // Update dynamic labels and measurements
  if (component.measurements.halfChest !== undefined) {
    component.measurements.halfChest = +(component.measurements.halfChest + (bustDeltaX / 5)).toFixed(1);
  }
  if (component.measurements.bodyLength !== undefined) {
    component.measurements.bodyLength = +(component.measurements.bodyLength + (bodyLengthDeltaY / 10)).toFixed(1);
  }
  if (component.measurements.hemWidth !== undefined) {
    component.measurements.hemWidth = +(component.measurements.hemWidth + (hipDeltaX / 5)).toFixed(1);
  }

  // Update label texts
  component.labels.forEach((lbl) => {
    if (lbl.text.startsWith('1/2 Chest:')) {
      lbl.text = `1/2 Chest: ${component.measurements.halfChest?.toFixed(1)}cm • Cut 1`;
    } else if (lbl.text.startsWith('BUST LEVEL:')) {
      lbl.text = `BUST LEVEL: ${component.measurements.halfChest?.toFixed(1)} cm (1/2)`;
    } else if (lbl.text.startsWith('HEM LEVEL:')) {
      lbl.text = `HEM LEVEL: ${component.measurements.hemWidth?.toFixed(1)} cm (1/2)`;
    } else if (lbl.text.startsWith('CENTER BACK LENGTH:')) {
      lbl.text = `CENTER BACK LENGTH: ${component.measurements.bodyLength?.toFixed(1)} cm`;
    }
  });
}

/**
 * Modifies vector points of Sleeve component synchronized with armhole expansion
 */
function gradeSleeveComponent(
  sleeve: PatternComponent,
  params: { sleeveWidthDeltaX: number; sleeveLengthDeltaY: number; armholeDelta: number }
): void {
  const { sleeveWidthDeltaX, sleeveLengthDeltaY, armholeDelta } = params;
  const halfWidthDelta = sleeveWidthDeltaX * 0.5;

  sleeve.paths.forEach((pathCmd: PatternPathCommand) => {
    pathCmd.points.forEach((p: Point2D) => {
      // Sleeve crown tip
      if (p.name?.includes('Crown')) {
        p.y -= armholeDelta * 0.5; // crown height rises slightly with chest expansion
      }
      // Front & Back Underarm points (sleeve bicep width expands)
      else if (p.name?.includes('Underarm Front') || (p.x < 100 && pathCmd.zone === 'sleeve-seam')) {
        p.x -= halfWidthDelta;
        p.y += armholeDelta * 0.4;
      } else if (p.name?.includes('Underarm Back') || (p.x > 250 && pathCmd.zone === 'sleeve-cap')) {
        p.x += halfWidthDelta;
        p.y += armholeDelta * 0.4;
      }
      // Cuff points (sleeve length drops, cuff expands)
      else if (p.name?.includes('Cuff Left') || pathCmd.zone === 'sleeve-hem') {
        if (p.x < 175) p.x -= halfWidthDelta * 0.6;
        else p.x += halfWidthDelta * 0.6;
        p.y += sleeveLengthDeltaY;
      } else if (p.name?.includes('Cuff Right')) {
        p.x += halfWidthDelta * 0.6;
        p.y += sleeveLengthDeltaY;
      }
    });
  });

  // Grade notches
  sleeve.notches.forEach((notch: Point2D) => {
    if (notch.name?.includes('Front')) {
      notch.x -= halfWidthDelta * 0.5;
    } else if (notch.name?.includes('Back')) {
      notch.x += halfWidthDelta * 0.5;
    }
  });

  // Grainline
  sleeve.grainline.end.y += sleeveLengthDeltaY;

  // Measurements
  if (sleeve.measurements.sleeveLength !== undefined) {
    sleeve.measurements.sleeveLength = +(sleeve.measurements.sleeveLength + (sleeveLengthDeltaY / 10)).toFixed(1);
  }
  if (sleeve.measurements.sleeveCapLength !== undefined) {
    sleeve.measurements.sleeveCapLength = +(sleeve.measurements.sleeveCapLength + (sleeveWidthDeltaX / 10)).toFixed(1);
  }

  // Update label text
  sleeve.labels.forEach((lbl) => {
    if (lbl.text.startsWith('Cap Scye')) {
      lbl.text = `Cap Scye ${sleeve.measurements.sleeveCapLength?.toFixed(1)}cm • Length ${sleeve.measurements.sleeveLength?.toFixed(1)}cm`;
    }
  });
}

/**
 * Calculates total 1-Object Bounding Box enclosing Front + Back + Sleeve
 */
export function calculateGarmentBounds(garment: Garment): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  garment.components.forEach((component) => {
    component.paths.forEach((cmd) => {
      cmd.points.forEach((p) => {
        const worldX = garment.position.x + component.offset.x + p.x;
        const worldY = garment.position.y + component.offset.y + p.y;
        if (worldX < minX) minX = worldX;
        if (worldY < minY) minY = worldY;
        if (worldX > maxX) maxX = worldX;
        if (worldY > maxY) maxY = worldY;
      });
    });
  });

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 800, width: 1000, height: 800 };
  }

  // Add padding around pattern edges
  const padding = 20;
  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

/**
 * Generates an SVG path string from PatternPathCommand array
 */
export function pathCommandsToSvgString(commands: PatternPathCommand[]): string {
  return commands
    .map((cmd) => {
      if (cmd.type === 'M' && cmd.points.length >= 1) {
        return `M ${cmd.points[0].x.toFixed(2)} ${cmd.points[0].y.toFixed(2)}`;
      }
      if (cmd.type === 'L' && cmd.points.length >= 1) {
        return `L ${cmd.points[0].x.toFixed(2)} ${cmd.points[0].y.toFixed(2)}`;
      }
      if (cmd.type === 'C' && cmd.points.length >= 3) {
        return `C ${cmd.points[0].x.toFixed(2)} ${cmd.points[0].y.toFixed(2)}, ${cmd.points[1].x.toFixed(2)} ${cmd.points[1].y.toFixed(2)}, ${cmd.points[2].x.toFixed(2)} ${cmd.points[2].y.toFixed(2)}`;
      }
      if (cmd.type === 'Q' && cmd.points.length >= 2) {
        return `Q ${cmd.points[0].x.toFixed(2)} ${cmd.points[0].y.toFixed(2)}, ${cmd.points[1].x.toFixed(2)} ${cmd.points[1].y.toFixed(2)}`;
      }
      if (cmd.type === 'Z') {
        return 'Z';
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}
