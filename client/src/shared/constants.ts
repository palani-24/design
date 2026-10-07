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

export function createPoloTShirt(): Garment {
  const basic = createDefaultBasicTShirt();
  const front = JSON.parse(JSON.stringify(basic.components[0])) as PatternComponent;
  const back = JSON.parse(JSON.stringify(basic.components[1])) as PatternComponent;
  const sleeve = JSON.parse(JSON.stringify(basic.components[2])) as PatternComponent;

  front.name = 'Front Component (Placket)';
  front.cutInstruction = 'Cut 1 on Fold (2-Btn Placket) • Base Size S';
  front.labels[0].text = 'POLO FRONT';

  back.name = 'Back Component (Drop Hem)';
  back.cutInstruction = 'Cut 1 on Fold • Drop Tail +15mm';
  back.labels[0].text = 'POLO BACK';

  sleeve.name = 'Sleeve (Ribbed Cuff)';
  sleeve.cutInstruction = 'Cut 2 (Pair) • 1x1 Rib Band';
  sleeve.labels[0].text = 'POLO SLEEVE';

  const collarComponent: PatternComponent = {
    id: 'collar',
    name: 'Ribbed Spread Collar',
    cutInstruction: 'Cut 1 on Fold • 1x1 Flat Knit Collar',
    offset: { x: 720, y: 380 },
    grainline: {
      start: { x: 20, y: 60 },
      end: { x: 240, y: 60 },
      label: 'GRAINLINE ↔ COLLAR FOLD',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 40, name: 'Center Back Collar Fold' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 240, y: 40, name: 'Collar Neck Seam End' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 260, y: 110, name: 'Collar Point' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 0, y: 100, name: 'Center Back Collar Edge' }],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 40 }],
      },
    ],
    notches: [
      { x: 120, y: 40, name: 'Collar Center Notch', isNotch: true },
    ],
    labels: [
      { text: 'POLO COLLAR', position: { x: 60, y: 80 }, type: 'title' },
      { text: 'Flat Knit Rib • 40cm Neck', position: { x: 60, y: 95 }, type: 'meta' },
    ],
    measurements: {
      halfChest: 40.0,
    },
  };

  return {
    id: 'garment-polo-002',
    name: 'Polo T-Shirt',
    category: 'polo',
    version: 'v2.1',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [front, back, sleeve, collarComponent],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

export const MENS_SHIRT_SIZE_TABLE: SizeTable = {
  XS: { bust: 94.0, waist: 86.0, hip: 94.0, length: 74.0, width: 47.0, height: 75.0, sleeveLength: 58.0, shoulderWidth: 42.0, neckCircumference: 38.0 },
  S:  { bust: 97.0, waist: 89.0, hip: 97.0, length: 75.0, width: 48.5, height: 76.0, sleeveLength: 59.0, shoulderWidth: 43.0, neckCircumference: 39.0 },
  M:  { bust: 100.0, waist: 92.0, hip: 100.0, length: 76.0, width: 50.0, height: 77.0, sleeveLength: 60.0, shoulderWidth: 44.0, neckCircumference: 40.0 },
  L:  { bust: 104.0, waist: 96.0, hip: 104.0, length: 77.0, width: 52.0, height: 78.0, sleeveLength: 61.0, shoulderWidth: 45.5, neckCircumference: 41.0 },
  XL: { bust: 108.0, waist: 100.0, hip: 108.0, length: 78.0, width: 54.0, height: 79.0, sleeveLength: 62.0, shoulderWidth: 47.0, neckCircumference: 42.0 },
  XXL:{ bust: 114.0, waist: 106.0, hip: 114.0, length: 80.0, width: 57.0, height: 81.0, sleeveLength: 63.0, shoulderWidth: 49.0, neckCircumference: 43.5 },
};

export function createMensShirtBasicPattern(): Garment {
  // 1. FRONT (CUT 2): Width 25cm, Total length 76cm (scye 26cm, side seam 50cm), neck 11.5cm x 7cm, 2.5cm slope
  const front: PatternComponent = {
    id: 'shirt-front',
    pieceCode: 'FR',
    name: 'FRONT (CUT 2)',
    cutInstruction: 'Cut 2 (Left & Right) • 3cm Front Placket Fold',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 40, y: 40 },
    grainline: {
      start: { x: 45, y: 120 },
      end: { x: 45, y: 700 },
      label: 'GRAINLINE ↕ CF',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 70, name: 'Center Front Neck' }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 20, y: 70, isControl: true },
          { x: 55, y: 30, isControl: true },
          { x: 70, y: 0, name: 'HPS Neck Point' },
        ],
        annotation: 'Neck Curve (7cm drop, 11.5cm width)',
      },
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 185, y: 25, name: 'Front Shoulder Tip' }],
        annotation: 'Shoulder Seam (11.5cm, 2.5cm slope)',
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 190, y: 150, isControl: true },
          { x: 210, y: 240, isControl: true },
          { x: 250, y: 260, name: 'Underarm Scye Point' },
        ],
        annotation: 'Armhole Scye (26cm Depth)',
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 250, y: 760, name: 'Side Hem Point' }],
        annotation: 'Side Seam (50cm)',
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 760, name: 'Center Front Hem' }],
        annotation: 'Hem Width (25cm • 3cm SA)',
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 70 }],
      },
    ],
    notches: [
      { x: 205, y: 160, name: 'Armhole Front Notch', isNotch: true },
      { x: 30, y: 760, name: 'Placket Fold Notch', isNotch: true },
      { x: 250, y: 730, name: 'Hem 3cm Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'front-placket-fold-line',
        name: 'Placket Fold Line (3cm)',
        type: 'line',
        points: [{ x: 30, y: 70 }, { x: 30, y: 760 }],
        color: '#16a34a',
      },
      {
        id: 'front-chest-pocket-placement',
        name: 'Chest Pocket Placement (13cm × 14cm)',
        type: 'pocket',
        points: [
          { x: 60, y: 320 },
          { x: 190, y: 320 },
          { x: 190, y: 430 },
          { x: 125, y: 460 },
          { x: 60, y: 430 },
          { x: 60, y: 320 },
        ],
        closed: true,
        color: '#2563eb',
      },
    ],
    labels: [
      { text: 'FRONT', position: { x: 90, y: 210 }, type: 'title' },
      { text: '(CUT 2)', position: { x: 90, y: 235 }, type: 'subtitle' },
      { text: 'Width: 25cm • Length: 76cm', position: { x: 55, y: 260 }, type: 'meta' },
      { text: 'Scye: 26cm • Side: 50cm', position: { x: 60, y: 280 }, type: 'guide' },
      { text: 'SA: 1cm (Hem: 3cm)', position: { x: 68, y: 300 }, type: 'guide' },
    ],
    measurements: {
      halfChest: 50.0,
      length: 76.0,
      bodyLength: 76.0,
      armholeLength: 26.0,
      shoulderLength: 11.5,
    },
  };

  // 2. BACK (CUT 1): Width 25cm, Total length 76cm, Shoulder 21cm, Slope 2.5cm, Armhole 26cm, Side 50cm
  const back: PatternComponent = {
    id: 'shirt-back',
    pieceCode: 'BK',
    name: 'BACK (CUT 1)',
    cutInstruction: 'Cut 1 on Fold • Center Fold Line',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 330, y: 40 },
    grainline: {
      start: { x: 40, y: 100 },
      end: { x: 40, y: 700 },
      label: 'GRAINLINE ↕ CB FOLD',
    },
    paths: [
      {
        type: 'M',
        zone: 'center-fold',
        points: [{ x: 0, y: 25, name: 'Center Back Neck' }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 25, y: 25, isControl: true },
          { x: 55, y: 15, isControl: true },
          { x: 70, y: 0, name: 'Back HPS Neck' },
        ],
        annotation: 'Back Neckline Curve',
      },
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 210, y: 25, name: 'Back Shoulder Tip' }],
        annotation: 'Back Shoulder (21cm, 2.5cm slope)',
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 205, y: 140, isControl: true },
          { x: 215, y: 230, isControl: true },
          { x: 250, y: 260, name: 'Back Underarm Scye' },
        ],
        annotation: 'Back Armhole Scye (26cm Depth)',
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 250, y: 760, name: 'Back Side Hem' }],
        annotation: 'Back Side Seam (50cm)',
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 760, name: 'Center Back Hem' }],
        annotation: 'Hem Width (25cm • 3cm SA)',
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 25 }],
      },
    ],
    notches: [
      { x: 205, y: 145, name: 'Back Double Notch 1', isNotch: true },
      { x: 205, y: 155, name: 'Back Double Notch 2', isNotch: true },
      { x: 250, y: 730, name: 'Hem 3cm Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'back-center-fold-indicator',
        name: 'Center Fold Line',
        type: 'line',
        points: [{ x: 0, y: 25 }, { x: 0, y: 760 }],
        color: '#16a34a',
      },
    ],
    labels: [
      { text: 'BACK', position: { x: 95, y: 210 }, type: 'title' },
      { text: '(CUT 1)', position: { x: 95, y: 235 }, type: 'subtitle' },
      { text: 'Width: 25cm • Length: 76cm', position: { x: 60, y: 260 }, type: 'meta' },
      { text: 'Shoulder: 21cm • Scye: 26cm', position: { x: 55, y: 280 }, type: 'guide' },
      { text: 'SA: 1cm (Hem: 3cm)', position: { x: 70, y: 300 }, type: 'guide' },
    ],
    measurements: {
      halfChest: 50.0,
      length: 76.0,
      bodyLength: 76.0,
      armholeLength: 26.0,
      shoulderLength: 14.0,
      shoulderWidth: 21.0,
    },
  };

  // 3. SLEEVE (CUT 2): Cap 15cm, Bicep 36cm, Sleeve Length 60cm, Cuff 22cm
  const sleeve: PatternComponent = {
    id: 'shirt-sleeve',
    pieceCode: 'SLV',
    name: 'SLEEVE (CUT 2)',
    cutInstruction: 'Cut 2 (Left & Right Pair)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 620, y: 40 },
    grainline: {
      start: { x: 180, y: 40 },
      end: { x: 180, y: 560 },
      label: 'GRAINLINE ↕ SLEEVE CENTER',
    },
    paths: [
      {
        type: 'M',
        zone: 'sleeve-seam',
        points: [{ x: 0, y: 150, name: 'Front Underarm Bicep' }],
      },
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 60, y: 70, isControl: true },
          { x: 120, y: 0, isControl: true },
          { x: 180, y: 0, name: 'Sleeve Cap Crown' },
        ],
        annotation: 'Front Sleeve Cap Curve',
      },
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 240, y: 0, isControl: true },
          { x: 300, y: 70, isControl: true },
          { x: 360, y: 150, name: 'Back Underarm Bicep' },
        ],
        annotation: 'Back Sleeve Cap Curve',
      },
      {
        type: 'L',
        zone: 'sleeve-seam',
        points: [{ x: 290, y: 600, name: 'Back Cuff Hem' }],
        annotation: 'Back Underarm Seam',
      },
      {
        type: 'L',
        zone: 'sleeve-hem',
        points: [{ x: 70, y: 600, name: 'Front Cuff Hem' }],
        annotation: 'Cuff Hem Line (22cm)',
      },
      {
        type: 'Z',
        zone: 'sleeve-seam',
        points: [{ x: 0, y: 150 }],
      },
    ],
    notches: [
      { x: 180, y: 0, name: 'Cap Crown Center Notch', isNotch: true },
      { x: 70, y: 60, name: 'Front Pitch Notch', isNotch: true },
      { x: 290, y: 60, name: 'Back Pitch Double Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'sleeve-placket-slit',
        name: 'Sleeve Placket Slit (12cm)',
        type: 'line',
        points: [{ x: 235, y: 600 }, { x: 235, y: 480 }],
        color: '#2563eb',
      },
    ],
    labels: [
      { text: 'SLEEVE', position: { x: 140, y: 250 }, type: 'title' },
      { text: '(CUT 2)', position: { x: 145, y: 275 }, type: 'subtitle' },
      { text: 'Bicep: 36cm • Cap: 15cm', position: { x: 105, y: 300 }, type: 'meta' },
      { text: 'Length: 60cm • Cuff: 22cm', position: { x: 100, y: 320 }, type: 'guide' },
    ],
    measurements: {
      sleeveLength: 60.0,
      sleeveCapLength: 15.0,
      hemWidth: 22.0,
    },
  };

  // 4. COLLAR (CUT 2): 44cm x 4.5cm
  const collar: PatternComponent = {
    id: 'shirt-collar',
    pieceCode: 'COL',
    name: 'COLLAR (CUT 2)',
    cutInstruction: 'Cut 2 (Upper & Under Collar)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 1020, y: 150 },
    grainline: {
      start: { x: 40, y: 22.5 },
      end: { x: 400, y: 22.5 },
      label: 'GRAINLINE ↔ COLLAR',
    },
    paths: [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 0, name: 'Collar TL' }] },
      { type: 'L', zone: 'neck', points: [{ x: 440, y: 0, name: 'Collar TR' }] },
      { type: 'L', zone: 'neck', points: [{ x: 440, y: 45, name: 'Collar BR' }] },
      { type: 'L', zone: 'neck', points: [{ x: 0, y: 45, name: 'Collar BL' }] },
      { type: 'Z', zone: 'neck', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'collar-stitching-line',
        name: 'Stitching Line',
        type: 'line',
        points: [{ x: 10, y: 10 }, { x: 430, y: 10 }, { x: 430, y: 35 }, { x: 10, y: 35 }, { x: 10, y: 10 }],
        closed: true,
        color: '#2563eb',
      },
    ],
    notches: [{ x: 220, y: 45, name: 'Collar Center Notch', isNotch: true }],
    labels: [
      { text: 'COLLAR (CUT 2)', position: { x: 155, y: 24 }, type: 'title' },
      { text: '44cm × 4.5cm', position: { x: 180, y: 38 }, type: 'meta' },
    ],
    measurements: {
      halfChest: 44.0,
    },
  };

  // 5. COLLAR STAND (CUT 2): 44cm x 3cm
  const collarStand: PatternComponent = {
    id: 'shirt-collar-stand',
    pieceCode: 'STD',
    name: 'COLLAR STAND (CUT 2)',
    cutInstruction: 'Cut 2 (Inner & Outer Stand)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 1020, y: 225 },
    grainline: {
      start: { x: 40, y: 15 },
      end: { x: 400, y: 15 },
      label: 'GRAINLINE ↔ STAND',
    },
    paths: [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 0, name: 'Stand TL' }] },
      { type: 'L', zone: 'neck', points: [{ x: 440, y: 0, name: 'Stand TR' }] },
      { type: 'L', zone: 'neck', points: [{ x: 440, y: 30, name: 'Stand BR' }] },
      { type: 'L', zone: 'neck', points: [{ x: 0, y: 30, name: 'Stand BL' }] },
      { type: 'Z', zone: 'neck', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'stand-stitching-line',
        name: 'Stitching Line',
        type: 'line',
        points: [{ x: 10, y: 10 }, { x: 430, y: 10 }, { x: 430, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 10 }],
        closed: true,
        color: '#2563eb',
      },
    ],
    notches: [{ x: 220, y: 30, name: 'Stand Center Notch', isNotch: true }],
    labels: [
      { text: 'COLLAR STAND (CUT 2)', position: { x: 135, y: 17 }, type: 'title' },
      { text: '44cm × 3cm', position: { x: 180, y: 27 }, type: 'meta' },
    ],
    measurements: {
      halfChest: 44.0,
    },
  };

  // 6. POCKET (CUT 1): 13cm x 14cm with pointed chevron bottom
  const pocket: PatternComponent = {
    id: 'shirt-pocket',
    pieceCode: 'PKT',
    name: 'POCKET (CUT 1)',
    cutInstruction: 'Cut 1 (Chest Patch Pocket)',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 1020, y: 285 },
    grainline: {
      start: { x: 65, y: 20 },
      end: { x: 65, y: 90 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      { type: 'M', zone: 'hem', points: [{ x: 0, y: 0, name: 'Pocket TL' }] },
      { type: 'L', zone: 'hem', points: [{ x: 130, y: 0, name: 'Pocket TR' }] },
      { type: 'L', zone: 'hem', points: [{ x: 130, y: 110, name: 'Pocket MR' }] },
      { type: 'L', zone: 'hem', points: [{ x: 65, y: 140, name: 'Pocket Point' }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 110, name: 'Pocket ML' }] },
      { type: 'Z', zone: 'hem', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'pocket-stitching-line',
        name: 'Stitching Line',
        type: 'line',
        points: [
          { x: 10, y: 10 },
          { x: 120, y: 10 },
          { x: 120, y: 105 },
          { x: 65, y: 130 },
          { x: 10, y: 105 },
          { x: 10, y: 10 },
        ],
        closed: true,
        color: '#2563eb',
      },
    ],
    notches: [],
    labels: [
      { text: 'POCKET (CUT 1)', position: { x: 25, y: 55 }, type: 'title' },
      { text: '13cm × 14cm', position: { x: 32, y: 75 }, type: 'meta' },
    ],
    measurements: {
      length: 14.0,
    },
  };

  // 7. BACK YOKE (CUT 1): 44cm x 8cm with contoured lower edge
  const backYoke: PatternComponent = {
    id: 'shirt-back-yoke',
    pieceCode: 'BYK',
    name: 'BACK YOKE (CUT 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 620, y: 680 },
    grainline: {
      start: { x: 50, y: 40 },
      end: { x: 390, y: 40 },
      label: 'GRAINLINE ↔ BACK YOKE',
    },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 0, name: 'Yoke TL' }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 440, y: 0, name: 'Yoke TR' }] },
      { type: 'L', zone: 'armhole', points: [{ x: 440, y: 80, name: 'Yoke BR' }] },
      {
        type: 'C',
        zone: 'shoulder',
        points: [
          { x: 330, y: 90, isControl: true },
          { x: 110, y: 90, isControl: true },
          { x: 0, y: 80, name: 'Yoke BL' },
        ],
        annotation: 'Contoured Lower Yoke Seam',
      },
      { type: 'Z', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'back-yoke-center-line',
        name: 'Centre Line',
        type: 'line',
        points: [{ x: 220, y: 0 }, { x: 220, y: 85 }],
        color: '#dc2626',
      },
    ],
    notches: [{ x: 220, y: 80, name: 'Yoke Center Notch', isNotch: true }],
    labels: [
      { text: 'BACK YOKE (CUT 1)', position: { x: 150, y: 40 }, type: 'title' },
      { text: '44cm × 8cm', position: { x: 180, y: 60 }, type: 'meta' },
    ],
    measurements: {
      shoulderWidth: 44.0,
    },
  };

  // 8. FRONT YOKE (CUT 2): 22cm x 8cm
  const frontYoke: PatternComponent = {
    id: 'shirt-front-yoke',
    pieceCode: 'FYK',
    name: 'FRONT YOKE (CUT 2)',
    cutInstruction: 'Cut 2 (Left & Right)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 1020, y: 40 },
    grainline: {
      start: { x: 110, y: 20 },
      end: { x: 110, y: 65 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 0, name: 'FYoke TL' }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 220, y: 0, name: 'FYoke TR' }] },
      { type: 'L', zone: 'armhole', points: [{ x: 220, y: 80, name: 'FYoke BR' }] },
      {
        type: 'C',
        zone: 'shoulder',
        points: [
          { x: 160, y: 90, isControl: true },
          { x: 60, y: 90, isControl: true },
          { x: 0, y: 80, name: 'FYoke BL' },
        ],
        annotation: 'Front Yoke Lower Curve',
      },
      { type: 'Z', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
    ],
    notches: [],
    labels: [
      { text: 'FRONT YOKE (CUT 2)', position: { x: 45, y: 40 }, type: 'title' },
      { text: '22cm × 8cm', position: { x: 65, y: 60 }, type: 'meta' },
    ],
    measurements: {
      shoulderWidth: 22.0,
    },
  };

  // 9. CUFF (CUT 2): 22cm x 11cm
  const cuff: PatternComponent = {
    id: 'shirt-cuff',
    pieceCode: 'CUF',
    name: 'CUFF (CUT 2)',
    cutInstruction: 'Cut 2 (Pair)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 1020, y: 455 },
    grainline: {
      start: { x: 30, y: 27.5 },
      end: { x: 190, y: 27.5 },
      label: 'GRAINLINE ↔ CUFF',
    },
    paths: [
      { type: 'M', zone: 'sleeve-hem', points: [{ x: 0, y: 0, name: 'Cuff TL' }] },
      { type: 'L', zone: 'sleeve-hem', points: [{ x: 220, y: 0, name: 'Cuff TR' }] },
      { type: 'L', zone: 'sleeve-hem', points: [{ x: 220, y: 110, name: 'Cuff BR' }] },
      { type: 'L', zone: 'sleeve-hem', points: [{ x: 0, y: 110, name: 'Cuff BL' }] },
      { type: 'Z', zone: 'sleeve-hem', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'cuff-fold-line',
        name: 'Center Fold Line',
        type: 'line',
        points: [{ x: 0, y: 55 }, { x: 220, y: 55 }],
        color: '#16a34a',
      },
      {
        id: 'cuff-stitching-line',
        name: 'Stitching Line',
        type: 'line',
        points: [{ x: 10, y: 10 }, { x: 210, y: 10 }, { x: 210, y: 100 }, { x: 10, y: 100 }, { x: 10, y: 10 }],
        closed: true,
        color: '#2563eb',
      },
    ],
    notches: [],
    labels: [
      { text: 'CUFF (CUT 2)', position: { x: 70, y: 35 }, type: 'title' },
      { text: '22cm × 11cm', position: { x: 75, y: 85 }, type: 'meta' },
    ],
    measurements: {
      hemWidth: 22.0,
      length: 11.0,
    },
  };

  // 10. PLACKET (CUT 1): 4cm x 76cm
  const placket: PatternComponent = {
    id: 'shirt-placket',
    pieceCode: 'PLK',
    name: 'PLACKET (CUT 1)',
    cutInstruction: 'Cut 1 (Center Front Band)',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 1280, y: 40 },
    grainline: {
      start: { x: 20, y: 50 },
      end: { x: 20, y: 710 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0, name: 'Placket TL' }] },
      { type: 'L', zone: 'waist', points: [{ x: 40, y: 0, name: 'Placket TR' }] },
      { type: 'L', zone: 'waist', points: [{ x: 40, y: 760, name: 'Placket BR' }] },
      { type: 'L', zone: 'waist', points: [{ x: 0, y: 760, name: 'Placket BL' }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    internals: [
      {
        id: 'placket-stitch-line',
        name: 'Stitching Line',
        type: 'line',
        points: [{ x: 20, y: 10 }, { x: 20, y: 750 }],
        color: '#2563eb',
      },
    ],
    notches: [],
    labels: [
      { text: 'PLACKET (CUT 1)', position: { x: 3, y: 360 }, type: 'title' },
      { text: '4cm × 76cm', position: { x: 3, y: 390 }, type: 'meta' },
    ],
    measurements: {
      length: 76.0,
    },
  };

  return {
    id: 'garment-mens-shirt-001',
    name: "Men's Shirt – Basic Pattern",
    category: 'shirt',
    version: 'v2.0 (Master Spec)',
    baseSize: 'M',
    currentSize: 'M',
    position: { x: 0, y: 0 },
    components: [
      front,
      back,
      sleeve,
      collar,
      collarStand,
      pocket,
      backYoke,
      frontYoke,
      cuff,
      placket,
    ],
    sizeTable: MENS_SHIRT_SIZE_TABLE,
    gradeHistory: [],
  };
}

