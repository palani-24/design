import { Garment, PatternComponent, PatternPathCommand, SizeTable } from './types';
import {
  createDefaultBasicTShirt,
  createPoloTShirt,
  createCasualShirt,
  createChinoTrouser,
  createWomensBootCutPant,
  createMensTailoredSuitJacket,
  createDoubleBreastedBlazer,
  createDenimJeans,
  createFlaredSkirt,
  createSheathDress,
  createTrenchCoat,
  createBomberJacket,
  DEFAULT_SIZE_TABLE,
  MENS_TROUSER_SIZE_TABLE,
} from './constants';
import { createBasicBodice, BASIC_BODICE_SIZE_TABLE } from './easyPatternConstants';

export interface PatternMeasurementDef {
  key: string;
  label: string;
  unit: string;
  placeholder?: string;
  min: number;
  max: number;
  description?: string;
  defaultValue?: number;
}

export interface PatternDefinition {
  id: string;
  name: string;
  category: 'Women' | 'Men' | 'Unisex' | 'Outerwear';
  piecesCount: number;
  description: string;
  baseMeasurements: Record<string, number>;
  measurements: PatternMeasurementDef[];
}

export const PATTERN_DEFINITIONS: PatternDefinition[] = [
  {
    id: 'basic-bodice',
    name: "Women's Basic Bodice",
    category: 'Women',
    piecesCount: 2,
    description: 'Front & Back Sloper with Bust, Waist & Shoulder Darts',
    baseMeasurements: {
      bust: 92.0,
      waist: 72.0,
      hip: 96.0,
      backLength: 42.0,
      shoulderWidth: 13.0,
      armholeDepth: 21.0,
      neckGirth: 37.0,
    },
    measurements: [
      { key: 'bust', label: 'Bust Circumference', unit: 'cm', min: 60, max: 160, placeholder: 'e.g. 92.0', defaultValue: 92.0, description: 'Full circumference around the fullest part of bust' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 50, max: 140, placeholder: 'e.g. 72.0', defaultValue: 72.0, description: 'Natural waistline circumference' },
      { key: 'hip', label: 'Hip Circumference', unit: 'cm', min: 60, max: 170, placeholder: 'e.g. 96.0', defaultValue: 96.0, description: 'Fullest hip circumference' },
      { key: 'backLength', label: 'Back Length (Nape to Waist)', unit: 'cm', min: 30, max: 70, placeholder: 'e.g. 42.0', defaultValue: 42.0, description: 'From prominent neck vertebra (C7) to natural waist' },
      { key: 'shoulderWidth', label: 'Shoulder Width', unit: 'cm', min: 8, max: 25, placeholder: 'e.g. 13.0', defaultValue: 13.0, description: 'From neck base to acromion shoulder tip' },
      { key: 'armholeDepth', label: 'Armhole Depth', unit: 'cm', min: 14, max: 35, placeholder: 'e.g. 21.0', defaultValue: 21.0, description: 'Vertical drop from shoulder to underarm level' },
      { key: 'neckGirth', label: 'Neck Circumference', unit: 'cm', min: 25, max: 55, placeholder: 'e.g. 37.0', defaultValue: 37.0, description: 'Circumference around base of the neck' },
    ],
  },
  {
    id: 'shirt',
    name: "Men's Casual Button-Up Shirt",
    category: 'Men',
    piecesCount: 10,
    description: '10-Piece Shirt with Collar Stand, Yoke, Front Placket & Cuffs',
    baseMeasurements: {
      chest: 100.0,
      waist: 92.0,
      shoulderWidth: 44.0,
      shirtLength: 76.0,
      sleeveLength: 60.0,
      neckGirth: 40.0,
      armholeDepth: 26.0,
      cuffWidth: 11.0,
      collarWidth: 4.5,
    },
    measurements: [
      { key: 'chest', label: 'Chest Circumference', unit: 'cm', min: 70, max: 160, placeholder: 'e.g. 100.0', defaultValue: 100.0, description: 'Full circumference around chest under arms' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 60, max: 150, placeholder: 'e.g. 92.0', defaultValue: 92.0, description: 'Circumference at natural waistline' },
      { key: 'shoulderWidth', label: 'Shoulder Width (Across Back)', unit: 'cm', min: 30, max: 65, placeholder: 'e.g. 44.0', defaultValue: 44.0, description: 'Cross-shoulder distance shoulder point to shoulder point' },
      { key: 'shirtLength', label: 'Shirt Length (Center Back)', unit: 'cm', min: 50, max: 110, placeholder: 'e.g. 76.0', defaultValue: 76.0, description: 'From base of collar stand to curved hem' },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'cm', min: 40, max: 80, placeholder: 'e.g. 60.0', defaultValue: 60.0, description: 'From shoulder tip over elbow to wrist bone' },
      { key: 'neckGirth', label: 'Neck Circumference', unit: 'cm', min: 30, max: 60, placeholder: 'e.g. 40.0', defaultValue: 40.0, description: 'Base collar circumference plus 2cm comfort ease' },
      { key: 'armholeDepth', label: 'Armhole Scye Depth', unit: 'cm', min: 18, max: 40, placeholder: 'e.g. 26.0', defaultValue: 26.0, description: 'Vertical drop for armhole comfort' },
      { key: 'cuffWidth', label: 'Cuff Width', unit: 'cm', min: 8, max: 20, placeholder: 'e.g. 11.0', defaultValue: 11.0, description: 'Half-width around wrist with button overlap' },
      { key: 'collarWidth', label: 'Collar Height', unit: 'cm', min: 2.5, max: 8, placeholder: 'e.g. 4.5', defaultValue: 4.5, description: 'Height of collar leaf' },
    ],
  },
  {
    id: 'trouser',
    name: "Men's Chino Trouser",
    category: 'Men',
    piecesCount: 9,
    description: 'Production 9-Piece Pant with Waistband, Fly, Slash Pockets & Welts',
    baseMeasurements: {
      waist: 84.0,
      hip: 100.0,
      inseam: 78.0,
      outseam: 104.0,
      frontRise: 26.0,
      backRise: 38.0,
      thigh: 62.0,
      knee: 44.0,
      hemWidth: 19.0,
    },
    measurements: [
      { key: 'waist', label: 'Waistband Circumference', unit: 'cm', min: 55, max: 140, placeholder: 'e.g. 84.0', defaultValue: 84.0, description: 'Finished waistband circumference' },
      { key: 'hip', label: 'Hip / Seat Circumference', unit: 'cm', min: 70, max: 160, placeholder: 'e.g. 100.0', defaultValue: 100.0, description: 'Full circumference around seat' },
      { key: 'inseam', label: 'Inseam Length', unit: 'cm', min: 50, max: 110, placeholder: 'e.g. 78.0', defaultValue: 78.0, description: 'From crotch point down to ankle floor' },
      { key: 'outseam', label: 'Outseam Length', unit: 'cm', min: 70, max: 140, placeholder: 'e.g. 104.0', defaultValue: 104.0, description: 'Total length from top of waistband to hem' },
      { key: 'frontRise', label: 'Front Rise', unit: 'cm', min: 18, max: 40, placeholder: 'e.g. 26.0', defaultValue: 26.0, description: 'Waistband to crotch intersection at front' },
      { key: 'backRise', label: 'Back Rise', unit: 'cm', min: 25, max: 55, placeholder: 'e.g. 38.0', defaultValue: 38.0, description: 'Waistband to crotch intersection at back' },
      { key: 'thigh', label: 'Thigh Circumference', unit: 'cm', min: 40, max: 90, placeholder: 'e.g. 62.0', defaultValue: 62.0, description: 'Full circumference around upper thigh' },
      { key: 'knee', label: 'Knee Circumference', unit: 'cm', min: 30, max: 70, placeholder: 'e.g. 44.0', defaultValue: 44.0, description: 'Full circumference at knee line' },
      { key: 'hemWidth', label: 'Hem Opening (Half Width)', unit: 'cm', min: 12, max: 35, placeholder: 'e.g. 19.0', defaultValue: 19.0, description: 'Half flat measurement across bottom hem' },
    ],
  },
  {
    id: 'basic-tshirt',
    name: 'Basic Crew-Neck T-Shirt',
    category: 'Unisex',
    piecesCount: 3,
    description: 'Classic Crew Neckline, Front Bodice, Back Bodice & Short Sleeve',
    baseMeasurements: {
      chest: 96.0,
      bodyLength: 70.0,
      shoulderWidth: 42.0,
      sleeveLength: 22.0,
      neckWidth: 18.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest / Bust Circumference', unit: 'cm', min: 70, max: 160, placeholder: 'e.g. 96.0', defaultValue: 96.0, description: 'Circumference around body at underarm' },
      { key: 'bodyLength', label: 'Body Length (HPS to Hem)', unit: 'cm', min: 50, max: 100, placeholder: 'e.g. 70.0', defaultValue: 70.0, description: 'From high point shoulder straight down to hem' },
      { key: 'shoulderWidth', label: 'Shoulder Width (Across)', unit: 'cm', min: 30, max: 60, placeholder: 'e.g. 42.0', defaultValue: 42.0, description: 'From left shoulder tip to right shoulder tip' },
      { key: 'sleeveLength', label: 'Short Sleeve Length', unit: 'cm', min: 12, max: 40, placeholder: 'e.g. 22.0', defaultValue: 22.0, description: 'From armhole seam to sleeve hem' },
      { key: 'neckWidth', label: 'Neckline Opening Width', unit: 'cm', min: 12, max: 30, placeholder: 'e.g. 18.0', defaultValue: 18.0, description: 'Horizontal collar opening distance' },
    ],
  },
  {
    id: 'polo',
    name: 'Pique Polo T-Shirt',
    category: 'Men',
    piecesCount: 4,
    description: 'Knit Ribbed Collar, Box Placket, Front, Back & Sleeves',
    baseMeasurements: {
      chest: 102.0,
      bodyLength: 72.0,
      shoulderWidth: 45.0,
      sleeveLength: 24.0,
      neckGirth: 41.0,
      placketLength: 16.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest Circumference', unit: 'cm', min: 70, max: 160, placeholder: 'e.g. 102.0', defaultValue: 102.0, description: 'Chest measurement with ease' },
      { key: 'bodyLength', label: 'Body Length', unit: 'cm', min: 50, max: 100, placeholder: 'e.g. 72.0', defaultValue: 72.0, description: 'HPS to hem length' },
      { key: 'shoulderWidth', label: 'Shoulder Width', unit: 'cm', min: 30, max: 60, placeholder: 'e.g. 45.0', defaultValue: 45.0, description: 'Across back shoulder seam length' },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'cm', min: 14, max: 40, placeholder: 'e.g. 24.0', defaultValue: 24.0, description: 'Sleeve length to ribbed cuff' },
      { key: 'neckGirth', label: 'Neck Circumference', unit: 'cm', min: 30, max: 55, placeholder: 'e.g. 41.0', defaultValue: 41.0, description: 'Polo knit collar circumference' },
      { key: 'placketLength', label: 'Front Placket Length', unit: 'cm', min: 10, max: 25, placeholder: 'e.g. 16.0', defaultValue: 16.0, description: 'Depth of front button box placket' },
    ],
  },
  {
    id: 'bootcut-pant',
    name: "Women's Boot Cut Pant",
    category: 'Women',
    piecesCount: 4,
    description: 'Contour Waistband, Fitted Knee & Balanced Boot Cut Flare',
    baseMeasurements: {
      waist: 72.0,
      hip: 96.0,
      inseam: 82.0,
      outseam: 106.0,
      knee: 40.0,
      flareHemWidth: 24.0,
      frontRise: 24.0,
    },
    measurements: [
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 50, max: 130, placeholder: 'e.g. 72.0', defaultValue: 72.0, description: 'Contour waistband circumference' },
      { key: 'hip', label: 'Hip Circumference', unit: 'cm', min: 65, max: 150, placeholder: 'e.g. 96.0', defaultValue: 96.0, description: 'Full hip circumference' },
      { key: 'inseam', label: 'Inseam Length', unit: 'cm', min: 55, max: 110, placeholder: 'e.g. 82.0', defaultValue: 82.0, description: 'Crotch to hem inside leg' },
      { key: 'outseam', label: 'Outseam Length', unit: 'cm', min: 75, max: 140, placeholder: 'e.g. 106.0', defaultValue: 106.0, description: 'Total side seam length' },
      { key: 'knee', label: 'Knee Circumference', unit: 'cm', min: 28, max: 60, placeholder: 'e.g. 40.0', defaultValue: 40.0, description: 'Circumference at knee' },
      { key: 'flareHemWidth', label: 'Flare Hem Opening (Half)', unit: 'cm', min: 16, max: 40, placeholder: 'e.g. 24.0', defaultValue: 24.0, description: 'Half flat measurement at boot flare' },
      { key: 'frontRise', label: 'Front Rise', unit: 'cm', min: 16, max: 36, placeholder: 'e.g. 24.0', defaultValue: 24.0, description: 'Front waist to crotch seam' },
    ],
  },
  {
    id: 'denim-jeans',
    name: '5-Pocket Raw Denim Jeans',
    category: 'Unisex',
    piecesCount: 5,
    description: 'Coin Pocket, Curved Back Yoke, Front & Back Legs, Waistband',
    baseMeasurements: {
      waist: 82.0,
      hip: 98.0,
      inseam: 80.0,
      outseam: 105.0,
      thigh: 58.0,
      knee: 42.0,
      legOpening: 18.0,
      frontRise: 27.0,
    },
    measurements: [
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 55, max: 140, placeholder: 'e.g. 82.0', defaultValue: 82.0, description: 'Denim waistband measurement' },
      { key: 'hip', label: 'Hip Circumference', unit: 'cm', min: 70, max: 160, placeholder: 'e.g. 98.0', defaultValue: 98.0, description: 'Seat circumference at fullest part' },
      { key: 'inseam', label: 'Inseam Length', unit: 'cm', min: 55, max: 115, placeholder: 'e.g. 80.0', defaultValue: 80.0, description: 'Inside leg length' },
      { key: 'outseam', label: 'Outseam Length', unit: 'cm', min: 75, max: 145, placeholder: 'e.g. 105.0', defaultValue: 105.0, description: 'Total outer seam' },
      { key: 'thigh', label: 'Thigh Circumference', unit: 'cm', min: 40, max: 85, placeholder: 'e.g. 58.0', defaultValue: 58.0, description: 'Thigh circumference below crotch' },
      { key: 'knee', label: 'Knee Circumference', unit: 'cm', min: 28, max: 65, placeholder: 'e.g. 42.0', defaultValue: 42.0, description: 'Knee circumference' },
      { key: 'legOpening', label: 'Leg Opening (Half)', unit: 'cm', min: 12, max: 30, placeholder: 'e.g. 18.0', defaultValue: 18.0, description: 'Half flat ankle opening' },
      { key: 'frontRise', label: 'Front Rise', unit: 'cm', min: 18, max: 40, placeholder: 'e.g. 27.0', defaultValue: 27.0, description: 'Front rise to top of waistband' },
    ],
  },
  {
    id: 'flared-skirt',
    name: '8-Gore A-Line Flared Skirt',
    category: 'Women',
    piecesCount: 2,
    description: 'Two-Piece Tailored Flared Skirt with Balanced Sweeping Hemline',
    baseMeasurements: {
      waist: 68.0,
      hip: 94.0,
      skirtLength: 58.0,
      sweepWidth: 130.0,
    },
    measurements: [
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 50, max: 130, placeholder: 'e.g. 68.0', defaultValue: 68.0, description: 'Circumference at natural waist' },
      { key: 'hip', label: 'Hip Circumference', unit: 'cm', min: 65, max: 150, placeholder: 'e.g. 94.0', defaultValue: 94.0, description: 'Circumference at hip level (20cm below waist)' },
      { key: 'skirtLength', label: 'Skirt Length (Waist to Hem)', unit: 'cm', min: 35, max: 120, placeholder: 'e.g. 58.0', defaultValue: 58.0, description: 'Vertical length of skirt' },
      { key: 'sweepWidth', label: 'Total Hem Sweep Width', unit: 'cm', min: 80, max: 250, placeholder: 'e.g. 130.0', defaultValue: 130.0, description: 'Full circumference sweep at hem' },
    ],
  },
  {
    id: 'sheath-dress',
    name: 'Princess Seam Sheath Dress',
    category: 'Women',
    piecesCount: 3,
    description: 'Form-Fitted Couture Bodice, Princess Seams & Rear Kick Vent',
    baseMeasurements: {
      bust: 90.0,
      waist: 70.0,
      hip: 96.0,
      dressLength: 102.0,
      shoulderWidth: 12.5,
      armholeDepth: 20.0,
    },
    measurements: [
      { key: 'bust', label: 'Bust Circumference', unit: 'cm', min: 65, max: 150, placeholder: 'e.g. 90.0', defaultValue: 90.0, description: 'Fullest bust measurement' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 50, max: 130, placeholder: 'e.g. 70.0', defaultValue: 70.0, description: 'Fitted natural waistline' },
      { key: 'hip', label: 'Hip Circumference', unit: 'cm', min: 65, max: 150, placeholder: 'e.g. 96.0', defaultValue: 96.0, description: 'Fullest hip measurement' },
      { key: 'dressLength', label: 'Total Dress Length (HPS to Hem)', unit: 'cm', min: 70, max: 150, placeholder: 'e.g. 102.0', defaultValue: 102.0, description: 'Shoulder neck to bottom hem' },
      { key: 'shoulderWidth', label: 'Shoulder Seam Length', unit: 'cm', min: 8, max: 22, placeholder: 'e.g. 12.5', defaultValue: 12.5, description: 'Neck point to shoulder tip' },
      { key: 'armholeDepth', label: 'Armhole Depth', unit: 'cm', min: 14, max: 32, placeholder: 'e.g. 20.0', defaultValue: 20.0, description: 'Fitted armhole scye depth' },
    ],
  },
  {
    id: 'suit-jacket',
    name: "Men's Tailored Suit Jacket",
    category: 'Men',
    piecesCount: 16,
    description: 'Two-Button Notch Lapel, Chest Canvas, Side Bodies & Sleeves',
    baseMeasurements: {
      chest: 104.0,
      waist: 90.0,
      hip: 102.0,
      jacketLength: 78.0,
      shoulderWidth: 46.0,
      sleeveLength: 64.0,
      armholeDepth: 27.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest Circumference', unit: 'cm', min: 75, max: 160, placeholder: 'e.g. 104.0', defaultValue: 104.0, description: 'Chest measurement over shirt' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 60, max: 150, placeholder: 'e.g. 90.0', defaultValue: 90.0, description: 'Fitted jacket waist' },
      { key: 'hip', label: 'Low Hip Circumference', unit: 'cm', min: 75, max: 160, placeholder: 'e.g. 102.0', defaultValue: 102.0, description: 'Circumference at jacket hem line' },
      { key: 'jacketLength', label: 'Jacket Length (Center Back)', unit: 'cm', min: 60, max: 110, placeholder: 'e.g. 78.0', defaultValue: 78.0, description: 'Collar seam to back hem' },
      { key: 'shoulderWidth', label: 'Shoulder Width (Across Back)', unit: 'cm', min: 32, max: 65, placeholder: 'e.g. 46.0', defaultValue: 46.0, description: 'Total shoulder breadth with pad allowance' },
      { key: 'sleeveLength', label: 'Two-Piece Sleeve Length', unit: 'cm', min: 45, max: 80, placeholder: 'e.g. 64.0', defaultValue: 64.0, description: 'Crown to finished sleeve cuff' },
      { key: 'armholeDepth', label: 'Armhole Depth', unit: 'cm', min: 18, max: 38, placeholder: 'e.g. 27.0', defaultValue: 27.0, description: 'Armhole scye allowance' },
    ],
  },
  {
    id: 'double-breasted-blazer',
    name: 'DB Peak Lapel Blazer',
    category: 'Men',
    piecesCount: 12,
    description: 'Overlapping Button Wrap, Peak Lapel, Tailored Shoulder Structure',
    baseMeasurements: {
      chest: 106.0,
      waist: 92.0,
      jacketLength: 79.0,
      shoulderWidth: 47.0,
      sleeveLength: 65.0,
      lapelOverlap: 12.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest Circumference', unit: 'cm', min: 75, max: 160, placeholder: 'e.g. 106.0', defaultValue: 106.0, description: 'Chest circumference' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 60, max: 150, placeholder: 'e.g. 92.0', defaultValue: 92.0, description: 'Waist circumference' },
      { key: 'jacketLength', label: 'Blazer Length', unit: 'cm', min: 60, max: 110, placeholder: 'e.g. 79.0', defaultValue: 79.0, description: 'Center back length' },
      { key: 'shoulderWidth', label: 'Shoulder Width', unit: 'cm', min: 32, max: 65, placeholder: 'e.g. 47.0', defaultValue: 47.0, description: 'Shoulder width across back' },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'cm', min: 45, max: 80, placeholder: 'e.g. 65.0', defaultValue: 65.0, description: 'Crown to cuff length' },
      { key: 'lapelOverlap', label: 'Front Lapel Overlap Width', unit: 'cm', min: 6, max: 22, placeholder: 'e.g. 12.0', defaultValue: 12.0, description: 'Overlapping double-breasted wrap distance' },
    ],
  },
  {
    id: 'trench-coat',
    name: 'Classic Belted Trench Coat',
    category: 'Outerwear',
    piecesCount: 14,
    description: 'Storm Flaps, Epaulettes, Gun Flap, Deep Vent & Buckled Belt',
    baseMeasurements: {
      chest: 108.0,
      waist: 94.0,
      coatLength: 110.0,
      shoulderWidth: 48.0,
      sleeveLength: 65.0,
      beltLength: 140.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest / Bust Circumference (With Coat Ease)', unit: 'cm', min: 75, max: 160, placeholder: 'e.g. 108.0', defaultValue: 108.0, description: 'Chest measurement with coat ease' },
      { key: 'waist', label: 'Waist Circumference', unit: 'cm', min: 60, max: 150, placeholder: 'e.g. 94.0', defaultValue: 94.0, description: 'Waist circumference' },
      { key: 'coatLength', label: 'Coat Length (Center Back)', unit: 'cm', min: 75, max: 140, placeholder: 'e.g. 110.0', defaultValue: 110.0, description: 'Total length to knee or below' },
      { key: 'shoulderWidth', label: 'Shoulder Width', unit: 'cm', min: 32, max: 65, placeholder: 'e.g. 48.0', defaultValue: 48.0, description: 'Shoulder point to shoulder point' },
      { key: 'sleeveLength', label: 'Raglan Sleeve Length', unit: 'cm', min: 45, max: 80, placeholder: 'e.g. 65.0', defaultValue: 65.0, description: 'Neck point over shoulder to wrist' },
      { key: 'beltLength', label: 'Waist Belt Length', unit: 'cm', min: 90, max: 200, placeholder: 'e.g. 140.0', defaultValue: 140.0, description: 'Total buckle belt length' },
    ],
  },
  {
    id: 'bomber-jacket',
    name: 'MA-1 Flight Bomber Jacket',
    category: 'Outerwear',
    piecesCount: 8,
    description: 'Raglan Sleeve, Ribbed Knit Collar, Waist & Welt Pockets',
    baseMeasurements: {
      chest: 108.0,
      waistRib: 86.0,
      bodyLength: 66.0,
      shoulderWidth: 48.0,
      sleeveLength: 63.0,
      cuffRibWidth: 8.0,
    },
    measurements: [
      { key: 'chest', label: 'Chest Circumference', unit: 'cm', min: 75, max: 160, placeholder: 'e.g. 108.0', defaultValue: 108.0, description: 'Full chest circumference with bomber volume' },
      { key: 'waistRib', label: 'Waist Rib Knit Circumference', unit: 'cm', min: 55, max: 140, placeholder: 'e.g. 86.0', defaultValue: 86.0, description: 'Snug bottom elastic rib circumference' },
      { key: 'bodyLength', label: 'Jacket Body Length', unit: 'cm', min: 45, max: 95, placeholder: 'e.g. 66.0', defaultValue: 66.0, description: 'HPS to bottom of rib' },
      { key: 'shoulderWidth', label: 'Shoulder Breadth', unit: 'cm', min: 32, max: 65, placeholder: 'e.g. 48.0', defaultValue: 48.0, description: 'Drop shoulder breadth' },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'cm', min: 45, max: 80, placeholder: 'e.g. 63.0', defaultValue: 63.0, description: 'Sleeve including knit wrist cuff' },
      { key: 'cuffRibWidth', label: 'Cuff Rib Width', unit: 'cm', min: 4, max: 16, placeholder: 'e.g. 8.0', defaultValue: 8.0, description: 'Rib knit cuff width' },
    ],
  },
];

