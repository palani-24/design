export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const GARMENT_SIZES: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export interface SizeMeasurement {
  bust: number;       // total circumference in cm (e.g. 92 for S)
  waist: number;      // total circumference in cm (e.g. 84 for S)
  hip: number;        // total circumference in cm (e.g. 96 for S)
  length: number;     // center back body length in cm (e.g. 66 for S)
  width: number;      // half chest width in cm (e.g. 48 for S)
  height: number;     // overall garment height in cm (e.g. 70 for S)
  sleeveLength: number; // crown to hem in cm (e.g. 20.5 for S)
  shoulderWidth: number; // neck to shoulder tip in cm (e.g. 15.2 for S)
  neckCircumference: number; // neck opening in cm (e.g. 40 for S)
}

export type SizeTable = Record<GarmentSize, SizeMeasurement>;

export interface Point2D {
  x: number;
  y: number;
  name?: string;
  isControl?: boolean;
  isNotch?: boolean;
}

export type PathCommandType = 'M' | 'L' | 'C' | 'Q' | 'Z';

export interface PatternPathCommand {
  type: PathCommandType;
  points: Point2D[];
  annotation?: string;
  zone?: 'neck' | 'shoulder' | 'armhole' | 'bust' | 'waist' | 'hip' | 'hem' | 'sleeve-cap' | 'sleeve-seam' | 'sleeve-hem' | 'center-fold';
}

export type CADTheme = 'tukacad-black' | 'cad-slate' | 'blueprint-light';
export type CADUnit = 'in' | 'cm';

export interface InternalContour {
  id: string;
  name: string;
  type: 'line' | 'pocket' | 'dart' | 'pleat' | 'graphic';
  points: Point2D[];
  closed?: boolean;
  color?: string;
  graphicSvg?: string;
}

export interface PatternComponent {
  id: string; // 'front' | 'back' | 'sleeve'
  pieceCode?: string; // 'BK', 'FR', 'BK-PK', 'COIN', 'WB', etc. (TUKA Piece Code)
  name: string; // 'Front Component', 'Back Component', 'Sleeve (Pair)'
  cutInstruction: string; // 'Cut 1 on Fold' | 'Cut 1' | 'Cut 2 (Pair)'
  quantity?: number;
  grainline: {
    start: Point2D;
    end: Point2D;
    label: string;
  };
  paths: PatternPathCommand[];
  notches: Point2D[];
  internals?: InternalContour[];
  seamAllowanceMm?: number;
  labels: Array<{
    text: string;
    position: Point2D;
    type?: string;
  }>;
  measurements: {
    halfChest?: number;
    waist?: number;
    hip?: number;
    length?: number;
    inseam?: number;
    bodyLength?: number;
    armholeLength?: number;
    sleeveCapLength?: number;
    sleeveLength?: number;
    hemWidth?: number;
    shoulderLength?: number;
  };
  offset: Point2D; // Relative layout offset inside garment workspace
}

export interface Garment {
  id: string;
  name: string; // e.g. "Basic T-Shirt"
  category: 't-shirt' | 'polo' | 'shirt' | 'trouser' | 'jacket' | 'dress';
  version: string;
  baseSize: GarmentSize;
  currentSize: GarmentSize;
  position: Point2D; // Moving Entire Garment moves Front + Back + Sleeve together
  components: PatternComponent[];
  sizeTable: SizeTable;
  lastGradedAt?: string;
  gradeHistory?: Array<{
    from: GarmentSize;
    to: GarmentSize;
    timestamp: string;
  }>;
}

export interface Project {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  garment: Garment;
  createdAt: string;
  updatedAt: string;
}

export type GradingStep = 'neck' | 'shoulder' | 'bust' | 'waist' | 'hip' | 'hem';

export interface GradingStepInfo {
  step: GradingStep;
  name: string;
  deltaMm: number;
  deltaCm: number;
  appliedToComponents: string[];
  status: 'pending' | 'in-progress' | 'complete';
}

export interface MetricComparison {
  label: string;
  beforeCm: number;
  afterCm: number;
  deltaCm: number;
}

export interface GradingResult {
  gradedGarment: Garment;
  fromSize: GarmentSize;
  toSize: GarmentSize;
  stepsSummary: GradingStepInfo[];
  metricsComparison: MetricComparison[];
  gradingTimestamp: string;
}

export interface MeasureToolState {
  active: boolean;
  startPoint: Point2D | null;
  endPoint: Point2D | null;
  currentDistanceMm: number | null;
  currentDistanceCm: number | null;
}

// ==========================================
// CLO 3D Standalone Engine Types
// ==========================================
export type CADEngineMode = 'clo3d' | 'tukacad';
export type CloViewMode = 'split' | '3d-only' | '2d-only';
export type Language = 'ta' | 'en';
export type SurfaceMode = 'textured' | 'wireframe' | 'stressMap' | 'translucent';

export type AvatarPose =
  | 'FV2_01_A'
  | 'FV2_02_Aforsize'
  | 'FV2_03_Attention'
  | 'FV2_04'
  | 'FV2_08_Running'
  | 'FV2_09_Sitting'
  | 'FV2_10_ArmsUp';

export interface FabricPhysics {
  id: string;
  name: string;
  type: string;
  color: string;
  stretchWarp: number; // 0-100
  stretchWeft: number; // 0-100
  bending: number;     // 0-100
  shear: number;       // 0-100
  density: number;     // g/m^2 (e.g. 180)
  thickness: number;   // mm (e.g. 0.45)
  roughness: number;   // 0.0 - 1.0
  metalness: number;   // 0.0 - 1.0
}

export interface SeamLink {
  id: string;
  name: string;
  sourcePiece: string;
  sourceEdge: string;
  targetPiece: string;
  targetEdge: string;
  lengthMm: number;
  color?: string;
}