export function createCasualShirt(): Garment {
  return createMensShirtBasicPattern();
}

export function createChinoTrouser(): Garment {
  const frontLeg: PatternComponent = {
    id: 'trouser-front',
    name: 'Front Trouser Leg',
    cutInstruction: 'Cut 2 (Pair) • Slant Pocket Facing',
    offset: { x: 60, y: 60 },
    grainline: {
      start: { x: 140, y: 100 },
      end: { x: 140, y: 750 },
      label: 'GRAINLINE ↑ CREASE LINE',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 40, y: 60, name: 'Front Waist Left' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 240, y: 60, name: 'Front Waist Side' }],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 260, y: 120, isControl: true },
          { x: 270, y: 220, isControl: true },
          { x: 250, y: 290, name: 'Side Hip Curve' },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 220, y: 520, name: 'Outseam Knee' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 200, y: 780, name: 'Trouser Hem Outseam' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 80, y: 780, name: 'Trouser Hem Inseam' }],
      },
      {
        type: 'L',
        zone: 'hip',
        points: [{ x: 70, y: 520, name: 'Inseam Knee' }],
      },
      {
        type: 'C',
        zone: 'bust',
        points: [
          { x: 50, y: 340, isControl: true },
          { x: 40, y: 290, isControl: true },
          { x: 20, y: 280, name: 'Front Crotch Fork' },
        ],
      },
      {
        type: 'C',
        zone: 'waist',
        points: [
          { x: 25, y: 220, isControl: true },
          { x: 35, y: 120, isControl: true },
          { x: 40, y: 60, name: 'Center Front Fly' },
        ],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 40, y: 60 }],
      },
    ],
    notches: [
      { x: 70, y: 520, name: 'Knee Level Notch', isNotch: true },
      { x: 220, y: 520, name: 'Knee Side Notch', isNotch: true },
    ],
    labels: [
      { text: 'CHINO FRONT LEG', position: { x: 90, y: 200 }, type: 'title' },
      { text: 'Waist: 84cm • Inseam 78cm', position: { x: 90, y: 220 }, type: 'meta' },
      { text: 'KNEE LEVEL: 44cm', position: { x: 90, y: 510 }, type: 'guide' },
      { text: 'BOTTOM HEM OPENING: 38cm', position: { x: 70, y: 770 }, type: 'guide' },
    ],
    measurements: {
      waist: 42.0,
      hip: 50.0,
      length: 104.0,
      hemWidth: 19.0,
    },
  };

  const backLeg: PatternComponent = {
    id: 'trouser-back',
    name: 'Back Trouser Leg',
    cutInstruction: 'Cut 2 (Pair) • Double Jetted Welt Pocket',
    offset: { x: 380, y: 40 },
    grainline: {
      start: { x: 160, y: 120 },
      end: { x: 160, y: 770 },
      label: 'GRAINLINE ↑ CREASE LINE',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 30, y: 40, name: 'Back Crotch Waist Apex' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 240, y: 80, name: 'Back Waist Side' }],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 270, y: 140, isControl: true },
          { x: 280, y: 240, isControl: true },
          { x: 260, y: 310, name: 'Side Hip Curve' },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 230, y: 540, name: 'Back Outseam Knee' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 210, y: 800, name: 'Back Hem Outseam' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 90, y: 800, name: 'Back Hem Inseam' }],
      },
      {
        type: 'L',
        zone: 'hip',
        points: [{ x: 70, y: 540, name: 'Back Inseam Knee' }],
      },
      {
        type: 'C',
        zone: 'bust',
        points: [
          { x: 30, y: 380, isControl: true },
          { x: 0, y: 320, isControl: true },
          { x: -20, y: 300, name: 'Back Crotch Extension' },
        ],
      },
      {
        type: 'C',
        zone: 'waist',
        points: [
          { x: 0, y: 240, isControl: true },
          { x: 15, y: 140, isControl: true },
          { x: 30, y: 40, name: 'Seat Angle Curve' },
        ],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 30, y: 40 }],
      },
    ],
    notches: [
      { x: 70, y: 540, name: 'Back Knee Notch', isNotch: true },
      { x: 230, y: 540, name: 'Back Side Notch', isNotch: true },
    ],
    labels: [
      { text: 'CHINO BACK LEG', position: { x: 100, y: 220 }, type: 'title' },
      { text: 'Seat Pitch +30° • Hip 100cm', position: { x: 100, y: 240 }, type: 'meta' },
      { text: 'KNEE LEVEL: 46cm', position: { x: 100, y: 530 }, type: 'guide' },
      { text: 'BOTTOM HEM OPENING: 40cm', position: { x: 80, y: 790 }, type: 'guide' },
    ],
    measurements: {
      waist: 42.0,
      hip: 50.0,
      length: 106.0,
      hemWidth: 20.0,
    },
  };

  const waistband: PatternComponent = {
    id: 'trouser-waistband',
    name: 'Contour Waistband',
    cutInstruction: 'Cut 2 (Outer + Facing) • Interfaced',
    offset: { x: 720, y: 100 },
    grainline: {
      start: { x: 20, y: 35 },
      end: { x: 260, y: 35 },
      label: 'GRAINLINE ↔ WAISTBAND',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 15, name: 'Center Back WB' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 280, y: 15, name: 'Front WB Underlap' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 280, y: 65, name: 'WB Tab End' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 65, name: 'Center Back Bottom' }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [
      { x: 140, y: 15, name: 'Side Seam Notch', isNotch: true },
      { x: 230, y: 15, name: 'Front Fly Notch', isNotch: true },
    ],
    labels: [
      { text: 'WAISTBAND', position: { x: 60, y: 45 }, type: 'title' },
      { text: 'Curved Waist Band 4.5cm height', position: { x: 60, y: 58 }, type: 'meta' },
    ],
    measurements: {
      waist: 84.0,
    },
  };

  // 4. FLY SHIELD (CUT 1)
  const flyShield: PatternComponent = {
    id: 'trouser-fly-shield',
    pieceCode: 'FSD',
    name: 'FLY SHIELD (CUT 1)',
    cutInstruction: 'Cut 1 (Underlap Fly Guard)',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 720, y: 200 },
    grainline: { start: { x: 30, y: 20 }, end: { x: 30, y: 160 }, label: 'GRAINLINE ↕' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 60, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 60, y: 160 }] },
      { type: 'C', zone: 'waist', points: [{ x: 60, y: 200, isControl: true }, { x: 0, y: 200, isControl: true }, { x: 0, y: 180 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [{ x: 60, y: 40, name: 'Zipper Stop Notch', isNotch: true }],
    labels: [{ text: 'FLY SHIELD (CUT 1)', position: { x: 8, y: 90 }, type: 'title' }],
    measurements: { length: 20.0 },
  };

  // 5. FLY FACING (CUT 1)
  const flyFacing: PatternComponent = {
    id: 'trouser-fly-facing',
    pieceCode: 'FFC',
    name: 'FLY FACING (CUT 1)',
    cutInstruction: 'Cut 1 (Bearer Facing)',
    quantity: 1,
    seamAllowanceMm: 10,
    offset: { x: 820, y: 200 },
    grainline: { start: { x: 25, y: 20 }, end: { x: 25, y: 150 }, label: 'GRAINLINE ↕' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 55, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 55, y: 150 }] },
      { type: 'C', zone: 'waist', points: [{ x: 55, y: 190, isControl: true }, { x: 0, y: 190, isControl: true }, { x: 0, y: 170 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [],
    labels: [{ text: 'FLY FACING (CUT 1)', position: { x: 6, y: 90 }, type: 'title' }],
    measurements: { length: 19.0 },
  };

  // 6. FRONT SLANT POCKET FACING (CUT 2)
  const slantFacing: PatternComponent = {
    id: 'trouser-slant-facing',
    pieceCode: 'SPF',
    name: 'SLANT FACING (CUT 2)',
    cutInstruction: 'Cut 2 (Pair)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 920, y: 200 },
    grainline: { start: { x: 50, y: 20 }, end: { x: 50, y: 150 }, label: 'GRAINLINE ↕' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 120, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 120, y: 180 }] },
      { type: 'L', zone: 'waist', points: [{ x: 0, y: 180 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [{ x: 0, y: 40, name: 'Pocket Opening Notch', isNotch: true }],
    labels: [{ text: 'SLANT FACING (CUT 2)', position: { x: 10, y: 90 }, type: 'title' }],
    measurements: { length: 18.0 },
  };

  // 7. POCKET BAG (CUT 4)
  const pocketBag: PatternComponent = {
    id: 'trouser-pocket-bag',
    pieceCode: 'PBG',
    name: 'POCKET BAG (CUT 4)',
    cutInstruction: 'Cut 4 (2 Pairs in Pocketing Fabric)',
    quantity: 4,
    seamAllowanceMm: 10,
    offset: { x: 1080, y: 200 },
    grainline: { start: { x: 80, y: 20 }, end: { x: 80, y: 220 }, label: 'GRAINLINE ↕' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 160, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 160, y: 220 }] },
      { type: 'C', zone: 'waist', points: [{ x: 160, y: 270, isControl: true }, { x: 0, y: 270, isControl: true }, { x: 0, y: 220 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [],
    labels: [{ text: 'POCKET BAG (CUT 4)', position: { x: 20, y: 120 }, type: 'title' }],
    measurements: { length: 27.0 },
  };

  // 8. BACK WELT FACING (CUT 2)
  const backWelt: PatternComponent = {
    id: 'trouser-back-welt',
    pieceCode: 'WLT',
    name: 'WELT FACING (CUT 2)',
    cutInstruction: 'Cut 2 (Jetted Welt Facing)',
    quantity: 2,
    seamAllowanceMm: 10,
    offset: { x: 720, y: 440 },
    grainline: { start: { x: 20, y: 30 }, end: { x: 160, y: 30 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 180, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 180, y: 60 }] },
      { type: 'L', zone: 'waist', points: [{ x: 0, y: 60 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [],
    labels: [{ text: 'WELT FACING (CUT 2)', position: { x: 30, y: 35 }, type: 'title' }],
    measurements: { length: 18.0 },
  };

  // 9. BELT LOOPS STRIP (CUT 6)
  const beltLoops: PatternComponent = {
    id: 'trouser-belt-loops',
    pieceCode: 'BLP',
    name: 'BELT LOOPS (CUT 6)',
    cutInstruction: 'Cut 6 Loops (or 1 Strip 60cm)',
    quantity: 6,
    seamAllowanceMm: 10,
    offset: { x: 940, y: 440 },
    grainline: { start: { x: 20, y: 15 }, end: { x: 190, y: 15 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 210, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 210, y: 35 }] },
      { type: 'L', zone: 'waist', points: [{ x: 0, y: 35 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [],
    labels: [{ text: 'BELT LOOPS (CUT 6)', position: { x: 35, y: 22 }, type: 'title' }],
    measurements: { length: 21.0 },
  };

  return {
    id: 'garment-trouser-004',
    name: "Men's Tailored Trouser",
    category: 'trouser',
    version: 'v2.0 (Master Spec)',
    baseSize: 'M',
    currentSize: 'M',
    position: { x: 0, y: 0 },
    components: [
      frontLeg,
      backLeg,
      waistband,
      flyShield,
      flyFacing,
      slantFacing,
      pocketBag,
      backWelt,
      beltLoops,
    ],
    sizeTable: MENS_TROUSER_SIZE_TABLE,
    gradeHistory: [],
  };
}

export const MENS_TROUSER_SIZE_TABLE: SizeTable = {
  XS:  { bust: 92.0, waist: 76.0, hip: 92.0,  length: 100.0, width: 28.0, height: 102.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
  S:   { bust: 96.0, waist: 80.0, hip: 96.0,  length: 102.0, width: 29.0, height: 104.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
  M:   { bust: 100.0, waist: 84.0, hip: 100.0, length: 104.0, width: 30.0, height: 106.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
  L:   { bust: 104.0, waist: 88.0, hip: 104.0, length: 106.0, width: 31.0, height: 108.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
  XL:  { bust: 108.0, waist: 92.0, hip: 108.0, length: 108.0, width: 32.0, height: 110.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
  XXL: { bust: 112.0, waist: 96.0, hip: 112.0, length: 110.0, width: 33.0, height: 112.0, sleeveLength: 0.0, shoulderWidth: 0.0, neckCircumference: 0.0 },
};

export function createWomensBootCutPant(): Garment {
  // 1. BK: Back Leg (Boot Cut silhouette with back knee reduction and hem flare)
  const backLeg: PatternComponent = {
    id: 'pant-bk',
    pieceCode: 'BK',
    name: 'BK - Back Leg (1. 2)',
    cutInstruction: 'Cut 2 (Pair) • Self Fabric',
    quantity: 2,
    offset: { x: 60, y: 50 },
    grainline: {
      start: { x: 420, y: 260 },
      end: { x: 780, y: 260 },
      label: 'GRAINLINE ↔ LENGTH',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 50, y: 70, name: 'Back Crotch Waist Apex' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 50, y: 380, name: 'Back Waist Side Apex' }],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 120, y: 400, isControl: true },
          { x: 260, y: 405, isControl: true },
          { x: 380, y: 395, name: 'Side Hip Curve Apex' },
        ],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 520, y: 385, isControl: true },
          { x: 680, y: 375, isControl: true },
          { x: 740, y: 380, name: 'Knee Outseam Curve' },
        ],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 800, y: 385, isControl: true },
          { x: 920, y: 398, isControl: true },
          { x: 980, y: 410, name: 'Boot Cut Outseam Flare' },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 980, y: 150, name: 'Boot Cut Inseam Flare' }],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 920, y: 162, isControl: true },
          { x: 800, y: 175, isControl: true },
          { x: 740, y: 180, name: 'Knee Inseam Curve' },
        ],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 580, y: 188, isControl: true },
          { x: 400, y: 195, isControl: true },
          { x: 280, y: 190, name: 'Back Crotch Fork Curve' },
        ],
      },
      {
        type: 'C',
        zone: 'bust',
        points: [
          { x: 210, y: 140, isControl: true },
          { x: 140, y: 95, isControl: true },
          { x: 50, y: 70, name: 'Back Crotch Rise Curve' },
        ],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 50, y: 70 }],
      },
    ],
    notches: [
      { x: 740, y: 380, name: 'Knee Notch Outseam', isNotch: true },
      { x: 740, y: 180, name: 'Knee Notch Inseam', isNotch: true },
      { x: 280, y: 190, name: 'Crotch Seam Notch', isNotch: true },
    ],
    internals: [
      {
        id: 'back-pocket-placement-contour',
        name: 'Pocket Placement Guide',
        type: 'pocket',
        color: '#facc15', // Yellow line as shown in TUKAcad screenshot
        closed: true,
        points: [
          { x: 90, y: 160 },
          { x: 90, y: 310 },
          { x: 195, y: 320 },
          { x: 235, y: 235 },
          { x: 195, y: 150 },
        ],
      },
    ],
    labels: [
      { text: 'WOMENS BOOT CUT PANT - BACK (BK)', position: { x: 340, y: 300 }, type: 'title' },
      { text: 'Cut 2 • Size S (28" Waist) • Inseam 32"', position: { x: 340, y: 320 }, type: 'meta' },
      { text: 'KNEE LEVEL: 18.5" (47cm)', position: { x: 700, y: 280 }, type: 'guide' },
      { text: 'BOOT CUT FLARE: 21.0" (53.3cm)', position: { x: 920, y: 280 }, type: 'guide' },
    ],
    measurements: {
      waist: 71.0,
      hip: 94.0,
      length: 106.0,
      inseam: 81.3,
      hemWidth: 26.5,
    },
  };

  // 2. BK-PK: Back Pocket with Butterfly Embroidery Art (exactly as in screenshot)
  const backPocket: PatternComponent = {
    id: 'pant-bk-pk',
    pieceCode: 'BK-PK',
    name: 'BK-PK - Back Pocket (6. 2)',
    cutInstruction: 'Cut 2 (Pair) • Butterfly Embroidery',
    quantity: 2,
    offset: { x: 480, y: 440 },
    grainline: {
      start: { x: 80, y: 30 },
      end: { x: 80, y: 160 },
      label: 'GRAINLINE ↕ POCKET',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 15, y: 20, name: 'Top Pocket Left' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 155, y: 20, name: 'Top Pocket Right' }],
      },
      {
        type: 'L',
        zone: 'hip',
        points: [{ x: 165, y: 135, name: 'Pocket Right Side' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 85, y: 185, name: 'Pocket Bottom Apex' }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 5, y: 135, name: 'Pocket Left Side' }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 15, y: 20 }],
      },
    ],
    notches: [
      { x: 15, y: 35, name: 'Hem Fold Notch Left', isNotch: true },
      { x: 155, y: 35, name: 'Hem Fold Notch Right', isNotch: true },
    ],
    internals: [
      {
        id: 'butterfly-artwork',
        name: 'TUKA Butterfly Graphic Placement',
        type: 'graphic',
        color: '#2563eb',
        points: [
          { x: 25, y: 45 },
          { x: 145, y: 45 },
          { x: 145, y: 140 },
          { x: 25, y: 140 },
        ],
        graphicSvg: 'butterfly',
      },
    ],
    labels: [
      { text: 'BK-PK (6. 2)', position: { x: 45, y: 32 }, type: 'title' },
      { text: 'Pocket Top 14.0cm • Length 16.5cm', position: { x: 20, y: 175 }, type: 'meta' },
    ],
    measurements: {
      length: 16.5,
      hemWidth: 14.0,
    },
  };

  // 3. FR: Front Leg
  const frontLeg: PatternComponent = {
    id: 'pant-fr',
    pieceCode: 'FR',
    name: 'FR - Front Leg (7. 2)',
    cutInstruction: 'Cut 2 (Pair) • Curve Pocket Cutout',
    quantity: 2,
    offset: { x: 60, y: 550 },
    grainline: {
      start: { x: 420, y: 220 },
      end: { x: 780, y: 220 },
      label: 'GRAINLINE ↔ LENGTH',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 50, y: 100, name: 'Front Fly Top' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 50, y: 320, name: 'Front Waist Side' }],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 110, y: 350, isControl: true },
          { x: 250, y: 360, isControl: true },
          { x: 380, y: 350, name: 'Front Hip Curve' },
        ],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 520, y: 340, isControl: true },
          { x: 680, y: 330, isControl: true },
          { x: 740, y: 335, name: 'Front Knee Outseam' },
        ],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 800, y: 340, isControl: true },
          { x: 920, y: 355, isControl: true },
          { x: 980, y: 370, name: 'Front Boot Cut Outseam' },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 980, y: 150, name: 'Front Boot Cut Inseam' }],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 920, y: 158, isControl: true },
          { x: 800, y: 168, isControl: true },
          { x: 740, y: 172, name: 'Front Knee Inseam' },
        ],
      },
      {
        type: 'C',
        zone: 'hip',
        points: [
          { x: 580, y: 176, isControl: true },
          { x: 400, y: 180, isControl: true },
          { x: 260, y: 178, name: 'Front Crotch Fork' },
        ],
      },
      {
        type: 'C',
        zone: 'bust',
        points: [
          { x: 180, y: 120, isControl: true },
          { x: 100, y: 105, isControl: true },
          { x: 50, y: 100, name: 'Front Fly Curve' },
        ],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 50, y: 100 }],
      },
    ],
    notches: [
      { x: 740, y: 335, name: 'Front Knee Notch', isNotch: true },
      { x: 740, y: 172, name: 'Front Knee Inseam Notch', isNotch: true },
    ],
    labels: [
      { text: 'WOMENS BOOT CUT PANT - FRONT (FR)', position: { x: 340, y: 260 }, type: 'title' },
      { text: 'Cut 2 • Inseam 32" • Slanted Pocket Scoop', position: { x: 340, y: 280 }, type: 'meta' },
    ],
    measurements: {
      waist: 71.0,
      hip: 94.0,
      length: 104.0,
      inseam: 81.3,
      hemWidth: 26.5,
    },
  };

  // 4. WB: Waistband
  const waistband: PatternComponent = {
    id: 'pant-wb',
    pieceCode: 'WB',
    name: 'WB - Waistband (8. 1)',
    cutInstruction: 'Cut 1 on Fold • Interfaced',
    quantity: 1,
    offset: { x: 1100, y: 50 },
    grainline: {
      start: { x: 20, y: 40 },
      end: { x: 320, y: 40 },
      label: 'GRAINLINE ↔ WAISTBAND',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 10, name: 'WB Center Back' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 350, y: 10, name: 'WB Front Extension' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 350, y: 70, name: 'WB Front Bottom' }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 70, name: 'WB Center Back Bottom' }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 10 }],
      },
    ],
    notches: [
      { x: 175, y: 10, name: 'Side Seam Notch', isNotch: true },
      { x: 320, y: 10, name: 'Center Front Notch', isNotch: true },
    ],
    labels: [
      { text: 'WB (8. 1)', position: { x: 80, y: 45 }, type: 'title' },
      { text: 'Contour Waistband 4.5cm', position: { x: 80, y: 60 }, type: 'meta' },
    ],
    measurements: {
      waist: 71.0,
    },
  };

  // 5. COIN: Coin Pocket
  const coinPocket: PatternComponent = {
    id: 'pant-coin',
    pieceCode: 'COIN',
    name: 'COIN - Coin Pocket (5. 1)',
    cutInstruction: 'Cut 1 • Right Front Watch Pocket',
    quantity: 1,
    offset: { x: 1100, y: 180 },
    grainline: {
      start: { x: 10, y: 40 },
      end: { x: 80, y: 40 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 90, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 90, y: 85 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 85 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'COIN (5. 1)', position: { x: 15, y: 45 }, type: 'title' },
    ],
    measurements: {
      length: 8.5,
      hemWidth: 9.0,
    },
  };

  // 6. BUT-FLY: Button Fly Facing
  const buttonFly: PatternComponent = {
    id: 'pant-but-fly',
    pieceCode: 'BUT-FLY',
    name: 'BUT-FLY - Button Fly (4. 1)',
    cutInstruction: 'Cut 1 • Button Stand',
    quantity: 1,
    offset: { x: 1100, y: 310 },
    grainline: {
      start: { x: 15, y: 20 },
      end: { x: 15, y: 130 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 60, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 60, y: 120 }],
      },
      {
        type: 'C',
        zone: 'waist',
        points: [
          { x: 50, y: 150, isControl: true },
          { x: 20, y: 160, isControl: true },
          { x: 0, y: 155, name: 'Fly Curve Bottom' },
        ],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'BUT-FLY (4. 1)', position: { x: 10, y: 70 }, type: 'title' },
    ],
    measurements: {
      length: 15.5,
      hemWidth: 6.0,
    },
  };

  // 7. BIA-PK: Bias Pocket Facing
  const biasPocket: PatternComponent = {
    id: 'pant-bia-pk',
    pieceCode: 'BIA-PK',
    name: 'BIA-PK - Bias Pocket (2. 1)',
    cutInstruction: 'Cut 2 Facing',
    quantity: 2,
    offset: { x: 1100, y: 520 },
    grainline: {
      start: { x: 20, y: 15 },
      end: { x: 120, y: 65 },
      label: 'BIAS 45°',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 140, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 140, y: 70 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 70 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'BIA-PK (2. 1)', position: { x: 25, y: 40 }, type: 'title' },
    ],
    measurements: {
      length: 7.0,
      hemWidth: 14.0,
    },
  };

  // 8. BIA-BTTM: Bias Bottom Hem Facing
  const biasBottom: PatternComponent = {
    id: 'pant-bia-bttm',
    pieceCode: 'BIA-BTTM',
    name: 'BIA-BTTM - Bias Bottom (3. 1)',
    cutInstruction: 'Cut 2 Hem Reinforcement',
    quantity: 2,
    offset: { x: 1100, y: 640 },
    grainline: {
      start: { x: 10, y: 20 },
      end: { x: 150, y: 20 },
      label: 'BIAS ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'hem',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 180, y: 0 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 180, y: 40 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 40 }],
      },
      {
        type: 'Z',
        zone: 'hem',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'BIA-BTTM (3. 1)', position: { x: 30, y: 25 }, type: 'title' },
    ],
    measurements: {
      length: 4.0,
      hemWidth: 18.0,
    },
  };

  // 9. R-LOOP: Right Belt Loop
  const beltLoop: PatternComponent = {
    id: 'pant-r-loop',
    pieceCode: 'R-LOOP',
    name: 'R-LOOP - Belt Loop (9. 1)',
    cutInstruction: 'Cut 5 Loops',
    quantity: 5,
    offset: { x: 1100, y: 730 },
    grainline: {
      start: { x: 10, y: 15 },
      end: { x: 100, y: 15 },
      label: 'GRAINLINE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 120, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 120, y: 30 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 30 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'R-LOOP (9. 1)', position: { x: 20, y: 20 }, type: 'title' },
    ],
    measurements: {
      length: 3.0,
      hemWidth: 12.0,
    },
  };

  // 10. R-FY: Right Fly Facing
  const rightFly: PatternComponent = {
    id: 'pant-r-fy',
    pieceCode: 'R-FY',
    name: 'R-FY - Right Fly (10. 1)',
    cutInstruction: 'Cut 1 Fly Shield',
    quantity: 1,
    offset: { x: 1100, y: 800 },
    grainline: {
      start: { x: 15, y: 15 },
      end: { x: 15, y: 110 },
      label: 'GRAINLINE ↕',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 55, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 55, y: 120 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 120 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [
      { text: 'R-FY (10. 1)', position: { x: 10, y: 60 }, type: 'title' },
    ],
    measurements: {
      length: 12.0,
      hemWidth: 5.5,
    },
  };

  return {
    id: 'garment-bootcut-pant-005',
    name: 'Womens Boot Cut Pant',
    category: 'trouser',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [
      backLeg,
      biasPocket,
      biasBottom,
      buttonFly,
      coinPocket,
      backPocket,
      frontLeg,
      waistband,
      beltLoop,
      rightFly,
    ],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// Men's Tailored Suit Jacket (Blazer Marker)
// Authentic TUKAcad 16-Piece Nest
// ==========================================
export function createMensTailoredSuitJacket(): Garment {
  // 1. BACK: Suit Jacket Back Panel
  const backPanel: PatternComponent = {
    id: 'suit-back',
    pieceCode: 'BACK',
    name: 'BACK - Jacket Back (1. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 230, y: 130 },
    grainline: {
      start: { x: 60, y: 55 },
      end: { x: 260, y: 55 },
      label: 'BACK ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 20 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 30, y: 10 },
          { x: 70, y: 0 },
          { x: 120, y: 0 },
        ],
      },
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 320, y: 10 }],
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 330, y: 40 },
          { x: 325, y: 90 },
          { x: 310, y: 110 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 110 }],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 20 }],
      },
    ],
    notches: [
      { x: 70, y: 0 },
      { x: 320, y: 10 },
      { x: 325, y: 90 },
      { x: 160, y: 110 },
    ],
    labels: [
      { text: 'BACK', position: { x: 140, y: 45 }, type: 'title' },
    ],
    measurements: {
      length: 76.0,
      halfChest: 54.0,
      shoulderWidth: 16.5,
    },
  };

  // 2. FRONT: Suit Jacket Front Panel (with lapel, gorge & pocket welts)
  const frontPanel: PatternComponent = {
    id: 'suit-front',
    pieceCode: 'FRONT',
    name: 'FRONT - Jacket Front (2. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 230, y: 270 },
    grainline: {
      start: { x: 60, y: 65 },
      end: { x: 260, y: 65 },
      label: 'FRONT ↔',
    },
    internals: [
      {
        id: 'front-chest-dart',
        name: 'Chest Dart',
        type: 'dart',
        points: [
          { x: 110, y: 20 },
          { x: 110, y: 80 },
        ],
        color: '#facc15',
      },
      {
        id: 'breast-pocket-welt',
        name: 'Breast Welt Pocket',
        type: 'pocket',
        points: [
          { x: 180, y: 35 },
          { x: 240, y: 45 },
          { x: 240, y: 55 },
          { x: 180, y: 45 },
          { x: 180, y: 35 },
        ],
        closed: true,
        color: '#facc15',
      },
      {
        id: 'waist-pocket-welt',
        name: 'Waist Flap Pocket Welt',
        type: 'pocket',
        points: [
          { x: 210, y: 95 },
          { x: 225, y: 95 },
          { x: 225, y: 125 },
          { x: 210, y: 125 },
          { x: 210, y: 95 },
        ],
        closed: true,
        color: '#facc15',
      },
    ],
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 30 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 40, y: 5 },
          { x: 100, y: 0 },
          { x: 180, y: 0 },
        ],
      },
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 320, y: 15 }],
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 335, y: 55 },
          { x: 310, y: 100 },
          { x: 280, y: 120 },
        ],
      },
      {
        type: 'C',
        zone: 'hem',
        points: [
          { x: 200, y: 135 },
          { x: 90, y: 130 },
          { x: 0, y: 115 },
        ],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 30 }],
      },
    ],
    notches: [
      { x: 100, y: 0 },
      { x: 180, y: 0 },
      { x: 320, y: 15 },
      { x: 310, y: 100 },
    ],
    labels: [
      { text: 'FRONT', position: { x: 150, y: 60 }, type: 'title' },
    ],
    measurements: {
      length: 78.0,
      halfChest: 56.0,
    },
  };

  // 3. FRONT FUSE: Full Front Interlining Canvas
  const frontFuse: PatternComponent = {
    id: 'suit-front-fuse',
    pieceCode: 'FRONT FUSE',
    name: 'FRONT FUSE - Interfacing (3. 2)',
    cutInstruction: 'Cut 2 Fusible',
    quantity: 2,
    offset: { x: 230, y: 430 },
    grainline: {
      start: { x: 60, y: 55 },
      end: { x: 250, y: 55 },
      label: 'FRONT FUSE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 310, y: 0 }],
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 325, y: 40 },
          { x: 300, y: 90 },
          { x: 270, y: 115 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 115 }],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [{ x: 310, y: 0 }, { x: 300, y: 90 }],
    labels: [{ text: 'FRONT FUSE', position: { x: 135, y: 50 }, type: 'title' }],
    measurements: { length: 74.0 },
  };

  // 4. FRT FACING: Front Lapel Facing
  const frontFacing: PatternComponent = {
    id: 'suit-frt-facing',
    pieceCode: 'FRT FACING',
    name: 'FRT FACING - Lapel Facing (4. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 230, y: 570 },
    grainline: {
      start: { x: 50, y: 35 },
      end: { x: 220, y: 35 },
      label: 'FRT FACING ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 20 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 80, y: 0 },
          { x: 200, y: 0 },
          { x: 290, y: 15 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 280, y: 55 }],
      },
      {
        type: 'C',
        zone: 'center-fold',
        points: [
          { x: 180, y: 45 },
          { x: 70, y: 45 },
          { x: 0, y: 55 },
        ],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 20 }],
      },
    ],
    notches: [{ x: 150, y: 0 }],
    labels: [{ text: 'FRT FACING', position: { x: 130, y: 30 }, type: 'title' }],
    measurements: { length: 65.0 },
  };

  // 5. UNDER COLLAR / BRIDLE
  const underCollarBridle: PatternComponent = {
    id: 'suit-under-collar-bridle',
    pieceCode: 'UNDER COLLAR',
    name: 'UNDER COLLAR (5. 2)',
    cutInstruction: 'Cut 2 Bias Melton',
    quantity: 2,
    offset: { x: 230, y: 660 },
    grainline: {
      start: { x: 20, y: 15 },
      end: { x: 130, y: 15 },
      label: 'UNDER COLLAR ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 10 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 40, y: 0 },
          { x: 110, y: 0 },
          { x: 150, y: 10 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 140, y: 35 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 100, y: 25 },
          { x: 40, y: 25 },
          { x: 0, y: 35 },
        ],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 10 }],
      },
    ],
    notches: [{ x: 75, y: 0 }],
    labels: [{ text: 'UNDER COLLAR', position: { x: 60, y: 20 }, type: 'title' }],
    measurements: { length: 42.0 },
  };

  // 6. TOP SLEEVE: Two-Piece Upper Sleeve Panel
  const topSleeve: PatternComponent = {
    id: 'suit-top-sleeve',
    pieceCode: 'TOP SLEEVE',
    name: 'TOP SLEEVE - Upper Sleeve (6. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 590, y: 130 },
    grainline: {
      start: { x: 45, y: 55 },
      end: { x: 215, y: 55 },
      label: 'TOP SLEEVE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'sleeve-cap',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'sleeve-seam',
        points: [{ x: 170, y: 0 }],
      },
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 215, y: 10 },
          { x: 260, y: 40 },
          { x: 255, y: 80 },
        ],
      },
      {
        type: 'C',
        zone: 'sleeve-seam',
        points: [
          { x: 240, y: 105 },
          { x: 180, y: 115 },
          { x: 0, y: 110 },
        ],
      },
      {
        type: 'Z',
        zone: 'sleeve-hem',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [
      { x: 170, y: 0 },
      { x: 260, y: 40 },
      { x: 100, y: 110 },
    ],
    labels: [{ text: 'TOP SLEEVE', position: { x: 120, y: 45 }, type: 'title' }],
    measurements: { length: 64.0, sleeveLength: 64.0 },
  };

  // 7. UND SLEEVE: Two-Piece Under Sleeve Panel
  const undSleeve: PatternComponent = {
    id: 'suit-und-sleeve',
    pieceCode: 'UND SLEEVE',
    name: 'UND SLEEVE - Under Sleeve (7. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 590, y: 270 },
    grainline: {
      start: { x: 40, y: 40 },
      end: { x: 180, y: 40 },
      label: 'UND SLEEVE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'sleeve-cap',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'sleeve-seam',
        points: [{ x: 170, y: 10 }],
      },
      {
        type: 'C',
        zone: 'sleeve-cap',
        points: [
          { x: 210, y: 30 },
          { x: 220, y: 65 },
          { x: 195, y: 85 },
        ],
      },
      {
        type: 'L',
        zone: 'sleeve-seam',
        points: [{ x: 0, y: 85 }],
      },
      {
        type: 'Z',
        zone: 'sleeve-hem',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [{ x: 170, y: 10 }, { x: 210, y: 30 }],
    labels: [{ text: 'UND SLEEVE', position: { x: 100, y: 35 }, type: 'title' }],
    measurements: { length: 58.0 },
  };

  // 8. SIDE: Jacket Side Body Panel
  const sidePanel: PatternComponent = {
    id: 'suit-side',
    pieceCode: 'SIDE',
    name: 'SIDE - Side Body (8. 2)',
    cutInstruction: 'Cut 2 in Fabric',
    quantity: 2,
    offset: { x: 590, y: 390 },
    grainline: {
      start: { x: 40, y: 45 },
      end: { x: 180, y: 45 },
      label: 'SIDE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'armhole',
        points: [{ x: 0, y: 10 }],
      },
      {
        type: 'L',
        zone: 'armhole',
        points: [{ x: 150, y: 0 }],
      },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: 190, y: 15 },
          { x: 220, y: 55 },
          { x: 200, y: 85 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 85 }],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 10 }],
      },
    ],
    notches: [{ x: 150, y: 0 }, { x: 190, y: 15 }],
    labels: [{ text: 'SIDE', position: { x: 105, y: 38 }, type: 'title' }],
    measurements: { length: 55.0 },
  };

  // 9. FRT CHEST: Front Chest Canvas Reinforcement
  const frtChest: PatternComponent = {
    id: 'suit-frt-chest',
    pieceCode: 'FRT CHEST',
    name: 'FRT CHEST - Chest Piece (9. 2)',
    cutInstruction: 'Cut 2 Canvas',
    quantity: 2,
    offset: { x: 590, y: 500 },
    grainline: {
      start: { x: 30, y: 35 },
      end: { x: 140, y: 35 },
      label: 'FRT CHEST ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 150, y: 0 }],
      },
      {
        type: 'L',
        zone: 'armhole',
        points: [{ x: 160, y: 70 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 65 }],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [{ x: 150, y: 0 }],
    labels: [{ text: 'FRT CHEST', position: { x: 75, y: 30 }, type: 'title' }],
    measurements: { length: 28.0 },
  };

  // 10. FRONT CHEST FELT: Chest Felt Pad
  const frontChestFelt: PatternComponent = {
    id: 'suit-front-chest-felt',
    pieceCode: 'FRONT CHEST FELT',
    name: 'FRONT CHEST FELT (10. 2)',
    cutInstruction: 'Cut 2 Wool Felt',
    quantity: 2,
    offset: { x: 590, y: 590 },
    grainline: {
      start: { x: 30, y: 40 },
      end: { x: 130, y: 40 },
      label: 'FRONT CHEST FELT ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 140, y: 0 }],
      },
      {
        type: 'L',
        zone: 'armhole',
        points: [{ x: 150, y: 80 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 75 }],
      },
      {
        type: 'Z',
        zone: 'center-fold',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [],
    labels: [{ text: 'FRONT CHEST FELT', position: { x: 65, y: 35 }, type: 'title' }],
    measurements: { length: 26.0 },
  };

  // 11. COLLAR: Jacket Collar Stand and Leaf
  const collarPiece: PatternComponent = {
    id: 'suit-collar',
    pieceCode: 'COLLAR',
    name: 'COLLAR - Upper Collar (11. 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    offset: { x: 880, y: 130 },
    grainline: {
      start: { x: 20, y: 25 },
      end: { x: 110, y: 25 },
      label: 'COLLAR ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 10 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 35, y: 0 },
          { x: 95, y: 0 },
          { x: 130, y: 10 },
        ],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 120, y: 50 }],
      },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 85, y: 40 },
          { x: 35, y: 40 },
          { x: 0, y: 50 },
        ],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 10 }],
      },
    ],
    notches: [{ x: 65, y: 0 }],
    labels: [{ text: 'COLLAR', position: { x: 55, y: 25 }, type: 'title' }],
    measurements: { length: 44.0 },
  };

  // 12. CHEST CANVAS: Chest Floating Canvas Piece
  const chestCanvas: PatternComponent = {
    id: 'suit-chest-canvas',
    pieceCode: 'CHEST CANVAS',
    name: 'CHEST CANVAS (12. 2)',
    cutInstruction: 'Cut 2 Horsehair Canvas',
    quantity: 2,
    offset: { x: 880, y: 210 },
    grainline: {
      start: { x: 20, y: 35 },
      end: { x: 100, y: 35 },
      label: 'CHEST CANVAS ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 15 }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 125, y: 0 }],
      },
      {
        type: 'L',
        zone: 'armhole',
        points: [{ x: 130, y: 65 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 60 }],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 15 }],
      },
    ],
    notches: [],
    labels: [{ text: 'CHEST CANVAS', position: { x: 55, y: 30 }, type: 'title' }],
    measurements: { length: 25.0 },
  };

  // 13. SHOULDER CANVAS: Shoulder Pad Reinforcement
  const shoulderCanvas: PatternComponent = {
    id: 'suit-shoulder-canvas',
    pieceCode: 'SHOULDER CANVAS',
    name: 'SHOULDER CANVAS (13. 2)',
    cutInstruction: 'Cut 2 Pad Canvas',
    quantity: 2,
    offset: { x: 880, y: 295 },
    grainline: {
      start: { x: 15, y: 25 },
      end: { x: 90, y: 25 },
      label: 'SHOULDER CANVAS ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'shoulder',
        points: [{ x: 0, y: 20 }],
      },
      {
        type: 'L',
        zone: 'shoulder',
        points: [{ x: 110, y: 0 }],
      },
      {
        type: 'L',
        zone: 'armhole',
        points: [{ x: 115, y: 55 }],
      },
      {
        type: 'L',
        zone: 'hem',
        points: [{ x: 0, y: 50 }],
      },
      {
        type: 'Z',
        zone: 'shoulder',
        points: [{ x: 0, y: 20 }],
      },
    ],
    notches: [],
    labels: [{ text: 'SHOULDER CANVAS', position: { x: 45, y: 25 }, type: 'title' }],
    measurements: { length: 20.0 },
  };

  // 14. CANVAS: Floating Canvas Strip
  const canvasStrip: PatternComponent = {
    id: 'suit-canvas-strip',
    pieceCode: 'CANVAS',
    name: 'CANVAS - Strip (14. 2)',
    cutInstruction: 'Cut 2 Canvas',
    quantity: 2,
    offset: { x: 880, y: 375 },
    grainline: {
      start: { x: 15, y: 18 },
      end: { x: 80, y: 18 },
      label: 'CANVAS ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 95, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 95, y: 35 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 35 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [{ text: 'CANVAS', position: { x: 35, y: 18 }, type: 'title' }],
    measurements: { length: 18.0 },
  };

  // 15. BOTTOM WELT: Pocket Welt Rectangle
  const bottomWelt: PatternComponent = {
    id: 'suit-bottom-welt',
    pieceCode: 'BOTTOM WELT',
    name: 'BOTTOM WELT (15. 2)',
    cutInstruction: 'Cut 2 Pocket Welt',
    quantity: 2,
    offset: { x: 880, y: 430 },
    grainline: {
      start: { x: 10, y: 12 },
      end: { x: 65, y: 12 },
      label: 'BOTTOM WELT ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 75, y: 0 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 75, y: 24 }],
      },
      {
        type: 'L',
        zone: 'waist',
        points: [{ x: 0, y: 24 }],
      },
      {
        type: 'Z',
        zone: 'waist',
        points: [{ x: 0, y: 0 }],
      },
    ],
    notches: [],
    labels: [{ text: 'BOTTOM WELT', position: { x: 20, y: 14 }, type: 'title' }],
    measurements: { length: 16.0 },
  };

  // 16. UNSLEEVE FUSE: Under Sleeve Cuff Fusing
  const unsleeveFuse: PatternComponent = {
    id: 'suit-unsleeve-fuse',
    pieceCode: 'UNSLEEVE FUSE',
    name: 'UNSLEEVE FUSE (16. 2)',
    cutInstruction: 'Cut 2 Fusible',
    quantity: 2,
    offset: { x: 880, y: 475 },
    grainline: {
      start: { x: 15, y: 20 },
      end: { x: 80, y: 20 },
      label: 'UNSLEEVE FUSE ↔',
    },
    paths: [
      {
        type: 'M',
        zone: 'sleeve-hem',
        points: [{ x: 0, y: 10 }],
      },
      {
        type: 'L',
        zone: 'sleeve-hem',
        points: [{ x: 95, y: 0 }],
      },
      {
        type: 'L',
        zone: 'sleeve-hem',
        points: [{ x: 90, y: 45 }],
      },
      {
        type: 'L',
        zone: 'sleeve-hem',
        points: [{ x: 0, y: 40 }],
      },
      {
        type: 'Z',
        zone: 'sleeve-hem',
        points: [{ x: 0, y: 10 }],
      },
    ],
    notches: [],
    labels: [{ text: 'UNSLEEVE FUSE', position: { x: 30, y: 22 }, type: 'title' }],
    measurements: { length: 22.0 },
  };

  return {
    id: 'garment-mens-suit-jacket-006',
    name: "Mens Tailored Suit Jacket",
    category: 'jacket',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [
      backPanel,
      frontPanel,
      frontFuse,
      frontFacing,
      underCollarBridle,
      topSleeve,
      undSleeve,
      sidePanel,
      frtChest,
      frontChestFelt,
      collarPiece,
      chestCanvas,
      shoulderCanvas,
      canvasStrip,
      bottomWelt,
      unsleeveFuse,
    ],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 1. Womens Double-Breasted Blazer (10 Pcs)
// ==========================================
export function createDoubleBreastedBlazer(): Garment {
  const frontLeft: PatternComponent = {
    id: 'db-front-left',
    pieceCode: 'DB-FRT-L',
    name: 'Front Left Peak Lapel (1. 1)',
    cutInstruction: 'Cut 1 in Shell',
    quantity: 1,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 60, y: 60 }, end: { x: 260, y: 60 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 25 }] },
      { type: 'C', zone: 'neck', points: [{ x: 50, y: 0 }, { x: 120, y: 0 }, { x: 200, y: 10 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 330, y: 20 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 340, y: 60 }, { x: 310, y: 105 }, { x: 280, y: 125 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 125 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 25 }] },
    ],
    internals: [
      { id: 'db-button-wrap', name: 'DB Button Line', type: 'line', points: [{ x: 140, y: 40 }, { x: 140, y: 110 }], color: '#facc15' },
    ],
    notches: [{ x: 200, y: 10 }, { x: 330, y: 20 }],
    labels: [{ text: 'DB FRONT L', position: { x: 120, y: 55 }, type: 'title' }],
    measurements: { length: 72.0, halfChest: 52.0 },
  };

  const backPanel: PatternComponent = {
    id: 'db-back',
    pieceCode: 'DB-BACK',
    name: 'Jacket Back with Vent (2. 2)',
    cutInstruction: 'Cut 2 in Shell',
    quantity: 2,
    offset: { x: 580, y: 140 },
    grainline: { start: { x: 60, y: 55 }, end: { x: 250, y: 55 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 15 }] },
      { type: 'C', zone: 'neck', points: [{ x: 40, y: 0 }, { x: 110, y: 0 }, { x: 160, y: 0 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 320, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 330, y: 50 }, { x: 315, y: 95 }, { x: 290, y: 120 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 120 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 15 }] },
    ],
    notches: [{ x: 320, y: 15 }, { x: 160, y: 120 }],
    labels: [{ text: 'DB BACK', position: { x: 130, y: 45 }, type: 'title' }],
    measurements: { length: 70.0, halfChest: 50.0 },
  };

  const topSleeve: PatternComponent = {
    id: 'db-top-sleeve',
    pieceCode: 'DB-SLEEVE-TOP',
    name: 'Top Sleeve Panel (3. 2)',
    cutInstruction: 'Cut 2 Pair',
    quantity: 2,
    offset: { x: 230, y: 290 },
    grainline: { start: { x: 40, y: 50 }, end: { x: 200, y: 50 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'sleeve-cap', points: [{ x: 0, y: 15 }] },
      { type: 'L', zone: 'sleeve-seam', points: [{ x: 160, y: 0 }] },
      { type: 'C', zone: 'sleeve-cap', points: [{ x: 210, y: 15 }, { x: 250, y: 45 }, { x: 245, y: 85 }] },
      { type: 'L', zone: 'sleeve-hem', points: [{ x: 0, y: 105 }] },
      { type: 'Z', zone: 'sleeve-seam', points: [{ x: 0, y: 15 }] },
    ],
    notches: [{ x: 160, y: 0 }],
    labels: [{ text: 'DB SLEEVE TOP', position: { x: 100, y: 45 }, type: 'title' }],
    measurements: { length: 62.0 },
  };

  const peakCollar: PatternComponent = {
    id: 'db-collar',
    pieceCode: 'DB-COLLAR',
    name: 'Peak Lapel Collar (4. 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    offset: { x: 580, y: 290 },
    grainline: { start: { x: 20, y: 20 }, end: { x: 120, y: 20 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 10 }] },
      { type: 'C', zone: 'neck', points: [{ x: 40, y: 0 }, { x: 100, y: 0 }, { x: 140, y: 10 }] },
      { type: 'L', zone: 'hem', points: [{ x: 130, y: 45 }] },
      { type: 'C', zone: 'neck', points: [{ x: 90, y: 35 }, { x: 40, y: 35 }, { x: 0, y: 45 }] },
      { type: 'Z', zone: 'neck', points: [{ x: 0, y: 10 }] },
    ],
    notches: [{ x: 70, y: 0 }],
    labels: [{ text: 'PEAK COLLAR', position: { x: 50, y: 22 }, type: 'title' }],
    measurements: { length: 42.0 },
  };

  return {
    id: 'garment-db-blazer-007',
    name: 'Womens Double-Breasted Blazer',
    category: 'jacket',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontLeft, backPanel, topSleeve, peakCollar],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 2. 5-Pocket Raw Denim Jeans (8 Pcs)