export function getPatternDefinition(id: string): PatternDefinition | undefined {
  return PATTERN_DEFINITIONS.find((p) => p.id === id);
}

/**
 * Validates that all required measurements for the selected pattern exist and are valid numbers > 0.
 */
export function validatePatternMeasurements(
  patternIdOrDef: string | PatternDefinition,
  enteredValues: Record<string, number | undefined>
): {
  valid: boolean;
  errors: Record<string, string>;
  missingFields: string[];
} {
  const pattern = typeof patternIdOrDef === 'string'
    ? getPatternDefinition(patternIdOrDef)
    : patternIdOrDef;
  if (!pattern) {
    return {
      valid: false,
      errors: { pattern: 'Unknown pattern selected' },
      missingFields: ['pattern'],
    };
  }

  const errors: Record<string, string> = {};
  const missingFields: string[] = [];

  for (const field of pattern.measurements) {
    const val = enteredValues[field.key];
    if (val === undefined || val === null || isNaN(val) || val <= 0) {
      errors[field.key] = `${field.label} is required and must be greater than 0`;
      missingFields.push(field.label);
    } else if (val < field.min * 0.5 || val > field.max * 1.8) {
      errors[field.key] = `${field.label} must be between ${Math.round(field.min * 0.5)} and ${Math.round(field.max * 1.8)} ${field.unit}`;
      missingFields.push(field.label);
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    missingFields,
  };
}

/**
 * Scales piece path coordinates in X and Y dimensions.
 */
function scaleComponent(comp: PatternComponent, scaleX: number, scaleY: number): PatternComponent {
  const scaledPaths: PatternPathCommand[] = comp.paths.map((cmd) => ({
    ...cmd,
    points: cmd.points.map((pt) => ({
      ...pt,
      x: Math.round(pt.x * scaleX * 10) / 10,
      y: Math.round(pt.y * scaleY * 10) / 10,
    })),
  }));

  const scaledNotches = comp.notches.map((n) => ({
    ...n,
    x: Math.round(n.x * scaleX * 10) / 10,
    y: Math.round(n.y * scaleY * 10) / 10,
  }));

  const scaledInternals = comp.internals?.map((int) => ({
    ...int,
    points: int.points.map((pt) => ({
      ...pt,
      x: Math.round(pt.x * scaleX * 10) / 10,
      y: Math.round(pt.y * scaleY * 10) / 10,
    })),
  }));

  const scaledLabels = comp.labels.map((lbl) => ({
    ...lbl,
    position: {
      x: Math.round(lbl.position.x * scaleX),
      y: Math.round(lbl.position.y * scaleY),
    },
  }));

  const grainline = comp.grainline
    ? {
        ...comp.grainline,
        start: {
          x: Math.round(comp.grainline.start.x * scaleX),
          y: Math.round(comp.grainline.start.y * scaleY),
        },
        end: {
          x: Math.round(comp.grainline.end.x * scaleX),
          y: Math.round(comp.grainline.end.y * scaleY),
        },
      }
    : {
        start: { x: 30, y: 50 },
        end: { x: 150, y: 50 },
        label: 'GRAINLINE ↕',
      };

  return {
    ...comp,
    paths: scaledPaths,
    notches: scaledNotches,
    internals: scaledInternals,
    labels: scaledLabels,
    grainline,
  };
}

/**
 * Builds Men's Shirt parametric pattern using the exact entered measurements.
 */
function buildParametricMensShirt(m: Record<string, number>): Garment {
  const chest = m.chest || 100;
  const waist = m.waist || 92;
  const shoulderWidth = m.shoulderWidth || 44;
  const shirtLength = m.shirtLength || 76;
  const sleeveLength = m.sleeveLength || 60;
  const neckGirth = m.neckGirth || 40;
  const armholeDepth = m.armholeDepth || 26;
  const cuffWidthVal = m.cuffWidth || 11;
  const collarWidthVal = m.collarWidth || 4.5;

  const totalChest = chest + 4; // 4cm ease
  const frontWidth = Math.round((totalChest / 4) * 10);
  const backLen = Math.round(shirtLength * 10);
  const scyeDepth = Math.round(armholeDepth * 10);
  const slvLen = Math.round(sleeveLength * 10);
  const cuffW = Math.round(cuffWidthVal * 20);
  const collarW = Math.round((neckGirth + 4) * 10);
  const collarHt = Math.round(collarWidthVal * 10);
  const yokeW = Math.round(shoulderWidth * 10);
  const sa = 10; // 1cm

  const components: PatternComponent[] = [
    // 1. FRONT
    {
      id: 'shirt-front',
      pieceCode: 'FR',
      name: "Men's Shirt (Front Piece)",
      cutInstruction: 'Cut 2 (Left & Right) • 3cm Front Placket Fold',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: 0, y: 0 },
      grainline: { start: { x: 45, y: 120 }, end: { x: 45, y: Math.max(160, backLen - 60) }, label: 'GRAINLINE ↕ CF' },
      paths: [
        { type: 'M', zone: 'center-fold', points: [{ x: 0, y: 70, name: 'Center Front Neck' }] },
        { type: 'C', zone: 'neck', points: [{ x: 20, y: 70, isControl: true }, { x: 55, y: 30, isControl: true }, { x: 70, y: 0, name: 'HPS Neck Point' }], annotation: 'Neck Curve' },
        { type: 'L', zone: 'shoulder', points: [{ x: 185, y: 25, name: 'Front Shoulder Tip' }], annotation: 'Shoulder Seam' },
        { type: 'C', zone: 'armhole', points: [{ x: 190, y: 150, isControl: true }, { x: 210, y: 240, isControl: true }, { x: frontWidth, y: scyeDepth, name: 'Underarm Scye Point' }], annotation: 'Armhole Scye' },
        { type: 'L', zone: 'waist', points: [{ x: frontWidth, y: backLen, name: 'Side Hem Point' }], annotation: 'Side Seam' },
        { type: 'L', zone: 'hem', points: [{ x: 0, y: backLen, name: 'Center Front Hem' }], annotation: 'Hem Width' },
        { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 70 }] },
      ],
      notches: [{ x: 205, y: 160, name: 'Armhole Front Notch', isNotch: true }, { x: 30, y: backLen, name: 'Placket Fold Notch', isNotch: true }],
      internals: [{ id: 'front-placket-line', name: 'Placket Fold Line (3cm)', type: 'line', points: [{ x: 30, y: 70 }, { x: 30, y: backLen }], color: '#16a34a' }],
      labels: [
        { text: 'SHIRT FRONT', position: { x: 90, y: 210 }, type: 'title' },
        { text: `Chest: ${chest}cm • Length: ${shirtLength}cm`, position: { x: 55, y: 240 }, type: 'meta' },
      ],
      measurements: { chest, waist, halfChest: totalChest / 2, length: shirtLength, armholeDepth },
    },
    // 2. BACK
    {
      id: 'shirt-back',
      pieceCode: 'BK',
      name: "Men's Shirt (Back Piece)",
      cutInstruction: 'Cut 1 on Fold • Center Fold Line',
      quantity: 1,
      seamAllowanceMm: sa,
      offset: { x: frontWidth + 50, y: 0 },
      grainline: { start: { x: 40, y: 100 }, end: { x: 40, y: Math.max(160, backLen - 60) }, label: 'GRAINLINE ↕ CB FOLD' },
      paths: [
        { type: 'M', zone: 'center-fold', points: [{ x: 0, y: 0, name: 'Back Yoke Seam Center' }] },
        { type: 'L', zone: 'shoulder', points: [{ x: Math.round(yokeW / 2), y: 0, name: 'Back Yoke Armhole Point' }] },
        { type: 'C', zone: 'armhole', points: [{ x: Math.round(yokeW / 2), y: 80, isControl: true }, { x: frontWidth - 10, y: 140, isControl: true }, { x: frontWidth, y: scyeDepth - 10, name: 'Back Scye Underarm' }] },
        { type: 'L', zone: 'waist', points: [{ x: frontWidth, y: backLen, name: 'Back Side Hem Point' }] },
        { type: 'L', zone: 'hem', points: [{ x: 0, y: backLen, name: 'Back Center Hem Point' }] },
        { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: Math.round(yokeW / 2), y: 40, name: 'Back Scye Notch', isNotch: true }],
      labels: [
        { text: 'SHIRT BACK', position: { x: 90, y: 210 }, type: 'title' },
        { text: `Chest: ${chest}cm • Back Length: ${shirtLength}cm`, position: { x: 50, y: 240 }, type: 'meta' },
      ],
      measurements: { chest, waist, length: shirtLength, shoulderWidth },
    },
    // 3. SLEEVE
    {
      id: 'shirt-sleeve',
      pieceCode: 'SL',
      name: "Men's Shirt (Sleeve)",
      cutInstruction: 'Cut 2 (Left & Right Pair) • Symmetrical',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: 0, y: backLen + 40 },
      grainline: { start: { x: Math.round(scyeDepth * 0.9), y: 50 }, end: { x: Math.round(scyeDepth * 0.9), y: slvLen - 40 }, label: 'GRAINLINE ↕ CENTER' },
      paths: [
        { type: 'M', zone: 'sleeve-cap', points: [{ x: Math.round(scyeDepth * 0.9), y: 0, name: 'Sleeve Crown Apex' }] },
        { type: 'C', zone: 'sleeve-cap', points: [{ x: Math.round(scyeDepth * 1.4), y: 10, isControl: true }, { x: Math.round(scyeDepth * 1.7), y: 80, isControl: true }, { x: Math.round(scyeDepth * 1.8), y: 140, name: 'Front Bicep Corner' }] },
        { type: 'L', zone: 'sleeve-seam', points: [{ x: Math.round(cuffW * 0.8), y: slvLen, name: 'Front Cuff Seam' }] },
        { type: 'L', zone: 'sleeve-hem', points: [{ x: 40, y: slvLen, name: 'Back Cuff Seam' }] },
        { type: 'L', zone: 'sleeve-seam', points: [{ x: 0, y: 140, name: 'Back Bicep Corner' }] },
        { type: 'C', zone: 'sleeve-cap', points: [{ x: 10, y: 80, isControl: true }, { x: Math.round(scyeDepth * 0.4), y: 10, isControl: true }, { x: Math.round(scyeDepth * 0.9), y: 0 }] },
        { type: 'Z', zone: 'sleeve-cap', points: [{ x: Math.round(scyeDepth * 0.9), y: 0 }] },
      ],
      notches: [{ x: Math.round(scyeDepth * 0.9), y: 0, name: 'Crown Notch', isNotch: true }],
      labels: [
        { text: 'SHIRT SLEEVE', position: { x: Math.round(scyeDepth * 0.9) - 40, y: 180 }, type: 'title' },
        { text: `Length: ${sleeveLength}cm`, position: { x: Math.round(scyeDepth * 0.9) - 35, y: 210 }, type: 'meta' },
      ],
      measurements: { sleeveLength, cuffWidth: cuffWidthVal },
    },
    // 4. COLLAR STAND
    {
      id: 'shirt-collar-stand',
      pieceCode: 'CS',
      name: 'Collar Stand',
      cutInstruction: 'Cut 2 (Interfaced)',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: frontWidth + 50, y: backLen + 40 },
      grainline: { start: { x: 30, y: 18 }, end: { x: Math.min(200, collarW - 30), y: 18 }, label: 'GRAINLINE ↔' },
      paths: [
        { type: 'M', zone: 'neck', points: [{ x: 0, y: 0 }] },
        { type: 'L', zone: 'neck', points: [{ x: Math.round(collarW / 2), y: 0 }] },
        { type: 'C', zone: 'neck', points: [{ x: Math.round(collarW / 2) + 20, y: 5, isControl: true }, { x: Math.round(collarW / 2) + 25, y: 25, isControl: true }, { x: Math.round(collarW / 2) + 10, y: 35 }] },
        { type: 'L', zone: 'neck', points: [{ x: 0, y: 35 }] },
        { type: 'Z', zone: 'neck', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: 0, y: 0, name: 'Center Back Notch', isNotch: true }],
      labels: [{ text: 'COLLAR STAND', position: { x: 40, y: 22 }, type: 'title' }],
      measurements: { neckGirth, collarWidth: collarWidthVal },
    },
    // 5. BACK YOKE
    {
      id: 'shirt-yoke',
      pieceCode: 'YK',
      name: 'Back Yoke',
      cutInstruction: 'Cut 2 (Outer & Facing)',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: frontWidth + 50, y: backLen + 110 },
      grainline: { start: { x: 30, y: 40 }, end: { x: Math.min(220, yokeW / 2 - 20), y: 40 }, label: 'GRAINLINE ↔ CB' },
      paths: [
        { type: 'M', zone: 'center-fold', points: [{ x: 0, y: 0 }] },
        { type: 'L', zone: 'neck', points: [{ x: 45, y: 0 }] },
        { type: 'L', zone: 'shoulder', points: [{ x: Math.round(yokeW / 2), y: 25 }] },
        { type: 'L', zone: 'armhole', points: [{ x: Math.round(yokeW / 2) - 10, y: 85 }] },
        { type: 'L', zone: 'waist', points: [{ x: 0, y: 85 }] },
        { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: 0, y: 0, name: 'CB Notch', isNotch: true }],
      labels: [{ text: 'BACK YOKE', position: { x: 35, y: 45 }, type: 'title' }],
      measurements: { shoulderWidth },
    },
  ];

  return {
    id: `shirt-custom-${Date.now()}`,
    name: "Men's Casual Button-Up Shirt (Custom Fitted)",
    category: 'shirt',
    version: 'tud v4.8',
    baseSize: 'M',
    currentSize: 'M',
    position: { x: 0, y: 0 },
    components,
    sizeTable: DEFAULT_SIZE_TABLE,
    measurements: { ...m },
  };
}

