import { Garment, PatternComponent, SizeTable } from './types';
import { DEFAULT_SIZE_TABLE } from './constants';

export const EASY_PATTERN_GRADING_RULES = [
  { point: 'Bust', gradeRule: '+2.0 cm', deltaCm: 2.0, color: '#2563eb', sizeName: 'Blue (S)' },
  { point: 'Waist', gradeRule: '+1.5 cm', deltaCm: 1.5, color: '#16a34a', sizeName: 'Green (M)' },
  { point: 'Hip', gradeRule: '+2.0 cm', deltaCm: 2.0, color: '#dc2626', sizeName: 'Red (L)' },
  { point: 'Shoulder', gradeRule: '+1.0 cm', deltaCm: 1.0, color: '#ca8a04', sizeName: 'Yellow (XL)' },
  { point: 'Neck Width', gradeRule: '+0.5 cm', deltaCm: 0.5, color: '#9333ea', sizeName: 'Purple (XXL)' },
  { point: 'Armhole', gradeRule: '+1.0 cm', deltaCm: 1.0, color: '#0284c7', sizeName: 'Cyan' },
];

export const SIZE_COLOR_PALETTE: Record<string, { name: string; hex: string; bg: string; border: string }> = {
  XS: { name: 'Slate', hex: '#64748b', bg: 'bg-slate-500', border: 'border-slate-500' },
  S: { name: 'Blue', hex: '#2563eb', bg: 'bg-blue-600', border: 'border-blue-600' },
  M: { name: 'Green', hex: '#16a34a', bg: 'bg-emerald-600', border: 'border-emerald-600' },
  L: { name: 'Red', hex: '#dc2626', bg: 'bg-red-600', border: 'border-red-600' },
  XL: { name: 'Yellow', hex: '#ca8a04', bg: 'bg-amber-600', border: 'border-amber-600' },
  XXL: { name: 'Purple', hex: '#9333ea', bg: 'bg-purple-600', border: 'border-purple-600' },
};

export const TUKACAD_GRADING_MATRIX = [
  { size: 'XS', bust: -2.0, waist: -1.5, hip: -2.0, shoulder: -1.0, armhole: -1.0 },
  { size: 'S',  bust: -1.0, waist: -0.5, hip: -1.0, shoulder: -0.5, armhole: -0.5 },
  { size: 'M',  bust:  0.0, waist:  0.0, hip:  0.0, shoulder:  0.0, armhole:  0.0 },
  { size: 'L',  bust: +1.0, waist: +0.5, hip: +1.0, shoulder: +0.5, armhole: +0.5 },
  { size: 'XL', bust: +2.0, waist: +1.5, hip: +2.0, shoulder: +1.0, armhole: +1.0 },
  { size: 'XXL',bust: +3.0, waist: +2.5, hip: +3.0, shoulder: +1.5, armhole: +1.5 },
];

export const BASIC_BODICE_SIZE_TABLE: SizeTable = {
  XS: { bust: 88.0, waist: 68.0, hip: 92.0, length: 41.0, width: 44.0, height: 42.0, sleeveLength: 0, shoulderWidth: 12.2, neckCircumference: 35.5 },
  S:  { bust: 92.0, waist: 71.0, hip: 96.0, length: 42.0, width: 46.0, height: 43.0, sleeveLength: 0, shoulderWidth: 12.8, neckCircumference: 36.5 },
  M:  { bust: 96.0, waist: 74.0, hip: 100.0, length: 43.0, width: 48.0, height: 44.0, sleeveLength: 0, shoulderWidth: 13.4, neckCircumference: 37.5 },
  L:  { bust: 100.0, waist: 77.0, hip: 104.0, length: 44.0, width: 50.0, height: 45.0, sleeveLength: 0, shoulderWidth: 14.0, neckCircumference: 38.5 },
  XL: { bust: 104.0, waist: 80.0, hip: 108.0, length: 45.0, width: 52.0, height: 46.0, sleeveLength: 0, shoulderWidth: 14.6, neckCircumference: 39.5 },
  XXL:{ bust: 110.0, waist: 85.0, hip: 114.0, length: 46.5, width: 55.0, height: 47.5, sleeveLength: 0, shoulderWidth: 15.4, neckCircumference: 41.0 },
};