// ==========================================
export function createDenimJeans(): Garment {
  const frontLeg: PatternComponent = {
    id: 'jeans-front-leg',
    pieceCode: 'JEANS-FRT',
    name: 'Front Leg with Scoop Pocket (1. 2)',
    cutInstruction: 'Cut 2 in Denim',
    quantity: 2,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 50, y: 40 }, end: { x: 280, y: 40 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 20 }] },
      { type: 'L', zone: 'waist', points: [{ x: 80, y: 0 }] },
      { type: 'L', zone: 'hip', points: [{ x: 340, y: 10 }] },
      { type: 'L', zone: 'hem', points: [{ x: 340, y: 95 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 90 }] },
      { type: 'Z', zone: 'crotch', points: [{ x: 0, y: 20 }] },
    ],
    internals: [
      { id: 'scoop-pocket-curve', name: 'Scoop Pocket Opening', type: 'pocket', points: [{ x: 20, y: 15 }, { x: 65, y: 25 }, { x: 75, y: 0 }], color: '#facc15' },
      { id: 'coin-pocket-welt', name: 'Coin Pocket Welt', type: 'pocket', points: [{ x: 30, y: 10 }, { x: 55, y: 10 }, { x: 55, y: 25 }, { x: 30, y: 25 }, { x: 30, y: 10 }], closed: true, color: '#facc15' },
    ],
    notches: [{ x: 80, y: 0 }, { x: 340, y: 10 }],
    labels: [{ text: 'JEANS FRONT', position: { x: 150, y: 45 }, type: 'title' }],
    measurements: { length: 104.0, inseam: 81.0, waist: 76.0 },
  };

  const backLeg: PatternComponent = {
    id: 'jeans-back-leg',
    pieceCode: 'JEANS-BACK',
    name: 'Back Leg with Yoke Seam (2. 2)',
    cutInstruction: 'Cut 2 in Denim',
    quantity: 2,
    offset: { x: 230, y: 280 },
    grainline: { start: { x: 50, y: 40 }, end: { x: 280, y: 40 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 25 }] },
      { type: 'L', zone: 'waist', points: [{ x: 90, y: 0 }] },
      { type: 'L', zone: 'hip', points: [{ x: 350, y: 15 }] },
      { type: 'L', zone: 'hem', points: [{ x: 350, y: 105 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 95 }] },
      { type: 'Z', zone: 'crotch', points: [{ x: 0, y: 25 }] },
    ],
    internals: [
      { id: 'back-yoke-line', name: 'Yoke Seam Line', type: 'line', points: [{ x: 10, y: 20 }, { x: 85, y: 5 }], color: '#facc15' },
      { id: 'back-patch-pocket', name: 'Back Patch Pocket Placement', type: 'pocket', points: [{ x: 35, y: 28 }, { x: 75, y: 28 }, { x: 75, y: 65 }, { x: 55, y: 78 }, { x: 35, y: 65 }, { x: 35, y: 28 }], closed: true, color: '#facc15' },
    ],
    notches: [{ x: 90, y: 0 }],
    labels: [{ text: 'JEANS BACK', position: { x: 160, y: 45 }, type: 'title' }],
    measurements: { length: 106.0, inseam: 81.0 },
  };

  const waistband: PatternComponent = {
    id: 'jeans-waistband',
    pieceCode: 'JEANS-WB',
    name: 'Contoured Denim Waistband (3. 2)',
    cutInstruction: 'Cut 2 in Denim',
    quantity: 2,
    offset: { x: 620, y: 140 },
    grainline: { start: { x: 20, y: 15 }, end: { x: 260, y: 15 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 280, y: 0 }] },
      { type: 'L', zone: 'waist', points: [{ x: 280, y: 35 }] },
      { type: 'L', zone: 'waist', points: [{ x: 0, y: 35 }] },
      { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
    ],
    notches: [{ x: 140, y: 0 }],
    labels: [{ text: 'DENIM WAISTBAND', position: { x: 100, y: 20 }, type: 'title' }],
    measurements: { length: 82.0 },
  };

  return {
    id: 'garment-denim-jeans-008',
    name: '5-Pocket Raw Denim Jeans',
    category: 'trouser',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontLeg, backLeg, waistband],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 3. A-Line Flared Skirt (4 Pcs)
