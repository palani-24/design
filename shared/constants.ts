import { SizeTable, Garment, PatternComponent } from './types';

// Default professional size table in metric centimeters (cm)
// Perfectly calibrated with grading increments matching standard apparel specs
export const DEFAULT_SIZE_TABLE: SizeTable = {
  XS: {
    bust: 88.0,
    waist: 80.0,
    hip: 92.0,
    length: 64.0,
    width: 46.0,
    height: 68.0,
    sleeveLength: 19.5,
    shoulderWidth: 14.6,
    neckCircumference: 38.5,
  },
  S: {
    bust: 92.0,
    waist: 84.0,
    hip: 96.0,
    length: 66.0,
    width: 48.0,
    height: 70.0,
    sleeveLength: 20.5,
    shoulderWidth: 15.2,
    neckCircumference: 40.0,
  },
  M: {
    bust: 96.0,
    waist: 88.0,
    hip: 100.0,
    length: 68.0,
    width: 50.0,
    height: 72.0,
    sleeveLength: 21.5,
    shoulderWidth: 15.8,
    neckCircumference: 41.5,
  },
  L: {
    bust: 100.0,
    waist: 92.0,
    hip: 104.0,
    length: 70.0,
    width: 52.0,
    height: 74.0,
    sleeveLength: 22.5,
    shoulderWidth: 16.4,
    neckCircumference: 43.0,
  },
  XL: {
    bust: 104.0,
    waist: 96.0,
    hip: 108.0,
    length: 72.0,
    width: 54.0,
    height: 76.0,
    sleeveLength: 23.5,
    shoulderWidth: 17.0,
    neckCircumference: 44.5,
  },
  XXL: {
    bust: 110.0,
    waist: 102.0,
    hip: 114.0,
    length: 74.0,
    width: 57.0,
    height: 78.0,
    sleeveLength: 24.5,
    shoulderWidth: 17.8,
    neckCircumference: 46.5,
  },
};

/**
 * Creates initial SVG vector geometry for a standard Basic T-Shirt (Size S base)
 * Units in workspace: 1 SVG unit = 1 mm (or 10 units = 1 cm).
 * Front, Back, Sleeve are positioned side-by-side inside the garment coordinate frame.
 */
