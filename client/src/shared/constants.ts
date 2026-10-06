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