// ==========================================
export function createFlaredSkirt(): Garment {
  const frontPanel: PatternComponent = {
    id: 'skirt-front-flare',
    pieceCode: 'SKIRT-FRT',
    name: 'Front Flared Panel (1. 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 40, y: 50 }, end: { x: 220, y: 50 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 10 }] },
      { type: 'C', zone: 'waist', points: [{ x: 50, y: 0 }, { x: 100, y: 0 }, { x: 150, y: 10 }] },
      { type: 'L', zone: 'hem', points: [{ x: 260, y: 110 }] },
      { type: 'C', zone: 'hem', points: [{ x: 150, y: 125 }, { x: 50, y: 125 }, { x: 0, y: 110 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 10 }] },
    ],
    notches: [{ x: 75, y: 0 }],
    labels: [{ text: 'SKIRT FRONT', position: { x: 80, y: 45 }, type: 'title' }],
    measurements: { length: 58.0, waist: 68.0 },
  };

  const backPanel: PatternComponent = {
    id: 'skirt-back-flare',
    pieceCode: 'SKIRT-BACK',
    name: 'Back Flared Panel with Zip (2. 2)',
    cutInstruction: 'Cut 2 in Shell',
    quantity: 2,
    offset: { x: 540, y: 140 },
    grainline: { start: { x: 40, y: 50 }, end: { x: 220, y: 50 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'waist', points: [{ x: 0, y: 12 }] },
      { type: 'C', zone: 'waist', points: [{ x: 50, y: 2 }, { x: 100, y: 2 }, { x: 150, y: 12 }] },
      { type: 'L', zone: 'hem', points: [{ x: 260, y: 112 }] },
      { type: 'C', zone: 'hem', points: [{ x: 150, y: 127 }, { x: 50, y: 127 }, { x: 0, y: 112 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 12 }] },
    ],
    notches: [{ x: 75, y: 2 }],
    labels: [{ text: 'SKIRT BACK', position: { x: 80, y: 45 }, type: 'title' }],
    measurements: { length: 58.0, waist: 68.0 },
  };

  return {
    id: 'garment-flared-skirt-009',
    name: 'A-Line Flared Skirt',
    category: 'skirt',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontPanel, backPanel],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 4. Classic Sheath Dress (6 Pcs)