/**
 * Creates authentic Front Bodice & Back Bodice Pattern as illustrated in
 * "Pattern Making & Grading Workflow: From Start to Finish (EasyPattern -> TUKAcAd)"
 */
export function createBasicBodice(): Garment {
  const frontBodice: PatternComponent = {
    id: 'front',
    pieceCode: 'FR-BD',
    name: 'Front Bodice',
    cutInstruction: 'Cut 1 on Fold • Base Size S',
    offset: { x: 60, y: 70 },
    grainline: {
      start: { x: 35, y: 120 },
      end: { x: 35, y: 410 },
      label: 'GRAINLINE ↑ CENTER FOLD',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 95, name: 'Center Front Neck' }],
      },
      // Front Neck curve to HPS
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 30, y: 95, isControl: true },
          { x: 75, y: 55, isControl: true },
          { x: 88, y: 40, name: 'HPS Neck Point' },
        ],
        annotation: 'Front Neckline',
      },
      // Shoulder line
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 200, y: 78, name: 'Front Shoulder Tip' }],
        annotation: 'Shoulder Seam',
      },
      // Deep Scye Armhole curve
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 178, y: 145, isControl: true },
          { x: 205, y: 205, isControl: true },
          { x: 220, y: 228, name: 'Underarm Point' },
        ],
        annotation: 'Armhole Curve',
      },
      // Side seam to bust dart upper leg
      {
        type: 'L',
        zone: 'bust',
        points: [{ x: 216, y: 265, name: 'Side Bust Dart Top' }],
      },
      // Side Bust Dart to Apex
      {
        type: 'L',
        zone: 'bust',
        points: [{ x: 135, y: 285, name: 'Bust Apex Point' }],
      },
      // Side Bust Dart lower leg
      {
        type: 'L',
        zone: 'bust',
        points: [{ x: 213, y: 305, name: 'Side Bust Dart Bottom' }],
      },
      // Side seam to waist
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 205, y: 440, name: 'Front Side Waist' }],
        annotation: 'Side Seam',
      },
      // Waist line to Waist Dart leg 2
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 140, y: 440, name: 'Waist Dart Leg 2' }],
      },
      // Waist Dart Apex
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 125, y: 310, name: 'Waist Dart Apex' }],
      },
      // Waist Dart Leg 1
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 110, y: 440, name: 'Waist Dart Leg 1' }],
      },
      // Waistline to Center Front
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 440, name: 'Center Front Waist' }],
        annotation: 'Waistline (46.0cm 1/2)',
      },
      // Close to Center Front Neck
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 95 }],
      },
    ],
    notches: [
      { x: 190, y: 160, name: 'Armhole Front Notch', isNotch: true },
      { x: 216, y: 265, name: 'Side Dart Top Notch', isNotch: true },
      { x: 213, y: 305, name: 'Side Dart Bottom Notch', isNotch: true },
      { x: 125, y: 440, name: 'Waist Dart Center Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'front-bust-dart-center',
        name: 'Bust Dart Centerline',
        type: 'dart',
        points: [
          { x: 214.5, y: 285 },
          { x: 135, y: 285 },
        ],
        color: '#dc2626',
      },
      {
        id: 'front-waist-dart-center',
        name: 'Waist Dart Centerline',
        type: 'dart',
        points: [
          { x: 125, y: 440 },
          { x: 125, y: 310 },
        ],
        color: '#dc2626',
      },
    ],
    labels: [
      { text: 'FRONT BODICE', position: { x: 50, y: 170 }, type: 'title' },
      { text: 'Size: S • Cut 1 on Fold', position: { x: 50, y: 195 }, type: 'meta' },
      { text: 'SA: 1.0 cm • Notch: 0.3 cm', position: { x: 50, y: 218 }, type: 'guide' },
      { text: 'Bust Apex (BP)', position: { x: 135, y: 275 }, type: 'point' },
    ],
    measurements: {
      halfChest: 46.0,
      bust: 92.0,
      waist: 71.0,
      bodyLength: 42.0,
      armholeLength: 22.0,
      shoulderLength: 12.8,
    },
  };

  const backBodice: PatternComponent = {
    id: 'back',
    pieceCode: 'BK-BD',
    name: 'Back Bodice',
    cutInstruction: 'Cut 1 on Fold • Base Size S',
    offset: { x: 380, y: 70 },
    grainline: {
      start: { x: 35, y: 120 },
      end: { x: 35, y: 410 },
      label: 'GRAINLINE ↑ CENTER BACK',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 45, name: 'Center Back Neck' }],
      },
      // Back Neck curve to HPS (shallow curve)
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 30, y: 45, isControl: true },
          { x: 68, y: 42, isControl: true },
          { x: 82, y: 40, name: 'Back HPS Neck' },
        ],
        annotation: 'Back Neckline',
      },
      // Shoulder to shoulder dart leg 1
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 135, y: 56, name: 'Shoulder Dart Leg 1' }],
      },
      // Shoulder dart apex
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 130, y: 130, name: 'Shoulder Dart Apex' }],
      },
      // Shoulder dart leg 2
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 147, y: 59, name: 'Shoulder Dart Leg 2' }],
      },
      // Shoulder Tip
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 200, y: 74, name: 'Back Shoulder Tip' }],
        annotation: 'Shoulder Seam',
      },
      // Back Armhole curve
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 175, y: 135, isControl: true },
          { x: 195, y: 195, isControl: true },
          { x: 215, y: 228, name: 'Back Underarm' },
        ],
        annotation: 'Armhole Curve',
      },
      // Side seam down to waist
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 200, y: 440, name: 'Back Side Waist' }],
        annotation: 'Side Seam',
      },
      // Waistline to back dart leg 2
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 135, y: 440, name: 'Back Waist Dart Leg 2' }],
      },
      // Back dart apex
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 120, y: 270, name: 'Back Waist Dart Apex' }],
      },
      // Back dart leg 1
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 105, y: 440, name: 'Back Waist Dart Leg 1' }],
      },
      // Waistline to Center Back
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 440, name: 'Center Back Waist' }],
        annotation: 'Waistline (46.0cm 1/2)',
      },
      // Close to Center Back Neck
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 45 }],
      },
    ],
    notches: [
      { x: 180, y: 140, name: 'Back Armhole Double Notch 1', isNotch: true },
      { x: 183, y: 148, name: 'Back Armhole Double Notch 2', isNotch: true },
      { x: 120, y: 440, name: 'Back Waist Dart Center Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'back-waist-dart-center',
        name: 'Back Waist Dart Centerline',
        type: 'dart',
        points: [
          { x: 120, y: 440 },
          { x: 120, y: 270 },
        ],
        color: '#dc2626',
      },
      {
        id: 'back-shoulder-dart-center',
        name: 'Back Shoulder Dart Centerline',
        type: 'dart',
        points: [
          { x: 141, y: 57.5 },
          { x: 130, y: 130 },
        ],
        color: '#dc2626',
      },
    ],
    labels: [
      { text: 'BACK BODICE', position: { x: 50, y: 170 }, type: 'title' },
      { text: 'Size: S • Cut 1 on Fold', position: { x: 50, y: 195 }, type: 'meta' },
      { text: 'SA: 1.0 cm • Notch: 0.3 cm', position: { x: 50, y: 218 }, type: 'guide' },
    ],
    measurements: {
      halfChest: 46.0,
      bust: 92.0,
      waist: 71.0,
      bodyLength: 42.0,
      armholeLength: 22.0,
      shoulderLength: 12.8,
    },
  };

  return {
    id: 'garment-basic-bodice-01',
    name: 'Basic Bodice',
    category: 'custom',
    version: 'EasyPattern v1.0',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontBodice, backBodice],
    sizeTable: BASIC_BODICE_SIZE_TABLE,
    gradeHistory: [],
  };
}