/**
 * Builds Men's Trouser parametric pattern using the exact entered measurements.
 */
function buildParametricMensTrouser(m: Record<string, number>): Garment {
  const waist = m.waist || 84;
  const hip = m.hip || 100;
  const inseam = m.inseam || 78;
  const outseam = m.outseam || 104;
  const frontRise = m.frontRise || 26;
  const backRise = m.backRise || 38;
  const thigh = m.thigh || 62;
  const knee = m.knee || 44;
  const hemWidthVal = m.hemWidth || 19;

  const wWaist = Math.round((waist / 4) * 10);
  const wHip = Math.round((hip / 4) * 10);
  const totalLen = Math.round(outseam * 10);
  const fCrotchY = Math.round(frontRise * 10);
  const bCrotchY = Math.round(backRise * 10);
  const kneeY = Math.round(fCrotchY + (inseam * 10) * 0.5);
  const halfHem = Math.round(hemWidthVal * 10);
  const halfKnee = Math.round((knee / 2) * 10);
  const sa = 10;

  const components: PatternComponent[] = [
    // 1. FRONT LEG
    {
      id: 'trouser-front-leg',
      pieceCode: 'P-FR',
      name: 'Front Trouser Leg',
      cutInstruction: 'Cut 2 in Shell (Left & Right Pair)',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: 40, y: 30 },
      grainline: { start: { x: Math.round(wHip * 0.55), y: 80 }, end: { x: Math.round(wHip * 0.55), y: totalLen - 60 }, label: 'GRAINLINE ↕ CREASE LINE' },
      paths: [
        { type: 'M', zone: 'waist', points: [{ x: 0, y: 0, name: 'CF Waist' }] },
        { type: 'L', zone: 'waist', points: [{ x: wWaist, y: 0, name: 'Side Waist' }] },
        { type: 'C', zone: 'hip', points: [{ x: wWaist + 15, y: 80, isControl: true }, { x: wHip + 10, y: 150, isControl: true }, { x: wHip, y: fCrotchY, name: 'Side Hip at Crotch Level' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wHip * 0.55) + Math.round(halfKnee / 2), y: kneeY, name: 'Knee Side Seam' }] },
        { type: 'L', zone: 'hem', points: [{ x: Math.round(wHip * 0.55) + Math.round(halfHem / 2), y: totalLen, name: 'Hem Outseam' }] },
        { type: 'L', zone: 'hem', points: [{ x: Math.round(wHip * 0.55) - Math.round(halfHem / 2), y: totalLen, name: 'Hem Inseam' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wHip * 0.55) - Math.round(halfKnee / 2), y: kneeY, name: 'Knee Inseam' }] },
        { type: 'C', zone: 'crotch', points: [{ x: 30, y: kneeY - 80, isControl: true }, { x: 55, y: fCrotchY + 30, isControl: true }, { x: 45, y: fCrotchY, name: 'Front Crotch Fork' }] },
        { type: 'C', zone: 'crotch', points: [{ x: 25, y: fCrotchY - 50, isControl: true }, { x: 5, y: 80, isControl: true }, { x: 0, y: 0, name: 'CF Waist Point' }] },
        { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: Math.round(wHip * 0.55), y: totalLen, name: 'Hem Crease Notch', isNotch: true }],
      labels: [
        { text: 'FRONT LEG', position: { x: Math.round(wHip * 0.55) - 30, y: 220 }, type: 'title' },
        { text: `Waist: ${waist}cm • Inseam: ${inseam}cm`, position: { x: Math.round(wHip * 0.55) - 45, y: 250 }, type: 'meta' },
      ],
      measurements: { waist, hip, inseam, outseam, frontRise },
    },
    // 2. BACK LEG
    {
      id: 'trouser-back-leg',
      pieceCode: 'P-BK',
      name: 'Back Trouser Leg',
      cutInstruction: 'Cut 2 in Shell (Left & Right Pair)',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: wHip + 140, y: 30 },
      grainline: { start: { x: Math.round(wHip * 0.65), y: 80 }, end: { x: Math.round(wHip * 0.65), y: totalLen - 60 }, label: 'GRAINLINE ↕ CB CREASE' },
      paths: [
        { type: 'M', zone: 'waist', points: [{ x: 0, y: -25, name: 'CB Waist Apex' }] },
        { type: 'L', zone: 'waist', points: [{ x: wWaist + 20, y: 0, name: 'Back Side Waist' }] },
        { type: 'C', zone: 'hip', points: [{ x: wWaist + 30, y: 90, isControl: true }, { x: wHip + 25, y: 160, isControl: true }, { x: wHip + 15, y: bCrotchY - 30, name: 'Back Hip Outseam' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wHip * 0.65) + Math.round(halfKnee / 2) + 15, y: kneeY, name: 'Back Knee Outseam' }] },
        { type: 'L', zone: 'hem', points: [{ x: Math.round(wHip * 0.65) + Math.round(halfHem / 2) + 10, y: totalLen, name: 'Back Hem Outseam' }] },
        { type: 'L', zone: 'hem', points: [{ x: Math.round(wHip * 0.65) - Math.round(halfHem / 2) - 10, y: totalLen, name: 'Back Hem Inseam' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wHip * 0.65) - Math.round(halfKnee / 2) - 15, y: kneeY, name: 'Back Knee Inseam' }] },
        { type: 'C', zone: 'crotch', points: [{ x: 30, y: kneeY - 80, isControl: true }, { x: 75, y: bCrotchY + 30, isControl: true }, { x: 80, y: bCrotchY, name: 'Back Crotch Point' }] },
        { type: 'C', zone: 'crotch', points: [{ x: 40, y: bCrotchY - 80, isControl: true }, { x: 10, y: 50, isControl: true }, { x: 0, y: -25 }] },
        { type: 'Z', zone: 'waist', points: [{ x: 0, y: -25 }] },
      ],
      notches: [{ x: Math.round(wHip * 0.65), y: totalLen, name: 'CB Hem Notch', isNotch: true }],
      labels: [
        { text: 'BACK LEG', position: { x: Math.round(wHip * 0.65) - 30, y: 220 }, type: 'title' },
        { text: `Hip: ${hip}cm • Outseam: ${outseam}cm`, position: { x: Math.round(wHip * 0.65) - 40, y: 250 }, type: 'meta' },
      ],
      measurements: { waist, hip, inseam, outseam, backRise },
    },
    // 3. WAISTBAND
    {
      id: 'trouser-waistband',
      pieceCode: 'P-WB',
      name: 'Curved Waistband',
      cutInstruction: 'Cut 2 in Shell + Interfacing',
      quantity: 2,
      seamAllowanceMm: sa,
      offset: { x: 40, y: totalLen + 50 },
      grainline: { start: { x: 30, y: 20 }, end: { x: Math.min(300, Math.round(waist * 5)), y: 20 }, label: 'GRAINLINE ↔' },
      paths: [
        { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round((waist / 2 + 5) * 10), y: 0 }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round((waist / 2 + 5) * 10), y: 40 }] },
        { type: 'L', zone: 'waist', points: [{ x: 0, y: 40 }] },
        { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: Math.round((waist / 4) * 10), y: 0, name: 'Side Seam Notch', isNotch: true }],
      labels: [{ text: 'WAISTBAND', position: { x: 60, y: 25 }, type: 'title' }],
      measurements: { waist },
    },
  ];

  return {
    id: `trouser-custom-${Date.now()}`,
    name: "Men's Chino Trouser (Custom Fitted)",
    category: 'trouser',
    version: 'tud v4.8',
    baseSize: 'M',
    currentSize: 'M',
    position: { x: 0, y: 0 },
    components,
    sizeTable: MENS_TROUSER_SIZE_TABLE,
    measurements: { ...m },
  };
}