// ==========================================
export function createSheathDress(): Garment {
  const frontDress: PatternComponent = {
    id: 'sheath-front',
    pieceCode: 'DRESS-FRT',
    name: 'Front Fitted Sheath Body (1. 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 50, y: 60 }, end: { x: 300, y: 60 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 25 }] },
      { type: 'C', zone: 'neck', points: [{ x: 40, y: 0 }, { x: 90, y: 0 }, { x: 140, y: 10 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 220, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 230, y: 45 }, { x: 215, y: 80 }, { x: 195, y: 100 }] },
      { type: 'L', zone: 'hem', points: [{ x: 380, y: 100 }] },
      { type: 'L', zone: 'hem', points: [{ x: 380, y: 30 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 25 }] },
    ],
    internals: [
      { id: 'bust-dart-front', name: 'French Bust Dart', type: 'dart', points: [{ x: 110, y: 30 }, { x: 150, y: 60 }], color: '#facc15' },
    ],
    notches: [{ x: 140, y: 10 }, { x: 220, y: 15 }],
    labels: [{ text: 'SHEATH FRONT', position: { x: 160, y: 55 }, type: 'title' }],
    measurements: { length: 102.0, bust: 90.0, waist: 72.0 },
  };

  const backDress: PatternComponent = {
    id: 'sheath-back',
    pieceCode: 'DRESS-BACK',
    name: 'Back Sheath with Vent (2. 2)',
    cutInstruction: 'Cut 2 in Shell',
    quantity: 2,
    offset: { x: 640, y: 140 },
    grainline: { start: { x: 50, y: 60 }, end: { x: 300, y: 60 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 15 }] },
      { type: 'C', zone: 'neck', points: [{ x: 40, y: 5 }, { x: 90, y: 5 }, { x: 140, y: 12 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 220, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 230, y: 45 }, { x: 215, y: 80 }, { x: 195, y: 100 }] },
      { type: 'L', zone: 'hem', points: [{ x: 380, y: 100 }] },
      { type: 'L', zone: 'hem', points: [{ x: 380, y: 20 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 15 }] },
    ],
    notches: [{ x: 140, y: 12 }, { x: 220, y: 15 }],
    labels: [{ text: 'SHEATH BACK', position: { x: 160, y: 55 }, type: 'title' }],
    measurements: { length: 102.0 },
  };

  return {
    id: 'garment-sheath-dress-010',
    name: 'Pencil Sheath Dress',
    category: 'dress',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontDress, backDress],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 5. Classic Trench Coat (14 Pcs)