export function createDefaultBasicTShirt(): Garment {
  // S Base Dimensions (1cm = 10 units in vector space):
  // Half chest width = 240 (which is 1/4 bust circumference = 23cm + ease = 24cm)
  // Body length = 660 mm
  // Sleeve crown height = 140 mm, bicep width = 185 mm, sleeve length = 205 mm

  const frontComponent: PatternComponent = {
    id: 'front',
    name: 'Front Component',
    cutInstruction: 'Cut 1 on Fold • Base Size S',
    offset: { x: 50, y: 80 },
    grainline: {
      start: { x: 40, y: 150 },
      end: { x: 40, y: 550 },
      label: 'GRAINLINE ↑ FOLD',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 120, name: 'Center Front Neck' }],
      },
      // Front Neck curve to High Point Shoulder (HPS)
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 35, y: 120, isControl: true },
          { x: 80, y: 65, isControl: true },
          { x: 95, y: 50, name: 'HPS Neck Point' },
        ],
        annotation: 'Neck Seam',
      },
      // Shoulder slant down to Armhole top
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 225, y: 92, name: 'Shoulder Tip' }],
        annotation: 'Shoulder Lock (15.2cm)',
      },
      // Armhole Scye curve to Underarm Bust level
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 200, y: 175, isControl: true },
          { x: 230, y: 245, isControl: true },
          { x: 240, y: 270, name: 'Front Underarm' },
        ],
        annotation: 'Scye Armhole',
      },
      // Side seam from Underarm through Waist level
      {
        type: 'C',
        zone: 'waist',
        points: [
          { x: 236, y: 340, isControl: true },
          { x: 232, y: 410, isControl: true },
          { x: 235, y: 440, name: 'Front Waist' },
        ],
        annotation: 'Waist Level',
      },
      // Side seam down to Hip/Hem
      {
        type: 'L',
        zone: 'hip',
        points: [{ x: 242, y: 660, name: 'Front Side Hem' }],
        annotation: 'Hip/Side Seam',
      },
      // Bottom Hem line
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 660, name: 'Center Front Hem' }],
        annotation: 'Hem Level: 50.0 cm (1/2)',
      },
      // Close to Center Front Fold
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 120 }],
      },
    ],
    notches: [
      { x: 215, y: 165, name: 'Front Armhole Single Notch', isNotch: true },
      { x: 235, y: 440, name: 'Waist Alignment Notch', isNotch: true },
      { x: 120, y: 660, name: 'Hem Notch', isNotch: true },
    ],
    labels: [
      { text: 'FRONT', position: { x: 80, y: 220 }, type: 'title' },
      { text: '1/2 Chest: 48.0cm • Cut 1', position: { x: 80, y: 245 }, type: 'meta' },
      { text: 'BUST LEVEL: 48.0 cm (1/2)', position: { x: 60, y: 270 }, type: 'guide' },
      { text: 'WAIST LEVEL: 42.0 cm (1/2)', position: { x: 60, y: 440 }, type: 'guide' },
      { text: 'HEM LEVEL: 50.0 cm (1/2)', position: { x: 60, y: 650 }, type: 'guide' },
    ],
    measurements: {
      halfChest: 48.0,
      bodyLength: 66.0,
      armholeLength: 23.4,
      hemWidth: 50.0,
      shoulderLength: 15.2,
    },
  };

  const backComponent: PatternComponent = {
    id: 'back',
    name: 'Back Component',
    cutInstruction: 'Cut 1 on Fold • Base Size S',
    offset: { x: 380, y: 80 },
    grainline: {
      start: { x: 40, y: 150 },
      end: { x: 40, y: 550 },
      label: 'GRAINLINE ↑ FOLD',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 45, name: 'Center Back Neck' }],
      },
      // Back Neck curve to HPS (shallower drop than front)
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 35, y: 45, isControl: true },
          { x: 75, y: 48, isControl: true },
          { x: 95, y: 50, name: 'HPS Neck Point Back' },
        ],
        annotation: 'Back Neckline',
      },
      // Shoulder line
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 228, y: 92, name: 'Back Shoulder Tip' }],
        annotation: 'Shoulder Lock (15.2cm)',
      },
      // Back Armhole Scye curve (deeper and higher curve)
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 206, y: 165, isControl: true },
          { x: 232, y: 240, isControl: true },
          { x: 240, y: 270, name: 'Back Underarm' },
        ],
        annotation: 'Back Scye',
      },
      // Side seam through Waist
      {
        type: 'C',
        zone: 'waist',
        points: [
          { x: 236, y: 340, isControl: true },
          { x: 232, y: 410, isControl: true },
          { x: 235, y: 440, name: 'Back Waist' },
        ],
        annotation: 'Waist Level',
      },
      // Side seam to Hem
      {
        type: 'L',
        zone: 'hip',
        points: [{ x: 242, y: 660, name: 'Back Side Hem' }],
        annotation: 'Side Seam',
      },
      // Hem line
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 660, name: 'Center Back Hem' }],
        annotation: 'Hem Level: 50.0 cm (1/2)',
      },
      // Close to Center Back Fold
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 45 }],
      },
    ],
    notches: [
      { x: 218, y: 160, name: 'Back Armhole Double Notch 1', isNotch: true },
      { x: 221, y: 172, name: 'Back Armhole Double Notch 2', isNotch: true },
      { x: 235, y: 440, name: 'Back Waist Notch', isNotch: true },
    ],
    labels: [
      { text: 'BACK', position: { x: 80, y: 220 }, type: 'title' },
      { text: '1/2 Chest: 48.0cm • Cut 1', position: { x: 80, y: 245 }, type: 'meta' },
      { text: 'BUST LEVEL: 48.0 cm (1/2)', position: { x: 60, y: 270 }, type: 'guide' },
      { text: 'WAIST LEVEL: 42.0 cm (1/2)', position: { x: 60, y: 440 }, type: 'guide' },
      { text: 'CENTER BACK LENGTH: 66.0 cm', position: { x: 20, y: 530 }, type: 'guide' },
    ],
    measurements: {
      halfChest: 48.0,
      bodyLength: 66.0,
      armholeLength: 24.2,
      hemWidth: 50.0,
      shoulderLength: 15.2,
    },
  };

  const sleeveComponent: PatternComponent = {
    id: 'sleeve',
    name: 'Sleeve (Pair)',
    cutInstruction: 'Cut 2 (Pair) • Base Size S',
    offset: { x: 700, y: 80 },
    grainline: {
      start: { x: 175, y: 60 },
      end: { x: 175, y: 260 },
      label: 'GRAINLINE ↑ CENTER SLEEVE',
    },
    paths: [
      {
        type: 'M',
        zone: 'sleeve-seam',
        points: [{ x: 20, y: 145, name: 'Underarm Front Sleeve' }],
      },
      // Front sleeve cap curve up to sleeve crown
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 65, y: 105, isControl: true },
          { x: 120, y: 20, isControl: true },
          { x: 175, y: 20, name: 'Sleeve Crown Tip' },
        ],
        annotation: 'Sleeve Cap Front',
      },
      // Back sleeve cap curve down to back underarm
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 230, y: 20, isControl: true },
          { x: 285, y: 105, isControl: true },
          { x: 330, y: 145, name: 'Underarm Back Sleeve' }],
        annotation: 'Sleeve Cap Back',
      },
      // Sleeve underarm seam to cuff hem (right side)
      {
        type: 'L',
        zone: 'sleeve-seam',
        points: [{ x: 300, y: 245, name: 'Sleeve Cuff Right' }],
        annotation: 'Underarm Seam Right',
      },
      // Sleeve hem line
      {
        type: 'L',
        zone: 'sleeve-hem',
        points: [{ x: 50, y: 245, name: 'Sleeve Cuff Left' }],
        annotation: 'Sleeve Hem Opening (33cm)',
      },
      // Sleeve underarm seam back to start (left side)
      {
        type: 'Z',
        zone: 'sleeve-seam',
        points: [{ x: 20, y: 145 }],
      },
    ],
    notches: [
      { x: 175, y: 20, name: 'Crown Shoulder Notch', isNotch: true },
      { x: 80, y: 92, name: 'Front Sleeve Notch', isNotch: true },
      { x: 265, y: 88, name: 'Back Sleeve Double Notch', isNotch: true },
    ],
    labels: [
      { text: 'SLEEVE', position: { x: 140, y: 130 }, type: 'title' },
      { text: 'Cap Scye 46.2cm • Length 20.5cm', position: { x: 100, y: 155 }, type: 'meta' },
      { text: 'BICEP LINE: 35.0 cm', position: { x: 120, y: 175 }, type: 'guide' },
      { text: 'CUFF OPENING: 33.0 cm', position: { x: 110, y: 235 }, type: 'guide' },
    ],
    measurements: {
      sleeveLength: 20.5,
      sleeveCapLength: 46.2,
      hemWidth: 33.0,
    },
  };

  return {
    id: 'garment-basic-tshirt-001',
    name: 'Basic T-Shirt',
    category: 't-shirt',
    version: 'v1.4',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontComponent, backComponent, sleeveComponent],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}