/**
 * Builds authentic Women's Basic Bodice using exact entered measurements.
 */
function buildParametricBasicBodice(m: Record<string, number>): Garment {
  const bust = m.bust || 92;
  const waist = m.waist || 72;
  const hip = m.hip || 96;
  const backLength = m.backLength || 42;
  const shoulderWidth = m.shoulderWidth || 13;
  const armholeDepth = m.armholeDepth || 21;
  const neckGirth = m.neckGirth || 37;

  const baseBodice = createBasicBodice();
  const baseBust = 92;
  const baseWaist = 72;
  const baseLen = 42;

  const scaleX = bust / baseBust;
  const scaleY = backLength / baseLen;

  const scaledComponents = baseBodice.components.map((c) => {
    const isFront = c.id.includes('front');
    const scaled = scaleComponent(c, scaleX, scaleY);
    return {
      ...scaled,
      name: isFront ? "Women's Front Bodice (Custom Fitted)" : "Women's Back Bodice (Custom Fitted)",
      labels: [
        ...scaled.labels,
        {
          text: `Bust: ${bust}cm • Waist: ${waist}cm • Back Len: ${backLength}cm`,
          position: { x: 50, y: 360 },
          type: 'meta' as const,
        },
      ],
      measurements: {
        ...c.measurements,
        bust,
        waist,
        hip,
        length: backLength,
        shoulderWidth,
        armholeDepth,
        neckCircumference: neckGirth,
      },
    };
  });

  return {
    ...baseBodice,
    id: `bodice-custom-${Date.now()}`,
    name: "Women's Basic Bodice (Custom Fitted)",
    components: scaledComponents,
    sizeTable: BASIC_BODICE_SIZE_TABLE,
    measurements: { ...m },
  };
}