// ==========================================
export function createTrenchCoat(): Garment {
  const frontPanel: PatternComponent = {
    id: 'trench-front',
    pieceCode: 'TRENCH-FRT',
    name: 'Trench Double-Breasted Front (1. 2)',
    cutInstruction: 'Cut 2 in Gabardine',
    quantity: 2,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 60, y: 65 }, end: { x: 300, y: 65 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 25 }] },
      { type: 'C', zone: 'neck', points: [{ x: 60, y: 0 }, { x: 140, y: 0 }, { x: 220, y: 10 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 350, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 360, y: 55 }, { x: 335, y: 100 }, { x: 300, y: 125 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 130 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 25 }] },
    ],
    internals: [
      { id: 'gun-flap-line', name: 'Gun Flap Storm Seam', type: 'line', points: [{ x: 100, y: 20 }, { x: 200, y: 20 }], color: '#facc15' },
    ],
    notches: [{ x: 220, y: 10 }, { x: 350, y: 15 }],
    labels: [{ text: 'TRENCH FRONT', position: { x: 160, y: 60 }, type: 'title' }],
    measurements: { length: 110.0, halfChest: 58.0 },
  };

  const backPanel: PatternComponent = {
    id: 'trench-back',
    pieceCode: 'TRENCH-BACK',
    name: 'Trench Vented Storm Back (2. 2)',
    cutInstruction: 'Cut 2 in Gabardine',
    quantity: 2,
    offset: { x: 610, y: 140 },
    grainline: { start: { x: 60, y: 60 }, end: { x: 300, y: 60 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 15 }] },
      { type: 'C', zone: 'neck', points: [{ x: 50, y: 0 }, { x: 120, y: 0 }, { x: 180, y: 0 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 340, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 350, y: 50 }, { x: 335, y: 95 }, { x: 305, y: 120 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 125 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 15 }] },
    ],
    notches: [{ x: 180, y: 0 }, { x: 340, y: 15 }],
    labels: [{ text: 'TRENCH BACK', position: { x: 160, y: 55 }, type: 'title' }],
    measurements: { length: 110.0 },
  };

  return {
    id: 'garment-trench-coat-011',
    name: 'Classic Trench Coat',
    category: 'outerwear',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontPanel, backPanel],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 6. MA-1 Flight Bomber Jacket (8 Pcs)
