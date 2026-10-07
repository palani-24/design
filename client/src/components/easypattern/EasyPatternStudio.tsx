import React, { useState, useRef } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  EasyPatternStep,
  EasyPatternTool,
  GarmentSize,
  EasyGradingRuleItem,
} from '@shared/types';
import {
  EASY_PATTERN_GRADING_RULES,
  SIZE_COLOR_PALETTE,
  createBasicBodice,
  BASIC_BODICE_SIZE_TABLE,
} from '@shared/easyPatternConstants';
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
  } = useCADStore();

  // ==========================================
  // STEP 1 SUB-MODALS STATE
  // ==========================================
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

  // Step 2 manual measurements
  const [measurements, setMeasurements] = useState({
    bust: 92.0,
    waist: 71.0,
    hip: 96.0,
    bodyLength: 42.0,
    shoulderWidth: 12.8,
    armhole: 22.0,
  });

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

  // Load Basic Bodice if not loaded
  const ensureBasicBodice = () => {
    if (garment.name !== 'Basic Bodice') {
      const bodice = createBasicBodice();
      setGarment(bodice);
    }
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
        {/* Left Brand Badge */}
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
                  ensureBasicBodice();
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
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. DYNAMIC WORKFLOW CONTENT                                    */}
      {/* ============================================================== */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* ============================================================== */}
        {/* STEP 1: OPEN EASYPATTERN (Hub & Dashboard)                     */}
        {/* ============================================================== */}
        {easyPatternStep === 1 && (
          <div className="flex-1 flex h-full bg-[#f8fafc] overflow-y-auto">
            {/* Sidebar like image: Home, New Project, Open Project, Settings, Help */}
            <div className="w-56 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  EasyPattern Navigation
                </div>
                <button
                  onClick={() => setEasyPatternStep(1)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Home Hub</span>
                </button>
                <button
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(2);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  <FolderPlus className="w-4 h-4 text-slate-500" />
                  <span>New Project</span>
                </button>
                <button
                  onClick={() => setActiveSubModal('library')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-slate-500" />
                  <span>Open Project</span>
                </button>
                <button
                  onClick={() => setActiveSubModal('settings')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings & Specs</span>
                </button>
                <button
                  onClick={() => setActiveSubModal('tutorial')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Tutorial & Help</span>
                </button>
              </div>

              {/* Bottom Version Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 text-[11px]">EasyPattern v1.0</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Beginner CAD to TUKAcad Pipeline
                </div>
              </div>
            </div>

            {/* Main Stage Grid: Action Cards */}
            <div className="flex-1 p-8 flex flex-col justify-center max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  1. Launch EasyPattern & Create New Project
                </h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                  Simple, intuitive garment pattern drafting and automatic multi-size grading for beginners.
                </p>
              </div>

              {/* 4 Cards Matching Image Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Create New Pattern */}
                <button
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(2);
                  }}
                  className="p-6 rounded-2xl bg-white border-2 border-blue-500 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:border-blue-600 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Create New Pattern
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose garment type (Basic Bodice, Trouser, Skirt) and size range with standard measurements.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                    <span>Start Step 2</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 2: Open Project */}
                <button
                  onClick={() => setActiveSubModal('library')}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md text-left transition-all group flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      Open Existing Pattern
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Load saved pattern files, templates or previous grading drafts (.ep / .tud).
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-600 group-hover:text-blue-600">
                    <span>Explore Templates</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 3: Pattern Library */}
                <button
                  onClick={() => setActiveSubModal('library')}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md text-left transition-all group flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                      Pattern Library
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pre-calibrated slopers: Women's Basic Bodice, Trouser sloper, A-line Skirt, Oxford Shirt.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
                    <span>Explore Slopers</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 4: Recent Files */}
                <button
                  onClick={() => setActiveSubModal('recent')}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md text-left transition-all group flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Recent Files
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Basic_Bodice_Size_S.ep • Front & Back Bodice with Waist Dart & Seam Allowance.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <span>Recent Drafts</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: SELECT GARMENT & SIZE RANGE                            */}
        {/* ============================================================== */}
        {easyPatternStep === 2 && (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Step 2 of 8
                  </span>
                  <h2 className="text-lg font-bold">New Project: Garment & Size Range</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                  Women · Basic Bodice
                </span>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5 text-xs">
                {/* 1. Category Selection */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    1. Select Garment Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Women', 'Men', 'Children', 'Custom'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGarmentCategory(cat)}
                        className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                          garmentCategory === cat
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Garment Type Dropdown */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    2. Garment Type
                  </label>
                  <select
                    value={garmentType}
                    onChange={(e) => setGarmentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Basic Bodice">Basic Bodice (Front & Back with Darts - Recommended)</option>
                    <option value="Trouser">Trouser / Pants Sloper</option>
                    <option value="Flared Skirt">Flared Skirt</option>
                    <option value="Shirt">Casual Button-Up Shirt</option>
                    <option value="Sheath Dress">Princess Sheath Dress</option>
                  </select>
                </div>

                {/* 3. Size Range Multi-Select Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      3. Target Size Range
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {selectedSizeRange.length} sizes selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[]).map((sz) => {
                      const isSelected = selectedSizeRange.includes(sz);
                      const colorInfo = SIZE_COLOR_PALETTE[sz];
                      return (
                        <button
                          key={sz}
                          onClick={() => toggleSizeInRange(sz)}
                          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 border-2 border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{sz}</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: colorInfo.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Measurement Input Option */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    4. Measurement Input Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                      measurementInputMode === 'manual'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="meas-mode"
                        checked={measurementInputMode === 'manual'}
                        onChange={() => setMeasurementInputMode('manual')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold">Manual Input</div>
                        <div className="text-[10px] text-slate-500">Enter custom body measurements</div>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                      measurementInputMode === 'sizechart'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="meas-mode"
                        checked={measurementInputMode === 'sizechart'}
                        onChange={() => setMeasurementInputMode('sizechart')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold">Use Size Chart</div>
                        <div className="text-[10px] text-slate-500">Industry standard specs</div>
                      </div>
                    </label>
                  </div>

                  {/* Manual Inputs Preview */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Bust (cm)</span>
                      <input
                        type="number"
                        value={measurements.bust}
                        onChange={(e) => setMeasurements({ ...measurements, bust: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Waist (cm)</span>
                      <input
                        type="number"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Hip (cm)</span>
                      <input
                        type="number"
                        value={measurements.hip}
                        onChange={(e) => setMeasurements({ ...measurements, hip: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-xs mt-0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit & Next Button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setEasyPatternStep(1)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      ensureBasicBodice();
                      setEasyPatternStep(3);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all"
                  >
                    <span>Next: Draft the Pattern</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    viewBox="0 0 760 560"
                    onMouseDown={handleSvgMouseDown}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={handleSvgMouseUp}
                    className={`w-full max-w-4xl h-auto bg-white border border-slate-200 rounded-xl shadow-sm ${
                      easyPatternTool === 'select'
                        ? 'cursor-default'
                        : easyPatternTool === 'measure'
                        ? 'cursor-crosshair'
                        : easyPatternTool === 'point'
                        ? 'cursor-cell'
                        : 'cursor-crosshair'
                    }`}
                    style={{ maxHeight: '72vh' }}
                  >
                    {/* Background Grid Pattern */}
                    <defs>
                      <pattern id="easy-grid" width={appSettings.gridSize} height={appSettings.gridSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${appSettings.gridSize} 0 L 0 0 0 ${appSettings.gridSize}`} fill="none" stroke="#f1f5f9" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="760" height="560" fill="url(#easy-grid)" />

                    {/* Step 7 Fabric Roll Bounds (If in Preview mode) */}
                    {easyPatternStep === 7 && (
                      <g id="fabric-marker-preview">
                        <rect
                          x="20"
                          y="20"
                          width="720"
                          height="520"
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          rx="8"
                        />
                        <text x="35" y="42" fill="#64748b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                          FABRIC ROLL: WIDTH {markerWidthCm} cm • LENGTH {fabricLengthMeters} m • EFFICIENCY 88.7%
                        </text>
                      </g>
                    )}

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
                    <span>Size: <strong className="text-blue-700 font-bold">{currentSize}</strong></span>
                    <span>Bust: <strong>{currentBustCm} cm</strong></span>
                    <span>Waist: <strong>{currentWaistCm} cm</strong></span>
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
                      ensureBasicBodice();
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