/**
 * Main Pattern Generation Engine:
 * Generates ONLY the selected pattern using the exact entered measurements.
 */
export function generatePatternFromMeasurements(
  patternId: string,
  measurements: Record<string, number>,
  unit: 'cm' | 'in' = 'cm'
): Garment {
  const patternDef = getPatternDefinition(patternId);
  const patternName = patternDef ? patternDef.name : patternId;

  // 1. Shirt
  if (patternId === 'shirt') {
    return buildParametricMensShirt(measurements);
  }

  // 2. Trouser
  if (patternId === 'trouser') {
    return buildParametricMensTrouser(measurements);
  }

  // 3. Basic Bodice
  if (patternId === 'basic-bodice') {
    return buildParametricBasicBodice(measurements);
  }

  // 4. Other Archetypes: Load base template and precisely scale/parameterize coordinates
  let baseGarment: Garment;
  let baseWidthKey = 'chest';
  let baseLengthKey = 'length';
  let nominalBaseWidth = 100;
  let nominalBaseLength = 70;

  if (patternId === 'basic-tshirt') {
    baseGarment = createDefaultBasicTShirt();
    baseWidthKey = 'chest';
    baseLengthKey = 'bodyLength';
    nominalBaseWidth = 96;
    nominalBaseLength = 70;
  } else if (patternId === 'polo') {
    baseGarment = createPoloTShirt();
    baseWidthKey = 'chest';
    baseLengthKey = 'bodyLength';
    nominalBaseWidth = 102;
    nominalBaseLength = 72;
  } else if (patternId === 'bootcut-pant') {
    baseGarment = createWomensBootCutPant();
    baseWidthKey = 'waist';
    baseLengthKey = 'outseam';
    nominalBaseWidth = 72;
    nominalBaseLength = 106;
  } else if (patternId === 'denim-jeans') {
    baseGarment = createDenimJeans();
    baseWidthKey = 'waist';
    baseLengthKey = 'outseam';
    nominalBaseWidth = 82;
    nominalBaseLength = 105;
  } else if (patternId === 'flared-skirt') {
    baseGarment = createFlaredSkirt();
    baseWidthKey = 'waist';
    baseLengthKey = 'skirtLength';
    nominalBaseWidth = 68;
    nominalBaseLength = 58;
  } else if (patternId === 'sheath-dress') {
    baseGarment = createSheathDress();
    baseWidthKey = 'bust';
    baseLengthKey = 'dressLength';
    nominalBaseWidth = 90;
    nominalBaseLength = 102;
  } else if (patternId === 'suit-jacket') {
    baseGarment = createMensTailoredSuitJacket();
    baseWidthKey = 'chest';
    baseLengthKey = 'jacketLength';
    nominalBaseWidth = 104;
    nominalBaseLength = 78;
  } else if (patternId === 'double-breasted-blazer') {
    baseGarment = createDoubleBreastedBlazer();
    baseWidthKey = 'chest';
    baseLengthKey = 'jacketLength';
    nominalBaseWidth = 106;
    nominalBaseLength = 79;
  } else if (patternId === 'trench-coat') {
    baseGarment = createTrenchCoat();
    baseWidthKey = 'chest';
    baseLengthKey = 'coatLength';
    nominalBaseWidth = 108;
    nominalBaseLength = 110;
  } else if (patternId === 'bomber-jacket') {
    baseGarment = createBomberJacket();
    baseWidthKey = 'chest';
    baseLengthKey = 'bodyLength';
    nominalBaseWidth = 108;
    nominalBaseLength = 66;
  } else {
    baseGarment = createBasicBodice();
    baseWidthKey = 'bust';
    baseLengthKey = 'backLength';
    nominalBaseWidth = 92;
    nominalBaseLength = 42;
  }

  const userWidth = measurements[baseWidthKey] || measurements.chest || measurements.bust || measurements.waist || nominalBaseWidth;
  const userLength = measurements[baseLengthKey] || measurements.length || measurements.outseam || measurements.jacketLength || nominalBaseLength;

  const scaleX = Math.max(0.6, Math.min(1.8, userWidth / nominalBaseWidth));
  const scaleY = Math.max(0.6, Math.min(1.8, userLength / nominalBaseLength));

  const scaledComponents = baseGarment.components.map((c) => {
    const scaled = scaleComponent(c, scaleX, scaleY);
    return {
      ...scaled,
      measurements: {
        ...c.measurements,
        ...measurements,
      },
    };
  });

  return {
    ...baseGarment,
    id: `${patternId}-custom-${Date.now()}`,
    name: `${patternName} (Custom Fitted)`,
    components: scaledComponents,
    measurements: { ...measurements },
  };
}
