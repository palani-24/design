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

export function createCasualShirt(): Garment {
  const basic = createDefaultBasicTShirt();
  const front = JSON.parse(JSON.stringify(basic.components[0])) as PatternComponent;
  const back = JSON.parse(JSON.stringify(basic.components[1])) as PatternComponent;
  const sleeve = JSON.parse(JSON.stringify(basic.components[2])) as PatternComponent;

  front.id = 'shirt-front';
  front.name = 'Shirt Front (Placket & Pocket)';
  front.cutInstruction = 'Cut 2 (Left & Right) • 3cm Front Placket';
  front.labels[0].text = 'SHIRT FRONT';
  front.labels[1].text = '1/2 Chest: 52.0cm • Button Stand';

  back.id = 'shirt-back';
  back.name = 'Shirt Back (Yoke & Pleat)';
  back.cutInstruction = 'Cut 1 on Fold • Center Box Pleat';
  back.labels[0].text = 'SHIRT BACK';
  back.labels[1].text = 'Curved Shirttail Hem • +40mm';

  sleeve.id = 'shirt-sleeve';
  sleeve.name = 'Long Sleeve & Placket';
  sleeve.cutInstruction = 'Cut 2 (Pair) • Gauntlet & Cuff';
  sleeve.labels[0].text = 'LONG SLEEVE';
  sleeve.labels[1].text = 'Cap Scye 48.0cm • Length 62.0cm';

  const collarStand: PatternComponent = {
    id: 'shirt-collar',
    name: 'Shirt Collar & Stand',
    cutInstruction: 'Cut 2 (Upper & Under Collar + Interlining)',
    offset: { x: 720, y: 380 },
    grainline: {
      start: { x: 20, y: 50 },
      end: { x: 220, y: 50 },
      label: 'GRAINLINE ↔ COLLAR',
    },
    paths: [
      {
        type: 'M',
        zone: 'neck',
        points: [{ x: 0, y: 40, name: 'Center Back Collar Stand' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 220, y: 40, name: 'Collar Stand Point' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 240, y: 95, name: 'Collar Leaf Point' }],
      },
      {
        type: 'L',
        zone: 'neck',
        points: [{ x: 0, y: 90, name: 'Center Back Leaf' }],
      },
      {
        type: 'Z',
        zone: 'neck',
        points: [{ x: 0, y: 40 }],
      },
    ],
    notches: [
      { x: 110, y: 40, name: 'Shoulder Seam Notch', isNotch: true },
    ],
    labels: [
      { text: 'STAND COLLAR', position: { x: 50, y: 70 }, type: 'title' },
      { text: 'Point Spread 7.5cm', position: { x: 50, y: 85 }, type: 'meta' },
    ],
    measurements: {
      halfChest: 40.0,
    },
  };

  return {
    id: 'garment-shirt-003',
    name: 'Casual Button-Up Shirt',
    category: 'shirt',
    version: 'v1.0',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [front, back, sleeve, collarStand],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
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
      { text: 'Curved Waist Band 4.0cm height', position: { x: 60, y: 58 }, type: 'meta' },
    ],
    measurements: {
      waist: 84.0,
    },
  };

  return {
    id: 'garment-trouser-004',
    name: 'Chino Trouser',
    category: 'trouser',
    version: 'v1.0',
    baseSize: 'S',
    currentSize: 'S',
    position: { x: 0, y: 0 },
    components: [frontLeg, backLeg, waistband],
    sizeTable: DEFAULT_SIZE_TABLE,
    gradeHistory: [],
  };
}

