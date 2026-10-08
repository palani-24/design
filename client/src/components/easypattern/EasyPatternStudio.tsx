import React, { useState, useRef } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  EasyPatternStep,
  EasyPatternTool,
  GarmentSize,
  EasyGradingRuleItem,
  Garment,
  PatternComponent,
  PatternPathCommand,
} from '@shared/types';
import {
  EASY_PATTERN_GRADING_RULES,
  SIZE_COLOR_PALETTE,
  createBasicBodice,
  BASIC_BODICE_SIZE_TABLE,
} from '@shared/easyPatternConstants';
import {
  createMensShirtBasicPattern,
  MENS_SHIRT_SIZE_TABLE,
  createChinoTrouser,
  MENS_TROUSER_SIZE_TABLE,
} from '@shared/constants';
import { pathCommandsToSvgString } from '@shared/gradingEngine';
import {
  PATTERN_DEFINITIONS,
  getPatternDefinition,
  validatePatternMeasurements,
} from '@shared/patternCatalog';
import { MensShirtMasterModal } from './MensShirtMasterModal';
import { MensTrouserMasterModal } from './MensTrouserMasterModal';
import {
  MousePointer,
  Dot,
  Minus,
  Spline,
  Scissors,
  Layers,
  Tag,
  Ruler,
  FolderPlus,
  FolderOpen,
  Settings,
  HelpCircle,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  RotateCcw,
  Zap,
  Map,
  X,
  Sliders,
  Move,
  Info,
  Maximize2,
  Bookmark,
  Shirt,
  CheckCircle2,
  Palette,
  Eye,
  Play,
  Plus,
  ZoomIn,
  ZoomOut,
  Upload,
  Grid,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface CustomPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  piece: 'front' | 'back';
}

interface ConstructionLine {
  id: string;
  name: string;
  p1: { x: number; y: number; name: string };
  p2: { x: number; y: number; name: string };
  lengthCm: number;
}