// ==========================================
export function createBomberJacket(): Garment {
  const frontPanel: PatternComponent = {
    id: 'bomber-front',
    pieceCode: 'BOMBER-FRT',
    name: 'Bomber Front Zip Body (1. 2)',
    cutInstruction: 'Cut 2 in Nylon',
    quantity: 2,
    offset: { x: 230, y: 140 },
    grainline: { start: { x: 40, y: 55 }, end: { x: 220, y: 55 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 30 }] },
      { type: 'C', zone: 'neck', points: [{ x: 30, y: 10 }, { x: 80, y: 0 }, { x: 140, y: 0 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 240, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 250, y: 50 }, { x: 235, y: 90 }, { x: 210, y: 115 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 115 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 30 }] },
    ],
    internals: [
      { id: 'slant-welt-pocket', name: 'Snap Welt Pocket', type: 'pocket', points: [{ x: 110, y: 70 }, { x: 160, y: 85 }], color: '#facc15' },
    ],
    notches: [{ x: 140, y: 0 }, { x: 240, y: 15 }],
    labels: [{ text: 'BOMBER FRONT', position: { x: 110, y: 50 }, type: 'title' }],
    measurements: { length: 65.0, halfChest: 56.0 },
  };

  const backPanel: PatternComponent = {
    id: 'bomber-back',
    pieceCode: 'BOMBER-BACK',
    name: 'Bomber Blouson Back (2. 1)',
    cutInstruction: 'Cut 1 on Fold',
    quantity: 1,
    offset: { x: 520, y: 140 },
    grainline: { start: { x: 40, y: 50 }, end: { x: 220, y: 50 }, label: 'GRAINLINE ↔' },
    paths: [
      { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 15 }] },
      { type: 'C', zone: 'neck', points: [{ x: 40, y: 0 }, { x: 90, y: 0 }, { x: 140, y: 0 }] },
      { type: 'L', zone: 'shoulder', points: [{ x: 240, y: 15 }] },
      { type: 'C', zone: 'armhole', points: [{ x: 250, y: 45 }, { x: 235, y: 85 }, { x: 210, y: 110 }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: 110 }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 15 }] },
    ],
    notches: [{ x: 140, y: 0 }],
    labels: [{ text: 'BOMBER BACK', position: { x: 110, y: 45 }, type: 'title' }],
    measurements: { length: 65.0 },
  };

  return {
    id: 'garment-bomber-jacket-012',
    name: 'MA-1 Flight Bomber Jacket',
    category: 'jacket',
    version: 'tud v4.8',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontPanel, backPanel],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

// ==========================================
// 7. Manual Garment Generator
// Generates custom 1-Object garment from inputs
// ==========================================
export function generateBlankGarmentFromInput(input: import('./types').CustomGarmentInput): Garment {
  const compList: PatternComponent[] = [];
  const startX = 230;
  let currY = 140;

  input.pieces.forEach((p, idx) => {
    const isFront = p.type === 'front';
    const isBack = p.type === 'back';
    const isSleeve = p.type === 'sleeve';
    const isCollar = p.type === 'collar';
    const isPocket = p.type === 'pocket';

    const w = isSleeve ? 240 : isCollar || isPocket ? 140 : 320;
    const h = isSleeve ? 110 : isCollar ? 50 : isPocket ? 40 : 125;

    const comp: PatternComponent = {
      id: `custom-piece-${idx + 1}-${p.pieceCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      pieceCode: p.pieceCode || `P${idx + 1}`,
      name: `${p.name} (${idx + 1}. ${p.quantity})`,
      cutInstruction: p.cutInstruction || `Cut ${p.quantity}`,
      quantity: p.quantity,
      offset: { x: startX + (idx % 2 === 0 ? 0 : 360), y: currY },
      grainline: {
        start: { x: 30, y: h / 2 },
        end: { x: w - 30, y: h / 2 },
        label: `${p.pieceCode || 'GRAINLINE'} ↔`,
      },
      paths: [
        { type: 'M', zone: 'shoulder', points: [{ x: 0, y: isBack ? 15 : 25 }] },
        { type: 'C', zone: 'neck', points: [{ x: w * 0.2, y: 0 }, { x: w * 0.4, y: 0 }, { x: w * 0.6, y: 10 }] },
        { type: 'L', zone: 'shoulder', points: [{ x: w, y: 20 }] },
        { type: 'C', zone: 'armhole', points: [{ x: w + 10, y: h * 0.4 }, { x: w - 10, y: h * 0.8 }, { x: w - 30, y: h }] },
        { type: 'L', zone: 'hem', points: [{ x: 0, y: h }] },
        { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: isBack ? 15 : 25 }] },
      ],
      notches: [{ x: w * 0.6, y: 10 }, { x: w, y: 20 }],
      labels: [{ text: p.pieceCode || p.name, position: { x: w / 2 - 20, y: h / 2 }, type: 'title' }],
      measurements: {
        length: input.measurements.length || 70.0,
        halfChest: (input.measurements.bustChest || 92.0) / 2,
        waist: input.measurements.waist || 78.0,
      },
    };

    compList.push(comp);
    if (idx % 2 === 1) {
      currY += h + 30;
    }
  });

  return {
    id: `custom-garment-${Date.now()}`,
    name: input.name || 'Custom Tailored Pattern',
    category: (input.category as any) || 'custom',
    version: 'tud v4.8',
    baseSize: input.baseSize || 'S',
    currentSize: input.baseSize || 'S',
    position: { x: 0, y: 0 },
    components: compList,
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}