export const EasyPatternStudio: React.FC = () => {
  const {
    garment,
    setGarment,
    currentSize,
    setCurrentSize,
    easyPatternStep,
    setEasyPatternStep,
    easyPatternTool,
    setEasyPatternTool,
    garmentCategory,
    setGarmentCategory,
    garmentType,
    setGarmentType,
    selectedSizeRange,
    toggleSizeInRange,
    measurementInputMode,
    setMeasurementInputMode,
    seamAllowanceCm,
    setSeamAllowanceCm,
    notchSizeCm,
    setNotchSizeCm,
    showEasyPatternLabel,
    setShowEasyPatternLabel,
    showEasyPatternGrainline,
    setShowEasyPatternGrainline,
    markerWidthCm,
    setMarkerWidthCm,
    fabricLengthMeters,
    executeGrading,
    isGrading,
    transferToTukacad,
    setCADEngineMode,
    setIsWorkflowModalOpen,
    loadGarmentTemplate,
    setTukacadWorkflowStep,
    setActiveModal,
    generatePatternFromWorkflow,
  } = useCADStore();

  // ==========================================
  // STEP 1 CUSTOM PRODUCT CREATION STUDIO STATE
  // ==========================================
  const [step1Tab, setStep1Tab] = useState<'create-studio' | 'library' | 'recent' | 'settings' | 'tutorial'>('create-studio');

  // Product Identity
  const [newProductName, setNewProductName] = useState("Women's Tailored Bodice");
  const [newProductCategory, setNewProductCategory] = useState<'Women' | 'Men' | 'Unisex' | 'Outerwear' | 'Bottoms'>('Women');
  const [newProductArchetype, setNewProductArchetype] = useState<
    'basic-bodice' | 'basic-tshirt' | 'polo' | 'shirt' | 'trouser' | 'flared-skirt' | 'sheath-dress' | 'suit-jacket'
  >('basic-bodice');

  // Style Customization Options
  const [newSilhouetteFit, setNewSilhouetteFit] = useState<'slim' | 'regular' | 'relaxed' | 'oversized'>('regular');
  const [newNecklineStyle, setNewNecklineStyle] = useState<'crew' | 'v-neck' | 'scoop' | 'boat' | 'mandarin' | 'shirt-collar'>('crew');
  const [newDartStyle, setNewDartStyle] = useState<'waist-bust' | 'french' | 'princess' | 'shoulder' | 'dartless'>('waist-bust');
  const [newSleeveStyle, setNewSleeveStyle] = useState<'sleeveless' | 'cap' | 'short' | 'three-quarter' | 'long' | 'raglan'>('short');
  const [newHemLength, setNewHemLength] = useState<'cropped' | 'waist' | 'hip' | 'tunic' | 'knee' | 'maxi'>('hip');
  const [newHemShape, setNewHemShape] = useState<'straight' | 'shirttail' | 'asymmetric'>('straight');
  const [newClosure, setNewClosure] = useState<'pullover' | 'button-placket' | 'invisible-zip' | 'wrap'>('pullover');
  const [newPocket, setNewPocket] = useState<'none' | 'chest-patch' | 'inseam' | 'flap-welt'>('none');
  const [newSeamAllowance, setNewSeamAllowance] = useState<number>(1.0);
  const [newGrainlineOrientation, setNewGrainlineOrientation] = useState<'straight' | 'cross' | 'bias'>('straight');
  const [newFabricType, setNewFabricType] = useState('Cotton Jersey');
  const [newFabricColor, setNewFabricColor] = useState('#3b82f6');

  // Measurements (Pre-configured with Men's Shirt Basic Pattern Image 1 Spec)
  const [newMeasurements, setNewMeasurements] = useState({
    bustChest: 100.0,
    waist: 92.0,
    hip: 100.0,
    shoulderWidth: 44.0,
    backLength: 76.0,
    armholeDepth: 26.0,
    neckGirth: 40.0,
    sleeveLength: 60.0,
    collarWidth: 4.5,
    cuffWidth: 11.0,
  });

  // Manual Shirt Detailed Styling Options
  const [shirtCollarStyle, setShirtCollarStyle] = useState<'classic-point' | 'button-down' | 'spread' | 'mandarin-band' | 'cuban-camp' | 'cutaway'>('classic-point');
  const [shirtCuffStyle, setShirtCuffStyle] = useState<'single-round' | 'mitred-angle' | 'french-double' | 'square-cut'>('single-round');
  const [shirtPlacketStyle, setShirtPlacketStyle] = useState<'box-placket' | 'french-clean' | 'concealed-fly' | 'popover'>('box-placket');
  const [shirtPocketStyle, setShirtPocketStyle] = useState<'patch-chevron' | 'rounded-patch' | 'flap-pocket' | 'dual-pockets' | 'none'>('patch-chevron');
  const [shirtYokeStyle, setShirtYokeStyle] = useState<'classic-yoke' | 'split-western' | 'deep-curve' | 'seamless'>('classic-yoke');
  const [shirtHemStyle, setShirtHemStyle] = useState<'shirttail-curved' | 'straight-side-slits' | 'deep-scoop'>('shirttail-curved');
  const [shirtPleatStyle, setShirtPleatStyle] = useState<'box-pleat' | 'knife-pleats' | 'back-darts' | 'plain-clean'>('box-pleat');

  // Manual Pant / Trouser Detailed Styling Options
  const [pantSilhouette, setPantSilhouette] = useState<'slim-chino' | 'classic-straight' | 'relaxed-tailored' | 'wide-leg' | 'tapered-crop'>('classic-straight');
  const [pantRise, setPantRise] = useState<'mid-rise' | 'high-rise' | 'low-rise'>('mid-rise');
  const [pantFrontStyle, setPantFrontStyle] = useState<'flat-front' | 'single-pleat' | 'double-pleat'>('flat-front');
  const [pantWaistbandStyle, setPantWaistbandStyle] = useState<'standard-4cm' | 'extended-tab' | 'hollywood-seamless' | 'drawstring-hybrid'>('standard-4cm');
  const [pantPocketStyle, setPantPocketStyle] = useState<'slant-chino' | 'on-seam' | 'j-pocket-jeans' | 'coin-ticket'>('slant-chino');
  const [pantBackPocketStyle, setPantBackPocketStyle] = useState<'double-welt' | 'button-welt' | 'patch-pockets' | 'no-pocket'>('double-welt');
  const [pantHemStyle, setPantHemStyle] = useState<'plain-hem' | 'turn-up-cuff' | 'tapered-slit'>('plain-hem');

  // Pant Precision Measurements (Matching Master Tailored Pant Spec)
  const [pantMeasurements, setPantMeasurements] = useState({
    waist: 84.0,
    hip: 100.0,
    inseam: 78.0,
    outseam: 104.0,
    thigh: 62.0,
    knee: 44.0,
    hemWidth: 19.0, // 38cm circumference
    frontRise: 26.0,
    backRise: 38.0,
  });

  const [isShirtMasterModalOpen, setIsShirtMasterModalOpen] = useState(false);
  const [isTrouserMasterModalOpen, setIsTrouserMasterModalOpen] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState<'pieces' | 'marker'>('pieces');
  const [previewZoom, setPreviewZoom] = useState(1.0);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isPanningPreview, setIsPanningPreview] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState({ x: 0, y: 0 });
  const [previewLabelMode, setPreviewLabelMode] = useState<'clean' | 'all' | 'hover' | 'none'>('clean');
  const [hoveredLandmark, setHoveredLandmark] = useState<{ name: string; x: number; y: number; pieceName: string } | null>(null);
  const [selectedPreviewPieceId, setSelectedPreviewPieceId] = useState<string | null>(null);

  // Advanced Bespoke Fit & Shaping Fine-Tuning State
  const [bespokeFitTab, setBespokeFitTab] = useState<'contour' | 'ease' | 'sleeve'>('contour');
  const [bespokeFit, setBespokeFit] = useState({
    easeBust: 0,        // +/- cm
    easeWaist: 0,       // +/- cm
    easeHip: 0,         // +/- cm
    neckDrop: 0,        // +/- cm
    neckWidth: 0,       // +/- cm
    shoulderSlope: 0,   // +/- deg
    armholeDepth: 0,    // +/- cm
    bustDartWidth: 0,   // +/- cm
    waistSuppression: 0,// +/- cm
    sleeveBicep: 0,     // +/- cm
    hemCurve: 0,        // +/- cm
    sideSlit: 0,        // +/- cm
  });

  const resetBespokeFit = () => {
    setBespokeFit({
      easeBust: 0,
      easeWaist: 0,
      easeHip: 0,
      neckDrop: 0,
      neckWidth: 0,
      shoulderSlope: 0,
      armholeDepth: 0,
      bustDartWidth: 0,
      waistSuppression: 0,
      sleeveBicep: 0,
      hemCurve: 0,
      sideSlit: 0,
    });
    showToast('Reset bespoke fine-tuning adjustments.');
  };

  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanningPreview(true);
      setPanStartCoords({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (isPanningPreview) {
      const dx = e.clientX - panStartCoords.x;
      const dy = e.clientY - panStartCoords.y;
      setPreviewPan((prev) => ({
        x: prev.x + dx * 1.5,
        y: prev.y + dy * 1.5,
      }));
      setPanStartCoords({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePreviewMouseUp = () => {
    setIsPanningPreview(false);
  };

  const resetPreviewTransform = () => {
    setPreviewZoom(1.0);
    setPreviewPan({ x: 0, y: 0 });
    setSelectedPreviewPieceId(null);
    showToast('Reset pattern view to fit center.');
  };

  const isMajorLandmark = (name?: string) => {
    if (!name) return false;
    const n = name.toLowerCase();
    return (
      n.includes('hps') ||
      n.includes('shoulder tip') ||
      n.includes('underarm') ||
      n.includes('apex') ||
      n.includes('hem') ||
      n.includes('crotch') ||
      n.includes('knee') ||
      n.includes('crown') ||
      n.includes('center front') ||
      n.includes('center back')
    );
  };

  const getPreviewBoundingBox = (previewGarmentObj: Garment) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    previewGarmentObj.components.forEach((comp) => {
      comp.paths.forEach((cmd) => {
        cmd.points.forEach((pt) => {
          const absX = comp.offset.x + 30 + pt.x;
          const absY = comp.offset.y + 40 + pt.y;
          if (absX < minX) minX = absX;
          if (absX > maxX) maxX = absX;
          if (absY < minY) minY = absY;
          if (absY > maxY) maxY = absY;
        });
      });
    });

    if (!isFinite(minX) || !isFinite(maxX) || maxX <= minX || maxY <= minY) {
      return { minX: -60, minY: -50, width: 1400, height: 860 };
    }

    // Generous breathing room margin on every side so pieces and labels never clip!
    const padX = 100;
    const padY = 80;
    const calculatedWidth = (maxX - minX) + padX * 2;
    const calculatedHeight = (maxY - minY) + padY * 2;

    return {
      minX: minX - padX,
      minY: minY - padY,
      width: Math.max(calculatedWidth, 1250),
      height: Math.max(calculatedHeight, 740),
    };
  };

  const loadMensShirtImage1Spec = () => {
    setNewProductName("Men's Shirt – Basic Pattern");
    setNewProductCategory('Men');
    setNewProductArchetype('shirt');
    setNewSilhouetteFit('regular');
    setNewNecklineStyle('shirt-collar');
    setNewDartStyle('dartless');
    setNewSleeveStyle('long');
    setNewHemLength('tunic');
    setNewHemShape('shirttail');
    setNewClosure('button-placket');
    setNewPocket('chest-patch');
    setNewSeamAllowance(1.0);
    setNewFabricType('Poplin Cotton');
    setNewFabricColor('#3b82f6');
    setNewMeasurements({
      bustChest: 100.0,
      waist: 92.0,
      hip: 100.0,
      shoulderWidth: 44.0,
      backLength: 76.0,
      armholeDepth: 26.0,
      neckGirth: 40.0,
      sleeveLength: 60.0,
      collarWidth: 4.5,
      cuffWidth: 11.0,
    });
    showToast("Loaded Men's Shirt Master Technical Specification (Image 1 Match)!");
  };

  const loadMensTrouserMasterSpec = () => {
    setNewProductName("Men's Tailored Trouser");
    setNewProductCategory('Men');
    setNewProductArchetype('trouser');
    setNewSilhouetteFit('regular');
    setNewSeamAllowance(1.0);
    setNewFabricType('Wool Flannel');
    setNewFabricColor('#1e293b');
    setPantSilhouette('classic-straight');
    setPantRise('mid-rise');
    setPantFrontStyle('flat-front');
    setPantWaistbandStyle('standard-4cm');
    setPantPocketStyle('slant-chino');
    setPantBackPocketStyle('double-welt');
    setPantHemStyle('plain-hem');
    setPantMeasurements({
      waist: 84.0,
      hip: 100.0,
      inseam: 78.0,
      outseam: 104.0,
      thigh: 62.0,
      knee: 44.0,
      hemWidth: 19.0,
      frontRise: 26.0,
      backRise: 38.0,
    });
    showToast("Loaded Men's Tailored Trouser Master Specification (9 CAD Pieces)!");
  };

  const [activeSubModal, setActiveSubModal] = useState<
    'settings' | 'library' | 'tutorial' | 'recent' | null
  >(null);

  // Settings State
  const [appSettings, setAppSettings] = useState({
    unit: 'cm' as 'cm' | 'in',
    showGrid: true,
    gridSize: 20,
    snapToGrid: false,
    showLandmarkLabels: true,
    showMeasurementsBadge: true,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // SIZING & DIMENSION ADJUSTMENTS ("size agisee pannura mathiri")
  // ==========================================
  const [customDeltas, setCustomDeltas] = useState({
    bust: 0,     // +/- cm
    waist: 0,    // +/- cm
    shoulder: 0, // +/- cm
    length: 0,   // +/- cm
  });

  const resetDeltas = () => {
    setCustomDeltas({ bust: 0, waist: 0, shoulder: 0, length: 0 });
    showToast('Reset dimensions to standard size sloper.');
  };

  // ==========================================
  // INTERACTIVE EDITING TOOLS STATE
  // ==========================================
  // 1. Select Tool & Point Dragging
  const [selectedPointId, setSelectedPointId] = useState<string | null>('f_shTip');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [pointOffsets, setPointOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 2. Point Tool (custom user placed marks)
  const [customPoints, setCustomPoints] = useState<CustomPoint[]>([]);

  // 3. Line Tool (custom construction lines)
  const [lineStartPoint, setLineStartPoint] = useState<{ x: number; y: number; name: string } | null>(null);
  const [constructionLines, setConstructionLines] = useState<ConstructionLine[]>([]);

  // 4. Curve Tool (curvature depths)
  const [curveParams, setCurveParams] = useState({
    neckDepth: 0,     // +/- px
    armholeDepth: 0,  // +/- px
  });

  // 5. Dart Tool (waist & bust dart geometry)
  const [dartParams, setDartParams] = useState({
    hasWaistDart: true,
    hasBustDart: true,
    waistDartWidth: 3.0,  // cm
    waistDartDepth: 12.0, // cm
    bustDartWidth: 2.5,   // cm
    bustDartDepth: 9.0,   // cm
  });

  // 6. Notch Tool
  const [notchToggles, setNotchToggles] = useState({
    armhole: true,
    bustDart: true,
    waistDart: true,
    centerFold: true,
  });

  // 7. Measure Tool (caliper tape measure)
  const [measurePoint1, setMeasurePoint1] = useState<{ x: number; y: number; name: string } | null>(null);
  const [measurePoint2, setMeasurePoint2] = useState<{ x: number; y: number; name: string } | null>(null);

  // Step 2 manual measurements (legacy compatibility)
  const [measurements, setMeasurements] = useState({
    bust: 92.0,
    waist: 71.0,
    hip: 96.0,
    bodyLength: 42.0,
    shoulderWidth: 12.8,
    armhole: 22.0,
  });

  // Step 2 Pattern-Specific Workflow State
  const [step2PatternId, setStep2PatternId] = useState<string>('basic-bodice');
  const [step2Measurements, setStep2Measurements] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [step2GeneralError, setStep2GeneralError] = useState<string | null>(null);

  // Step 6 visible nested sizes
  const [visibleNestedSizes, setVisibleNestedSizes] = useState<Record<GarmentSize, boolean>>({
    XS: true,
    S: true,
    M: true,
    L: true,
    XL: true,
    XXL: true,
  });

  // Step 8 Export
  const [exportFormat, setExportFormat] = useState<'pdf' | 'dxf' | 'aama' | 'png'>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeGrading: true,
    includeLabels: true,
    includeNotches: true,
    includeSeamAllowance: true,
  });
  const [exportSuccess, setExportSuccess] = useState(false);

  // Load Basic Bodice ONLY if no garment exists at all (never overwrite user pattern)
  const ensureBasicBodice = () => {
    if (!garment) {
      const bodice = createBasicBodice();
      setGarment(bodice);
    }
  };

  // Step 2 Pattern Selection & Measurement Handlers
  const handleStep2SelectPattern = (id: string) => {
    setStep2PatternId(id);
    setStep2Measurements({}); // Clear previous pattern measurements (Req 13)
    setStep2Errors({});
    setStep2GeneralError(null);
  };

  const handleStep2OkSubmit = () => {
    const patDef = getPatternDefinition(step2PatternId);
    if (!patDef) {
      setStep2GeneralError('Please select a pattern.');
      return;
    }

    const numericValues: Record<string, number | undefined> = {};
    for (const field of patDef.measurements) {
      const raw = step2Measurements[field.key]?.trim();
      if (raw !== undefined && raw !== '') {
        const num = parseFloat(raw);
        numericValues[field.key] = isNaN(num) ? undefined : num;
      } else {
        numericValues[field.key] = undefined;
      }
    }

    const validation = validatePatternMeasurements(step2PatternId, numericValues);
    if (!validation.valid) {
      setStep2Errors(validation.errors);
      setStep2GeneralError(
        `Please enter all required measurements for ${patDef.name}. Missing or invalid: ${validation.missingFields.join(', ')}.`
      );
      return;
    }

    const sanitized: Record<string, number> = {};
    for (const [k, v] of Object.entries(numericValues)) {
      if (v !== undefined) sanitized[k] = v;
    }

    generatePatternFromWorkflow(step2PatternId, sanitized, 'cm');
    setEasyPatternStep(3);
    showToast(`Generated ${patDef.name} using entered measurements!`);
  };

  // Compile custom product from scratch
  const generateCustomGarmentProduct = (): Garment => {
    // 👔 MEN'S SHIRT MASTER PATTERN (IMAGE 1 SPECIFICATION)
    if (newProductArchetype === 'shirt' || newProductName.toLowerCase().includes('shirt')) {
      const baseChestEase = newSilhouetteFit === 'slim' ? 0 : newSilhouetteFit === 'regular' ? 4 : newSilhouetteFit === 'relaxed' ? 8 : 14;
      const chestEase = baseChestEase + bespokeFit.easeBust;
      const totalChest = newMeasurements.bustChest + chestEase;
      const frontWidth = Math.round((totalChest / 4) * 10); // 250mm
      const backWidth = frontWidth;
      const backLen = Math.round(newMeasurements.backLength * 10); // 760mm
      const scyeDepth = Math.round((newMeasurements.armholeDepth + bespokeFit.armholeDepth) * 10); // 260mm
      const slvLen = Math.round(newMeasurements.sleeveLength * 10); // 600mm
      const cuffWidth = Math.round((newMeasurements.cuffWidth + bespokeFit.sleeveBicep * 0.5) * 20); // 220mm
      const collarWidth = Math.round((newMeasurements.neckGirth + 4 + bespokeFit.neckWidth) * 10); // 440mm
      const collarHt = Math.round(newMeasurements.collarWidth * 10); // 45mm
      const yokeWidth = Math.round((newMeasurements.shoulderWidth + bespokeFit.neckWidth) * 10); // 440mm
      const fYokeWidth = Math.round(yokeWidth / 2); // 220mm
      const sa = Math.round(newSeamAllowance * 10);
      const frontNeckDrop = 70 + (bespokeFit.neckDrop * 6);
      const shoulderSlopeOffset = bespokeFit.shoulderSlope * 2;

      const shirtComponents: PatternComponent[] = [
        // 1. FRONT (CUT 2)
        {
          id: 'shirt-front',
          pieceCode: 'FR',
          name: `${newProductName} (Front Piece)`,
          cutInstruction: 'Cut 2 (Left & Right) • 3cm Front Placket Fold',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 0, y: 0 },
          grainline: {
            start: { x: 45, y: 120 },
            end: { x: 45, y: Math.max(160, backLen - 60) },
            label: 'GRAINLINE ↕ CF',
          },
          paths: [
            { type: 'M', zone: 'center-fold', points: [{ x: 0, y: frontNeckDrop, name: 'Center Front Neck' }] },
            {
              type: 'C',
              zone: 'neck',
              points: [
                { x: 20, y: frontNeckDrop, isControl: true },
                { x: 55, y: 30, isControl: true },
                { x: 70 + (bespokeFit.neckWidth * 2), y: 0, name: 'HPS Neck Point' },
              ],
              annotation: 'Neck Curve (7cm drop, 11.5cm width)',
            },
            { type: 'L', zone: 'shoulder', points: [{ x: 185, y: 25 + shoulderSlopeOffset, name: 'Front Shoulder Tip' }], annotation: 'Shoulder Seam (11.5cm)' },
            {
              type: 'C',
              zone: 'armhole',
              points: [
                { x: 190, y: 150, isControl: true },
                { x: 210, y: 240, isControl: true },
                { x: frontWidth, y: scyeDepth, name: 'Underarm Scye Point' },
              ],
              annotation: 'Armhole Scye (26cm Depth)',
            },
            { type: 'L', zone: 'waist', points: [{ x: frontWidth, y: backLen, name: 'Side Hem Point' }], annotation: 'Side Seam (50cm)' },
            { type: 'L', zone: 'hem', points: [{ x: 0, y: backLen, name: 'Center Front Hem' }], annotation: 'Hem Width (25cm)' },
            { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 70 }] },
          ],
          notches: [
            { x: 205, y: 160, name: 'Armhole Front Notch', isNotch: true },
            { x: 30, y: backLen, name: 'Placket Fold Notch', isNotch: true },
            { x: frontWidth, y: backLen - 30, name: 'Hem 3cm Notch', isNotch: true },
          ],
          internals: [
            {
              id: 'front-placket-fold-line',
              name: 'Placket Fold Line (3cm)',
              type: 'line',
              points: [{ x: 30, y: 70 }, { x: 30, y: backLen }],
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
            { text: `Width: ${frontWidth / 10}cm • Length: ${backLen / 10}cm`, position: { x: 55, y: 260 }, type: 'meta' },
          ],
          measurements: {
            halfChest: totalChest / 2,
            length: backLen / 10,
            bodyLength: backLen / 10,
            armholeLength: scyeDepth / 10,
            shoulderLength: 11.5,
          },
        },
        // 2. BACK (CUT 1)
        {
          id: 'shirt-back',
          pieceCode: 'BK',
          name: `${newProductName} (Back Piece)`,
          cutInstruction: 'Cut 1 on Fold • Center Fold Line',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: frontWidth + 50, y: 0 },
          grainline: {
            start: { x: 40, y: 100 },
            end: { x: 40, y: Math.max(160, backLen - 60) },
            label: 'GRAINLINE ↕ CB FOLD',
          },
          paths: [
            { type: 'M', zone: 'center-fold', points: [{ x: 0, y: 25, name: 'Center Back Neck' }] },
            {
              type: 'C',
              zone: 'neck',
              points: [
                { x: 25, y: 25, isControl: true },
                { x: 55, y: 15, isControl: true },
                { x: 70, y: 0, name: 'Back HPS Neck' },
              ],
            },
            { type: 'L', zone: 'shoulder', points: [{ x: 210, y: 25, name: 'Back Shoulder Tip' }] },
            {
              type: 'C',
              zone: 'armhole',
              points: [
                { x: 205, y: 140, isControl: true },
                { x: 215, y: 230, isControl: true },
                { x: backWidth, y: scyeDepth, name: 'Back Underarm Scye' },
              ],
            },
            { type: 'L', zone: 'waist', points: [{ x: backWidth, y: backLen, name: 'Back Side Hem' }] },
            { type: 'L', zone: 'hem', points: [{ x: 0, y: backLen, name: 'Center Back Hem' }] },
            { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 25 }] },
          ],
          notches: [
            { x: 205, y: 145, name: 'Back Double Notch 1', isNotch: true },
            { x: 205, y: 155, name: 'Back Double Notch 2', isNotch: true },
          ],
          labels: [
            { text: 'BACK', position: { x: 95, y: 210 }, type: 'title' },
            { text: '(CUT 1)', position: { x: 95, y: 235 }, type: 'subtitle' },
            { text: `Width: ${backWidth / 10}cm • Length: ${backLen / 10}cm`, position: { x: 60, y: 260 }, type: 'meta' },
          ],
          measurements: {
            halfChest: totalChest / 2,
            length: backLen / 10,
            bodyLength: backLen / 10,
            armholeLength: scyeDepth / 10,
            shoulderLength: 14.0,
            shoulderWidth: 21.0,
          },
        },
        // 3. SLEEVE (CUT 2)
        {
          id: 'shirt-sleeve',
          pieceCode: 'SLV',
          name: `${newProductName} (Sleeve Pair)`,
          cutInstruction: 'Cut 2 (Left & Right Pair)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2, y: 0 },
          grainline: {
            start: { x: 180, y: 40 },
            end: { x: 180, y: slvLen - 40 },
            label: 'GRAINLINE ↕ SLEEVE CENTER',
          },
          paths: [
            { type: 'M', zone: 'sleeve-seam', points: [{ x: 0, y: 150, name: 'Front Underarm Bicep' }] },
            {
              type: 'C',
              zone: 'sleeve-cap',
              points: [
                { x: 60, y: 70, isControl: true },
                { x: 120, y: 0, isControl: true },
                { x: 180, y: 0, name: 'Sleeve Cap Crown' },
              ],
            },
            {
              type: 'C',
              zone: 'sleeve-cap',
              points: [
                { x: 240, y: 0, isControl: true },
                { x: 300, y: 70, isControl: true },
                { x: 360, y: 150, name: 'Back Underarm Bicep' },
              ],
            },
            { type: 'L', zone: 'sleeve-seam', points: [{ x: 290, y: slvLen, name: 'Back Cuff Hem' }] },
            { type: 'L', zone: 'sleeve-hem', points: [{ x: 70, y: slvLen, name: 'Front Cuff Hem' }] },
            { type: 'Z', zone: 'sleeve-seam', points: [{ x: 0, y: 150 }] },
          ],
          notches: [
            { x: 180, y: 0, name: 'Crown Notch', isNotch: true },
            { x: 70, y: 60, name: 'Front Pitch', isNotch: true },
            { x: 290, y: 60, name: 'Back Pitch', isNotch: true },
          ],
          labels: [
            { text: 'SLEEVE', position: { x: 140, y: 250 }, type: 'title' },
            { text: '(CUT 2)', position: { x: 145, y: 275 }, type: 'subtitle' },
            { text: `Bicep: 36cm • Length: ${slvLen / 10}cm`, position: { x: 105, y: 300 }, type: 'meta' },
          ],
          measurements: {
            sleeveLength: slvLen / 10,
            sleeveCapLength: 15.0,
            hemWidth: cuffWidth / 10,
          },
        },
        // 4. COLLAR (CUT 2)
        {
          id: 'shirt-collar',
          pieceCode: 'COL',
          name: 'COLLAR (CUT 2)',
          cutInstruction: 'Cut 2 (Upper & Under Collar)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 400, y: 0 },
          grainline: { start: { x: 40, y: 22.5 }, end: { x: collarWidth - 40, y: 22.5 }, label: 'GRAINLINE ↔ COLLAR' },
          paths: [
            { type: 'M', zone: 'neck', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'neck', points: [{ x: collarWidth, y: 0 }] },
            { type: 'L', zone: 'neck', points: [{ x: collarWidth, y: collarHt }] },
            { type: 'L', zone: 'neck', points: [{ x: 0, y: collarHt }] },
            { type: 'Z', zone: 'neck', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'COLLAR (CUT 2)', position: { x: 155, y: 24 }, type: 'title' }],
          notches: [],
          measurements: { halfChest: collarWidth / 10 },
        },
        // 5. COLLAR STAND (CUT 2)
        {
          id: 'shirt-collar-stand',
          pieceCode: 'STD',
          name: 'COLLAR STAND (CUT 2)',
          cutInstruction: 'Cut 2 (Inner & Outer Stand)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 400, y: 70 },
          grainline: { start: { x: 40, y: 15 }, end: { x: collarWidth - 40, y: 15 }, label: 'GRAINLINE ↔ STAND' },
          paths: [
            { type: 'M', zone: 'neck', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'neck', points: [{ x: collarWidth, y: 0 }] },
            { type: 'L', zone: 'neck', points: [{ x: collarWidth, y: 30 }] },
            { type: 'L', zone: 'neck', points: [{ x: 0, y: 30 }] },
            { type: 'Z', zone: 'neck', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'COLLAR STAND (CUT 2)', position: { x: 135, y: 17 }, type: 'title' }],
          notches: [],
          measurements: { halfChest: collarWidth / 10 },
        },
        // 6. POCKET (CUT 1)
        {
          id: 'shirt-pocket',
          pieceCode: 'PKT',
          name: 'POCKET (CUT 1)',
          cutInstruction: 'Cut 1 (Chest Patch Pocket)',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 400, y: 130 },
          grainline: { start: { x: 65, y: 20 }, end: { x: 65, y: 90 }, label: 'GRAINLINE ↕' },
          paths: [
            { type: 'M', zone: 'hem', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'hem', points: [{ x: 130, y: 0 }] },
            { type: 'L', zone: 'hem', points: [{ x: 130, y: 110 }] },
            { type: 'L', zone: 'hem', points: [{ x: 65, y: 140 }] },
            { type: 'L', zone: 'hem', points: [{ x: 0, y: 110 }] },
            { type: 'Z', zone: 'hem', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'POCKET (CUT 1)', position: { x: 25, y: 55 }, type: 'title' }],
          notches: [],
          measurements: { length: 14 },
        },
        // 7. BACK YOKE (CUT 1)
        {
          id: 'shirt-back-yoke',
          pieceCode: 'BYK',
          name: 'BACK YOKE (CUT 1)',
          cutInstruction: 'Cut 1 on Fold',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2, y: slvLen + 40 },
          grainline: { start: { x: 50, y: 40 }, end: { x: yokeWidth - 50, y: 40 }, label: 'GRAINLINE ↔ BACK YOKE' },
          paths: [
            { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'shoulder', points: [{ x: yokeWidth, y: 0 }] },
            { type: 'L', zone: 'armhole', points: [{ x: yokeWidth, y: 80 }] },
            {
              type: 'C',
              zone: 'shoulder',
              points: [
                { x: Math.round(yokeWidth * 0.75), y: 90, isControl: true },
                { x: Math.round(yokeWidth * 0.25), y: 90, isControl: true },
                { x: 0, y: 80 },
              ],
            },
            { type: 'Z', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'BACK YOKE (CUT 1)', position: { x: 150, y: 40 }, type: 'title' }],
          notches: [],
          measurements: { shoulderWidth: yokeWidth / 10 },
        },
        // 8. FRONT YOKE (CUT 2)
        {
          id: 'shirt-front-yoke',
          pieceCode: 'FYK',
          name: 'FRONT YOKE (CUT 2)',
          cutInstruction: 'Cut 2 (Pair)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 400, y: 310 },
          grainline: { start: { x: 110, y: 20 }, end: { x: 110, y: 65 }, label: 'GRAINLINE ↕' },
          paths: [
            { type: 'M', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'shoulder', points: [{ x: fYokeWidth, y: 0 }] },
            { type: 'L', zone: 'armhole', points: [{ x: fYokeWidth, y: 80 }] },
            {
              type: 'C',
              zone: 'shoulder',
              points: [
                { x: Math.round(fYokeWidth * 0.72), y: 90, isControl: true },
                { x: Math.round(fYokeWidth * 0.28), y: 90, isControl: true },
                { x: 0, y: 80 },
              ],
            },
            { type: 'Z', zone: 'shoulder', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'FRONT YOKE (CUT 2)', position: { x: 45, y: 40 }, type: 'title' }],
          notches: [],
          measurements: { shoulderWidth: fYokeWidth / 10 },
        },
        // 9. CUFF (CUT 2)
        {
          id: 'shirt-cuff',
          pieceCode: 'CUF',
          name: 'CUFF (CUT 2)',
          cutInstruction: 'Cut 2 (Pair)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 400, y: 420 },
          grainline: { start: { x: 30, y: 27.5 }, end: { x: 190, y: 27.5 }, label: 'GRAINLINE ↔ CUFF' },
          paths: [
            { type: 'M', zone: 'sleeve-hem', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'sleeve-hem', points: [{ x: 220, y: 0 }] },
            { type: 'L', zone: 'sleeve-hem', points: [{ x: 220, y: 110 }] },
            { type: 'L', zone: 'sleeve-hem', points: [{ x: 0, y: 110 }] },
            { type: 'Z', zone: 'sleeve-hem', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'CUFF (CUT 2)', position: { x: 70, y: 35 }, type: 'title' }],
          notches: [],
          measurements: { hemWidth: 22, length: 11 },
        },
        // 10. PLACKET (CUT 1)
        {
          id: 'shirt-placket',
          pieceCode: 'PLK',
          name: 'PLACKET (CUT 1)',
          cutInstruction: 'Cut 1 (Center Front Band)',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: (frontWidth + 50) * 2 + 660, y: 0 },
          grainline: { start: { x: 20, y: 50 }, end: { x: 20, y: backLen - 50 }, label: 'GRAINLINE ↕' },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 40, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 40, y: backLen }] },
            { type: 'L', zone: 'waist', points: [{ x: 0, y: backLen }] },
            { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
          ],
          labels: [{ text: 'PLACKET (CUT 1)', position: { x: 3, y: 360 }, type: 'title' }],
          notches: [],
          measurements: { length: backLen / 10 },
        },
      ];

      return {
        id: `shirt-prod-${Date.now()}`,
        name: newProductName,
        category: 'shirt',
        version: 'v2.0 (Master Spec)',
        baseSize: currentSize,
        currentSize: currentSize,
        position: { x: 0, y: 0 },
        components: shirtComponents,
        sizeTable: MENS_SHIRT_SIZE_TABLE,
      };
    }

    // 👖 MEN'S TAILORED TROUSER / PANT MASTER PATTERN (9 PRODUCTION CAD PIECES)
    if (newProductArchetype === 'trouser' || newProductName.toLowerCase().includes('trouser') || newProductName.toLowerCase().includes('pant')) {
      const sa = Math.round(newSeamAllowance * 10);
      const fWaist = Math.round(((pantMeasurements.waist + bespokeFit.easeWaist) / 4) * 10); // 210mm
      const bWaist = Math.round(((pantMeasurements.waist + bespokeFit.easeWaist + 4) / 4) * 10); // 220mm
      const fHip = Math.round(((pantMeasurements.hip + bespokeFit.easeHip) / 4) * 10); // 250mm
      const bHip = Math.round(((pantMeasurements.hip + bespokeFit.easeHip + 4) / 4) * 10); // 260mm
      const totalLen = Math.round(pantMeasurements.outseam * 10); // 1040mm
      const kneePos = Math.round(totalLen * 0.52);
      const kneeW = Math.round(((pantMeasurements.knee + bespokeFit.sleeveBicep) / 2) * 10);
      const hemW = Math.round((pantMeasurements.hemWidth + bespokeFit.hemCurve) * 10);
      const fRise = Math.round(pantMeasurements.frontRise * 10);
      const bRise = Math.round(pantMeasurements.backRise * 10);

      // Extra pleat allowance
      const pleatAllowance = pantFrontStyle === 'single-pleat' ? 20 : pantFrontStyle === 'double-pleat' ? 35 : 0;
      const fWaistTotal = fWaist + pleatAllowance;

      const trouserComponents: PatternComponent[] = [
        // 1. FRONT LEG (CUT 2)
        {
          id: 'trouser-front',
          pieceCode: 'T-FR',
          name: `${newProductName} (Front Leg)`,
          cutInstruction: `Cut 2 (Pair) • ${pantFrontStyle.replace('-', ' ').toUpperCase()} • ${pantPocketStyle.toUpperCase()}`,
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 0, y: 0 },
          grainline: {
            start: { x: Math.round(fWaistTotal * 0.55), y: 60 },
            end: { x: Math.round(fWaistTotal * 0.55), y: totalLen - 40 },
            label: 'GRAINLINE ↑ CREASE LINE',
          },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 40, y: 40, name: 'Front Waist Left' }] },
            { type: 'L', zone: 'waist', points: [{ x: fWaistTotal + 40, y: 40, name: 'Front Waist Side' }] },
            {
              type: 'C',
              zone: 'hip',
              points: [
                { x: fWaistTotal + 60, y: Math.round(fRise * 0.4), isControl: true },
                { x: fHip + 40, y: Math.round(fRise * 0.8), isControl: true },
                { x: fHip + 20, y: fRise, name: 'Side Hip Curve' },
              ],
            },
            { type: 'L', zone: 'hem', points: [{ x: kneeW + 40, y: kneePos, name: 'Outseam Knee' }] },
            { type: 'L', zone: 'hem', points: [{ x: hemW + 40, y: totalLen, name: 'Trouser Hem Outseam' }] },
            { type: 'L', zone: 'hem', points: [{ x: 40, y: totalLen, name: 'Trouser Hem Inseam' }] },
            { type: 'L', zone: 'hip', points: [{ x: 40, y: kneePos, name: 'Inseam Knee' }] },
            {
              type: 'C',
              zone: 'bust',
              points: [
                { x: 30, y: Math.round(fRise * 1.15), isControl: true },
                { x: 10, y: Math.round(fRise * 1.05), isControl: true },
                { x: 0, y: fRise, name: 'Front Crotch Fork' },
              ],
            },
            {
              type: 'C',
              zone: 'waist',
              points: [
                { x: 15, y: Math.round(fRise * 0.7), isControl: true },
                { x: 30, y: Math.round(fRise * 0.35), isControl: true },
                { x: 40, y: 40, name: 'Center Front Fly' },
              ],
            },
            { type: 'Z', zone: 'waist', points: [{ x: 40, y: 40 }] },
          ],
          notches: [
            { x: 40, y: kneePos, name: 'Knee Inseam Notch', isNotch: true },
            { x: kneeW + 40, y: kneePos, name: 'Knee Outseam Notch', isNotch: true },
            { x: 40, y: 140, name: 'Zipper Base Notch', isNotch: true },
          ],
          internals: [
            {
              id: 'front-crease-line',
              name: 'Sharp Crease Line',
              type: 'line',
              points: [{ x: Math.round(fWaistTotal * 0.55), y: 60 }, { x: Math.round(fWaistTotal * 0.55), y: totalLen - 20 }],
              color: '#38bdf8',
            },
            {
              id: 'front-fly-j-stitch',
              name: 'Fly J-Stitch (4cm)',
              type: 'line',
              points: [
                { x: 40, y: 40 },
                { x: 40, y: 150 },
                { x: 20, y: 170 },
              ],
              color: '#2563eb',
            },
            {
              id: 'front-slant-pocket-line',
              name: 'Slant Pocket Opening (14cm)',
              type: 'line',
              points: [
                { x: fWaistTotal, y: 40 },
                { x: fHip + 20, y: 170 },
              ],
              color: '#16a34a',
            },
            ...(pleatAllowance > 0
              ? [
                  {
                    id: 'front-pleat-fold-1',
                    name: 'Forward Pleat Fold Line',
                    type: 'line' as const,
                    points: [{ x: Math.round(fWaistTotal * 0.45), y: 40 }, { x: Math.round(fWaistTotal * 0.45), y: 140 }],
                    color: '#f59e0b',
                  },
                ]
              : []),
          ],
          labels: [
            { text: 'FRONT LEG', position: { x: 70, y: 260 }, type: 'title' },
            { text: '(CUT 2)', position: { x: 80, y: 285 }, type: 'subtitle' },
            { text: `Waist: ${pantMeasurements.waist}cm • Inseam: ${pantMeasurements.inseam}cm`, position: { x: 50, y: 310 }, type: 'meta' },
          ],
          measurements: {
            waist: pantMeasurements.waist / 2,
            hip: pantMeasurements.hip / 2,
            length: pantMeasurements.outseam,
            hemWidth: pantMeasurements.hemWidth,
          },
        },

        // 2. BACK LEG (CUT 2)
        {
          id: 'trouser-back',
          pieceCode: 'T-BK',
          name: `${newProductName} (Back Leg)`,
          cutInstruction: 'Cut 2 (Pair) • Double Welt Pocket • Seat Pitch Angle +30°',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 380, y: 0 },
          grainline: {
            start: { x: Math.round(bWaist * 0.6), y: 80 },
            end: { x: Math.round(bWaist * 0.6), y: totalLen - 40 },
            label: 'GRAINLINE ↑ CREASE LINE',
          },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 30, y: 20, name: 'Back Crotch Waist Apex' }] },
            { type: 'L', zone: 'waist', points: [{ x: bWaist + 50, y: 60, name: 'Back Waist Side' }] },
            {
              type: 'C',
              zone: 'hip',
              points: [
                { x: bWaist + 70, y: Math.round(bRise * 0.45), isControl: true },
                { x: bHip + 50, y: Math.round(bRise * 0.85), isControl: true },
                { x: bHip + 30, y: bRise, name: 'Back Side Hip Curve' },
              ],
            },
            { type: 'L', zone: 'hem', points: [{ x: kneeW + 50, y: kneePos, name: 'Back Outseam Knee' }] },
            { type: 'L', zone: 'hem', points: [{ x: hemW + 50, y: totalLen, name: 'Back Hem Outseam' }] },
            { type: 'L', zone: 'hem', points: [{ x: 30, y: totalLen, name: 'Back Hem Inseam' }] },
            { type: 'L', zone: 'hip', points: [{ x: 30, y: kneePos, name: 'Back Inseam Knee' }] },
            {
              type: 'C',
              zone: 'bust',
              points: [
                { x: 10, y: Math.round(bRise * 1.25), isControl: true },
                { x: -30, y: Math.round(bRise * 1.15), isControl: true },
                { x: -50, y: bRise, name: 'Back Crotch Extension' },
              ],
            },
            {
              type: 'C',
              zone: 'waist',
              points: [
                { x: -20, y: Math.round(bRise * 0.7), isControl: true },
                { x: 10, y: Math.round(bRise * 0.35), isControl: true },
                { x: 30, y: 20, name: 'Seat Angle Curve' },
              ],
            },
            { type: 'Z', zone: 'waist', points: [{ x: 30, y: 20 }] },
          ],
          notches: [
            { x: 30, y: kneePos, name: 'Back Knee Notch', isNotch: true },
            { x: kneeW + 50, y: kneePos, name: 'Back Side Notch', isNotch: true },
          ],
          internals: [
            {
              id: 'back-welt-placement',
              name: 'Welt Pocket Placement (13cm × 1.2cm)',
              type: 'pocket',
              points: [
                { x: Math.round(bWaist * 0.35), y: 130 },
                { x: Math.round(bWaist * 0.35) + 130, y: 130 },
                { x: Math.round(bWaist * 0.35) + 130, y: 142 },
                { x: Math.round(bWaist * 0.35), y: 142 },
              ],
              closed: true,
              color: '#2563eb',
            },
            {
              id: 'back-waist-dart',
              name: 'Back Waist Dart (7cm)',
              type: 'dart',
              points: [
                { x: Math.round(bWaist * 0.55), y: 40 },
                { x: Math.round(bWaist * 0.55) - 10, y: 40 },
                { x: Math.round(bWaist * 0.55) - 5, y: 110 },
                { x: Math.round(bWaist * 0.55), y: 40 },
              ],
              closed: true,
              color: '#dc2626',
            },
          ],
          labels: [
            { text: 'BACK LEG', position: { x: 90, y: 260 }, type: 'title' },
            { text: '(CUT 2)', position: { x: 100, y: 285 }, type: 'subtitle' },
            { text: `Hip: ${pantMeasurements.hip}cm • Outseam: ${pantMeasurements.outseam}cm`, position: { x: 60, y: 310 }, type: 'meta' },
          ],
          measurements: {
            waist: (pantMeasurements.waist + 4) / 2,
            hip: (pantMeasurements.hip + 4) / 2,
            length: pantMeasurements.outseam,
          },
        },

        // 3. WAISTBAND (CUT 2)
        {
          id: 'trouser-waistband',
          pieceCode: 'T-WB',
          name: 'WAISTBAND (CUT 2)',
          cutInstruction: 'Cut 2 (Outer + Facing) • Interfaced',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 780, y: 0 },
          grainline: { start: { x: 40, y: 22.5 }, end: { x: Math.round(pantMeasurements.waist * 10) - 40, y: 22.5 }, label: 'GRAINLINE ↔ WAISTBAND' },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: Math.round(pantMeasurements.waist * 10) + (pantWaistbandStyle === 'extended-tab' ? 50 : 0), y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: Math.round(pantMeasurements.waist * 10) + (pantWaistbandStyle === 'extended-tab' ? 50 : 0), y: 45 }] },
            { type: 'L', zone: 'waist', points: [{ x: 0, y: 45 }] },
            { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
          ],
          notches: [
            { x: Math.round((pantMeasurements.waist * 10) / 2), y: 45, name: 'Center Back Notch', isNotch: true },
            { x: Math.round((pantMeasurements.waist * 10) / 4), y: 45, name: 'Side Seam Notch', isNotch: true },
          ],
          labels: [{ text: 'WAISTBAND (CUT 2)', position: { x: 180, y: 28 }, type: 'title' }],
          measurements: { length: pantMeasurements.waist, hemWidth: 4.5 },
        },

        // 4. FLY SHIELD (CUT 1)
        {
          id: 'trouser-fly-shield',
          pieceCode: 'T-FSD',
          name: 'FLY SHIELD (CUT 1)',
          cutInstruction: 'Cut 1 (Underlap Fly Guard)',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: 780, y: 80 },
          grainline: { start: { x: 30, y: 20 }, end: { x: 30, y: 150 }, label: 'GRAINLINE ↕' },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 60, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 60, y: 160 }] },
            { type: 'C', zone: 'waist', points: [{ x: 60, y: 200, isControl: true }, { x: 0, y: 200, isControl: true }, { x: 0, y: 180 }] },
            { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
          ],
          notches: [{ x: 60, y: 40, name: 'Zipper Notch', isNotch: true }],
          labels: [{ text: 'FLY SHIELD (CUT 1)', position: { x: 8, y: 90 }, type: 'title' }],
          measurements: { length: 20.0, hemWidth: 6.0 },
        },

        // 5. FLY FACING (CUT 1)
        {
          id: 'trouser-fly-facing',
          pieceCode: 'T-FFC',
          name: 'FLY FACING (CUT 1)',
          cutInstruction: 'Cut 1 (Bearer Facing)',
          quantity: 1,
          seamAllowanceMm: sa,
          offset: { x: 880, y: 80 },
          grainline: { start: { x: 25, y: 20 }, end: { x: 25, y: 140 }, label: 'GRAINLINE ↕' },
          paths: [
            { type: 'M', zone: 'waist', points: [{ x: 0, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 55, y: 0 }] },
            { type: 'L', zone: 'waist', points: [{ x: 55, y: 150 }] },
            { type: 'C', zone: 'waist', points: [{ x: 55, y: 190, isControl: true }, { x: 0, y: 190, isControl: true }, { x: 0, y: 170 }] },
            { type: 'Z', zone: 'waist', points: [{ x: 0, y: 0 }] },
          ],
          notches: [],
          labels: [{ text: 'FLY FACING (CUT 1)', position: { x: 6, y: 90 }, type: 'title' }],
          measurements: { length: 19.0, hemWidth: 5.5 },
        },

        // 6. FRONT SLANT POCKET FACING (CUT 2)
        {
          id: 'trouser-slant-facing',
          pieceCode: 'T-SPF',
          name: 'SLANT FACING (CUT 2)',
          cutInstruction: 'Cut 2 (Pair)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 980, y: 80 },
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
          measurements: { length: 18.0, hemWidth: 12.0 },
        },

        // 7. POCKET BAG (CUT 4)
        {
          id: 'trouser-pocket-bag',
          pieceCode: 'T-PBG',
          name: 'POCKET BAG (CUT 4)',
          cutInstruction: 'Cut 4 (2 Pairs in Pocketing Fabric)',
          quantity: 4,
          seamAllowanceMm: sa,
          offset: { x: 1140, y: 80 },
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
          measurements: { length: 27.0, hemWidth: 16.0 },
        },

        // 8. BACK WELT FACING (CUT 2)
        {
          id: 'trouser-back-welt',
          pieceCode: 'T-WLT',
          name: 'WELT FACING (CUT 2)',
          cutInstruction: 'Cut 2 (Jetted Welt Facing)',
          quantity: 2,
          seamAllowanceMm: sa,
          offset: { x: 780, y: 320 },
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
          measurements: { length: 18.0, hemWidth: 6.0 },
        },

        // 9. BELT LOOPS STRIP (CUT 6)
        {
          id: 'trouser-belt-loops',
          pieceCode: 'T-BLP',
          name: 'BELT LOOPS (CUT 6)',
          cutInstruction: 'Cut 6 Loops (or 1 Strip 60cm)',
          quantity: 6,
          seamAllowanceMm: sa,
          offset: { x: 1000, y: 320 },
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
          measurements: { length: 21.0, hemWidth: 3.5 },
        },
      ];

      return {
        id: `trouser-prod-${Date.now()}`,
        name: newProductName,
        category: 'trouser',
        version: 'v2.0 (Master Spec)',
        baseSize: currentSize,
        currentSize: currentSize,
        position: { x: 0, y: 0 },
        components: trouserComponents,
        sizeTable: MENS_TROUSER_SIZE_TABLE,
      };
    }

    const bustEase = (newSilhouetteFit === 'slim' ? 0 : newSilhouetteFit === 'regular' ? 4 : newSilhouetteFit === 'relaxed' ? 8 : 14) + bespokeFit.easeBust;
    const waistEase = (newSilhouetteFit === 'slim' ? 0 : newSilhouetteFit === 'regular' ? 3 : newSilhouetteFit === 'relaxed' ? 6 : 10) + bespokeFit.easeWaist;

    const wChest = Math.round(((newMeasurements.bustChest + bustEase) / 4) * 10);
    const wWaist = Math.round(((newMeasurements.waist + waistEase) / 4) * 10);
    const wShoulder = Math.round((newMeasurements.shoulderWidth / 2) * 10 * 1.5);

    let totalLen = newMeasurements.backLength * 10;
    if (newHemLength === 'cropped') totalLen = 380;
    else if (newHemLength === 'waist') totalLen = 450;
    else if (newHemLength === 'hip') totalLen = 600;
    else if (newHemLength === 'tunic') totalLen = 760;
    else if (newHemLength === 'knee') totalLen = 980;
    else if (newHemLength === 'maxi') totalLen = 1320;

    let neckY = 95 + (bespokeFit.neckDrop * 8);
    if (newNecklineStyle === 'crew') neckY = 90 + (bespokeFit.neckDrop * 8);
    else if (newNecklineStyle === 'v-neck') neckY = 150 + (bespokeFit.neckDrop * 8);
    else if (newNecklineStyle === 'scoop') neckY = 165 + (bespokeFit.neckDrop * 8);
    else if (newNecklineStyle === 'boat') neckY = 50 + (bespokeFit.neckDrop * 8);
    else if (newNecklineStyle === 'mandarin') neckY = 65 + (bespokeFit.neckDrop * 8);
    else if (newNecklineStyle === 'shirt-collar') neckY = 80 + (bespokeFit.neckDrop * 8);

    const shoulderSlopeDelta = bespokeFit.shoulderSlope * 3;
    const armholeScyeDelta = bespokeFit.armholeDepth * 10;
    const bustDartSuppression = bespokeFit.bustDartWidth * 4;
    const waistDartSuppression = bespokeFit.waistSuppression * 4;

    const components: PatternComponent[] = [];

    // 1. Front Bodice Component
    const frontPaths: PatternPathCommand[] = [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: neckY, name: 'Center Front Neck' }] },
      newNecklineStyle === 'v-neck'
        ? { type: 'L', zone: 'neck', points: [{ x: 88 + (bespokeFit.neckWidth * 3), y: 40, name: 'HPS Neck Point' }] }
        : {
            type: 'C',
            zone: 'neck',
            points: [
              { x: 30, y: neckY, isControl: true },
              { x: 75, y: 55, isControl: true },
              { x: 88 + (bespokeFit.neckWidth * 3), y: 40, name: 'HPS Neck Point' },
            ],
            annotation: 'Front Neckline',
          },
      { type: 'L', zone: 'shoulder', points: [{ x: wShoulder, y: 78 + shoulderSlopeDelta, name: 'Front Shoulder Tip' }], annotation: 'Shoulder Seam' },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: Math.round(wShoulder * 0.9), y: 145, isControl: true },
          { x: Math.round(wChest * 0.92), y: 205, isControl: true },
          { x: wChest, y: 228 + armholeScyeDelta, name: 'Underarm Point' },
        ],
        annotation: 'Armhole Curve',
      },
    ];

    if (newDartStyle === 'waist-bust') {
      frontPaths.push(
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.98), y: 265 - bustDartSuppression, name: 'Side Bust Dart Top' }] },
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.62), y: 285, name: 'Bust Apex Point' }] },
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.97), y: 305 + bustDartSuppression, name: 'Side Bust Dart Bottom' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist + 15), y: totalLen, name: 'Front Side Waist' }], annotation: 'Side Seam' },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.75 + waistDartSuppression), y: totalLen, name: 'Waist Dart Leg 2' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.65), y: 310, name: 'Waist Dart Apex' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.55 - waistDartSuppression), y: totalLen, name: 'Waist Dart Leg 1' }] }
      );
    } else if (newDartStyle === 'french') {
      frontPaths.push(
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.98), y: Math.round(totalLen * 0.72), name: 'French Dart Top' }] },
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.58), y: 285, name: 'Bust Apex Point' }] },
        { type: 'L', zone: 'bust', points: [{ x: Math.round(wChest * 0.96), y: Math.round(totalLen * 0.85), name: 'French Dart Bottom' }] },
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist + 15), y: totalLen, name: 'Front Side Waist' }], annotation: 'Side Seam' }
      );
    } else {
      frontPaths.push(
        { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist + 15), y: totalLen, name: 'Front Side Waist' }], annotation: 'Side Seam' }
      );
    }

    if (newHemShape === 'shirttail') {
      frontPaths.push({
        type: 'C',
        zone: 'hem',
        points: [
          { x: Math.round(wWaist * 0.7), y: totalLen + 15 + (bespokeFit.hemCurve * 3), isControl: true },
          { x: Math.round(wWaist * 0.3), y: totalLen + 30 + (bespokeFit.hemCurve * 3), isControl: true },
          { x: 0, y: totalLen + 25 + (bespokeFit.hemCurve * 3), name: 'Center Front Hem' },
        ],
        annotation: 'Curved Shirttail Hem',
      });
    } else {
      frontPaths.push({ type: 'L', zone: 'hem', points: [{ x: 0, y: totalLen, name: 'Center Front Waist' }], annotation: 'Waistline' });
    }

    frontPaths.push({ type: 'Z', zone: 'center-fold', points: [{ x: 0, y: neckY }] });

    components.push({
      id: 'front',
      pieceCode: 'FR-BD',
      name: `${newProductName} (Front Piece)`,
      cutInstruction: newClosure === 'button-placket' ? 'Cut 2 (Pair)' : 'Cut 1 on Fold',
      quantity: 1,
      offset: { x: 0, y: 0 },
      grainline: {
        start: { x: 40, y: 120 },
        end: { x: 40, y: Math.max(160, totalLen - 40) },
        label: newClosure === 'button-placket' ? 'GRAINLINE (CF PLACKET) ↕' : 'GRAINLINE (CF FOLD) ↕',
      },
      paths: frontPaths,
      notches: [
        { x: Math.round(wShoulder * 0.92), y: 175 },
        { x: Math.round(wChest * 0.98), y: 265 },
        { x: Math.round(wWaist * 0.65), y: totalLen },
      ],
      labels: [{ text: `${newProductName} FR`, position: { x: Math.round(wChest * 0.35), y: 220 }, type: 'title' }],
      measurements: {
        length: totalLen / 10,
        halfChest: (newMeasurements.bustChest + bustEase) / 2,
        waist: newMeasurements.waist + waistEase,
      },
    });

    // 2. Back Bodice Component
    const backPaths: PatternPathCommand[] = [
      { type: 'M', zone: 'neck', points: [{ x: 0, y: 45, name: 'Center Back Neck' }] },
      {
        type: 'C',
        zone: 'neck',
        points: [
          { x: 30, y: 45, isControl: true },
          { x: 72, y: 42, isControl: true },
          { x: 88 + (bespokeFit.neckWidth * 3), y: 40, name: 'Back HPS Neck Point' },
        ],
        annotation: 'Back Neckline',
      },
      { type: 'L', zone: 'shoulder', points: [{ x: Math.round(wShoulder * 0.55), y: 56, name: 'Back Shoulder Dart 1' }] },
      { type: 'L', zone: 'shoulder', points: [{ x: Math.round(wShoulder * 0.52), y: 130, name: 'Back Shoulder Dart Apex' }] },
      { type: 'L', zone: 'shoulder', points: [{ x: Math.round(wShoulder * 0.62), y: 59, name: 'Back Shoulder Dart 2' }] },
      { type: 'L', zone: 'shoulder', points: [{ x: wShoulder, y: 74 + shoulderSlopeDelta, name: 'Back Shoulder Tip' }] },
      {
        type: 'C',
        zone: 'armhole',
        points: [
          { x: Math.round(wShoulder * 0.92), y: 145, isControl: true },
          { x: Math.round(wChest * 0.92), y: 205, isControl: true },
          { x: wChest, y: 228 + armholeScyeDelta, name: 'Back Underarm Point' },
        ],
      },
      { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist + 15), y: totalLen, name: 'Back Side Waist' }] },
      { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.72 + waistDartSuppression), y: totalLen, name: 'Back Waist Dart Leg 2' }] },
      { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.62), y: 260, name: 'Back Waist Dart Apex' }] },
      { type: 'L', zone: 'waist', points: [{ x: Math.round(wWaist * 0.52 - waistDartSuppression), y: totalLen, name: 'Back Waist Dart Leg 1' }] },
      { type: 'L', zone: 'hem', points: [{ x: 0, y: totalLen, name: 'Center Back Waist' }] },
      { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 45 }] },
    ];

    components.push({
      id: 'back',
      pieceCode: 'BK-BD',
      name: `${newProductName} (Back Piece)`,
      cutInstruction: newClosure === 'invisible-zip' ? 'Cut 2 (Pair)' : 'Cut 1 on Fold',
      quantity: 1,
      offset: { x: Math.round(wChest * 1.35 + 80), y: 0 },
      grainline: {
        start: { x: 40, y: 90 },
        end: { x: 40, y: Math.max(140, totalLen - 40) },
        label: newClosure === 'invisible-zip' ? 'GRAINLINE (CB ZIP) ↕' : 'GRAINLINE (CB FOLD) ↕',
      },
      paths: backPaths,
      notches: [
        { x: Math.round(wShoulder * 0.92), y: 175 },
        { x: Math.round(wWaist * 0.62), y: totalLen },
      ],
      labels: [{ text: `${newProductName} BK`, position: { x: Math.round(wChest * 0.35), y: 200 }, type: 'title' }],
      measurements: {
        length: totalLen / 10,
        halfChest: (newMeasurements.bustChest + bustEase) / 2,
        waist: newMeasurements.waist + waistEase,
      },
    });

    // 3. Sleeve Component
    if (newSleeveStyle !== 'sleeveless') {
      let slvLen = 230;
      if (newSleeveStyle === 'cap') slvLen = 130;
      else if (newSleeveStyle === 'three-quarter') slvLen = 430;
      else if (newSleeveStyle === 'long' || newSleeveStyle === 'raglan') slvLen = 590;

      const slvWidth = Math.round(wChest * 1.05) + (bespokeFit.sleeveBicep * 10);
      const slvCrown = 145;

      const sleevePaths: PatternPathCommand[] = [
        { type: 'M', zone: 'sleeve-hem', points: [{ x: 0, y: slvLen, name: 'Underarm Hem L' }] },
        { type: 'L', zone: 'sleeve-seam', points: [{ x: 0, y: slvCrown, name: 'Front Underarm Bicep' }] },
        {
          type: 'C',
          zone: 'sleeve-cap',
          points: [
            { x: Math.round(slvWidth * 0.25), y: slvCrown * 0.45, isControl: true },
            { x: Math.round(slvWidth * 0.38), y: 0, isControl: true },
            { x: Math.round(slvWidth * 0.5), y: 0, name: 'Sleeve Cap Crown' },
          ],
        },
        {
          type: 'C',
          zone: 'sleeve-cap',
          points: [
            { x: Math.round(slvWidth * 0.62), y: 0, isControl: true },
            { x: Math.round(slvWidth * 0.75), y: slvCrown * 0.45, isControl: true },
            { x: slvWidth, y: slvCrown, name: 'Back Underarm Bicep' },
          ],
        },
        { type: 'L', zone: 'sleeve-seam', points: [{ x: slvWidth, y: slvLen, name: 'Underarm Hem R' }] },
        { type: 'L', zone: 'sleeve-hem', points: [{ x: 0, y: slvLen, name: 'Underarm Hem L' }] },
        { type: 'Z', zone: 'sleeve-hem', points: [{ x: 0, y: slvLen }] },
      ];

      components.push({
        id: 'sleeve',
        pieceCode: 'SLV',
        name: `${newProductName} (Sleeve Pair)`,
        cutInstruction: 'Cut 2 (Pair)',
        quantity: 2,
        offset: { x: Math.round((wChest * 1.35 + 80) * 2 + 50), y: 0 },
        grainline: {
          start: { x: Math.round(slvWidth * 0.5), y: 25 },
          end: { x: Math.round(slvWidth * 0.5), y: slvLen - 25 },
          label: 'GRAINLINE ↕',
        },
        paths: sleevePaths,
        notches: [
          { x: Math.round(slvWidth * 0.3), y: Math.round(slvCrown * 0.35) },
          { x: Math.round(slvWidth * 0.7), y: Math.round(slvCrown * 0.35) },
        ],
        labels: [{ text: `${newProductName} SLV`, position: { x: Math.round(slvWidth * 0.35), y: Math.round(slvLen * 0.5) }, type: 'title' }],
        measurements: {
          sleeveLength: slvLen / 10,
        },
      });
    }

    // 4. Pocket Component
    if (newPocket !== 'none') {
      components.push({
        id: 'pocket',
        pieceCode: 'PKT',
        name: 'Patch Pocket',
        cutInstruction: 'Cut 1',
        quantity: 1,
        offset: { x: 40, y: Math.round(totalLen + 60) },
        grainline: {
          start: { x: 55, y: 15 },
          end: { x: 55, y: 110 },
          label: 'GRAINLINE ↕',
        },
        paths: [
          { type: 'M', zone: 'hem', points: [{ x: 0, y: 0 }] },
          { type: 'L', zone: 'hem', points: [{ x: 110, y: 0 }] },
          { type: 'L', zone: 'hem', points: [{ x: 110, y: 110 }] },
          { type: 'L', zone: 'hem', points: [{ x: 55, y: 135 }] },
          { type: 'L', zone: 'hem', points: [{ x: 0, y: 110 }] },
          { type: 'Z', zone: 'hem', points: [{ x: 0, y: 0 }] },
        ],
        labels: [{ text: 'PKT', position: { x: 40, y: 55 }, type: 'title' }],
        notches: [],
        measurements: { length: 14 },
      });
    }

    return {
      id: `custom-prod-${Date.now()}`,
      name: newProductName,
      category: newProductCategory.toLowerCase() as any,
      version: 'tud v4.8',
      baseSize: currentSize,
      currentSize: currentSize,
      position: { x: 0, y: 0 },
      components,
      sizeTable: BASIC_BODICE_SIZE_TABLE,
    };
  };

  // Launch handlers
  const handleLaunchInEasyPattern = () => {
    const product = generateCustomGarmentProduct();
    setGarment(product);
    setEasyPatternStep(3);
    showToast(`🎉 "${newProductName}" created! Opening Step 3 Vector Draft Canvas.`);
  };

  const handleLaunchInCollab = () => {
    const product = generateCustomGarmentProduct();
    setGarment(product);
    setCADEngineMode('collab');
    showToast(`⚡ "${newProductName}" created! Opening in 3-in-1 Triple Collab Studio.`);
  };

  const handleLaunchInTukacad = () => {
    const product = generateCustomGarmentProduct();
    setGarment(product);
    setCADEngineMode('tukacad');
    setTukacadWorkflowStep(2);
    showToast(`📐 "${newProductName}" created! Opening in TUKAcad 2D Studio.`);
  };

  // ==========================================
  // DYNAMIC PARAMETRIC GEOMETRY GENERATOR
  // ==========================================
  const getComputedGeometry = () => {
    // Proportional size increments based on currentSize relative to S
    const sizeOffsets: Record<GarmentSize, { bust: number; waist: number; sh: number; len: number }> = {
      XS: { bust: -4.0, waist: -3.0, sh: -0.6, len: -1.0 },
      S:  { bust:  0.0, waist:  0.0, sh:  0.0, len:  0.0 },
      M:  { bust: +4.0, waist: +3.0, sh: +0.6, len: +1.0 },
      L:  { bust: +8.0, waist: +6.0, sh: +1.2, len: +2.0 },
      XL: { bust: +12.0,waist: +9.0, sh: +1.8, len: +3.0 },
      XXL:{ bust: +18.0,waist: +14.0,sh: +2.6, len: +4.5 },
    };

    const sz = sizeOffsets[currentSize] || sizeOffsets.S;
    const bDelta = (sz.bust + customDeltas.bust) * 2.4;
    const wDelta = (sz.waist + customDeltas.waist) * 2.4;
    const sDelta = (sz.sh + customDeltas.shoulder) * 3.5;
    const lDelta = (sz.len + customDeltas.length) * 3.2;

    const off = (key: string) => pointOffsets[key] || { dx: 0, dy: 0 };

    // Front Bodice landmarks
    const f_cfNeck = {
      id: 'f_cfNeck',
      piece: 'front' as const,
      name: 'Center Front Neck',
      x: 20 + off('f_cfNeck').dx,
      y: 95 + lDelta * 0.15 + off('f_cfNeck').dy,
    };
    const f_hps = {
      id: 'f_hps',
      piece: 'front' as const,
      name: 'HPS Shoulder',
      x: 108 + bDelta * 0.25 + off('f_hps').dx,
      y: 40 - lDelta * 0.1 + off('f_hps').dy,
    };
    const f_shTip = {
      id: 'f_shTip',
      piece: 'front' as const,
      name: 'Front Shoulder Tip',
      x: 220 + sDelta + bDelta * 0.3 + off('f_shTip').dx,
      y: 78 + off('f_shTip').dy,
    };
    const f_underarm = {
      id: 'f_underarm',
      piece: 'front' as const,
      name: 'Front Underarm Scye',
      x: 240 + bDelta * 0.65 + off('f_underarm').dx,
      y: 228 + lDelta * 0.25 + off('f_underarm').dy,
    };
    const f_apex = {
      id: 'f_apex',
      piece: 'front' as const,
      name: 'Bust Apex Point',
      x: 155 + bDelta * 0.3 + off('f_apex').dx,
      y: 285 + lDelta * 0.2 + off('f_apex').dy,
    };
    const f_bustDartTop = {
      id: 'f_bustDartTop',
      piece: 'front' as const,
      name: 'Bust Dart Top',
      x: 236 + bDelta * 0.6 + off('f_bustDartTop').dx,
      y: 265 - (dartParams.hasBustDart ? dartParams.bustDartWidth * 3 : 0) + off('f_bustDartTop').dy,
    };
    const f_bustDartBtm = {
      id: 'f_bustDartBtm',
      piece: 'front' as const,
      name: 'Bust Dart Bottom',
      x: 233 + bDelta * 0.6 + off('f_bustDartBtm').dx,
      y: 305 + (dartParams.hasBustDart ? dartParams.bustDartWidth * 3 : 0) + off('f_bustDartBtm').dy,
    };
    const f_sideWaist = {
      id: 'f_sideWaist',
      piece: 'front' as const,
      name: 'Front Side Waist',
      x: 225 + wDelta * 0.65 + off('f_sideWaist').dx,
      y: 440 + lDelta + off('f_sideWaist').dy,
    };
    const f_wDart2 = {
      id: 'f_wDart2',
      piece: 'front' as const,
      name: 'Waist Dart Leg 2',
      x: 160 + (dartParams.hasWaistDart ? dartParams.waistDartWidth * 3.5 : 0) + wDelta * 0.3 + off('f_wDart2').dx,
      y: 440 + lDelta + off('f_wDart2').dy,
    };
    const f_wDartApex = {
      id: 'f_wDartApex',
      piece: 'front' as const,
      name: 'Waist Dart Apex',
      x: 145 + wDelta * 0.2 + off('f_wDartApex').dx,
      y: 310 + lDelta * 0.3 - (dartParams.hasWaistDart ? dartParams.waistDartDepth * 2 : 0) + off('f_wDartApex').dy,
    };
    const f_wDart1 = {
      id: 'f_wDart1',
      piece: 'front' as const,
      name: 'Waist Dart Leg 1',
      x: 130 - (dartParams.hasWaistDart ? dartParams.waistDartWidth * 3.5 : 0) + wDelta * 0.2 + off('f_wDart1').dx,
      y: 440 + lDelta + off('f_wDart1').dy,
    };
    const f_cfWaist = {
      id: 'f_cfWaist',
      piece: 'front' as const,
      name: 'Center Front Waist',
      x: 20 + off('f_cfWaist').dx,
      y: 440 + lDelta + off('f_cfWaist').dy,
    };

    // Back Bodice landmarks
    const b_cbNeck = {
      id: 'b_cbNeck',
      piece: 'back' as const,
      name: 'Center Back Neck',
      x: 20 + off('b_cbNeck').dx,
      y: 45 + off('b_cbNeck').dy,
    };
    const b_hps = {
      id: 'b_hps',
      piece: 'back' as const,
      name: 'Back HPS',
      x: 102 + bDelta * 0.25 + off('b_hps').dx,
      y: 40 - lDelta * 0.1 + off('b_hps').dy,
    };
    const b_shDart1 = {
      id: 'b_shDart1',
      piece: 'back' as const,
      name: 'Back Shoulder Dart 1',
      x: 157 + sDelta * 0.5 + off('b_shDart1').dx,
      y: 56 + off('b_shDart1').dy,
    };
    const b_shDartApex = {
      id: 'b_shDartApex',
      piece: 'back' as const,
      name: 'Back Shoulder Dart Apex',
      x: 152 + sDelta * 0.5 + off('b_shDartApex').dx,
      y: 130 + off('b_shDartApex').dy,
    };
    const b_shDart2 = {
      id: 'b_shDart2',
      piece: 'back' as const,
      name: 'Back Shoulder Dart 2',
      x: 169 + sDelta * 0.5 + off('b_shDart2').dx,
      y: 59 + off('b_shDart2').dy,
    };
    const b_shTip = {
      id: 'b_shTip',
      piece: 'back' as const,
      name: 'Back Shoulder Tip',
      x: 220 + sDelta + bDelta * 0.3 + off('b_shTip').dx,
      y: 74 + off('b_shTip').dy,
    };
    const b_underarm = {
      id: 'b_underarm',
      piece: 'back' as const,
      name: 'Back Underarm Scye',
      x: 235 + bDelta * 0.65 + off('b_underarm').dx,
      y: 228 + lDelta * 0.25 + off('b_underarm').dy,
    };
    const b_sideWaist = {
      id: 'b_sideWaist',
      piece: 'back' as const,
      name: 'Back Side Waist',
      x: 220 + wDelta * 0.65 + off('b_sideWaist').dx,
      y: 440 + lDelta + off('b_sideWaist').dy,
    };
    const b_wDart2 = {
      id: 'b_wDart2',
      piece: 'back' as const,
      name: 'Back Waist Dart Leg 2',
      x: 155 + wDelta * 0.3 + off('b_wDart2').dx,
      y: 440 + lDelta + off('b_wDart2').dy,
    };
    const b_wDartApex = {
      id: 'b_wDartApex',
      piece: 'back' as const,
      name: 'Back Waist Dart Apex',
      x: 140 + wDelta * 0.2 + off('b_wDartApex').dx,
      y: 270 + lDelta * 0.3 + off('b_wDartApex').dy,
    };
    const b_wDart1 = {
      id: 'b_wDart1',
      piece: 'back' as const,
      name: 'Back Waist Dart Leg 1',
      x: 125 + wDelta * 0.1 + off('b_wDart1').dx,
      y: 440 + lDelta + off('b_wDart1').dy,
    };
    const b_cbWaist = {
      id: 'b_cbWaist',
      piece: 'back' as const,
      name: 'Center Back Waist',
      x: 20 + off('b_cbWaist').dx,
      y: 440 + lDelta + off('b_cbWaist').dy,
    };

    // Front Bodice SVG Path
    const frontPath = `M ${f_cfNeck.x} ${f_cfNeck.y} C ${f_cfNeck.x + 30} ${f_cfNeck.y + curveParams.neckDepth} ${f_hps.x - 20} ${f_hps.y + 15} ${f_hps.x} ${f_hps.y} L ${f_shTip.x} ${f_shTip.y} C ${f_shTip.x - 20} ${f_shTip.y + 70 + curveParams.armholeDepth} ${f_underarm.x - 15} ${f_underarm.y - 25} ${f_underarm.x} ${f_underarm.y} ${
      dartParams.hasBustDart
        ? `L ${f_bustDartTop.x} ${f_bustDartTop.y} L ${f_apex.x} ${f_apex.y} L ${f_bustDartBtm.x} ${f_bustDartBtm.y}`
        : ''
    } L ${f_sideWaist.x} ${f_sideWaist.y} ${
      dartParams.hasWaistDart
        ? `L ${f_wDart2.x} ${f_wDart2.y} L ${f_wDartApex.x} ${f_wDartApex.y} L ${f_wDart1.x} ${f_wDart1.y}`
        : ''
    } L ${f_cfWaist.x} ${f_cfWaist.y} Z`;

    // Back Bodice SVG Path
    const backPath = `M ${b_cbNeck.x} ${b_cbNeck.y} C ${b_cbNeck.x + 30} ${b_cbNeck.y} ${b_hps.x - 15} ${b_hps.y + 5} ${b_hps.x} ${b_hps.y} L ${b_shDart1.x} ${b_shDart1.y} L ${b_shDartApex.x} ${b_shDartApex.y} L ${b_shDart2.x} ${b_shDart2.y} L ${b_shTip.x} ${b_shTip.y} C ${b_shTip.x - 25} ${b_shTip.y + 65 + curveParams.armholeDepth} ${b_underarm.x - 15} ${b_underarm.y - 25} ${b_underarm.x} ${b_underarm.y} L ${b_sideWaist.x} ${b_sideWaist.y} L ${b_wDart2.x} ${b_wDart2.y} L ${b_wDartApex.x} ${b_wDartApex.y} L ${b_wDart1.x} ${b_wDart1.y} L ${b_cbWaist.x} ${b_cbWaist.y} Z`;

    const frontPointsList = [
      f_cfNeck, f_hps, f_shTip, f_underarm, f_apex,
      ...(dartParams.hasBustDart ? [f_bustDartTop, f_bustDartBtm] : []),
      f_sideWaist,
      ...(dartParams.hasWaistDart ? [f_wDart2, f_wDartApex, f_wDart1] : []),
      f_cfWaist,
    ];

    const backPointsList = [
      b_cbNeck, b_hps, b_shDart1, b_shDartApex, b_shDart2, b_shTip, b_underarm, b_sideWaist,
      b_wDart2, b_wDartApex, b_wDart1, b_cbWaist,
    ];

    return {
      front: {
        path: frontPath,
        points: frontPointsList,
        apex: f_apex,
        bustDartTop: f_bustDartTop,
        bustDartBtm: f_bustDartBtm,
        wDartApex: f_wDartApex,
        wDart1: f_wDart1,
        wDart2: f_wDart2,
        underarm: f_underarm,
        shTip: f_shTip,
        hps: f_hps,
        cfNeck: f_cfNeck,
        cfWaist: f_cfWaist,
        sideWaist: f_sideWaist,
      },
      back: {
        path: backPath,
        points: backPointsList,
        b_shDartApex,
        b_shDart1,
        b_shDart2,
        b_wDartApex,
        b_wDart1,
        b_wDart2,
        b_underarm,
        b_shTip,
        b_hps,
        b_cbNeck,
        b_cbWaist,
        b_sideWaist,
      },
    };
  };

  const geo = getComputedGeometry();

  // Selected point object
  const allLandmarks = [...geo.front.points, ...geo.back.points];
  const selectedPointObj = allLandmarks.find((p) => p.id === selectedPointId) || null;

  // Real-world Point-of-Measure (POM) calculation
  const baseSpecs = BASIC_BODICE_SIZE_TABLE[currentSize] || BASIC_BODICE_SIZE_TABLE.S;
  const currentBustCm = (baseSpecs.bust + customDeltas.bust).toFixed(1);
  const currentWaistCm = (baseSpecs.waist + customDeltas.waist).toFixed(1);
  const currentShoulderCm = (baseSpecs.shoulderWidth + customDeltas.shoulder).toFixed(1);
  const currentLengthCm = (baseSpecs.length + customDeltas.length).toFixed(1);

  // ==========================================
  // MOUSE EVENT HANDLERS FOR SVG CANVAS
  // ==========================================
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 760);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 560);

    // If Point Tool is active: drop a new mark point!
    if (easyPatternTool === 'point') {
      const piece = x < 380 ? 'front' : 'back';
      const relX = piece === 'front' ? x - 40 : x - 400;
      const relY = y - 30;
      const newPt: CustomPoint = {
        id: `custom_${Date.now()}`,
        name: `Mark P${customPoints.length + 1}`,
        x: relX,
        y: relY,
        piece,
      };
      setCustomPoints([...customPoints, newPt]);
      showToast(`Added custom point "${newPt.name}" at (${relX}, ${relY})`);
    }
  };

  const handleLandmarkClick = (pt: { id: string; name: string; x: number; y: number; piece: 'front' | 'back' }, e: React.MouseEvent) => {
    e.stopPropagation();

    if (easyPatternTool === 'select') {
      setSelectedPointId(pt.id);
      setDraggingPointId(pt.id);
      showToast(`Selected "${pt.name}"`);
    } else if (easyPatternTool === 'measure') {
      const canvasX = pt.piece === 'front' ? pt.x + 40 : pt.x + 400;
      const canvasY = pt.y + 30;

      if (!measurePoint1 || (measurePoint1 && measurePoint2)) {
        setMeasurePoint1({ x: canvasX, y: canvasY, name: pt.name });
        setMeasurePoint2(null);
        showToast(`Point A: ${pt.name}. Now click Point B.`);
      } else {
        setMeasurePoint2({ x: canvasX, y: canvasY, name: pt.name });
        const dx = canvasX - measurePoint1.x;
        const dy = canvasY - measurePoint1.y;
        const distPx = Math.sqrt(dx * dx + dy * dy);
        const distCm = (distPx * 0.1).toFixed(1);
        const distIn = (distPx * 0.1 / 2.54).toFixed(2);
        showToast(`Measured: ${distCm} cm (${distIn} in) between ${measurePoint1.name} & ${pt.name}`);
      }
    } else if (easyPatternTool === 'line') {
      const canvasX = pt.piece === 'front' ? pt.x + 40 : pt.x + 400;
      const canvasY = pt.y + 30;

      if (!lineStartPoint) {
        setLineStartPoint({ x: canvasX, y: canvasY, name: pt.name });
        showToast(`Line start: ${pt.name}. Click end landmark.`);
      } else {
        const dx = canvasX - lineStartPoint.x;
        const dy = canvasY - lineStartPoint.y;
        const lengthCm = Number((Math.sqrt(dx * dx + dy * dy) * 0.1).toFixed(1));
        const newLine: ConstructionLine = {
          id: `line_${Date.now()}`,
          name: `${lineStartPoint.name} → ${pt.name}`,
          p1: lineStartPoint,
          p2: { x: canvasX, y: canvasY, name: pt.name },
          lengthCm,
        };
        setConstructionLines([...constructionLines, newLine]);
        setLineStartPoint(null);
        showToast(`Created guideline (${lengthCm} cm)`);
      }
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingPointId || !svgRef.current || easyPatternTool !== 'select') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 760;
    const y = ((e.clientY - rect.top) / rect.height) * 560;

    const isBack = draggingPointId.startsWith('b_');
    const baseX = isBack ? 400 : 40;
    const baseY = 30;

    const relX = Math.round(x - baseX);
    const relY = Math.round(y - baseY);

    setPointOffsets((prev) => ({
      ...prev,
      [draggingPointId]: {
        dx: (prev[draggingPointId]?.dx || 0) + (e.movementX * 0.9),
        dy: (prev[draggingPointId]?.dy || 0) + (e.movementY * 0.9),
      },
    }));
  };

  const handleSvgMouseUp = () => {
    if (draggingPointId) {
      setDraggingPointId(null);
    }
  };

  const nudgePoint = (dx: number, dy: number) => {
    if (!selectedPointId) return;
    setPointOffsets((prev) => ({
      ...prev,
      [selectedPointId]: {
        dx: (prev[selectedPointId]?.dx || 0) + dx,
        dy: (prev[selectedPointId]?.dy || 0) + dy,
      },
    }));
  };

  const resetSelectedPoint = () => {
    if (!selectedPointId) return;
    setPointOffsets((prev) => {
      const next = { ...prev };
      delete next[selectedPointId];
      return next;
    });
    showToast('Reset selected point to standard position.');
  };

  // Step 8 Export Handler with real download
  const handleExport = () => {
    let filename = `EasyPattern-${garment.name.replace(/\s+/g, '_')}-${currentSize}`;
    let content = '';
    let mimeType = 'text/plain';

    if (exportFormat === 'pdf' || exportFormat === 'png') {
      filename += '.svg';
      mimeType = 'image/svg+xml';
      if (garment && garment.components && garment.components.length > 2) {
        const isTr = garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant');
        const compSvgs = garment.components.map((c) => {
          const dStr = pathCommandsToSvgString(c.paths);
          return `  <g transform="translate(${c.offset.x}, ${c.offset.y})">\n` +
                 `    <path d="${dStr}" fill="none" stroke="#2563eb" stroke-width="2" />\n` +
                 `    <text x="15" y="30" font-size="12" font-weight="bold" fill="#0f172a">${c.name} (${c.cutInstruction})</text>\n` +
                 `  </g>`;
        }).join('\n');
        content = `<!-- EasyPattern Vector Output - ${garment.name} (${garment.components.length} Pieces - Size: ${currentSize}) -->\n` +
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${isTr ? 1560 : 1480} ${isTr ? 1150 : 880}" width="${isTr ? 1560 : 1480}" height="${isTr ? 1150 : 880}">\n` +
          `  <rect width="100%" height="100%" fill="#f8fafc" />\n` +
          `  <text x="40" y="35" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">EasyPattern CAD - ${garment.name}</text>\n` +
          `  <text x="40" y="58" font-family="sans-serif" font-size="12" fill="#64748b">Size: ${currentSize} | SA: ${seamAllowanceCm}cm | Pieces: ${garment.components.length}</text>\n` +
          compSvgs + '\n' +
          `</svg>`;
      } else {
        content = `<!-- EasyPattern Vector Output - ${garment.name} (Size: ${currentSize}) -->\n` +
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">\n` +
          `  <rect width="1000" height="700" fill="#f8fafc" />\n` +
          `  <text x="50" y="40" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">EasyPattern - ${garment.name}</text>\n` +
          `  <text x="50" y="65" font-family="sans-serif" font-size="12" fill="#64748b">Size: ${currentSize} | SA: ${seamAllowanceCm}cm | Notch: ${notchSizeCm}cm | Bust: ${currentBustCm}cm | Waist: ${currentWaistCm}cm</text>\n` +
          `  <g transform="translate(60, 100)">\n` +
          `    <path d="${geo.front.path}" fill="none" stroke="#2563eb" stroke-width="2" />\n` +
          `    <text x="20" y="20" font-size="14" font-weight="bold" fill="#1e293b">FRONT BODICE (Cut 1 on fold)</text>\n` +
          `  </g>\n` +
          `  <g transform="translate(500, 100)">\n` +
          `    <path d="${geo.back.path}" fill="none" stroke="#2563eb" stroke-width="2" />\n` +
          `    <text x="20" y="20" font-size="14" font-weight="bold" fill="#1e293b">BACK BODICE (Cut 1 on fold)</text>\n` +
          `  </g>\n` +
          `</svg>`;
      }
    } else if (exportFormat === 'dxf') {
      filename += '.dxf';
      content = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n` +
        `0\nTEXT\n8\nLABELS\n10\n60.0\n20\n100.0\n40\n12.0\n1\nEASYPATTERN ${garment.name.toUpperCase()} SIZE ${currentSize} BUST ${currentBustCm}\n` +
        `0\nENDSEC\n0\nEOF\n`;
    } else {
      filename += '.aama';
      content = `AAMA-ASTM-D6673-EXPORT\nSTYLE: ${garment.name}\nBASE_SIZE: ${garment.baseSize}\nACTIVE_SIZE: ${currentSize}\n` +
        `BUST: ${currentBustCm} CM\nWAIST: ${currentWaistCm} CM\nSEAM_ALLOWANCE: ${seamAllowanceCm} CM\nNOTCH_SIZE: ${notchSizeCm} CM\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
    showToast(`Downloaded ${filename} successfully!`);
  };

  // Steps breadcrumb
  const steps: Array<{ step: EasyPatternStep; title: string; subtitle: string }> = [
    { step: 1, title: 'Open EasyPattern', subtitle: 'Launch & project hub' },
    { step: 2, title: 'Select Garment & Size', subtitle: 'Category & measurements' },
    { step: 3, title: 'Draft the Pattern', subtitle: 'Interactive vector draft' },
    { step: 4, title: 'Add Details & Edit', subtitle: 'Darts, seams, notches' },
    { step: 5, title: 'Grade the Pattern', subtitle: 'Rules & auto-grading' },
    { step: 6, title: 'Nest the Pattern', subtitle: 'Multi-size stack view' },
    { step: 7, title: 'Preview & Check', subtitle: 'Marker & fabric inspect' },
    { step: 8, title: 'Export Project', subtitle: 'PDF, DXF, AAMA output' },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f1f5f9] select-none font-sans text-slate-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. TOP NAVBAR: Brand + 8 Steps Stepper + Sizing Switcher       */}
      {/* ============================================================== */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-30">
        {/* Left Brand Badge + New File Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-500/20 tracking-tighter">
              EP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  EasyPattern
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  For beginners
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Simple · Learn · Create
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('new')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            title="New File (Pattern Generation Workflow)"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-100" />
            <span>New File</span>
          </button>
        </div>

        {/* Center: 8-Step Interactive Progress Stepper */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          {steps.map((s) => {
            const isActive = easyPatternStep === s.step;
            const isCompleted = easyPatternStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setEasyPatternStep(s.step);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-1 ring-blue-500'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-white/80'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
                title={`Step ${s.step}: ${s.title}`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </span>
                <span className="truncate max-w-[100px] xl:max-w-none text-[11px]">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Action Switchers */}
        <div className="flex items-center gap-2">
          {/* Men's Shirt Master Spec Sheet (Image 1 Exact Match) */}
          <button
            onClick={() => setIsShirtMasterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white border border-blue-500 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/20"
            title="Open Men's Shirt Basic Pattern Technical Specification & Measurement Sheet (Image 1 Match)"
          >
            <Shirt className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">Shirt Spec (Image 1)</span>
          </button>

          {/* Men's Trouser Master Spec Sheet (9 Production CAD Pieces) */}
          <button
            onClick={() => setIsTrouserMasterModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white border border-emerald-500 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
            title="Open Men's Tailored Trouser Technical Specification & 9-Piece Pattern Blueprint"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">Trouser Spec (9 CAD)</span>
          </button>

          {/* Workflow Guide Button */}
          <button
            onClick={() => setIsWorkflowModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Open Complete Start-to-Finish Workflow Infographic"
          >
            <Map className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Workflow Guide</span>
          </button>

          {/* Transfer to TUKAcad CTA */}
          <button
            onClick={transferToTukacad}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
            title="Send pattern to TUKAcAd for Professional CAD production"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Transfer to TUKAcad</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {/* Engine Mode Switcher Pill */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setCADEngineMode('easypattern')}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white text-blue-700 shadow-2xs"
            >
              EasyPattern
            </button>
            <button
              onClick={() => setCADEngineMode('tukacad')}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-500 hover:text-slate-800"
            >
              TUKAcad
            </button>
            <button
              onClick={() => setCADEngineMode('clo3d')}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-500 hover:text-slate-800"
            >
              CLO 3D
            </button>
            <button
              onClick={() => setCADEngineMode('collab')}
              className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs hover:from-emerald-400 hover:to-teal-500 flex items-center gap-1"
              title="Launch 3-in-1 Triple Engine Collab Studio (EasyPattern + TUKAcad 2D + CLO 3D)"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>⚡ Collab</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. DYNAMIC WORKFLOW CONTENT                                    */}
      {/* ============================================================== */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* ============================================================== */}
        {/* STEP 1: COMPREHENSIVE PRODUCT CREATION STUDIO & LAUNCHPAD      */}
        {/* ============================================================== */}
        {easyPatternStep === 1 && (
          <div className="flex-1 flex h-full bg-[#f8fafc] overflow-hidden">
            {/* 1. Left Navigation Sidebar */}
            <div className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs z-10">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  EasyPattern Navigation
                </div>
                <button
                  onClick={() => setActiveModal('new')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500"
                  title="New File: Select Pattern -> Enter Measurements -> OK -> Generate Pattern"
                >
                  <FolderPlus className="w-4 h-4 text-blue-200" />
                  <span>New File (Workflow)</span>
                </button>
                <button
                  onClick={() => setStep1Tab('create-studio')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    step1Tab === 'create-studio'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Product Studio</span>
                </button>
                <button
                  onClick={() => setStep1Tab('library')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    step1Tab === 'library'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>13 Ready Slopers</span>
                </button>
                <button
                  onClick={() => setStep1Tab('recent')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    step1Tab === 'recent'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent & Import</span>
                </button>
                <button
                  onClick={() => setStep1Tab('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    step1Tab === 'settings'
                      ? 'bg-slate-800 text-white shadow-md shadow-slate-700/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Specs</span>
                </button>
                <button
                  onClick={() => setStep1Tab('tutorial')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    step1Tab === 'tutorial'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Tutorial & Help</span>
                </button>
              </div>

              {/* Version & Active Mode Badge */}
              <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-[11px]">EasyPattern CAD</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black">v1.2 PRO</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  End-to-End Product Design to TUKAcad Production
                </div>
              </div>
            </div>

            {/* 2. Main Stage Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* TAB 1: CUSTOM PRODUCT CREATION STUDIO (End-to-End from Scratch) */}
              {step1Tab === 'create-studio' && (
                <div className="flex-1 flex h-full overflow-hidden">
                  {/* Left Column: Comprehensive Edit & Customization Options (Scrollable) */}
                  <div className="w-[480px] xl:w-[520px] h-full overflow-y-auto p-6 bg-white border-r border-slate-200 space-y-6 shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                          Product Creator
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Start from scratch</span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                        Create Custom Garment Product
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customize silhouette, neckline, darts, sleeves, length, and precision dimensions.
                      </p>
                    </div>

                    {/* Section 1: Product Identity */}
                    <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          1. Product Name & Category
                        </label>
                      </div>

                      {/* Dual Master Spec Quick-Load Banners (Shirt & Trouser) */}
                      <div className="space-y-2">
                        {/* 1. Men's Shirt Master Spec */}
                        <div className={`p-3 rounded-xl border transition-all ${
                          newProductArchetype === 'shirt'
                            ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-blue-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">👔</span>
                                <span className="font-extrabold text-xs text-blue-950">Men's Shirt – Basic Pattern</span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black uppercase">
                                  Image 1 Match
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                                Chest 100 • Waist 92 • 10 CAD pieces with full technical dimensions & seam rules.
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={loadMensShirtImage1Spec}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-all"
                              >
                                Load Shirt
                              </button>
                              <button
                                onClick={() => setIsShirtMasterModalOpen(true)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
                                title="View Full Technical Master Sheet (Image 1)"
                              >
                                <Info className="w-3.5 h-3.5 text-blue-700" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 2. Men's Tailored Trouser Master Spec */}
                        <div className={`p-3 rounded-xl border transition-all ${
                          newProductArchetype === 'trouser'
                            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-emerald-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">👖</span>
                                <span className="font-extrabold text-xs text-emerald-950">Men's Tailored Trouser</span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                                  9 CAD Pieces
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                                Waist 84 • Hip 100 • Inseam 78 • Complete 9-piece production set & cutting marker.
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={loadMensTrouserMasterSpec}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all"
                              >
                                Load Trouser
                              </button>
                              <button
                                onClick={() => setIsTrouserMasterModalOpen(true)}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
                                title="View Full Trouser Master Specification & 9-Piece Blueprint"
                              >
                                <Info className="w-3.5 h-3.5 text-emerald-700" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Archetype Selector */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Garment Archetype:</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'shirt', name: "Men's Shirt (Image 1)", icon: '👔', cat: 'Men' },
                            { id: 'trouser', name: "Tailored Trouser (9 CAD)", icon: '👖', cat: 'Men' },
                            { id: 'basic-bodice', name: "Tailored Bodice", icon: '👗', cat: 'Women' },
                            { id: 'basic-tshirt', name: "Crew T-Shirt", icon: '👕', cat: 'Unisex' },
                          ].map((arch) => (
                            <button
                              key={arch.id}
                              onClick={() => {
                                setNewProductArchetype(arch.id as any);
                                if (arch.id === 'shirt') {
                                  loadMensShirtImage1Spec();
                                } else if (arch.id === 'trouser') {
                                  loadMensTrouserMasterSpec();
                                } else if (arch.id === 'basic-bodice') {
                                  setNewProductName("Women's Tailored Bodice");
                                  setNewProductCategory('Women');
                                } else if (arch.id === 'basic-tshirt') {
                                  setNewProductName('Basic Crew T-Shirt');
                                  setNewProductCategory('Unisex');
                                }
                              }}
                              className={`p-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                newProductArchetype === arch.id
                                  ? arch.id === 'trouser' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>{arch.icon}</span>
                              <span className="truncate">{arch.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="e.g. Women's Summer Bodice"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                      />

                      {/* Category Pills */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Gender / Market Category:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(['Women', 'Men', 'Unisex', 'Outerwear', 'Bottoms'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setNewProductCategory(cat)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                newProductCategory === cat
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Style & Silhouette Architecture ("innum nara edit pannra option") */}
                    <div className="space-y-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                        <span>2. Style & Silhouette Architecture</span>
                        <span className="text-[10px] text-blue-600 font-semibold">Live updates in 2D preview →</span>
                      </div>

                      {/* A. SHIRT TAILORING CONTROLS */}
                      {newProductArchetype === 'shirt' && (
                        <div className="space-y-3.5">
                          {/* Silhouette Fit */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Shirt Fit Silhouette:</span>
                              <span className="text-blue-600 uppercase text-[10px] font-bold">
                                {newSilhouetteFit === 'slim' ? 'Fitted Slim (0 ease)' : newSilhouetteFit === 'regular' ? 'Classic Tailored (+4cm ease)' : newSilhouetteFit === 'relaxed' ? 'Loose Comfort (+8cm ease)' : 'Oversized (+14cm ease)'}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {(['slim', 'regular', 'relaxed', 'oversized'] as const).map((fit) => (
                                <button
                                  key={fit}
                                  onClick={() => setNewSilhouetteFit(fit)}
                                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                    newSilhouetteFit === fit
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {fit}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 1. Collar Style (6 Options) */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Collar Architecture:</span>
                              <span className="text-indigo-600 text-[10px] font-bold">{shirtCollarStyle.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'classic-point', name: 'Classic Point', icon: '👔' },
                                { id: 'button-down', name: 'Button-Down', icon: '🔘' },
                                { id: 'spread', name: 'Spread Collar', icon: '📐' },
                                { id: 'mandarin-band', name: 'Mandarin Band', icon: '⛩️' },
                                { id: 'cuban-camp', name: 'Cuban / Camp', icon: '🌴' },
                                { id: 'cutaway', name: 'Wide Cutaway', icon: '✂️' },
                              ].map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => setShirtCollarStyle(c.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1 ${
                                    shirtCollarStyle === c.id
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <span className="text-xs">{c.icon}</span>
                                  <span className="truncate">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Cuff Style (4 Options) */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Cuff Construction:</span>
                              <span className="text-rose-600 text-[10px] font-bold">{shirtCuffStyle.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'single-round', name: 'Single Round (1-Btn)' },
                                { id: 'mitred-angle', name: 'Mitred Angle (2-Btn)' },
                                { id: 'french-double', name: 'French Double Fold' },
                                { id: 'square-cut', name: 'Square Barrel Cuff' },
                              ].map((cuff) => (
                                <button
                                  key={cuff.id}
                                  onClick={() => setShirtCuffStyle(cuff.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-left transition-all truncate ${
                                    shirtCuffStyle === cuff.id
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {cuff.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 3. Placket Style (4 Options) */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Front Placket System:</span>
                              <span className="text-emerald-600 text-[10px] font-bold">{shirtPlacketStyle.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'box-placket', name: 'Box Placket (3.5cm)' },
                                { id: 'french-clean', name: 'French Clean Seamless' },
                                { id: 'concealed-fly', name: 'Concealed Fly (Hidden)' },
                                { id: 'popover', name: '4-Button Popover' },
                              ].map((plk) => (
                                <button
                                  key={plk.id}
                                  onClick={() => setShirtPlacketStyle(plk.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-left transition-all truncate ${
                                    shirtPlacketStyle === plk.id
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {plk.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 4. Chest Pocket Style (5 Options) */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Chest Pocket:</span>
                              <span className="text-amber-600 text-[10px] font-bold">{shirtPocketStyle.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'patch-chevron', name: 'Chevron 13×14' },
                                { id: 'rounded-patch', name: 'Round Patch' },
                                { id: 'flap-pocket', name: 'Button Flap' },
                                { id: 'dual-pockets', name: 'Dual Flaps' },
                                { id: 'none', name: 'Clean / None' },
                              ].map((pkt) => (
                                <button
                                  key={pkt.id}
                                  onClick={() => setShirtPocketStyle(pkt.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all truncate ${
                                    shirtPocketStyle === pkt.id
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {pkt.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 5. Yoke & Pleats Row */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Back Yoke Style:</div>
                              <select
                                value={shirtYokeStyle}
                                onChange={(e) => setShirtYokeStyle(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="classic-yoke">Classic 1-Piece (8cm)</option>
                                <option value="split-western">Split Yoke Western</option>
                                <option value="deep-curve">Deep Scye Curve</option>
                                <option value="seamless">Seamless Clean Back</option>
                              </select>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Back Pleats / Shaping:</div>
                              <select
                                value={shirtPleatStyle}
                                onChange={(e) => setShirtPleatStyle(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="box-pleat">Center Box Pleat</option>
                                <option value="knife-pleats">Side Knife Pleats</option>
                                <option value="back-darts">Dual Waist Darts</option>
                                <option value="plain-clean">Plain Clean Back</option>
                              </select>
                            </div>
                          </div>

                          {/* 6. Hemline Finish */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Hemline Architecture:</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'shirttail-curved', name: 'Curved Shirttail' },
                                { id: 'straight-side-slits', name: 'Straight + 5cm Slits' },
                                { id: 'deep-scoop', name: 'Deep Scoop Curve' },
                              ].map((h) => (
                                <button
                                  key={h.id}
                                  onClick={() => setShirtHemStyle(h.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all truncate ${
                                    shirtHemStyle === h.id
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {h.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* B. TROUSER TAILORING CONTROLS */}
                      {newProductArchetype === 'trouser' && (
                        <div className="space-y-3.5">
                          {/* 1. Silhouette & Leg Fit (5 Options) */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Leg Cut Silhouette:</span>
                              <span className="text-emerald-600 text-[10px] font-bold">{pantSilhouette.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'classic-straight', name: 'Classic Straight' },
                                { id: 'slim-chino', name: 'Slim Tapered' },
                                { id: 'relaxed-tailored', name: 'Relaxed Tailored' },
                                { id: 'wide-leg', name: 'Wide Leg Drape' },
                                { id: 'tapered-crop', name: 'Tapered Cropped' },
                              ].map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => setPantSilhouette(s.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all truncate ${
                                    pantSilhouette === s.id
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Rise Level & Front Pleats */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Rise Height:</div>
                              <select
                                value={pantRise}
                                onChange={(e) => setPantRise(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="mid-rise">Standard Mid-Rise (26cm)</option>
                                <option value="high-rise">High-Rise Tailored (30cm)</option>
                                <option value="low-rise">Modern Low-Rise (23cm)</option>
                              </select>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Front Pleat Style:</div>
                              <select
                                value={pantFrontStyle}
                                onChange={(e) => setPantFrontStyle(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="flat-front">Flat Front Clean</option>
                                <option value="single-pleat">Single Pleat (+2cm)</option>
                                <option value="double-pleat">Double Pleat (+3.5cm)</option>
                              </select>
                            </div>
                          </div>

                          {/* 3. Waistband Construction */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Waistband Construction:</span>
                              <span className="text-teal-600 text-[10px] font-bold">{pantWaistbandStyle.replace('-', ' ').toUpperCase()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'standard-4cm', name: 'Standard 4cm + Loops' },
                                { id: 'extended-tab', name: 'Gurkha Extended Tab' },
                                { id: 'hollywood-seamless', name: 'Hollywood Seamless' },
                                { id: 'drawstring-hybrid', name: 'Drawstring Hybrid' },
                              ].map((wb) => (
                                <button
                                  key={wb.id}
                                  onClick={() => setPantWaistbandStyle(wb.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-left transition-all truncate ${
                                    pantWaistbandStyle === wb.id
                                      ? 'bg-teal-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {wb.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 4. Front & Back Pocket Design */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Front Pockets:</div>
                              <select
                                value={pantPocketStyle}
                                onChange={(e) => setPantPocketStyle(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="slant-chino">Slanted Chino (14cm)</option>
                                <option value="on-seam">On-Seam Invisible</option>
                                <option value="j-pocket-jeans">Western Curved J-Pkt</option>
                                <option value="coin-ticket">Slant + Ticket Watch</option>
                              </select>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Back Pockets:</div>
                              <select
                                value={pantBackPocketStyle}
                                onChange={(e) => setPantBackPocketStyle(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="double-welt">Dual Double-Welt (16cm)</option>
                                <option value="button-welt">Single Welt + Button</option>
                                <option value="patch-pockets">Tailored Patch Pkts</option>
                                <option value="no-pocket">Clean (No Pocket)</option>
                              </select>
                            </div>
                          </div>

                          {/* 5. Trouser Hem Finish */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Trouser Hemline Finish:</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'plain-hem', name: 'Plain Blind Hem (4cm)' },
                                { id: 'turn-up-cuff', name: '1.5" Turn-Up Cuff' },
                                { id: 'tapered-slit', name: 'Ankle Slit Opening' },
                              ].map((h) => (
                                <button
                                  key={h.id}
                                  onClick={() => setPantHemStyle(h.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all truncate ${
                                    pantHemStyle === h.id
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {h.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* C. STANDARD BODICE / T-SHIRT CONTROLS */}
                      {newProductArchetype !== 'shirt' && newProductArchetype !== 'trouser' && (
                        <div className="space-y-3.5">
                          {/* Silhouette Fit */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                              <span>Silhouette Fit:</span>
                              <span className="text-blue-600 uppercase text-[10px]">
                                {newSilhouetteFit === 'slim' ? 'Fitted (0 ease)' : newSilhouetteFit === 'regular' ? 'Classic (+4cm ease)' : newSilhouetteFit === 'relaxed' ? 'Loose (+8cm ease)' : 'Oversized (+14cm ease)'}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {(['slim', 'regular', 'relaxed', 'oversized'] as const).map((fit) => (
                                <button
                                  key={fit}
                                  onClick={() => setNewSilhouetteFit(fit)}
                                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                    newSilhouetteFit === fit
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {fit}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Neckline Style */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Neckline Design:</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'crew', name: 'Crew Neck' },
                                { id: 'v-neck', name: 'V-Neck Plunge' },
                                { id: 'scoop', name: 'Wide Scoop' },
                                { id: 'boat', name: 'Boat Neck' },
                                { id: 'mandarin', name: 'Mandarin Band' },
                                { id: 'shirt-collar', name: 'Shirt Collar' },
                              ].map((neck) => (
                                <button
                                  key={neck.id}
                                  onClick={() => setNewNecklineStyle(neck.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                                    newNecklineStyle === neck.id
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {neck.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dart & Contour Architecture */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Dart & Shaping System:</div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'waist-bust', name: 'Waist + Bust Dart (Classic)' },
                                { id: 'french', name: 'French Diagonal Dart' },
                                { id: 'princess', name: 'Princess Seam Line' },
                                { id: 'dartless', name: 'Dartless Relaxed Fit' },
                              ].map((d) => (
                                <button
                                  key={d.id}
                                  onClick={() => setNewDartStyle(d.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-left transition-all truncate ${
                                    newDartStyle === d.id
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title={d.name}
                                >
                                  {d.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sleeve Style */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Sleeve Construction:</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'sleeveless', name: 'Sleeveless' },
                                { id: 'cap', name: 'Cap Sleeve' },
                                { id: 'short', name: 'Short (22cm)' },
                                { id: 'three-quarter', name: '3/4 (44cm)' },
                                { id: 'long', name: 'Long (58cm)' },
                                { id: 'raglan', name: 'Raglan Sleeve' },
                              ].map((slv) => (
                                <button
                                  key={slv.id}
                                  onClick={() => setNewSleeveStyle(slv.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                                    newSleeveStyle === slv.id
                                      ? 'bg-rose-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {slv.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Length & Hem Style */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-600">Garment Length:</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'cropped', name: 'Cropped (38cm)' },
                                { id: 'waist', name: 'Waist (45cm)' },
                                { id: 'hip', name: 'Hip Length (60cm)' },
                                { id: 'tunic', name: 'Tunic (76cm)' },
                                { id: 'knee', name: 'Knee (98cm)' },
                                { id: 'maxi', name: 'Maxi (132cm)' },
                              ].map((len) => (
                                <button
                                  key={len.id}
                                  onClick={() => setNewHemLength(len.id as any)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                                    newHemLength === len.id
                                      ? 'bg-teal-600 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {len.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Hem Shape & Closure */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Hemline Shape:</div>
                              <select
                                value={newHemShape}
                                onChange={(e) => setNewHemShape(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="straight">Straight Clean Hem</option>
                                <option value="shirttail">Curved Shirttail Hem</option>
                                <option value="asymmetric">High-Low Asymmetric</option>
                              </select>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-600 mb-1">Closure / Placket:</div>
                              <select
                                value={newClosure}
                                onChange={(e) => setNewClosure(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                              >
                                <option value="pullover">Pullover / Stretch</option>
                                <option value="button-placket">Front Button Placket</option>
                                <option value="invisible-zip">Back Invisible Zip</option>
                                <option value="wrap">Side Wrap & Tie</option>
                              </select>
                            </div>
                          </div>

                          {/* Pockets */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-600 mb-1">Pockets:</div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { id: 'none', name: 'None' },
                                { id: 'chest-patch', name: 'Patch Pkt' },
                                { id: 'inseam', name: 'In-Seam' },
                                { id: 'flap-welt', name: 'Flap Welt' },
                              ].map((pkt) => (
                                <button
                                  key={pkt.id}
                                  onClick={() => setNewPocket(pkt.id as any)}
                                  className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    newPocket === pkt.id
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {pkt.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 3: Precision Measurements & Fit */}
                    <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          3. Sizing & Precision Measurements (cm)
                        </label>
                        {/* Size Switcher */}
                        <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200">
                          {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setCurrentSize(sz)}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                                currentSize === sz
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Measurements Grid */}
                      {newProductArchetype === 'trouser' ? (
                        /* 👖 TROUSER 9 PRECISION PRODUCTION MEASUREMENTS */
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* 1. Waist */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Waist Circumference:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 84cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.waist} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, waist: Math.max(60, +(m.waist - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, waist: Math.min(130, +(m.waist + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Hip */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Hip Circumference:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 100cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.hip} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, hip: Math.max(70, +(m.hip - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, hip: Math.min(145, +(m.hip + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Inseam */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Inseam Length:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 78cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.inseam} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, inseam: Math.max(60, +(m.inseam - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, inseam: Math.min(96, +(m.inseam + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Outseam */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Outseam Length:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 104cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.outseam} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, outseam: Math.max(80, +(m.outseam - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, outseam: Math.min(125, +(m.outseam + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Thigh */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Thigh Girth:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 62cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.thigh} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, thigh: Math.max(45, +(m.thigh - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, thigh: Math.min(85, +(m.thigh + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Knee */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Knee Girth:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 44cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.knee} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, knee: Math.max(30, +(m.knee - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, knee: Math.min(60, +(m.knee + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 7. Hem Opening */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Hem Opening (Half):</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 19cm (38)</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.hemWidth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, hemWidth: Math.max(12, +(m.hemWidth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, hemWidth: Math.min(32, +(m.hemWidth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 8. Front Rise */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Front Rise:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 26cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.frontRise} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, frontRise: Math.max(18, +(m.frontRise - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, frontRise: Math.min(36, +(m.frontRise + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 9. Back Rise */}
                          <div className="col-span-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Back Rise:</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Spec: 38cm (+12cm curve)</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{pantMeasurements.backRise} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, backRise: Math.max(28, +(m.backRise - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setPantMeasurements((m) => ({ ...m, backRise: Math.min(48, +(m.backRise + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* 👔 SHIRT & BODICE 10 PRECISION MEASUREMENTS */
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* 1. Chest */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Chest / Bust:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 100cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.bustChest} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, bustChest: Math.max(70, +(m.bustChest - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, bustChest: Math.min(140, +(m.bustChest + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Waist */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Waist:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 92cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.waist} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, waist: Math.max(50, +(m.waist - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, waist: Math.min(130, +(m.waist + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Hip */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Hip:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 100cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.hip} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, hip: Math.max(60, +(m.hip - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, hip: Math.min(140, +(m.hip + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Shoulder Width */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Shoulder Width:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 44cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.shoulderWidth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, shoulderWidth: Math.max(30, +(m.shoulderWidth - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, shoulderWidth: Math.min(60, +(m.shoulderWidth + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Back Length */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Back Length:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 76cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.backLength} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, backLength: Math.max(50, +(m.backLength - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, backLength: Math.min(100, +(m.backLength + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Sleeve Length */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Sleeve Length:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 60cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.sleeveLength} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, sleeveLength: Math.max(30, +(m.sleeveLength - 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, sleeveLength: Math.min(75, +(m.sleeveLength + 1).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 7. Armhole Scye Depth */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Armhole Depth:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 26cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.armholeDepth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, armholeDepth: Math.max(18, +(m.armholeDepth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, armholeDepth: Math.min(36, +(m.armholeDepth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 8. Neck Circumference */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Neck Girth:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 40cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.neckGirth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, neckGirth: Math.max(30, +(m.neckGirth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, neckGirth: Math.min(52, +(m.neckGirth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 9. Collar Width */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Collar Width:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 4.5cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.collarWidth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, collarWidth: Math.max(2, +(m.collarWidth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, collarWidth: Math.min(8, +(m.collarWidth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 10. Cuff Width */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">Cuff Width:</span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">Img 1: 11cm</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold text-slate-800">{newMeasurements.cuffWidth} cm</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, cuffWidth: Math.max(6, +(m.cuffWidth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setNewMeasurements((m) => ({ ...m, cuffWidth: Math.min(18, +(m.cuffWidth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 4: Bespoke Fit & Shaping Fine-Tuner (Live Real-Time Sliders) */}
                    <div className="space-y-3 p-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-200/70 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-indigo-600" />
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                            4. Bespoke Fit & Shaping Fine-Tuner
                          </label>
                        </div>
                        <button
                          onClick={resetBespokeFit}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                          title="Reset all fine-tuning adjustments to 0"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug">
                        Real-time live CAD vector reshaping. Move sliders to morph curves, dart suppression, neckline drops, and ease immediately.
                      </p>

                      {/* Category Tabs: Contour & Darts | Ease & Silhouettes | Sleeve & Hem */}
                      <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
                        <button
                          onClick={() => setBespokeFitTab('contour')}
                          className={`py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                            bespokeFitTab === 'contour'
                              ? 'bg-white text-indigo-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Contour & Darts
                        </button>
                        <button
                          onClick={() => setBespokeFitTab('ease')}
                          className={`py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                            bespokeFitTab === 'ease'
                              ? 'bg-white text-indigo-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Ease & Fit
                        </button>
                        <button
                          onClick={() => setBespokeFitTab('sleeve')}
                          className={`py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                            bespokeFitTab === 'sleeve'
                              ? 'bg-white text-indigo-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Sleeve & Hem
                        </button>
                      </div>

                      {/* Tab 1: Contour & Darts */}
                      {bespokeFitTab === 'contour' && (
                        <div className="space-y-2 text-xs">
                          {/* 1. Neckline Drop Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Neck Drop / Depth:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.neckDrop > 0 ? `+${bespokeFit.neckDrop}` : bespokeFit.neckDrop} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-4"
                                max="8"
                                step="0.5"
                                value={bespokeFit.neckDrop}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, neckDrop: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, neckDrop: Math.max(-4, +(f.neckDrop - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, neckDrop: Math.min(8, +(f.neckDrop + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Neck Width Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Neck Width (HPS Lateral):</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.neckWidth > 0 ? `+${bespokeFit.neckWidth}` : bespokeFit.neckWidth} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-3"
                                max="6"
                                step="0.5"
                                value={bespokeFit.neckWidth}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, neckWidth: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, neckWidth: Math.max(-3, +(f.neckWidth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, neckWidth: Math.min(6, +(f.neckWidth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Shoulder Slope Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Shoulder Slope Offset:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.shoulderSlope > 0 ? `+${bespokeFit.shoulderSlope}` : bespokeFit.shoulderSlope} deg
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-5"
                                max="5"
                                step="0.5"
                                value={bespokeFit.shoulderSlope}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, shoulderSlope: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, shoulderSlope: Math.max(-5, +(f.shoulderSlope - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, shoulderSlope: Math.min(5, +(f.shoulderSlope + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Armhole Scye Depth Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Armhole Scye Depth:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.armholeDepth > 0 ? `+${bespokeFit.armholeDepth}` : bespokeFit.armholeDepth} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-4"
                                max="6"
                                step="0.5"
                                value={bespokeFit.armholeDepth}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, armholeDepth: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, armholeDepth: Math.max(-4, +(f.armholeDepth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, armholeDepth: Math.min(6, +(f.armholeDepth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Bust Dart Intake Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Bust Dart Intake / Width:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.bustDartWidth > 0 ? `+${bespokeFit.bustDartWidth}` : bespokeFit.bustDartWidth} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-3"
                                max="5"
                                step="0.5"
                                value={bespokeFit.bustDartWidth}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, bustDartWidth: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, bustDartWidth: Math.max(-3, +(f.bustDartWidth - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, bustDartWidth: Math.min(5, +(f.bustDartWidth + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Waist Dart Suppression Slider */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Waist Dart Suppression:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.waistSuppression > 0 ? `+${bespokeFit.waistSuppression}` : bespokeFit.waistSuppression} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-3"
                                max="6"
                                step="0.5"
                                value={bespokeFit.waistSuppression}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, waistSuppression: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, waistSuppression: Math.max(-3, +(f.waistSuppression - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, waistSuppression: Math.min(6, +(f.waistSuppression + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Ease & Fit */}
                      {bespokeFitTab === 'ease' && (
                        <div className="space-y-2 text-xs">
                          {/* 1. Bust / Chest Ease */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Bust / Chest Ease Allowance:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.easeBust > 0 ? `+${bespokeFit.easeBust}` : bespokeFit.easeBust} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-8"
                                max="16"
                                step="1"
                                value={bespokeFit.easeBust}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, easeBust: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeBust: Math.max(-8, f.easeBust - 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeBust: Math.min(16, f.easeBust + 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Waist Ease */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Waist Ease Allowance:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.easeWaist > 0 ? `+${bespokeFit.easeWaist}` : bespokeFit.easeWaist} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-8"
                                max="16"
                                step="1"
                                value={bespokeFit.easeWaist}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, easeWaist: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeWaist: Math.max(-8, f.easeWaist - 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeWaist: Math.min(16, f.easeWaist + 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Hip Ease */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Hip / Seat Ease Allowance:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.easeHip > 0 ? `+${bespokeFit.easeHip}` : bespokeFit.easeHip} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-8"
                                max="16"
                                step="1"
                                value={bespokeFit.easeHip}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, easeHip: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeHip: Math.max(-8, f.easeHip - 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, easeHip: Math.min(16, f.easeHip + 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Sleeve & Hem */}
                      {bespokeFitTab === 'sleeve' && (
                        <div className="space-y-2 text-xs">
                          {/* 1. Sleeve Bicep Girth */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Sleeve Bicep Girth / Knee:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.sleeveBicep > 0 ? `+${bespokeFit.sleeveBicep}` : bespokeFit.sleeveBicep} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-5"
                                max="8"
                                step="0.5"
                                value={bespokeFit.sleeveBicep}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, sleeveBicep: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, sleeveBicep: Math.max(-5, +(f.sleeveBicep - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, sleeveBicep: Math.min(8, +(f.sleeveBicep + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Hem Curvature */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Hem Curvature Depth:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.hemCurve > 0 ? `+${bespokeFit.hemCurve}` : bespokeFit.hemCurve} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="-4"
                                max="10"
                                step="0.5"
                                value={bespokeFit.hemCurve}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, hemCurve: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, hemCurve: Math.max(-4, +(f.hemCurve - 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, hemCurve: Math.min(10, +(f.hemCurve + 0.5).toFixed(1)) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Side Slit Opening */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-700 text-[11px]">Side Slit Opening:</span>
                              <span className="font-mono font-bold text-indigo-600 text-xs">
                                {bespokeFit.sideSlit > 0 ? `+${bespokeFit.sideSlit}` : bespokeFit.sideSlit} cm
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="25"
                                step="1"
                                value={bespokeFit.sideSlit}
                                onChange={(e) => setBespokeFit((f) => ({ ...f, sideSlit: parseFloat(e.target.value) }))}
                                className="flex-1 accent-indigo-600 cursor-pointer"
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, sideSlit: Math.max(0, f.sideSlit - 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => setBespokeFit((f) => ({ ...f, sideSlit: Math.min(25, f.sideSlit + 1) }))}
                                  className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 5: Production & Seam Specs */}
                    <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        5. Production CAD Specs & Fabric
                      </label>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-[11px] font-semibold text-slate-500 mb-1">Seam Allowance:</div>
                          <select
                            value={newSeamAllowance}
                            onChange={(e) => setNewSeamAllowance(parseFloat(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700"
                          >
                            <option value="0.5">0.5 cm (Knits / Stretch)</option>
                            <option value="1.0">1.0 cm (CAD Standard)</option>
                            <option value="1.25">1.25 cm (Commercial 1/2")</option>
                            <option value="1.5">1.5 cm (Bespoke Tailoring)</option>
                          </select>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold text-slate-500 mb-1">Fabric Material:</div>
                          <select
                            value={newFabricType}
                            onChange={(e) => setNewFabricType(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700"
                          >
                            <option value="Cotton Jersey">Cotton Jersey (160 g/m²)</option>
                            <option value="Silk Satin">Silk Satin (80 g/m²)</option>
                            <option value="Heavy Denim">Heavy Denim (420 g/m²)</option>
                            <option value="Wool Flannel">Wool Flannel (340 g/m²)</option>
                            <option value="Linen Natural">Linen Natural (210 g/m²)</option>
                            <option value="Leather">Leather (550 g/m²)</option>
                          </select>
                        </div>
                      </div>

                      {/* Fabric Color Swatches */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Fabric Drape Color:</div>
                        <div className="flex items-center gap-2">
                          {['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#1e293b', '#e2e8f0'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewFabricColor(color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                newFabricColor === color ? 'border-blue-600 scale-110 shadow-sm' : 'border-white hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Real-Time Interactive Vector Pattern Preview */}
                  {(() => {
                    const previewGarment = generateCustomGarmentProduct();
                    const isShirt = newProductArchetype === 'shirt' || newProductName.toLowerCase().includes('shirt');
                    const isTrouser = newProductArchetype === 'trouser' || newProductName.toLowerCase().includes('trouser') || newProductName.toLowerCase().includes('pant');
                    return (
                      <div className="flex-1 h-full bg-[#0e1117] flex flex-col justify-between overflow-hidden relative">
                        {/* Preview Top Header HUD */}
                        <div className="p-3 bg-[#141721] border-b border-zinc-800 flex items-center justify-between shrink-0 flex-wrap gap-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <h3 className="text-sm font-black text-white tracking-tight">
                                Live Real-Time Pattern Geometry
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                                {previewGarment.components.length} CAD Pieces Generated
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {newProductName} • {isTrouser ? pantSilhouette.toUpperCase() : newSilhouetteFit.toUpperCase()} • Size {currentSize}
                            </p>
                          </div>

                          {/* Center Controls: View Switcher & Zoom Toolbar & Labels Toggle */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                              <button
                                onClick={() => setPreviewViewMode('pieces')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                  previewViewMode === 'pieces'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                              >
                                🧩 Pattern Pieces ({previewGarment.components.length})
                              </button>
                              <button
                                onClick={() => setPreviewViewMode('marker')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                  previewViewMode === 'marker'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                              >
                                📐 Cutting Layout (Marker)
                              </button>
                            </div>

                            {/* Zoom & Fit Controls */}
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
                              <button
                                onClick={() => setPreviewZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(1)))}
                                className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                                title="Zoom Out"
                              >
                                <ZoomOut className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono text-[11px] font-bold text-zinc-200 px-1.5 min-w-[38px] text-center">
                                {Math.round(previewZoom * 100)}%
                              </span>
                              <button
                                onClick={() => setPreviewZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(1)))}
                                className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                                title="Zoom In"
                              >
                                <ZoomIn className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={resetPreviewTransform}
                                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ml-0.5"
                                title="Fit All Pattern Pieces (Center View)"
                              >
                                <Maximize2 className="w-3 h-3 text-cyan-400" />
                                <span>Fit All</span>
                              </button>
                            </div>

                            {/* Landmark Density Selector */}
                            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[10px]">
                              <span className="text-zinc-500 font-bold px-1.5 uppercase text-[9px]">Labels:</span>
                              {(['clean', 'hover', 'all', 'none'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setPreviewLabelMode(mode)}
                                  className={`px-2 py-0.5 rounded capitalize font-bold transition-all cursor-pointer ${
                                    previewLabelMode === mode
                                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-2xs'
                                      : 'text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>

                            {isTrouser ? (
                              <button
                                onClick={() => setIsTrouserMasterModalOpen(true)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Open Full Men's Tailored Trouser Master Specification & Blueprint"
                              >
                                <Layers className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Trouser Spec</span>
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setIsShirtMasterModalOpen(true)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Open Full Image 1 Technical Specification Sheet"
                              >
                                <Shirt className="w-3.5 h-3.5 text-indigo-300" />
                                <span>Image 1 Spec</span>
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                            {isTrouser ? (
                              <>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Waist: {pantMeasurements.waist + bespokeFit.easeWaist}cm
                                </span>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Hip: {pantMeasurements.hip + bespokeFit.easeHip}cm
                                </span>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Inseam: {pantMeasurements.inseam}cm
                                </span>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Outseam: {pantMeasurements.outseam}cm
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Chest: {newMeasurements.bustChest + bespokeFit.easeBust}cm
                                </span>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Waist: {newMeasurements.waist + bespokeFit.easeWaist}cm
                                </span>
                                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                                  Length: {newMeasurements.backLength}cm
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Interactive SVG Pattern Canvas */}
                        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                          {previewViewMode === 'marker' ? (
                            isTrouser ? (
                              /* 👖 MEN'S TAILORED TROUSER CUTTING MARKER VIEW */
                              <svg
                                viewBox="0 0 960 520"
                                className="w-full h-full max-h-[580px] drop-shadow-xl select-none"
                              >
                                <rect width="960" height="520" fill="#0b0f19" rx="8" />
                                
                                {/* Title Header Bar */}
                                <rect x="20" y="15" width="920" height="32" fill="#1e293b" rx="6" />
                                <text x="35" y="36" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                                  TROUSER CUTTING LAYOUT (Marker Suggestion) • Fabric Roll 140–150cm × 130–150cm
                                </text>
                                <text x="830" y="36" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                                  Efficiency: 91.4%
                                </text>

                                {/* Fabric Roll Perimeter */}
                                <rect
                                  x="40"
                                  y="65"
                                  width="840"
                                  height="400"
                                  fill="#151b28"
                                  stroke="#334155"
                                  strokeWidth="2"
                                  rx="4"
                                />

                                {/* Fabric Dimensions Arrows */}
                                <line x1="120" y1="485" x2="800" y2="485" stroke="#38bdf8" strokeWidth="1.5" />
                                <polygon points="120,485 130,481 130,489" fill="#38bdf8" />
                                <polygon points="800,485 790,481 790,489" fill="#38bdf8" />
                                <text x="460" y="502" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                                  Fabric Length (approx. 130–150 cm)
                                </text>

                                <line x1="895" y1="75" x2="895" y2="455" stroke="#38bdf8" strokeWidth="1.5" />
                                <polygon points="895,75 891,85 899,85" fill="#38bdf8" />
                                <polygon points="895,455 891,445 899,445" fill="#38bdf8" />
                                <text
                                  x="912"
                                  y="265"
                                  fill="#38bdf8"
                                  fontSize="11"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  transform="rotate(90, 912, 265)"
                                >
                                  Fabric Width (approx. 140–150 cm)
                                </text>

                                {/* Nested Trouser 1: Front Leg (Cut 2) */}
                                <g transform="translate(60, 85)">
                                  <polygon points="10,0 80,0 95,80 85,200 65,300 25,300 15,200 0,80" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="50" y="140" fill="#0f766e" fontSize="12" fontWeight="bold" textAnchor="middle">Front Leg</text>
                                  <text x="50" y="160" fill="#0f766e" fontSize="10" textAnchor="middle">(Cut 2)</text>
                                </g>

                                {/* Nested Trouser 2: Back Leg (Cut 2) */}
                                <g transform="translate(180, 85)">
                                  <polygon points="15,0 90,0 105,80 90,200 70,300 25,300 15,200 0,80" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="50" y="140" fill="#0f766e" fontSize="12" fontWeight="bold" textAnchor="middle">Back Leg</text>
                                  <text x="50" y="160" fill="#0f766e" fontSize="10" textAnchor="middle">(Cut 2)</text>
                                </g>

                                {/* Nested Trouser 3: Waistband (Cut 2) */}
                                <g transform="translate(310, 85)">
                                  <rect width="260" height="40" rx="3" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="130" y="25" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Waistband (Cut 2) • 88cm × 4cm</text>
                                </g>

                                {/* Nested Trouser 4: Pocket Bags (Cut 4) */}
                                <g transform="translate(310, 140)">
                                  <rect x="0" y="0" width="120" height="150" rx="4" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="60" y="75" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Pocket Bag</text>
                                  <text x="60" y="95" fill="#0f766e" fontSize="10" textAnchor="middle">(Cut 4)</text>

                                  <rect x="135" y="0" width="120" height="150" rx="4" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="195" y="75" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Pocket Facing</text>
                                  <text x="195" y="95" fill="#0f766e" fontSize="10" textAnchor="middle">(Cut 2)</text>
                                </g>

                                {/* Nested Trouser 5: Fly Shield & Facing */}
                                <g transform="translate(600, 85)">
                                  <rect x="0" y="0" width="80" height="130" rx="3" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="40" y="65" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Fly Shield</text>
                                  <text x="40" y="82" fill="#0f766e" fontSize="9" textAnchor="middle">(Cut 1)</text>

                                  <rect x="95" y="0" width="80" height="130" rx="3" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="135" y="65" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Fly Facing</text>
                                  <text x="135" y="82" fill="#0f766e" fontSize="9" textAnchor="middle">(Cut 1)</text>
                                </g>

                                {/* Nested Trouser 6: Welt Facing & Belt Loops */}
                                <g transform="translate(600, 235)">
                                  <rect width="175" height="50" rx="3" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="87" y="30" fill="#0f766e" fontSize="11" fontWeight="bold" textAnchor="middle">Welt Facing (Cut 2)</text>

                                  <rect y="60" width="175" height="40" rx="3" fill="#f1f5f9" fillOpacity="0.88" stroke="#0f766e" strokeWidth="1.5" />
                                  <text x="87" y="85" fill="#0f766e" fontSize="10" fontWeight="bold" textAnchor="middle">6 Belt Loops (Cut 6)</text>
                                </g>
                              </svg>
                            ) : (
                              /* 👔 EXACT IMAGE 1 CUTTING LAYOUT (SUGGESTION) MARKER VIEW */
                              <svg
                                viewBox="0 0 960 520"
                                className="w-full h-full max-h-[580px] drop-shadow-xl select-none"
                              >
                                <rect width="960" height="520" fill="#0b0f19" rx="8" />
                                
                                {/* Title Header Bar */}
                                <rect x="20" y="15" width="920" height="32" fill="#1e293b" rx="6" />
                                <text x="35" y="36" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                                  CUTTING LAYOUT (Suggestion) • Fabric Roll 110–140cm × 180–200cm
                                </text>
                                <text x="830" y="36" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
                                  Efficiency: 89.2%
                                </text>

                                {/* Fabric Roll Perimeter */}
                                <rect
                                  x="40"
                                  y="65"
                                  width="840"
                                  height="400"
                                  fill="#151b28"
                                  stroke="#334155"
                                  strokeWidth="2"
                                  rx="4"
                                />

                                {/* Dimension Callouts on Fabric Roll */}
                                <line x1="120" y1="485" x2="800" y2="485" stroke="#38bdf8" strokeWidth="1.5" />
                                <polygon points="120,485 130,481 130,489" fill="#38bdf8" />
                                <polygon points="800,485 790,481 790,489" fill="#38bdf8" />
                                <text x="460" y="502" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                                  Fabric Length (approx. 180–200 cm)
                                </text>

                                <line x1="895" y1="75" x2="895" y2="455" stroke="#38bdf8" strokeWidth="1.5" />
                                <polygon points="895,75 891,85 899,85" fill="#38bdf8" />
                                <polygon points="895,455 891,445 899,445" fill="#38bdf8" />
                                <text
                                  x="912"
                                  y="265"
                                  fill="#38bdf8"
                                  fontSize="11"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  transform="rotate(90, 912, 265)"
                                >
                                  Fabric Width (approx. 110–140 cm)
                                </text>

                                {/* Nested Piece 1: Front (Cut 2) */}
                                <g transform="translate(60, 85)">
                                  <rect width="130" height="280" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="65" y="130" fill="#881337" fontSize="12" fontWeight="bold" textAnchor="middle">Front</text>
                                  <text x="65" y="150" fill="#881337" fontSize="10" textAnchor="middle">(Cut 2)</text>
                                </g>

                                {/* Nested Piece 2: Back (Cut 1) */}
                                <g transform="translate(210, 85)">
                                  <rect width="130" height="280" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="65" y="130" fill="#881337" fontSize="12" fontWeight="bold" textAnchor="middle">Back</text>
                                  <text x="65" y="150" fill="#881337" fontSize="10" textAnchor="middle">(Cut 1)</text>
                                </g>

                                {/* Nested Piece 3: Sleeve (Cut 2) */}
                                <g transform="translate(360, 85)">
                                  <polygon points="75,0 150,60 125,280 25,280 0,60" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="75" y="140" fill="#881337" fontSize="12" fontWeight="bold" textAnchor="middle">Sleeve</text>
                                  <text x="75" y="160" fill="#881337" fontSize="10" textAnchor="middle">(Cut 2)</text>
                                </g>

                                {/* Right Nested Pieces Column */}
                                <g transform="translate(535, 85)">
                                  {/* Yoke */}
                                  <rect x="0" y="0" width="160" height="55" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="80" y="32" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Yoke</text>

                                  {/* Collar */}
                                  <rect x="0" y="68" width="160" height="35" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="80" y="90" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Collar</text>

                                  {/* Collar Stand */}
                                  <rect x="0" y="115" width="160" height="30" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="80" y="135" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">Collar Stand</text>

                                  {/* Pocket */}
                                  <rect x="25" y="160" width="110" height="110" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="80" y="220" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Pocket</text>
                                </g>

                                {/* Bottom nested pieces */}
                                {/* Cuff (Cut 2) */}
                                <g transform="translate(60, 390)">
                                  <rect width="180" height="60" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="90" y="35" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Cuff (Cut 2)</text>
                                </g>

                                {/* Placket (Cut 1) */}
                                <g transform="translate(260, 390)">
                                  <rect width="250" height="60" rx="3" fill="#fda4af" fillOpacity="0.85" stroke="#e11d48" strokeWidth="1.5" />
                                  <text x="125" y="35" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Placket (Cut 1)</text>
                                </g>
                              </svg>
                            )
                          ) : (() => {
                            const bbox = getPreviewBoundingBox(previewGarment);
                            const zoomWidth = bbox.width / previewZoom;
                            const zoomHeight = bbox.height / previewZoom;
                            const centerX = bbox.minX + bbox.width / 2;
                            const centerY = bbox.minY + bbox.height / 2;
                            const currentMinX = centerX - zoomWidth / 2 - previewPan.x;
                            const currentMinY = centerY - zoomHeight / 2 - previewPan.y;
                            const calculatedViewBox = `${currentMinX} ${currentMinY} ${zoomWidth} ${zoomHeight}`;

                            return (
                              /* PATTERN PIECES VIEW WITH DYNAMIC BOUNDING BOX & INTERACTIVE PAN/ZOOM */
                              <svg
                                viewBox={calculatedViewBox}
                                className="w-full h-full max-h-[580px] drop-shadow-xl select-none"
                                onMouseDown={handlePreviewMouseDown}
                                onMouseMove={handlePreviewMouseMove}
                                onMouseUp={handlePreviewMouseUp}
                                onMouseLeave={handlePreviewMouseUp}
                                style={{ cursor: isPanningPreview ? 'grabbing' : 'grab' }}
                              >
                                <defs>
                                  <pattern id="grid-pattern-step1" width="30" height="30" patternUnits="userSpaceOnUse">
                                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                                  </pattern>
                                  <marker id="arrow-dim-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                                  </marker>
                                </defs>
                                <rect
                                  x={currentMinX - 1200}
                                  y={currentMinY - 1200}
                                  width={zoomWidth + 2400}
                                  height={zoomHeight + 2400}
                                  fill="url(#grid-pattern-step1)"
                                />

                                {/* Render All Components in Live Preview */}
                                {previewGarment.components.map((comp) => {
                                  const isPieceSelected = selectedPreviewPieceId === comp.id;

                                  // Build SVG path string from component commands
                                  let d = '';
                                  comp.paths.forEach((cmd) => {
                                    if (cmd.type === 'M' && cmd.points[0]) {
                                      d += `M ${cmd.points[0].x} ${cmd.points[0].y} `;
                                    } else if (cmd.type === 'L' && cmd.points[0]) {
                                      d += `L ${cmd.points[0].x} ${cmd.points[0].y} `;
                                    } else if (cmd.type === 'C' && cmd.points.length >= 3) {
                                      d += `C ${cmd.points[0].x} ${cmd.points[0].y}, ${cmd.points[1].x} ${cmd.points[1].y}, ${cmd.points[2].x} ${cmd.points[2].y} `;
                                    } else if (cmd.type === 'Z') {
                                      d += 'Z ';
                                    }
                                  });

                                  return (
                                    <g
                                      key={comp.id}
                                      transform={`translate(${comp.offset.x + 30}, ${comp.offset.y + 40})`}
                                      className="transition-all duration-200 cursor-pointer"
                                      onClick={() => setSelectedPreviewPieceId(isPieceSelected ? null : comp.id)}
                                    >
                                      {/* Pattern Piece Shaded Body */}
                                      <path
                                        d={d}
                                        fill={isPieceSelected ? '#38bdf8' : isShirt ? '#ffe4e6' : isTrouser ? '#f1f5f9' : newFabricColor}
                                        fillOpacity={isPieceSelected ? 0.35 : isShirt ? 0.88 : isTrouser ? 0.85 : 0.18}
                                        stroke={isPieceSelected ? '#0284c7' : isShirt ? '#e11d48' : isTrouser ? '#0f766e' : newFabricColor}
                                        strokeWidth={isPieceSelected ? '3.5' : '2.5'}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                      />

                                      {/* Seam Allowance Offset Line */}
                                      <path
                                        d={d}
                                        fill="none"
                                        stroke="#38bdf8"
                                        strokeWidth="1.2"
                                        strokeDasharray="4 3"
                                        opacity="0.85"
                                        transform="scale(1.02)"
                                      />

                                      {/* Grainline Arrow */}
                                      <line
                                        x1={comp.grainline.start.x}
                                        y1={comp.grainline.start.y}
                                        x2={comp.grainline.end.x}
                                        y2={comp.grainline.end.y}
                                        stroke="#10b981"
                                        strokeWidth="2"
                                      />
                                      <text
                                        x={comp.grainline.start.x + 8}
                                        y={(comp.grainline.start.y + comp.grainline.end.y) / 2}
                                        fill="#10b981"
                                        fontSize="10"
                                        fontWeight="bold"
                                        transform={`rotate(90, ${comp.grainline.start.x + 8}, ${(comp.grainline.start.y + comp.grainline.end.y) / 2})`}
                                      >
                                        {comp.grainline.label}
                                      </text>

                                      {/* Piece Title Tag */}
                                      <text
                                        x={comp.labels[0]?.position.x || 60}
                                        y={comp.labels[0]?.position.y || 80}
                                        fill={isShirt ? '#881337' : isTrouser ? '#042f2e' : '#f8fafc'}
                                        fontSize="13"
                                        fontWeight="bold"
                                        letterSpacing="0.05em"
                                      >
                                        {comp.name}
                                      </text>
                                      <text
                                        x={comp.labels[0]?.position.x || 60}
                                        y={(comp.labels[0]?.position.y || 80) + 16}
                                        fill={isShirt ? '#9f1239' : isTrouser ? '#115e59' : '#94a3b8'}
                                        fontSize="10"
                                        fontWeight="600"
                                      >
                                        {comp.cutInstruction} • Size {currentSize}
                                      </text>

                                      {/* Internals (Pocket, Fold Lines) */}
                                      {comp.internals?.map((internal) => {
                                        const internalPath = internal.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ') + (internal.closed ? ' Z' : '');
                                        return (
                                          <path
                                            key={internal.id}
                                            d={internalPath}
                                            fill={internal.type === 'pocket' ? 'rgba(59, 130, 246, 0.08)' : 'none'}
                                            stroke={internal.color || '#3b82f6'}
                                            strokeWidth="1.5"
                                            strokeDasharray={internal.type === 'line' ? '4 2' : 'none'}
                                          />
                                        );
                                      })}

                                      {/* Landmark Point Dots & Labels */}
                                      {comp.paths.flatMap((p) => p.points).filter((pt) => !pt.isControl && pt.name).map((pt, pIdx) => {
                                        const isMajor = isMajorLandmark(pt.name);
                                        if (previewLabelMode === 'none') return null;
                                        if (previewLabelMode === 'clean' && !isMajor) return null;

                                        const isHovered = hoveredLandmark?.name === pt.name && hoveredLandmark?.pieceName === comp.name;
                                        const yOffset = pIdx % 2 === 0 ? -10 : 14;
                                        const xOffset = pIdx % 3 === 0 ? 8 : -8;
                                        const textAnchor = pIdx % 3 === 0 ? 'start' : 'end';

                                        return (
                                          <g
                                            key={pIdx}
                                            transform={`translate(${pt.x}, ${pt.y})`}
                                            className="cursor-pointer group"
                                            onMouseEnter={() => setHoveredLandmark({ name: pt.name!, x: Math.round(pt.x), y: Math.round(pt.y), pieceName: comp.name })}
                                            onMouseLeave={() => setHoveredLandmark(null)}
                                          >
                                            <circle
                                              r={isHovered ? 5.5 : 3.5}
                                              fill={isHovered ? '#f59e0b' : '#3b82f6'}
                                              stroke="#ffffff"
                                              strokeWidth={isHovered ? 2 : 1.5}
                                              className="transition-all"
                                            />
                                            {previewLabelMode !== 'hover' && (
                                              <g pointerEvents="none">
                                                <rect
                                                  x={textAnchor === 'start' ? xOffset - 3 : xOffset - (pt.name!.length * 5.8) - 3}
                                                  y={yOffset - 9}
                                                  width={pt.name!.length * 5.8 + 6}
                                                  height={12}
                                                  fill="#090d16"
                                                  fillOpacity="0.88"
                                                  rx="2.5"
                                                />
                                                <text
                                                  x={xOffset}
                                                  y={yOffset}
                                                  textAnchor={textAnchor}
                                                  fill={isHovered ? '#fbbf24' : '#e2e8f0'}
                                                  fontSize="8.5"
                                                  fontWeight={isMajor ? 'bold' : '600'}
                                                >
                                                  {pt.name}
                                                </text>
                                              </g>
                                            )}
                                          </g>
                                        );
                                      })}
                                    </g>
                                  );
                                })}

                              {/* EXACT IMAGE 1 TECHNICAL DIMENSION CALLOUT ANNOTATIONS FOR SHIRT */}
                              {isShirt && (
                                <g id="image1-dimension-callouts" stroke="#0284c7" strokeWidth="1.5" fill="#0284c7">
                                  {/* 1. FRONT PIECE CALLOUTS (offset: 30, 40) */}
                                  <line x1="30" y1="815" x2="280" y2="815" />
                                  <text x="155" y="830" fontSize="12" fontWeight="bold" textAnchor="middle">25</text>
                                  <line x1="15" y1="40" x2="15" y2="300" />
                                  <text x="8" y="175" fontSize="12" fontWeight="bold" textAnchor="middle">26</text>
                                  <line x1="15" y1="300" x2="15" y2="800" />
                                  <text x="8" y="555" fontSize="12" fontWeight="bold" textAnchor="middle">50</text>
                                  <line x1="295" y1="40" x2="295" y2="800" stroke="#0369a1" />
                                  <text x="305" y="420" fontSize="13" fontWeight="bold" fill="#0369a1">76</text>
                                  <line x1="100" y1="20" x2="215" y2="20" />
                                  <text x="157" y="15" fontSize="11" fontWeight="bold" textAnchor="middle">11.5</text>
                                  <line x1="30" y1="20" x2="100" y2="20" />
                                  <text x="65" y="15" fontSize="11" fontWeight="bold" textAnchor="middle">7</text>
                                  <text x="230" y="45" fontSize="10" fontWeight="bold">↕ 2.5</text>
                                  <text x="155" y="355" fontSize="10" fontWeight="bold" fill="#2563eb" textAnchor="middle">13</text>
                                  <text x="230" y="420" fontSize="10" fontWeight="bold" fill="#2563eb">14</text>

                                  {/* 2. BACK PIECE CALLOUTS */}
                                  <line x1="330" y1="815" x2="580" y2="815" />
                                  <text x="455" y="830" fontSize="12" fontWeight="bold" textAnchor="middle">25</text>
                                  <line x1="330" y1="20" x2="540" y2="20" />
                                  <text x="435" y="15" fontSize="11" fontWeight="bold" textAnchor="middle">21</text>
                                  <text x="555" y="45" fontSize="10" fontWeight="bold">↕ 2.5</text>
                                  <line x1="315" y1="40" x2="315" y2="300" />
                                  <text x="323" y="175" fontSize="11" fontWeight="bold">26</text>
                                  <line x1="595" y1="40" x2="595" y2="800" stroke="#0369a1" />
                                  <text x="605" y="420" fontSize="13" fontWeight="bold" fill="#0369a1">76</text>

                                  {/* 3. SLEEVE PIECE CALLOUTS */}
                                  <line x1="630" y1="25" x2="990" y2="25" />
                                  <text x="810" y="20" fontSize="12" fontWeight="bold" textAnchor="middle">36</text>
                                  <line x1="1005" y1="40" x2="1005" y2="190" />
                                  <text x="1015" y="120" fontSize="11" fontWeight="bold">15</text>
                                  <line x1="615" y1="40" x2="615" y2="640" stroke="#0369a1" />
                                  <text x="605" y="340" fontSize="13" fontWeight="bold" fill="#0369a1">60</text>
                                  <line x1="700" y1="655" x2="920" y2="655" />
                                  <text x="810" y="670" fontSize="12" fontWeight="bold" textAnchor="middle">22</text>

                                  {/* 4. COLLAR & STAND */}
                                  <line x1="1030" y1="25" x2="1470" y2="25" />
                                  <text x="1250" y="20" fontSize="12" fontWeight="bold" textAnchor="middle">44</text>
                                  <text x="1480" y="62" fontSize="11" fontWeight="bold">4.5</text>
                                  <text x="1250" y="105" fontSize="12" fontWeight="bold" textAnchor="middle">44</text>
                                  <text x="1480" y="130" fontSize="11" fontWeight="bold">3</text>

                                  {/* 5. POCKET */}
                                  <text x="1095" y="165" fontSize="11" fontWeight="bold" textAnchor="middle">13</text>
                                  <text x="1175" y="240" fontSize="11" fontWeight="bold">14</text>

                                  {/* 6. YOKE & CUFF & PLACKET */}
                                  <text x="850" y="695" fontSize="12" fontWeight="bold" textAnchor="middle">44</text>
                                  <text x="615" y="725" fontSize="11" fontWeight="bold">8</text>
                                  <text x="1140" y="345" fontSize="11" fontWeight="bold" textAnchor="middle">22</text>
                                  <text x="1015" y="390" fontSize="11" fontWeight="bold">8</text>
                                  <text x="1140" y="455" fontSize="11" fontWeight="bold" textAnchor="middle">22</text>
                                  <text x="1015" y="515" fontSize="11" fontWeight="bold">11</text>
                                  <text x="1310" y="25" fontSize="11" fontWeight="bold" textAnchor="middle">4</text>
                                  <text x="1340" y="420" fontSize="12" fontWeight="bold">76</text>
                                </g>
                              )}

                              {/* 👖 PRODUCTION CAD TECHNICAL DIMENSION CALLOUTS FOR TROUSER */}
                              {isTrouser && (
                                <g id="trouser-dimension-callouts" stroke="#0d9488" strokeWidth="1.5" fill="#0d9488">
                                  {/* FRONT LEG CALLOUTS (offset: 30, 40) */}
                                  {/* Waist: 21cm */}
                                  <line x1="70" y1="25" x2="280" y2="25" />
                                  <text x="175" y="20" fontSize="12" fontWeight="bold" textAnchor="middle">Waist 21</text>
                                  {/* Front Rise: 26cm */}
                                  <line x1="15" y1="40" x2="15" y2="300" />
                                  <text x="10" y="175" fontSize="11" fontWeight="bold" textAnchor="middle">Rise 26</text>
                                  {/* Inseam: 78cm */}
                                  <line x1="15" y1="300" x2="15" y2="1080" />
                                  <text x="10" y="690" fontSize="12" fontWeight="bold" textAnchor="middle">Inseam 78</text>
                                  {/* Total Outseam: 104cm */}
                                  <line x1="330" y1="40" x2="330" y2="1080" stroke="#047857" />
                                  <text x="340" y="560" fontSize="13" fontWeight="bold" fill="#047857">Outseam 104</text>
                                  {/* Knee: 22cm */}
                                  <line x1="70" y1="580" x2="290" y2="580" />
                                  <text x="180" y="575" fontSize="11" fontWeight="bold" textAnchor="middle">Knee 22</text>
                                  {/* Hem: 19cm */}
                                  <line x1="70" y1="1095" x2="260" y2="1095" />
                                  <text x="165" y="1110" fontSize="12" fontWeight="bold" textAnchor="middle">Hem 19</text>

                                  {/* BACK LEG CALLOUTS (offset: 370, 40) */}
                                  {/* Back Waist: 22cm */}
                                  <line x1="410" y1="25" x2="630" y2="25" />
                                  <text x="520" y="20" fontSize="12" fontWeight="bold" textAnchor="middle">Back Waist 22</text>
                                  {/* Back Rise: 38cm */}
                                  <line x1="355" y1="40" x2="355" y2="420" />
                                  <text x="350" y="230" fontSize="11" fontWeight="bold" textAnchor="middle">Back Rise 38</text>
                                  {/* Back Outseam: 104cm */}
                                  <line x1="680" y1="40" x2="680" y2="1080" stroke="#047857" />
                                  <text x="690" y="560" fontSize="13" fontWeight="bold" fill="#047857">104</text>
                                  {/* Back Hem: 19cm */}
                                  <line x1="410" y1="1095" x2="600" y2="1095" />
                                  <text x="505" y="1110" fontSize="12" fontWeight="bold" textAnchor="middle">Hem 19</text>

                                  {/* WAISTBAND CALLOUTS (offset: 750, 40) */}
                                  <line x1="750" y1="25" x2="1630" y2="25" />
                                  <text x="1190" y="20" fontSize="12" fontWeight="bold" textAnchor="middle">Waistband 88cm</text>
                                  <text x="1640" y="65" fontSize="11" fontWeight="bold">4cm</text>

                                  {/* FLY SHIELD & FACING (offset: 750, 130) */}
                                  <text x="770" y="240" fontSize="11" fontWeight="bold" textAnchor="middle">18 × 4</text>
                                  <text x="830" y="240" fontSize="11" fontWeight="bold" textAnchor="middle">18 × 4</text>

                                  {/* POCKET BAG (offset: 750, 310) */}
                                  <text x="840" y="300" fontSize="12" fontWeight="bold" textAnchor="middle">Pocket Bag 18cm</text>
                                  <text x="940" y="450" fontSize="11" fontWeight="bold">28cm</text>

                                  {/* SLANT FACING & WELT (offset: 750, 620) */}
                                  <text x="790" y="610" fontSize="11" fontWeight="bold" textAnchor="middle">Slant 14×4</text>
                                  <text x="830" y="770" fontSize="11" fontWeight="bold" textAnchor="middle">Welt 16×4</text>
                                  <text x="815" y="870" fontSize="11" fontWeight="bold" textAnchor="middle">Loops 9×2 (Cut 6)</text>
                                </g>
                              )}
                            </svg>
                          );
                        })()}

                        {/* Floating Landmark Hover Card */}
                        {hoveredLandmark && (
                          <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-amber-500/60 backdrop-blur-md rounded-xl p-3 shadow-2xl text-xs z-30 pointer-events-none flex items-center gap-3 animate-in fade-in">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                            <div>
                              <div className="text-[10px] text-zinc-400 font-semibold">{hoveredLandmark.pieceName}</div>
                              <div className="font-bold text-amber-300 text-xs">{hoveredLandmark.name}</div>
                              <div className="text-[10px] font-mono text-zinc-300">
                                X: {hoveredLandmark.x}mm • Y: {hoveredLandmark.y}mm ({Math.round(hoveredLandmark.x / 10)}cm, {Math.round(hoveredLandmark.y / 10)}cm)
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Piece Focus Bar */}
                        <div className="absolute bottom-2 left-4 z-20 flex items-center gap-1.5 flex-wrap bg-slate-900/85 backdrop-blur-md border border-zinc-800 rounded-xl px-2.5 py-1.5 shadow-lg">
                          <span className="text-[10px] text-zinc-400 font-semibold uppercase">Focus:</span>
                          {previewGarment.components.map((comp) => {
                            const isSelected = selectedPreviewPieceId === comp.id;
                            return (
                              <button
                                key={comp.id}
                                onClick={() => setSelectedPreviewPieceId(isSelected ? null : comp.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                }`}
                              >
                                {comp.name.replace(`${newProductName} `, '')}
                              </button>
                            );
                          })}
                          {selectedPreviewPieceId && (
                            <button
                              onClick={() => setSelectedPreviewPieceId(null)}
                              className="text-[10px] text-zinc-400 hover:text-white underline ml-1 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                        {/* Bottom Launch Actions (Create Product from Start to Finish) */}
                        <div className="p-4 bg-[#141721] border-t border-zinc-800 flex items-center justify-between gap-4 shrink-0">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl border-2 border-white/40 flex items-center justify-center font-bold text-white shadow-md"
                              style={{ backgroundColor: newFabricColor }}
                            >
                              EP
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">
                                Ready to Generate: {newProductName}
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                {newSilhouetteFit} fit • {newNecklineStyle} • {newSleeveStyle} • SA: {newSeamAllowance}cm
                              </div>
                            </div>
                          </div>

                          {/* 3 Huge Action Buttons */}
                          <div className="flex items-center gap-2.5">
                            {/* Primary EasyPattern Draft CTA */}
                            <button
                              onClick={handleLaunchInEasyPattern}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Sparkles className="w-4 h-4 fill-white" />
                              <span>Create & Draft in EasyPattern</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* 3-in-1 Triple Collab Launch CTA */}
                            <button
                              onClick={handleLaunchInCollab}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                              title="Collaborate simultaneously in EasyPattern + TUKAcad 2D + CLO 3D Drape"
                            >
                              <Zap className="w-4 h-4 fill-white text-amber-200" />
                              <span>⚡ Launch in 3-in-1 Collab</span>
                            </button>

                            {/* TUKAcad 2D Studio CTA */}
                            <button
                              onClick={handleLaunchInTukacad}
                              className="px-3.5 py-2.5 rounded-xl bg-[#222533] hover:bg-[#2b2f42] text-zinc-200 hover:text-white font-bold text-xs border border-zinc-700 transition-all flex items-center gap-1.5"
                            >
                              <Layers className="w-3.5 h-3.5 text-rose-400" />
                              <span>TUKAcad 2D</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: 13 READY-TO-SEW SLOPERS LIBRARY */}
              {step1Tab === 'library' && (
                <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
                  <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          13 Standard Production Slopers Library
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Industry-calibrated patterns ready for vector editing, grading, and 3D simulation.
                        </p>
                      </div>
                      <button
                        onClick={() => setStep1Tab('create-studio')}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Custom Product Studio</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { id: 'basic-bodice', name: "Women's Basic Bodice", pcs: 2, cat: 'Women', desc: 'Front & Back bodice with bust & waist darts.' },
                        { id: 'flared-skirt', name: 'A-Line Flared Skirt', pcs: 2, cat: 'Women', desc: 'Two-piece tailored flared skirt sloper.' },
                        { id: 'bootcut-pant', name: "Women's Boot Cut Pant", pcs: 4, cat: 'Women', desc: 'Contour waistband, front & back leg pieces.' },
                        { id: 'trouser', name: 'Chino Trouser', pcs: 4, cat: 'Men', desc: 'Slash pockets, back double-welt sloper.' },
                        { id: 'denim-jeans', name: 'Denim 5-Pocket Jeans', pcs: 5, cat: 'Unisex', desc: 'Coin pocket, curved yoke, and twin-needle back.' },
                        { id: 'basic-tshirt', name: 'Basic Crew T-Shirt', pcs: 3, cat: 'Unisex', desc: 'Classic crew neckline, set-in short sleeve.' },
                        { id: 'polo', name: 'Polo Shirt (Collar & Placket)', pcs: 4, cat: 'Men', desc: 'Ribbed knit collar with two-button front box.' },
                        { id: 'shirt', name: 'Casual Button-Up Shirt', pcs: 6, cat: 'Men', desc: 'Two-piece collar stand, yoke, and button placket.' },
                        { id: 'sheath-dress', name: 'Sheath Cocktail Dress', pcs: 3, cat: 'Women', desc: 'Fitted princess line silhouette with rear kick vent.' },
                        { id: 'suit-jacket', name: "Men's Tailored Suit Jacket", pcs: 16, cat: 'Men', desc: 'Two-button notch lapel, chest canvas, side bodies.' },
                        { id: 'double-breasted-blazer', name: 'Double-Breasted Blazer', pcs: 12, cat: 'Men', desc: 'Peak lapel, tailored shoulder structure.' },
                        { id: 'trench-coat', name: 'Classic Trench Coat', pcs: 14, cat: 'Outerwear', desc: 'Gun flap, storm shield, epaulets, and belt.' },
                        { id: 'bomber-jacket', name: 'Flight Bomber Jacket', pcs: 8, cat: 'Outerwear', desc: 'Raglan sleeve, ribbed collar, and welt pockets.' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {item.cat}
                              </span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {item.pcs} Pieces
                              </span>
                            </div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                loadGarmentTemplate(item.id as any);
                                setEasyPatternStep(3);
                                showToast(`Loaded "${item.name}" into Step 3 Draft!`);
                              }}
                              className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
                            >
                              Draft Pattern
                            </button>
                            <button
                              onClick={() => {
                                loadGarmentTemplate(item.id as any);
                                setCADEngineMode('collab');
                                showToast(`⚡ Loaded "${item.name}" into 3-in-1 Collab Studio!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-colors flex items-center gap-1"
                              title="Collaborate in EasyPattern + TUKAcad + CLO 3D"
                            >
                              <Zap className="w-3 h-3 text-emerald-600" />
                              <span>Collab</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RECENT PROJECTS & FILE IMPORTER */}
              {step1Tab === 'recent' && (
                <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Recent Projects & File Importer
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Resume your drafts or import standard apparel CAD files (.ep, .tud, .dxf, .json).
                      </p>
                    </div>

                    {/* File Dropzone */}
                    <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors text-center cursor-pointer shadow-xs">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-sm text-slate-800">
                        Drag & drop pattern file here, or browse
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports EasyPattern (.ep), TUKAcAd (.tud), DXF-AAMA, and Vector SVG formats.
                      </p>
                    </div>

                    {/* Recent Projects List */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
                        Recent Workspace Drafts
                      </div>
                      <div className="divide-y divide-slate-100">
                        {[
                          { title: "Women's Basic Bodice (Size S-M)", date: 'Today, 18:30', pieces: 2 },
                          { title: 'Casual Button-Up Shirt (Size L)', date: 'Yesterday', pieces: 6 },
                          { title: 'A-Line Flared Skirt (Size M)', date: '3 days ago', pieces: 2 },
                          { title: 'Classic Crew T-Shirt (Size M)', date: '5 days ago', pieces: 3 },
                        ].map((proj, idx) => (
                          <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                CAD
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-800">{proj.title}</div>
                                <div className="text-[10px] text-slate-500">{proj.date} • {proj.pieces} Pattern Pieces</div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setEasyPatternStep(3);
                                showToast(`Loaded "${proj.title}"!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors"
                            >
                              Open Draft
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: STUDIO SETTINGS & SPECS */}
              {step1Tab === 'settings' && (
                <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        Studio Settings & Calibration
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Configure measurement unit systems, grid snapping, and industrial tolerances.
                      </p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <div className="font-bold text-slate-800">Measurement Unit System</div>
                          <div className="text-slate-500 text-[11px]">Choose between Centimeters (cm) and Inches (in)</div>
                        </div>
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => setAppSettings((s) => ({ ...s, unit: 'cm' }))}
                            className={`px-3 py-1 rounded-md font-bold ${appSettings.unit === 'cm' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                          >
                            Metric (cm)
                          </button>
                          <button
                            onClick={() => setAppSettings((s) => ({ ...s, unit: 'in' }))}
                            className={`px-3 py-1 rounded-md font-bold ${appSettings.unit === 'in' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                          >
                            Imperial (in)
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <div className="font-bold text-slate-800">Display Grid & Landmarks</div>
                          <div className="text-slate-500 text-[11px]">Show millimeter coordinate grid and landmark labels</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.showGrid}
                          onChange={(e) => setAppSettings((s) => ({ ...s, showGrid: e.target.checked }))}
                          className="accent-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">Snap to Grid Anchors</div>
                          <div className="text-slate-500 text-[11px]">Snap vector points to closest 10mm increment</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.snapToGrid}
                          onChange={(e) => setAppSettings((s) => ({ ...s, snapToGrid: e.target.checked }))}
                          className="accent-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TUTORIAL & HELP */}
              {step1Tab === 'tutorial' && (
                <div className="flex-1 p-8 bg-[#f8fafc] overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        EasyPattern Quick Start Guide
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Learn how to draft patterns, grade sizes, and transfer to TUKAcad.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {[
                        { step: '1. Create Product', desc: 'Select garment archetype, choose neckline, darts, and sleeves in the studio.' },
                        { step: '2. Precision Draft', desc: 'Interactive SVG canvas allows dragging neckline, shoulder, and dart apex points.' },
                        { step: '3. Add Seam Allowance', desc: 'Adjust seam allowance slider from 0.5cm up to 2.5cm with auto-corner miters.' },
                        { step: '4. Grade XS to XXL', desc: 'Select sizes to instantly view nested grading contours.' },
                      ].map((tut, i) => (
                        <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                          <div className="font-bold text-blue-600 text-sm mb-1">{tut.step}</div>
                          <p className="text-slate-600 leading-relaxed">{tut.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep1Tab('create-studio')}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      Return to Product Studio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: SELECT PATTERN & ENTER MEASUREMENTS (EXACT WORKFLOW)   */}
        {/* ============================================================== */}
        {easyPatternStep === 2 && (() => {
          const activePatDef = getPatternDefinition(step2PatternId) || PATTERN_DEFINITIONS[0];
          return (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                      Step 2: Pattern Generation Workflow
                    </span>
                    <h2 className="text-lg font-bold">Select Pattern & Enter Measurements</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                    {activePatDef.name} ({activePatDef.piecesCount} Pcs)
                  </span>
                </div>

                {/* General Error Banner */}
                {step2GeneralError && (
                  <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{step2GeneralError}</div>
                  </div>
                )}

                {/* Form Content */}
                <div className="p-6 space-y-5 text-xs">
                  {/* 1. Select Exactly One Pattern */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                      1. Select Pattern (Exactly One)
                    </label>
                    <select
                      value={step2PatternId}
                      onChange={(e) => handleStep2SelectPattern(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {PATTERN_DEFINITIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.piecesCount} Pcs - {p.category})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {activePatDef.description}
                    </p>
                  </div>

                  {/* 2. Pattern-Specific Measurements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-blue-600" />
                        <span>2. Required Measurements for {activePatDef.name} (cm)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const defaults: Record<string, string> = {};
                          activePatDef.measurements.forEach((m) => {
                            defaults[m.key] = String(m.defaultValue || '');
                          });
                          setStep2Measurements(defaults);
                          setStep2Errors({});
                          setStep2GeneralError(null);
                        }}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        Fill Standard Specs
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 mb-2">
                      Only measurements required for this pattern are displayed. All fields marked with * are required.
                    </p>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                      {activePatDef.measurements.map((field) => {
                        const val = step2Measurements[field.key] || '';
                        const hasErr = Boolean(step2Errors[field.key]);
                        return (
                          <div key={field.key} className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-0.5">
                              <span>{field.label} ({field.unit})</span>
                              <span className="text-red-500 font-bold">*</span>
                            </span>
                            <input
                              type="number"
                              step="0.1"
                              value={val}
                              onChange={(e) => {
                                setStep2Measurements((prev) => ({ ...prev, [field.key]: e.target.value }));
                                if (step2Errors[field.key]) {
                                  setStep2Errors((prev) => {
                                    const next = { ...prev };
                                    delete next[field.key];
                                    return next;
                                  });
                                }
                                if (step2GeneralError) setStep2GeneralError(null);
                              }}
                              placeholder={field.placeholder || `e.g. ${field.defaultValue || ''}`}
                              className={`w-full bg-white border rounded px-2 py-1 font-mono font-bold text-xs ${
                                hasErr
                                  ? 'border-red-500 focus:ring-1 focus:ring-red-400'
                                  : 'border-slate-300 focus:ring-1 focus:ring-blue-500'
                              }`}
                            />
                            {hasErr && (
                              <span className="text-[9px] text-red-600 font-semibold block">
                                {step2Errors[field.key]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button: OK */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEasyPatternStep(1)}
                      className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    {/* Requirement 7, 8, 9, 10: "Click OK" -> validate -> generate ONLY selected pattern */}
                    <button
                      type="button"
                      onClick={handleStep2OkSubmit}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4 fill-white text-blue-200" />
                      <span>OK</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* STEPS 3 TO 7: INTERACTIVE PATTERN WORKSPACE & CANVAS          */}
        {/* ============================================================== */}
        {easyPatternStep >= 3 && easyPatternStep <= 7 && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Toolbar: 8 Basic Tools + Quick Sizing Bar */}
            <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-2xs z-20">
              {/* 8 Basic Vector Tools from Infographic */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-2 shrink-0">
                  Basic Tools:
                </span>
                {[
                  { id: 'select', label: 'Select', icon: MousePointer, tip: 'Select & Drag landmarks' },
                  { id: 'point', label: 'Point', icon: Dot, tip: 'Add landmark or drill point' },
                  { id: 'line', label: 'Line', icon: Minus, tip: 'Draw construction line' },
                  { id: 'curve', label: 'Curve', icon: Spline, tip: 'Adjust neck/armhole curve' },
                  { id: 'dart', label: 'Dart', icon: Scissors, tip: 'Edit bust & waist darts' },
                  { id: 'seam', label: 'Seam', icon: Layers, tip: 'Adjust seam allowance' },
                  { id: 'notch', label: 'Notch', icon: Tag, tip: 'Configure alignment notches' },
                  { id: 'measure', label: 'Measure', icon: Ruler, tip: 'Measure point-to-point distance' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = easyPatternTool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setEasyPatternTool(t.id as EasyPatternTool);
                        showToast(`Activated ${t.label} Tool: ${t.tip}`);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-2xs font-bold ring-1 ring-blue-500'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      title={t.tip}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* QUICK SIZE ADJUSTER BAR ("size agisee pannura mathiri") */}
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2">Size:</span>
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((sz) => {
                    const isCurrent = currentSize === sz;
                    const pal = SIZE_COLOR_PALETTE[sz];
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          setCurrentSize(sz);
                          showToast(`Graded to Size ${sz} (${pal.name})`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: pal.hex }}
                        />
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Step forward/backward buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEasyPatternStep(Math.max(1, easyPatternStep - 1) as EasyPatternStep)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    onClick={() => setEasyPatternStep(Math.min(8, easyPatternStep + 1) as EasyPatternStep)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-2xs"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Split Viewport: Left/Center Canvas + Right Properties/Grading Drawer */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Center SVG Vector Canvas */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {/* Canvas Area */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[#fbfcfd]">
                  <svg
                    ref={svgRef}
                    viewBox={
                      garment && garment.components && garment.components.length > 2
                        ? (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant')
                          ? "-40 -40 1560 1150"
                          : "-40 -40 1480 880")
                        : "0 0 760 560"
                    }
                    onMouseDown={handleSvgMouseDown}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={handleSvgMouseUp}
                    className={`w-full max-w-5xl h-auto bg-white border border-slate-200 rounded-xl shadow-sm ${
                      easyPatternTool === 'select'
                        ? 'cursor-default'
                        : easyPatternTool === 'measure'
                        ? 'cursor-crosshair'
                        : easyPatternTool === 'point'
                        ? 'cursor-cell'
                        : 'cursor-crosshair'
                    }`}
                    style={{ maxHeight: '74vh' }}
                  >
                    {/* Background Grid Pattern */}
                    <defs>
                      <pattern id="easy-grid" width={appSettings.gridSize} height={appSettings.gridSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${appSettings.gridSize} 0 L 0 0 0 ${appSettings.gridSize}`} fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect
                      x={garment && garment.components && garment.components.length > 2 ? -40 : 0}
                      y={garment && garment.components && garment.components.length > 2 ? -40 : 0}
                      width={garment && garment.components && garment.components.length > 2 ? (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant') ? 1560 : 1480) : 760}
                      height={garment && garment.components && garment.components.length > 2 ? (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant') ? 1150 : 880) : 560}
                      fill="url(#easy-grid)"
                    />

                    {/* Step 7 Fabric Roll Bounds (If in Preview mode) */}
                    {easyPatternStep === 7 && (
                      <g id="fabric-marker-preview">
                        <rect
                          x="10"
                          y="10"
                          width={garment && garment.components && garment.components.length > 2 ? (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant') ? 1480 : 1400) : 720}
                          height={garment && garment.components && garment.components.length > 2 ? (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant') ? 1080 : 800) : 520}
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          rx="8"
                        />
                        <text x="35" y="42" fill="#64748b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                          FABRIC ROLL: WIDTH {markerWidthCm} cm • LENGTH {garment && garment.components && garment.components.length > 2 && (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant')) ? '1.45' : fabricLengthMeters} m • EFFICIENCY {garment && garment.components && garment.components.length > 2 && (garment.name.toLowerCase().includes('trouser') || garment.name.toLowerCase().includes('pant')) ? '91.4%' : '88.7%'}
                        </text>
                      </g>
                    )}

                    {/* ============================================================== */}
                    {/* PATTERN VECTORS (MULTI-PIECE CAD OR SLOPER BODICE)            */}
                    {/* ============================================================== */}
                    {garment && garment.components && garment.components.length > 2 ? (
                      <g id="multi-piece-cad-garment">
                        {garment.components.map((comp) => {
                          const isCompSelected = (selectedComponentId || garment.components[0].id) === comp.id;
                          const pathD = pathCommandsToSvgString(comp.paths);
                          return (
                            <g
                              key={comp.id}
                              id={`cad-comp-${comp.id}`}
                              transform={`translate(${comp.offset.x}, ${comp.offset.y})`}
                              className="cursor-pointer group"
                              onClick={() => {
                                setSelectedComponentId(comp.id);
                                showToast(`Selected: ${comp.name}`);
                              }}
                            >
                              {/* Seam Allowance (dashed outline) */}
                              {seamAllowanceCm > 0 && (
                                <path
                                  d={pathD}
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 3"
                                  opacity="0.8"
                                />
                              )}

                              {/* Main Cut Boundary */}
                              <path
                                d={pathD}
                                fill={isCompSelected ? '#f0f7ff' : '#ffffff'}
                                stroke={isCompSelected ? '#2563eb' : '#0f172a'}
                                strokeWidth={isCompSelected ? '2.5' : '1.8'}
                                className="transition-colors hover:stroke-blue-600"
                              />

                              {/* Internal Contours (Stitching / Crease lines) */}
                              {comp.internals && comp.internals.map((internal) => {
                                const intPoints = internal.points.map((p) => `${p.x},${p.y}`).join(' ');
                                return internal.closed ? (
                                  <polygon
                                    key={internal.id}
                                    points={intPoints}
                                    fill="none"
                                    stroke={internal.color || '#3b82f6'}
                                    strokeWidth="1.2"
                                    strokeDasharray="4 2"
                                    opacity="0.85"
                                  />
                                ) : (
                                  <polyline
                                    key={internal.id}
                                    points={intPoints}
                                    fill="none"
                                    stroke={internal.color || '#3b82f6'}
                                    strokeWidth="1.2"
                                    strokeDasharray="4 2"
                                    opacity="0.85"
                                  />
                                );
                              })}

                              {/* Grainline */}
                              {showEasyPatternGrainline && comp.grainline && (
                                <g id={`grainline-${comp.id}`}>
                                  <line
                                    x1={comp.grainline.start.x}
                                    y1={comp.grainline.start.y}
                                    x2={comp.grainline.end.x}
                                    y2={comp.grainline.end.y}
                                    stroke="#64748b"
                                    strokeWidth="1.5"
                                  />
                                  <polygon
                                    points={`${comp.grainline.start.x - 3},${comp.grainline.start.y + 7} ${comp.grainline.start.x + 3},${comp.grainline.start.y + 7} ${comp.grainline.start.x},${comp.grainline.start.y}`}
                                    fill="#64748b"
                                  />
                                  <polygon
                                    points={`${comp.grainline.end.x - 3},${comp.grainline.end.y - 7} ${comp.grainline.end.x + 3},${comp.grainline.end.y - 7} ${comp.grainline.end.x},${comp.grainline.end.y}`}
                                    fill="#64748b"
                                  />
                                  <text
                                    x={(comp.grainline.start.x + comp.grainline.end.x) / 2 + 8}
                                    y={(comp.grainline.start.y + comp.grainline.end.y) / 2}
                                    fill="#64748b"
                                    fontSize="9"
                                    fontFamily="monospace"
                                    fontWeight="600"
                                  >
                                    {comp.grainline.label}
                                  </text>
                                </g>
                              )}

                              {/* Notches */}
                              {notchSizeCm > 0 && comp.notches && comp.notches.map((n, nIdx) => (
                                <g key={`notch-${nIdx}`}>
                                  <circle cx={n.x} cy={n.y} r="2.5" fill="#ef4444" />
                                  <line x1={n.x - 4} y1={n.y} x2={n.x + 4} y2={n.y} stroke="#ef4444" strokeWidth="1.5" />
                                </g>
                              ))}

                              {/* Labels & Cut Instructions */}
                              {showEasyPatternLabel && (
                                <g id={`labels-${comp.id}`}>
                                  {comp.labels && comp.labels.length > 0 ? (
                                    comp.labels.map((lbl, lIdx) => (
                                      <text
                                        key={`lbl-${lIdx}`}
                                        x={lbl.position.x}
                                        y={lbl.position.y}
                                        fill={lbl.type === 'title' ? '#0f172a' : '#64748b'}
                                        fontSize={lbl.type === 'title' ? '11' : '9'}
                                        fontWeight={lbl.type === 'title' ? 'bold' : 'normal'}
                                      >
                                        {lbl.text}
                                      </text>
                                    ))
                                  ) : (
                                    <>
                                      <text x="20" y="40" fill="#0f172a" fontSize="11" fontWeight="bold">
                                        {comp.name}
                                      </text>
                                      <text x="20" y="56" fill="#64748b" fontSize="9">
                                        {comp.cutInstruction}
                                      </text>
                                    </>
                                  )}
                                </g>
                              )}

                              {/* Interactive Landmarks on Component */}
                              {appSettings.showLandmarkLabels && comp.paths.flatMap(p => p.points).filter(pt => !pt.isControl && pt.name).map((pt, pIdx) => {
                                const ptId = `${comp.id}_${pIdx}`;
                                const isPtSelected = selectedPointId === ptId;
                                return (
                                  <g
                                    key={`pt-${pIdx}`}
                                    className="cursor-pointer group/pt"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPointId(ptId);
                                      showToast(`Selected landmark: ${pt.name || 'Point'}`);
                                    }}
                                  >
                                    {isPtSelected && (
                                      <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6" className="animate-ping" />
                                    )}
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r={isPtSelected ? "4.5" : "3"}
                                      fill={isPtSelected ? "#2563eb" : "#ffffff"}
                                      stroke="#2563eb"
                                      strokeWidth="1.5"
                                      className="group-hover/pt:fill-blue-500"
                                    />
                                    <text
                                      x={pt.x + 5}
                                      y={pt.y + 3}
                                      fill={isPtSelected ? "#1d4ed8" : "#64748b"}
                                      fontSize="7.5"
                                      fontFamily="sans-serif"
                                      fontWeight={isPtSelected ? "bold" : "normal"}
                                    >
                                      {pt.name}
                                    </text>
                                  </g>
                                );
                              })}
                            </g>
                          );
                        })}
                      </g>
                    ) : (
                      <>
                        {/* ============================================================== */}
                        {/* FRONT BODICE VECTOR                                            */}
                        {/* ============================================================== */}
                        <g id="front-bodice-group" transform="translate(40, 30)">
                      {/* Step 6 Nested Graded Lines */}
                      {easyPatternStep === 6 && (
                        <g id="front-nested-grading-lines">
                          {visibleNestedSizes.XS && (
                            <path
                              d="M 20 90 C 45 90 85 58 98 44 L 202 78 C 182 140 206 195 218 218 L 214 252 L 140 270 L 211 290 L 204 425 L 144 425 L 132 305 L 118 425 L 20 425 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XS.hex}
                              strokeWidth="1.2"
                              opacity="0.7"
                            />
                          )}
                          {visibleNestedSizes.S && (
                            <path
                              d="M 20 95 C 50 95 95 55 108 40 L 220 78 C 198 145 225 205 240 228 L 236 265 L 155 285 L 233 305 L 225 440 L 160 440 L 145 310 L 130 440 L 20 440 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.S.hex}
                              strokeWidth="1.8"
                            />
                          )}
                          {visibleNestedSizes.M && (
                            <path
                              d="M 20 100 C 55 100 102 52 116 36 L 234 76 C 210 148 240 212 258 236 L 254 274 L 165 296 L 250 316 L 242 452 L 172 452 L 155 315 L 138 452 L 20 452 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.M.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.L && (
                            <path
                              d="M 20 105 C 60 105 110 49 125 32 L 248 74 C 222 152 255 220 275 244 L 270 282 L 175 306 L 266 328 L 258 464 L 184 464 L 165 320 L 148 464 L 20 464 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.L.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.XL && (
                            <path
                              d="M 20 110 C 65 110 118 46 134 28 L 262 72 C 234 156 270 228 292 252 L 286 290 L 185 316 L 282 340 L 274 476 L 196 476 L 175 325 L 158 476 L 20 476 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XL.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.XXL && (
                            <path
                              d="M 20 115 C 70 115 125 43 142 24 L 276 70 C 246 160 285 236 309 260 L 302 298 L 195 326 L 298 352 L 290 488 L 208 488 L 185 330 L 168 488 L 20 488 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XXL.hex}
                              strokeWidth="1.8"
                            />
                          )}
                        </g>
                      )}

                      {/* Seam Allowance Offset Line */}
                      {seamAllowanceCm > 0 && easyPatternStep !== 6 && (
                        <path
                          d={geo.front.path}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="4 3"
                          style={{
                            transform: `scale(${1 + seamAllowanceCm * 0.04})`,
                            transformOrigin: '120px 240px',
                          }}
                          opacity={0.8}
                        />
                      )}

                      {/* Main Dynamic Front Bodice Path */}
                      <path
                        d={geo.front.path}
                        fill="rgba(59, 130, 246, 0.05)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        className="transition-all duration-75"
                      />

                      {/* Internal Dart Lines */}
                      {dartParams.hasBustDart && (
                        <g id="front-bust-dart-lines" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2">
                          <line x1={geo.front.bustDartTop.x} y1={geo.front.bustDartTop.y} x2={geo.front.apex.x} y2={geo.front.apex.y} />
                          <line x1={geo.front.bustDartBtm.x} y1={geo.front.bustDartBtm.y} x2={geo.front.apex.x} y2={geo.front.apex.y} />
                          <circle cx={geo.front.apex.x} cy={geo.front.apex.y} r="3.5" fill="#dc2626" />
                        </g>
                      )}

                      {dartParams.hasWaistDart && (
                        <g id="front-waist-dart-lines" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2">
                          <line x1={geo.front.wDart2.x} y1={geo.front.wDart2.y} x2={geo.front.wDartApex.x} y2={geo.front.wDartApex.y} />
                          <line x1={geo.front.wDart1.x} y1={geo.front.wDart1.y} x2={geo.front.wDartApex.x} y2={geo.front.wDartApex.y} />
                        </g>
                      )}

                      {/* Notches */}
                      {notchToggles.armhole && (
                        <line
                          x1={geo.front.underarm.x - 30}
                          y1={geo.front.underarm.y - 60}
                          x2={geo.front.underarm.x - 30 + notchSizeCm * 15}
                          y2={geo.front.underarm.y - 60}
                          stroke="#2563eb"
                          strokeWidth="2"
                        />
                      )}

                      {/* Grainline Arrow */}
                      {showEasyPatternGrainline && (
                        <g id="front-grainline" stroke="#64748b" strokeWidth="1.2">
                          <line x1="55" y1="140" x2="55" y2="400" />
                          <polyline points="50,148 55,140 60,148" fill="none" />
                          <polyline points="50,392 55,400 60,392" fill="none" />
                          <text
                            x="62"
                            y="280"
                            fill="#64748b"
                            fontSize="9"
                            fontFamily="monospace"
                            transform="rotate(-90 62 280)"
                          >
                            GRAINLINE ↑ CENTER FOLD
                          </text>
                        </g>
                      )}

                      {/* Piece Labels */}
                      {showEasyPatternLabel && (
                        <g id="front-labels">
                          <text x="75" y="190" fill="#0f172a" fontSize="13" fontWeight="bold">
                            FRONT BODICE
                          </text>
                          <text x="75" y="210" fill="#64748b" fontSize="10">
                            Size: {currentSize} • Bust: {currentBustCm}cm • Waist: {currentWaistCm}cm
                          </text>
                          <text x="75" y="228" fill="#3b82f6" fontSize="9" fontWeight="bold">
                            SA: {seamAllowanceCm}cm • Notch: {notchSizeCm}cm
                          </text>
                        </g>
                      )}

                      {/* Interactive Front Landmarks */}
                      {geo.front.points.map((pt) => {
                        const isSelected = selectedPointId === pt.id;
                        return (
                          <g
                            key={pt.id}
                            className="cursor-pointer group"
                            onMouseDown={(e) => handleLandmarkClick(pt, e)}
                          >
                            {isSelected && (
                              <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6" className="animate-ping" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? "5" : "3.5"}
                              fill={isSelected ? "#2563eb" : "#ffffff"}
                              stroke="#2563eb"
                              strokeWidth="2"
                              className="group-hover:fill-blue-500 transition-colors"
                            />
                            {appSettings.showLandmarkLabels && (
                              <text
                                x={pt.x + 6}
                                y={pt.y + 3}
                                fill={isSelected ? "#1d4ed8" : "#475569"}
                                fontSize="8"
                                fontFamily="sans-serif"
                                fontWeight={isSelected ? "bold" : "normal"}
                              >
                                {pt.name}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>

                    {/* ============================================================== */}
                    {/* BACK BODICE VECTOR                                             */}
                    {/* ============================================================== */}
                    <g id="back-bodice-group" transform="translate(400, 30)">
                      {/* Step 6 Nested Graded Lines for Back */}
                      {easyPatternStep === 6 && (
                        <g id="back-nested-grading-lines">
                          {visibleNestedSizes.S && (
                            <path
                              d="M 20 45 C 50 45 88 42 102 40 L 157 56 L 152 130 L 169 59 L 220 74 C 195 135 215 195 235 228 L 220 440 L 155 440 L 140 270 L 125 440 L 20 440 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.S.hex}
                              strokeWidth="1.8"
                            />
                          )}
                          {visibleNestedSizes.M && (
                            <path
                              d="M 20 48 C 55 48 95 40 110 37 L 167 53 L 160 132 L 180 56 L 234 72 C 206 138 228 202 250 236 L 235 452 L 165 452 L 148 275 L 132 452 L 20 452 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.M.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.L && (
                            <path
                              d="M 20 51 C 60 51 102 38 118 34 L 177 50 L 168 134 L 191 53 L 248 70 C 217 141 241 209 265 244 L 250 464 L 175 464 L 156 280 L 139 464 L 20 464 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.L.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.XL && (
                            <path
                              d="M 20 54 C 65 54 109 36 126 31 L 187 47 L 176 136 L 202 50 L 262 68 C 228 144 254 216 280 252 L 265 476 L 185 476 L 164 285 L 146 476 L 20 476 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XL.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {visibleNestedSizes.XXL && (
                            <path
                              d="M 20 57 C 70 57 116 34 134 28 L 197 44 L 184 138 L 213 47 L 276 66 C 239 147 267 223 295 260 L 280 488 L 195 488 L 172 290 L 153 488 L 20 488 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XXL.hex}
                              strokeWidth="1.8"
                            />
                          )}
                        </g>
                      )}

                      {/* Seam Allowance Offset Line */}
                      {seamAllowanceCm > 0 && easyPatternStep !== 6 && (
                        <path
                          d={geo.back.path}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={1}
                          strokeDasharray="4 3"
                          style={{
                            transform: `scale(${1 + seamAllowanceCm * 0.04})`,
                            transformOrigin: '120px 240px',
                          }}
                          opacity={0.8}
                        />
                      )}

                      {/* Main Dynamic Back Bodice Path */}
                      <path
                        d={geo.back.path}
                        fill="rgba(59, 130, 246, 0.05)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        className="transition-all duration-75"
                      />

                      {/* Back Dart Internals */}
                      <g id="back-dart-internals" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2">
                        <line x1={geo.back.b_shDart1.x} y1={geo.back.b_shDart1.y} x2={geo.back.b_shDartApex.x} y2={geo.back.b_shDartApex.y} />
                        <line x1={geo.back.b_shDart2.x} y1={geo.back.b_shDart2.y} x2={geo.back.b_shDartApex.x} y2={geo.back.b_shDartApex.y} />
                        <circle cx={geo.back.b_shDartApex.x} cy={geo.back.b_shDartApex.y} r="3" fill="#dc2626" />
                        <line x1={geo.back.b_wDart2.x} y1={geo.back.b_wDart2.y} x2={geo.back.b_wDartApex.x} y2={geo.back.b_wDartApex.y} />
                        <line x1={geo.back.b_wDart1.x} y1={geo.back.b_wDart1.y} x2={geo.back.b_wDartApex.x} y2={geo.back.b_wDartApex.y} />
                      </g>

                      {/* Back Grainline */}
                      {showEasyPatternGrainline && (
                        <g id="back-grainline" stroke="#64748b" strokeWidth="1.2">
                          <line x1="55" y1="140" x2="55" y2="400" />
                          <polyline points="50,148 55,140 60,148" fill="none" />
                          <polyline points="50,392 55,400 60,392" fill="none" />
                          <text
                            x="62"
                            y="280"
                            fill="#64748b"
                            fontSize="9"
                            fontFamily="monospace"
                            transform="rotate(-90 62 280)"
                          >
                            GRAINLINE ↑ CENTER BACK
                          </text>
                        </g>
                      )}

                      {/* Back Labels */}
                      {showEasyPatternLabel && (
                        <g id="back-labels">
                          <text x="75" y="190" fill="#0f172a" fontSize="13" fontWeight="bold">
                            BACK BODICE
                          </text>
                          <text x="75" y="210" fill="#64748b" fontSize="10">
                            Size: {currentSize} • Cut 1 on Fold
                          </text>
                          <text x="75" y="228" fill="#3b82f6" fontSize="9" fontWeight="bold">
                            SA: {seamAllowanceCm}cm • Notch: {notchSizeCm}cm
                          </text>
                        </g>
                      )}

                      {/* Interactive Back Landmarks */}
                      {geo.back.points.map((pt) => {
                        const isSelected = selectedPointId === pt.id;
                        return (
                          <g
                            key={pt.id}
                            className="cursor-pointer group"
                            onMouseDown={(e) => handleLandmarkClick(pt, e)}
                          >
                            {isSelected && (
                              <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6" className="animate-ping" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? "5" : "3.5"}
                              fill={isSelected ? "#2563eb" : "#ffffff"}
                              stroke="#2563eb"
                              strokeWidth="2"
                              className="group-hover:fill-blue-500 transition-colors"
                            />
                            {appSettings.showLandmarkLabels && (
                              <text
                                x={pt.x + 6}
                                y={pt.y + 3}
                                fill={isSelected ? "#1d4ed8" : "#475569"}
                                fontSize="8"
                                fontFamily="sans-serif"
                                fontWeight={isSelected ? "bold" : "normal"}
                              >
                                {pt.name}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                      </>
                    )}

                    {/* Custom Placed Marks (Point Tool) */}
                    {customPoints.map((cp) => {
                      const cx = cp.piece === 'front' ? cp.x + 40 : cp.x + 400;
                      const cy = cp.y + 30;
                      return (
                        <g key={cp.id}>
                          <circle cx={cx} cy={cy} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                          <text x={cx + 6} y={cy + 3} fill="#7e22ce" fontSize="8" fontWeight="bold">
                            {cp.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* Custom Construction Lines (Line Tool) */}
                    {constructionLines.map((line) => (
                      <g key={line.id}>
                        <line x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
                        <text
                          x={(line.p1.x + line.p2.x) / 2}
                          y={(line.p1.y + line.p2.y) / 2 - 4}
                          fill="#059669"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="bg-white"
                        >
                          {line.lengthCm} cm
                        </text>
                      </g>
                    ))}

                    {/* Measure Caliper Tape (Measure Tool) */}
                    {measurePoint1 && measurePoint2 && (
                      <g id="caliper-tape">
                        <line
                          x1={measurePoint1.x}
                          y1={measurePoint1.y}
                          x2={measurePoint2.x}
                          y2={measurePoint2.y}
                          stroke="#eab308"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                        <circle cx={measurePoint1.x} cy={measurePoint1.y} r="5" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={measurePoint2.x} cy={measurePoint2.y} r="5" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                        <rect
                          x={(measurePoint1.x + measurePoint2.x) / 2 - 45}
                          y={(measurePoint1.y + measurePoint2.y) / 2 - 14}
                          width="90"
                          height="20"
                          rx="4"
                          fill="#0f172a"
                          stroke="#eab308"
                          strokeWidth="1"
                        />
                        <text
                          x={(measurePoint1.x + measurePoint2.x) / 2}
                          y={(measurePoint1.y + measurePoint2.y) / 2}
                          fill="#fef08a"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontFamily="monospace"
                        >
                          {(Math.sqrt((measurePoint2.x - measurePoint1.x) ** 2 + (measurePoint2.y - measurePoint1.y) ** 2) * 0.1).toFixed(1)} cm
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Bottom Canvas Info Strip */}
                <div className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span>Tool: <strong className="text-blue-600">{easyPatternTool.toUpperCase()}</strong></span>
                    <span>Garment: <strong className="text-slate-800">{garment.name}</strong></span>
                    <span>Size: <strong className="text-blue-700 font-bold">{currentSize}</strong></span>
                    {garment && garment.components && garment.components.length > 2 ? (
                      <span>Pieces: <strong className="text-emerald-700 font-bold">{garment.components.length} CAD</strong></span>
                    ) : (
                      <>
                        <span>Bust: <strong>{currentBustCm} cm</strong></span>
                        <span>Waist: <strong>{currentWaistCm} cm</strong></span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {easyPatternTool === 'select' && 'Drag points on canvas or edit coordinates in right panel.'}
                    {easyPatternTool === 'measure' && 'Click 2 points to measure real caliper distance.'}
                    {easyPatternTool === 'point' && 'Click pattern canvas to place landmark.'}
                    {easyPatternTool === 'line' && 'Click 2 landmarks to connect construction line.'}
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* RIGHT SIDEBAR: COMPLETE WORKING EDIT OPTIONS ("completa edit panra") */}
              {/* ============================================================== */}
              <aside className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
                <div className="p-4 space-y-5">
                  {/* STEP 3 & STEP 4: INTERACTIVE EDIT CONTROLS */}
                  {easyPatternStep === 3 && (
                    <div className="space-y-4">
                      {/* MULTI-PIECE CAD PIECE EXPLORER */}
                      {garment && garment.components && garment.components.length > 2 && (
                        <div className="space-y-2.5 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3 rounded-xl border border-blue-200 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                              CAD Pattern Pieces ({garment.components.length})
                            </span>
                            <span className="text-[9px] font-mono text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold shadow-xs">
                              {garment.components.find(c => c.id === (selectedComponentId || garment.components[0].id))?.pieceCode || 'PIECE'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
                            {garment.components.map((c) => {
                              const isSel = (selectedComponentId || garment.components[0].id) === c.id;
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => {
                                    setSelectedComponentId(c.id);
                                    showToast(`Active Piece: ${c.name}`);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                                    isSel
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-white hover:bg-blue-100/60 border border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="truncate">
                                    <span className="font-bold mr-1.5 text-[11px]">{c.pieceCode || c.id.slice(0, 3).toUpperCase()}</span>
                                    <span className="text-[11px]">{c.name}</span>
                                  </div>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 font-mono ${isSel ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                                    {c.cutInstruction.split('•')[0].trim()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Section Title */}
                      <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                            Active Tool Controls
                          </h3>
                          <p className="text-[10px] text-slate-500">
                            Configure {easyPatternTool.toUpperCase()} tool properties.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                          {easyPatternTool}
                        </span>
                      </div>

                      {/* 1. SELECT TOOL: LANDMARK POINT INSPECTOR */}
                      {easyPatternTool === 'select' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Selected Landmark:
                          </span>
                          {selectedPointObj ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900">{selectedPointObj.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">{selectedPointObj.id}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-sans">X (px/cm)</span>
                                  <strong>{selectedPointObj.x.toFixed(1)}</strong>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-sans">Y (px/cm)</span>
                                  <strong>{selectedPointObj.y.toFixed(1)}</strong>
                                </div>
                              </div>

                              {/* Coordinate Nudge Controls */}
                              <div>
                                <span className="text-[10px] font-semibold text-slate-500 block mb-1">Nudge Point:</span>
                                <div className="grid grid-cols-4 gap-1">
                                  <button onClick={() => nudgePoint(-3, 0)} className="py-1 bg-white hover:bg-slate-100 border rounded text-[11px] font-bold">← Left</button>
                                  <button onClick={() => nudgePoint(3, 0)} className="py-1 bg-white hover:bg-slate-100 border rounded text-[11px] font-bold">Right →</button>
                                  <button onClick={() => nudgePoint(0, -3)} className="py-1 bg-white hover:bg-slate-100 border rounded text-[11px] font-bold">↑ Up</button>
                                  <button onClick={() => nudgePoint(0, 3)} className="py-1 bg-white hover:bg-slate-100 border rounded text-[11px] font-bold">Down ↓</button>
                                </div>
                              </div>

                              <button
                                onClick={resetSelectedPoint}
                                className="w-full py-1 text-center text-[10px] text-slate-500 hover:text-slate-800 underline"
                              >
                                Reset this landmark to default sloper
                              </button>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500">
                              Click any blue landmark circle on the pattern to select and edit its position.
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. CURVE TOOL: CURVATURE DEPTH SLIDERS */}
                      {easyPatternTool === 'curve' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Curvature Shaping:
                          </span>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Neckline Depth:</span>
                              <span className="font-mono text-blue-600">{curveParams.neckDepth} px</span>
                            </div>
                            <input
                              type="range"
                              min="-25"
                              max="35"
                              value={curveParams.neckDepth}
                              onChange={(e) => setCurveParams({ ...curveParams, neckDepth: Number(e.target.value) })}
                              className="w-full accent-blue-600"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Armhole Scye Depth:</span>
                              <span className="font-mono text-blue-600">{curveParams.armholeDepth} px</span>
                            </div>
                            <input
                              type="range"
                              min="-30"
                              max="40"
                              value={curveParams.armholeDepth}
                              onChange={(e) => setCurveParams({ ...curveParams, armholeDepth: Number(e.target.value) })}
                              className="w-full accent-blue-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. DART TOOL: DART PROPERTIES */}
                      {easyPatternTool === 'dart' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Dart Shaping:
                          </span>
                          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                            <span>Enable Waist Dart</span>
                            <input
                              type="checkbox"
                              checked={dartParams.hasWaistDart}
                              onChange={(e) => setDartParams({ ...dartParams, hasWaistDart: e.target.checked })}
                              className="rounded text-blue-600 w-4 h-4"
                            />
                          </label>
                          {dartParams.hasWaistDart && (
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                                <span>Waist Dart Width:</span>
                                <span className="font-mono text-blue-600">{dartParams.waistDartWidth} cm</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={dartParams.waistDartWidth}
                                onChange={(e) => setDartParams({ ...dartParams, waistDartWidth: Number(e.target.value) })}
                                className="w-full accent-blue-600"
                              />
                            </div>
                          )}

                          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer pt-2 border-t border-slate-200">
                            <span>Enable Side Bust Dart</span>
                            <input
                              type="checkbox"
                              checked={dartParams.hasBustDart}
                              onChange={(e) => setDartParams({ ...dartParams, hasBustDart: e.target.checked })}
                              className="rounded text-blue-600 w-4 h-4"
                            />
                          </label>
                          {dartParams.hasBustDart && (
                            <div>
                              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                                <span>Bust Dart Width:</span>
                                <span className="font-mono text-blue-600">{dartParams.bustDartWidth} cm</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="4"
                                step="0.5"
                                value={dartParams.bustDartWidth}
                                onChange={(e) => setDartParams({ ...dartParams, bustDartWidth: Number(e.target.value) })}
                                className="w-full accent-blue-600"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. SEAM TOOL: SEAM ALLOWANCE PRESETS */}
                      {easyPatternTool === 'seam' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Seam Allowance (SA):
                          </span>
                          <div className="grid grid-cols-4 gap-1">
                            {[0, 0.7, 1.0, 1.5].map((val) => (
                              <button
                                key={val}
                                onClick={() => setSeamAllowanceCm(val)}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  seamAllowanceCm === val
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-slate-100 border text-slate-700'
                                }`}
                              >
                                {val} cm
                              </button>
                            ))}
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Custom SA Width:</span>
                              <span className="font-mono text-blue-600">{seamAllowanceCm} cm</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={seamAllowanceCm}
                              onChange={(e) => setSeamAllowanceCm(Number(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* 5. NOTCH TOOL: NOTCH CONTROLS */}
                      {easyPatternTool === 'notch' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Notch Placements:
                          </span>
                          <div className="space-y-1.5 text-xs">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span>Armhole Balance Notch</span>
                              <input
                                type="checkbox"
                                checked={notchToggles.armhole}
                                onChange={(e) => setNotchToggles({ ...notchToggles, armhole: e.target.checked })}
                                className="rounded text-blue-600"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span>Bust Dart Notches</span>
                              <input
                                type="checkbox"
                                checked={notchToggles.bustDart}
                                onChange={(e) => setNotchToggles({ ...notchToggles, bustDart: e.target.checked })}
                                className="rounded text-blue-600"
                              />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span>Waist Dart Notches</span>
                              <input
                                type="checkbox"
                                checked={notchToggles.waistDart}
                                onChange={(e) => setNotchToggles({ ...notchToggles, waistDart: e.target.checked })}
                                className="rounded text-blue-600"
                              />
                            </label>
                          </div>
                          <div className="pt-2 border-t border-slate-200">
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Notch Slit Depth:</span>
                              <span className="font-mono text-blue-600">{notchSizeCm} cm</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="0.8"
                              step="0.05"
                              value={notchSizeCm}
                              onChange={(e) => setNotchSizeCm(Number(e.target.value))}
                              className="w-full accent-blue-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* 6. MEASURE TOOL: LIVE CALIPER TAPE & POM */}
                      {easyPatternTool === 'measure' && (
                        <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Caliper Measure:
                          </span>
                          {measurePoint1 && measurePoint2 ? (
                            <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs space-y-1">
                              <div className="font-bold text-yellow-900">
                                {measurePoint1.name} ➔ {measurePoint2.name}
                              </div>
                              <div className="text-base font-black font-mono text-yellow-800">
                                {(Math.sqrt((measurePoint2.x - measurePoint1.x) ** 2 + (measurePoint2.y - measurePoint1.y) ** 2) * 0.1).toFixed(1)} cm
                              </div>
                              <button
                                onClick={() => { setMeasurePoint1(null); setMeasurePoint2(null); }}
                                className="text-[10px] font-bold text-yellow-700 hover:underline pt-1 block"
                              >
                                Clear Caliper Line
                              </button>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500">
                              Click any 2 landmark dots on the pattern to measure the straight line distance between them.
                            </div>
                          )}

                          {/* Key Points of Measure (POM) Table */}
                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              Key Pattern Specs ({currentSize}):
                            </span>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-600">Total Bust:</span>
                                <strong className="font-mono text-slate-900">{currentBustCm} cm</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-600">Total Waist:</span>
                                <strong className="font-mono text-slate-900">{currentWaistCm} cm</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-600">Shoulder Width:</span>
                                <strong className="font-mono text-slate-900">{currentShoulderCm} cm</strong>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-slate-600">Garment Length:</span>
                                <strong className="font-mono text-slate-900">{currentLengthCm} cm</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ========================================================= */}
                      {/* LIVE DIMENSION FINE-TUNING SLIDERS ("size agisee pannura")  */}
                      {/* ========================================================= */}
                      <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Size Fine-Tuner:
                          </span>
                          <button
                            onClick={resetDeltas}
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Bust Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-0.5">
                            <span>Bust Adjustment:</span>
                            <span className="font-mono text-blue-600">
                              {customDeltas.bust > 0 ? `+${customDeltas.bust}` : customDeltas.bust} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-5"
                            max="5"
                            step="0.5"
                            value={customDeltas.bust}
                            onChange={(e) => setCustomDeltas({ ...customDeltas, bust: Number(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Waist Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-0.5">
                            <span>Waist Adjustment:</span>
                            <span className="font-mono text-blue-600">
                              {customDeltas.waist > 0 ? `+${customDeltas.waist}` : customDeltas.waist} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-5"
                            max="5"
                            step="0.5"
                            value={customDeltas.waist}
                            onChange={(e) => setCustomDeltas({ ...customDeltas, waist: Number(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Shoulder Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-0.5">
                            <span>Shoulder Adjustment:</span>
                            <span className="font-mono text-blue-600">
                              {customDeltas.shoulder > 0 ? `+${customDeltas.shoulder}` : customDeltas.shoulder} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-3"
                            max="3"
                            step="0.5"
                            value={customDeltas.shoulder}
                            onChange={(e) => setCustomDeltas({ ...customDeltas, shoulder: Number(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Length Slider */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-0.5">
                            <span>Body Length Adjustment:</span>
                            <span className="font-mono text-blue-600">
                              {customDeltas.length > 0 ? `+${customDeltas.length}` : customDeltas.length} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-8"
                            max="8"
                            step="1"
                            value={customDeltas.length}
                            onChange={(e) => setCustomDeltas({ ...customDeltas, length: Number(e.target.value) })}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PROPERTIES PANEL (Matching Step 4 in Image) */}
                  {easyPatternStep === 4 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Properties
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Configure seam allowance, notches, labels and grainlines.
                        </p>
                      </div>

                      {/* Seam Allowance Input */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Seam Allowance:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={seamAllowanceCm}
                            onChange={(e) => setSeamAllowanceCm(Number(e.target.value))}
                            className="w-24 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900"
                          />
                          <span className="text-xs font-bold text-slate-500">cm</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Standard industry allowance (1.0 cm = 10 mm)
                        </span>
                      </div>

                      {/* Notch Size Input */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Notch Size:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.05"
                            min="0.1"
                            max="1.5"
                            value={notchSizeCm}
                            onChange={(e) => setNotchSizeCm(Number(e.target.value))}
                            className="w-24 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900"
                          />
                          <span className="text-xs font-bold text-slate-500">cm</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Slit notch depth (0.3 cm)
                        </span>
                      </div>

                      {/* Checkboxes: Add Label & Show Grainline */}
                      <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEasyPatternLabel}
                            onChange={(e) => setShowEasyPatternLabel(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span>Add Label</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEasyPatternGrainline}
                            onChange={(e) => setShowEasyPatternGrainline(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span>Show Grainline</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: GRADING RULES PANEL (Matching Step 5 in Image) */}
                  {easyPatternStep === 5 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Grading Rules
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Proportional increments applied to all anchor points.
                        </p>
                      </div>

                      {/* Table matching the image */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="p-2">Point</th>
                              <th className="p-2">Grade Rule</th>
                              <th className="p-2">Size Colours</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {EASY_PATTERN_GRADING_RULES.map((rule: EasyGradingRuleItem, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="p-2 font-sans font-medium text-slate-800">{rule.point}</td>
                                <td className="p-2 font-bold text-blue-700">{rule.gradeRule}</td>
                                <td className="p-2 flex items-center gap-1.5 font-sans font-semibold">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: rule.color }}
                                  />
                                  <span className="text-[10px] text-slate-600">{rule.sizeName}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Live Automatic Grading Trigger */}
                      <button
                        onClick={async () => {
                          try {
                            await executeGrading('M');
                            showToast('Generated multi-size grading rules!');
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        disabled={isGrading}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{isGrading ? 'Grading S → M...' : 'Create Multiple Sizes (S, M, L, XL, XXL)'}</span>
                      </button>

                      {/* Quick Size Switcher */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Inspect Graded Size:
                        </span>
                        <div className="grid grid-cols-5 gap-1.5">
                          {(['S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((sz) => (
                            <button
                              key={sz}
                              onClick={() => {
                                setCurrentSize(sz);
                                showToast(`Viewing Size ${sz}`);
                              }}
                              className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                                currentSize === sz
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: NEST THE PATTERN (Multi-Size Graded Stack) */}
                  {easyPatternStep === 6 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Graded Nesting Stack
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Concentric multi-size contours (S through XXL).
                        </p>
                      </div>

                      {/* Legend with Color Checkboxes */}
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Visible Size Layers:
                        </span>
                        {(['S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((sz) => {
                          const pal = SIZE_COLOR_PALETTE[sz];
                          return (
                            <label
                              key={sz}
                              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white text-xs font-semibold cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: pal.hex }}
                                />
                                <span>Size {sz} ({pal.name})</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={visibleNestedSizes[sz]}
                                onChange={(e) =>
                                  setVisibleNestedSizes({
                                    ...visibleNestedSizes,
                                    [sz]: e.target.checked,
                                  })
                                }
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                            </label>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                        <div className="font-bold">Grading Inspection Note:</div>
                        <div className="text-[11px] text-blue-800">
                          Points grow proportionally from the center bust point outwards: +2.0 cm on bust, +1.5 cm on waist, +1.0 cm on armhole.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 7: PREVIEW & CHECK (Marker Details) */}
                  {easyPatternStep === 7 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Marker Details
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Fabric cut efficiency & marker dimensions.
                        </p>
                      </div>

                      {/* Seam Width / Fabric Roll Width */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Fabric Roll Width:
                        </label>
                        <select
                          value={markerWidthCm}
                          onChange={(e) => setMarkerWidthCm(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800"
                        >
                          <option value={140}>140 cm (55" Standard)</option>
                          <option value={150}>150 cm (59" Wide Width)</option>
                          <option value={160}>160 cm (63" Broadcloth)</option>
                        </select>
                      </div>

                      {/* Fabric Size */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Fabric Size / Length:
                        </span>
                        <div className="text-xl font-black text-slate-900 font-mono">
                          {fabricLengthMeters} m
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          Marker Yield: 88.7% High Efficiency
                        </span>
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEasyPatternLabel}
                            onChange={(e) => setShowEasyPatternLabel(e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          <span>Add Label</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seamAllowanceCm > 0}
                            onChange={(e) => setSeamAllowanceCm(e.target.checked ? 1.0 : 0)}
                            className="rounded text-blue-600"
                          />
                          <span>Seam Allowance</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Step Forward Action in Sidebar */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/70">
                  <button
                    onClick={() => setEasyPatternStep(Math.min(8, easyPatternStep + 1) as EasyPatternStep)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <span>Proceed to Step {easyPatternStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 8: EXPORT PROJECT MODAL & FINISH VIEW                     */}
        {/* ============================================================== */}
        {easyPatternStep === 8 && (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Step 8 of 8 • Final Step
                  </span>
                  <h2 className="text-lg font-bold">Export Project</h2>
                  <p className="text-xs text-blue-100">
                    Save your project in PDF, DXF, AAMA etc. for further use or production.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                  <Download className="w-5 h-5" />
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5 text-xs">
                {/* 1. Format Selection */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    Format:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'pdf', title: 'PDF (Recommended)', desc: 'Print-ready 1:1 scale vector sheet' },
                      { id: 'dxf', title: 'DXF (For CAD)', desc: 'Standard CAD exchange format' },
                      { id: 'aama', title: 'AAMA (For Industry)', desc: 'ASTM textile cutter spec' },
                      { id: 'png', title: 'PNG (Image)', desc: 'High-resolution graphic preview' },
                    ].map((fmt) => (
                      <label
                        key={fmt.id}
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                          exportFormat === fmt.id
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-blue-950'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="export-fmt"
                          checked={exportFormat === fmt.id}
                          onChange={() => setExportFormat(fmt.id as any)}
                          className="mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-bold text-xs">{fmt.title}</div>
                          <div className="text-[10px] text-slate-500">{fmt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Options Checkboxes */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    Options:
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeGrading}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeGrading: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Include Grading</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeLabels}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeLabels: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Include Labels</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeNotches}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeNotches: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Include Notches</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeSeamAllowance}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeSeamAllowance: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Include Seam Allowance</span>
                    </label>
                  </div>
                </div>

                {/* Success Feedback */}
                {exportSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>File exported and downloaded successfully!</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setEasyPatternStep(7)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                  >
                    Cancel / Back
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={transferToTukacad}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open in TUKAcAd</span>
                    </button>

                    <button
                      onClick={handleExport}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 3. STEP 1 SUB-MODALS: SETTINGS, LIBRARY, TUTORIAL, RECENT      */}
      {/* ============================================================== */}
      {/* A. Settings & Specs Modal */}
      {activeSubModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Settings & Specs</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Measurement Unit:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAppSettings({ ...appSettings, unit: 'cm' })}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      appSettings.unit === 'cm' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                  <button
                    onClick={() => setAppSettings({ ...appSettings, unit: 'in' })}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      appSettings.unit === 'in' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Canvas Grid Size:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 40].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setAppSettings({ ...appSettings, gridSize: sz })}
                      className={`py-1.5 rounded-lg font-bold border ${
                        appSettings.gridSize === sz ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {sz} px
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer font-semibold text-slate-800">
                  <span>Display Landmark Point Labels</span>
                  <input
                    type="checkbox"
                    checked={appSettings.showLandmarkLabels}
                    onChange={(e) => setAppSettings({ ...appSettings, showLandmarkLabels: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer font-semibold text-slate-800">
                  <span>Show Grainline on Pattern</span>
                  <input
                    type="checkbox"
                    checked={showEasyPatternGrainline}
                    onChange={(e) => setShowEasyPatternGrainline(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer font-semibold text-slate-800">
                  <span>Show Pattern Piece Labels</span>
                  <input
                    type="checkbox"
                    checked={showEasyPatternLabel}
                    onChange={(e) => setShowEasyPatternLabel(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSubModal(null);
                showToast('Settings saved successfully!');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md transition-all"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* B. Pattern Library Modal */}
      {activeSubModal === 'library' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Pattern Template Library</h3>
                  <p className="text-[11px] text-slate-500">Choose a garment sloper to start drafting immediately</p>
                </div>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { id: 'basic-bodice', name: "Women's Basic Bodice", desc: 'Front & Back with waist and bust darts (2 pieces)', active: true },
                { id: 'basic-tshirt', name: 'Basic Crew Neck T-Shirt', desc: 'Front, Back, Sleeve, Neckband (4 pieces)' },
                { id: 'polo', name: 'Casual Polo T-Shirt', desc: 'Collar, Placket, Front, Back, Sleeves (5 pieces)' },
                { id: 'shirt', name: 'Casual Button-Up Shirt', desc: 'Collar stand, Front, Back yoke, Cuffs (7 pieces)' },
                { id: 'trouser', name: 'Classic Trouser Sloper', desc: 'Front leg, Back leg, Waistband (3 pieces)' },
                { id: 'suit-jacket', name: 'Mens Tailored Suit Jacket', desc: '16-Piece Industrial Marker sloper' },
              ].map((template) => (
                <div
                  key={template.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{template.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{template.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      loadGarmentTemplate(template.id as any);
                      setActiveSubModal(null);
                      setEasyPatternStep(3);
                      showToast(`Loaded "${template.name}" into workspace!`);
                    }}
                    className="mt-3 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>Load Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* C. Tutorial & Help Modal */}
      {activeSubModal === 'tutorial' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">EasyPattern Step-by-Step Tutorial</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900">Step 1: Project Setup</h4>
                <p className="text-[11px] text-blue-800 mt-0.5">Start fresh, select library slopers, or open previous drafting projects.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Step 2: Garment & Size Range</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Pick your garment type, target sizes (XS to XXL), and enter manual measurements or standard size tables.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Step 3: Draft & Edit Landmarks</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Use the Select tool to drag landmark dots freely, change size with quick size buttons, fine-tune with sliders, or draw guidelines.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Step 4: Seams, Darts & Notches</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Adjust seam allowance width (1.0 cm) and notch length (0.3 cm) for production assembly.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Step 5 & 6: Grade & Nest</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Click automatic grading to generate the concentric multi-size outlines colored Blue, Green, Red, Yellow, and Purple.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Step 7 & 8: Check & Export</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Inspect the fabric cut marker and export in PDF, DXF, or AAMA, or transfer directly into TUKAcad with 1 click!</p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubModal(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
            >
              Got it! Let's Start
            </button>
          </div>
        </div>
      )}

      {/* D. Recent Files Modal */}
      {activeSubModal === 'recent' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Recent Projects</h3>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Basic_Bodice_Size_S.ep', date: 'Just now', size: 'S', pieces: 'Front & Back' },
                { name: 'Oxford_Casual_Shirt_Graded.ep', date: '2 hours ago', size: 'M', pieces: '7 pieces' },
                { name: 'Bootcut_Pants_Marker_Nest.ep', date: 'Yesterday', size: 'L', pieces: 'Front, Back, Waist' },
              ].map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{rec.name}</h4>
                    <span className="text-[10px] text-slate-500">Size {rec.size} • {rec.pieces} • {rec.date}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSubModal(null);
                      setEasyPatternStep(3);
                      showToast(`Resumed draft: ${rec.name}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* E. Men's Shirt Master Technical Specification Modal (Image 1 Exact Match) */}
      <MensShirtMasterModal
        isOpen={isShirtMasterModalOpen}
        onClose={() => setIsShirtMasterModalOpen(false)}
        onApplyPreset={loadMensShirtImage1Spec}
      />

      {/* F. Men's Tailored Trouser Master Technical Specification Modal (9 CAD Pieces) */}
      <MensTrouserMasterModal
        isOpen={isTrouserMasterModalOpen}
        onClose={() => setIsTrouserMasterModalOpen(false)}
        onApplyPreset={loadMensTrouserMasterSpec}
      />

      {/* ============================================================== */}
      {/* 4. FOOTER BANNER: Infographic Summary & Why Both Bridge        */}
      {/* ============================================================== */}
      <footer className="h-10 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700">EasyPattern:</span>
          <span className="text-slate-500">Fast, simple, beginner-friendly pattern making.</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Same idea... More precision... Bigger possibilities...
          </span>
          <button
            onClick={() => setIsWorkflowModalOpen(true)}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View Full Start-to-Finish Flow</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </footer>
    </div>
  );
};
