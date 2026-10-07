import React, { useState, useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { PatternWorkspace } from '../PatternWorkspace';
import { Clo3DViewport } from '../clo3d/Clo3DViewport';
import { TukaDrawingToolbar } from '../tukacad/TukaDrawingToolbar';
import { GarmentSize, SurfaceMode, AvatarPose, PatternComponent } from '@shared/types';
import { pathCommandsToSvgString } from '@shared/gradingEngine';
import {
  Sparkles,
  Layers,
  Box,
  Shirt,
  Play,
  Pause,
  Wind,
  Maximize2,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Workflow,
  ArrowRight,
  Eye,
  Camera,
  Scissors,
  Ruler,
  Compass,
  FileText,
  Download,
  Check,
  Undo2,
  Redo2,
  ChevronRight,
  SplitSquareVertical,
  Columns,
  Grid,
  Palette,
  Target,
} from 'lucide-react';

// Helper to compute individual pattern piece dimensions & SVG preview viewport
function getPieceMetrics(comp: PatternComponent) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  let pointCount = 0;

  comp.paths.forEach((p) => {
    p.points.forEach((pt) => {
      pointCount++;
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });
  });

  if (minX === Infinity) {
    return {
      widthCm: '0.0',
      heightCm: '0.0',
      viewBox: '-10 -10 100 100',
      pointCount: 0,
      notchCount: comp.notches?.length || 0,
    };
  }

  const w = Math.max(20, maxX - minX);
  const h = Math.max(20, maxY - minY);
  const padX = w * 0.12;
  const padY = h * 0.12;

  return {
    widthCm: (w / 10).toFixed(1),
    heightCm: (h / 10).toFixed(1),
    viewBox: `${(minX - padX).toFixed(1)} ${(minY - padY).toFixed(1)} ${(w + padX * 2).toFixed(1)} ${(h + padY * 2).toFixed(1)}`,
    pointCount,
    notchCount: comp.notches?.length || 0,
  };
}

export const CollabUnifiedStudio: React.FC = () => {
  const {
    garment,
    selectedComponentId,
    setSelectedComponent,
    selectEntireGarment,
    setPanOffset,
    currentSize,
    targetSize,
    executeGrading,
    isGrading,
    activeGradingStep,
    isSimulating,
    toggleSimulation,
    windEnabled,
    toggleWind,
    surfaceMode,
    setSurfaceMode,
    selectedAvatarPose,
    setSelectedAvatarPose,
    activeFabric,
    setActiveFabric,
    sloperDeltas,
    setSloperDeltas,
    resetSloperDeltas,
    seamAllowanceCm,
    setSeamAllowanceCm,
    notchSizeCm,
    setNotchSizeCm,
    showEasyPatternLabel,
    setShowEasyPatternLabel,
    showEasyPatternGrainline,
    setShowEasyPatternGrainline,
    easyPatternStep,
    setEasyPatternStep,
    loadGarmentTemplate,
    cadEngineMode,
    setCADEngineMode,
    setIsWorkflowModalOpen,
    setActiveModal,
    undo,
    redo,
    canUndo,
    canRedo,
    gradingNotification,
  } = useCADStore();

  // Layout preset mode: 'triple' | 'dual-cad-3d' | 'dual-easy-3d' | 'dual-easy-cad'
  const [layoutMode, setLayoutMode] = useState<
    'triple' | 'dual-cad-3d' | 'dual-easy-3d' | 'dual-easy-cad'
  >('triple');

  // Spacebar hotkey to toggle simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        toggleSimulation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSimulation]);

  const sizes: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Categorized product templates for Shirts, Pants, Dresses, Jackets
  const productCategories = [
    {
      category: '👔 Shirts & Tops',
      items: [
        { id: 'shirt', name: 'Casual Button-Up Shirt (4 Pcs)' },
        { id: 'polo', name: 'Pique Polo Shirt (4 Pcs)' },
        { id: 'basic-tshirt', name: 'Basic Crew T-Shirt (3 Pcs)' },
        { id: 'basic-bodice', name: "★ Women's Basic Bodice (2 Pcs)" },
      ],
    },
    {
      category: '👖 Pants & Trousers',
      items: [
        { id: 'trouser', name: 'Flat-Front Chino Trouser (3 Pcs)' },
        { id: 'denim-jeans', name: 'Denim 5-Pocket Jeans (4 Pcs)' },
        { id: 'bootcut-pant', name: "Women's Boot Cut Pant (4 Pcs)" },
      ],
    },
    {
      category: '👗 Dresses & Skirts',
      items: [
        { id: 'flared-skirt', name: 'A-Line Flared Skirt (2 Pcs)' },
        { id: 'sheath-dress', name: 'Cocktail Sheath Dress (3 Pcs)' },
      ],
    },
    {
      category: '🧥 Outerwear & Jackets',
      items: [
        { id: 'suit-jacket', name: "Men's Tailored Suit Jacket (16 Pcs)" },
        { id: 'double-breasted-blazer', name: 'Double-Breasted Blazer (12 Pcs)' },
        { id: 'trench-coat', name: 'Classic Trench Coat (14 Pcs)' },
        { id: 'bomber-jacket', name: 'Flight Bomber Jacket (8 Pcs)' },
      ],
    },
  ];

  // Curated color swatches for instant 2D & 3D re-coloring
  const curatedColors = [
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Denim Indigo', hex: '#2563eb' },
    { name: 'Chino Khaki', hex: '#b48a4c' },
    { name: 'Slate Charcoal', hex: '#334155' },
    { name: 'Jet Black', hex: '#18181b' },
    { name: 'Crisp White', hex: '#f8fafc' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Royal Purple', hex: '#7c3aed' },
    { name: 'Warm Tan', hex: '#d97706' },
    { name: 'Olive Green', hex: '#3f6212' },
    { name: 'Coral Rose', hex: '#f43f5e' },
  ];

  // Fabric physics presets
  const fabricPresets = [
    { name: 'Cotton Jersey', color: '#3b82f6', weight: 160, stretch: 15, bendStiffness: 25 },
    { name: 'Silk Satin', color: '#ec4899', weight: 80, stretch: 5, bendStiffness: 10 },
    { name: 'Heavy Denim', color: '#1e3a8a', weight: 420, stretch: 2, bendStiffness: 85 },
    { name: 'Wool Flannel', color: '#475569', weight: 340, stretch: 6, bendStiffness: 70 },
    { name: 'Leather', color: '#78350f', weight: 550, stretch: 1, bendStiffness: 95 },
    { name: 'Linen Natural', color: '#e2e8f0', weight: 210, stretch: 4, bendStiffness: 45 },
  ];

  // Avatar poses
  const poses: Array<{ id: AvatarPose; name: string }> = [
    { id: 'FV2_01_A', name: 'A-Pose' },
    { id: 'FV2_02_Aforsize', name: 'Size Check' },
    { id: 'FV2_03_Attention', name: 'Attention' },
    { id: 'FV2_08_Running', name: 'Running' },
    { id: 'FV2_09_Sitting', name: 'Sitting' },
    { id: 'FV2_10_ArmsUp', name: 'Arms Up' },
  ];

  // Active archetype flags
  const nameLower = garment.name.toLowerCase();
  const isShirt =
    nameLower.includes('shirt') || nameLower.includes('polo') || nameLower.includes('t-shirt');
  const isPant =
    nameLower.includes('trouser') ||
    nameLower.includes('pant') ||
    nameLower.includes('jean') ||
    nameLower.includes('chino');
  const isBodice = nameLower.includes('bodice');
  const isSkirt = nameLower.includes('skirt');
  const isJacket =
    nameLower.includes('jacket') || nameLower.includes('blazer') || nameLower.includes('coat');
  const isDress = nameLower.includes('dress');

  // Find currently active template id
  const currentTemplateId =
    productCategories
      .flatMap((c) => c.items)
      .find((t) => nameLower.includes(t.id) || nameLower.includes(t.name.toLowerCase().split(' ')[0]))
      ?.id || (isShirt ? 'shirt' : isPant ? 'trouser' : 'basic-bodice');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c0d11] select-none font-sans text-white">
      {/* ============================================================== */}
      {/* 1. TOP UNIFIED COLLABORATION HEADER                            */}
      {/* ============================================================== */}
      <header className="h-14 bg-[#14161d] border-b border-zinc-800 px-3 flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Left: Brand Badge & Live Collaboration Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span>3-in-1 Triple Collab Studio</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Bi-Directional Sync Active</span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:block">
                EasyPattern (Sloper & Sizing) ⇄ TUKAcad (2D Vector CAD) ⇄ CLO 3D (Live Avatar Drape)
              </p>
            </div>
          </div>

          {/* Categorized Product Selector Dropdown */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            <select
              value={currentTemplateId}
              onChange={(e) => loadGarmentTemplate(e.target.value as any)}
              className="bg-[#1c1f2b] border border-zinc-700 hover:border-zinc-500 rounded-md px-2.5 py-1 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[210px] truncate"
              title="Select Garment (Shirt, Pant, Skirt, Bodice, Jacket, Dress)"
            >
              {productCategories.map((group) => (
                <optgroup key={group.category} label={group.category} className="bg-[#14161d] font-bold text-zinc-300">
                  {group.items.map((item) => (
                    <option key={item.id} value={item.id} className="text-zinc-200">
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Quick Archetype Switcher Chips */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              <button
                onClick={() => loadGarmentTemplate('shirt')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isShirt
                    ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Select Shirt Archetype"
              >
                <span>👔</span>
                <span>Shirt</span>
              </button>
              <button
                onClick={() => loadGarmentTemplate('trouser')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isPant
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Select Pants Archetype"
              >
                <span>👖</span>
                <span>Pants</span>
              </button>
              <button
                onClick={() => loadGarmentTemplate('basic-bodice')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isBodice
                    ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Select Bodice Sloper"
              >
                <span>★</span>
                <span>Bodice</span>
              </button>
              <button
                onClick={() => loadGarmentTemplate('flared-skirt')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isSkirt
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'
                }`}
                title="Select Flared Skirt"
              >
                <span>✨</span>
                <span>Skirt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Quick Size Grading Bar (XS to XXL) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1a1d26] rounded-lg p-1 border border-zinc-700/80 shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2">
              Size:
            </span>
            <div className="flex items-center gap-1">
              {sizes.map((sz) => {
                const isCurrent = currentSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => executeGrading(sz)}
                    disabled={isGrading}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400 font-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                    title={`Grade pattern to size ${sz} (updates both 2D CAD and 3D avatar drape)`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Simulation Spacebar CTA */}
          <button
            onClick={toggleSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSimulating
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
            title="Toggle 3D Avatar Cloth Drape Simulation (Hotkey: Spacebar)"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Simulating (Space)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate (Space)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Layout Modes + Engine Switchers + Guide */}
        <div className="flex items-center gap-2">
          {/* Layout Selector */}
          <div className="hidden lg:flex items-center bg-[#1a1d26] rounded-lg p-0.5 border border-zinc-700/80">
            <button
              onClick={() => setLayoutMode('triple')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                layoutMode === 'triple'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Triple View: EasyPattern + TUKAcad 2D + CLO 3D"
            >
              ⚏ Triple (1:1:1)
            </button>
            <button
              onClick={() => setLayoutMode('dual-cad-3d')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                layoutMode === 'dual-cad-3d'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Dual View: TUKAcad 2D + CLO 3D"
            >
              ◫ CAD + 3D
            </button>
            <button
              onClick={() => setLayoutMode('dual-easy-3d')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                layoutMode === 'dual-easy-3d'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Dual View: EasyPattern + CLO 3D"
            >
              ◫ Easy + 3D
            </button>
          </div>

          {/* Workflow Guide Infographic Button */}
          <button
            onClick={() => setIsWorkflowModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Open Workflow Guide (Infographic)"
          >
            <Workflow className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Workflow Guide</span>
          </button>

          {/* Return to Single Engine Views */}
          <div className="flex items-center bg-[#1a1d26] rounded-lg p-0.5 border border-zinc-700/80">
            <button
              onClick={() => setCADEngineMode('easypattern')}
              className="px-2 py-1 rounded text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:bg-zinc-800"
              title="Switch to EasyPattern Full View"
            >
              EasyPattern
            </button>
            <button
              onClick={() => setCADEngineMode('tukacad')}
              className="px-2 py-1 rounded text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-zinc-800"
              title="Switch to TUKAcad 2D Full View"
            >
              TUKAcad
            </button>
            <button
              onClick={() => setCADEngineMode('clo3d')}
              className="px-2 py-1 rounded text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:bg-zinc-800"
              title="Switch to CLO 3D Full View"
            >
              CLO 3D
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SUB-HEADER WORKFLOW PIPELINE PROGRESS TRACKER               */}
      {/* ============================================================== */}
      <div className="h-7 bg-[#101217] border-b border-zinc-800/80 px-4 flex items-center justify-between text-[11px] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
            Collaborative Pipeline:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              1. EasyPattern Drafting & Sizing
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              2. TUKAcad 2D CAD Engineering
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              3. CLO 3D Virtual Drape & Fitting
            </span>
          </div>
        </div>

        {/* Undo/Redo & Quick Actions */}
        <div className="flex items-center gap-2">
          {gradingNotification && (
            <span className="text-amber-400 font-medium text-[11px] animate-pulse mr-2">
              {gradingNotification}
            </span>
          )}
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN MULTI-STUDIO COLLABORATIVE WORKSPACE                   */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ============================================================ */}
        {/* PANE 1: EASYPATTERN STUDIO (Sloper, Sizing & Delas)          */}
        {/* ============================================================ */}
        {(layoutMode === 'triple' || layoutMode === 'dual-easy-3d' || layoutMode === 'dual-easy-cad') && (
          <div className="w-80 xl:w-96 h-full bg-[#161820] border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto">
            {/* 1. Pane Header with Active Garment Info */}
            <div className="p-3 bg-[#1b1e29] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shadow-cyan-500/20">
                  EP
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-cyan-300 truncate max-w-[170px]">
                    {garment.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="capitalize text-cyan-400 font-semibold">{garment.category || 'Garment'}</span>
                    <span>•</span>
                    <span>{garment.components.length} Pieces</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                  Size {currentSize}
                </span>
              </div>
            </div>

            {/* 2. PATTERN PIECES BREAKDOWN SHELF ("thanithaniya ennaku show aganum") */}
            <div className="p-3 border-b border-zinc-800 space-y-2.5 bg-[#14161f]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                  Pattern Pieces Breakdown ({garment.components.length})
                </span>
                <button
                  onClick={selectEntireGarment}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                    selectedComponentId === 'entire' || selectedComponentId === null
                      ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                  title="View all pieces assembled in CAD canvas"
                >
                  All Pieces
                </button>
              </div>

              {/* Individual Piece Cards Filmstrip ("thanithaniya show") */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {garment.components.map((comp, idx) => {
                  const isSelected = selectedComponentId === comp.id;
                  const metrics = getPieceMetrics(comp);
                  const pathData = pathCommandsToSvgString(comp.paths);
                  const pieceCode = comp.pieceCode || comp.id.toUpperCase();

                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        setSelectedComponent(comp.id);
                        setPanOffset({
                          x: 180 - comp.offset.x * 0.8,
                          y: 120 - comp.offset.y * 0.8,
                        });
                      }}
                      className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                          : 'bg-[#181a24] border-zinc-800 hover:border-zinc-600 hover:bg-[#1e212e]'
                      }`}
                      title={`Click to inspect & isolate: ${comp.name}`}
                    >
                      {/* Mini SVG Preview of Individual Piece */}
                      <div
                        className="w-12 h-12 rounded bg-black/60 border border-zinc-800/80 p-1 flex items-center justify-center shrink-0 overflow-hidden"
                      >
                        <svg
                          viewBox={metrics.viewBox}
                          className="w-full h-full pointer-events-none"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <path
                            d={pathData}
                            fill={activeFabric.color}
                            fillOpacity={isSelected ? 0.6 : 0.3}
                            stroke={isSelected ? '#38bdf8' : '#22c55e'}
                            strokeWidth="3.5"
                          />
                        </svg>
                      </div>

                      {/* Piece Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-cyan-200' : 'text-zinc-200'
                            }`}
                          >
                            {comp.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {comp.cutInstruction || `Cut 1 • ${pieceCode}`}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-zinc-400">
                          <span className="text-emerald-400 font-bold">
                            {metrics.widthCm} × {metrics.heightCm} cm
                          </span>
                          <span>•</span>
                          <span>{metrics.notchCount} notches</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Piece Inspector Callout (if single piece selected) */}
              {selectedComponentId && selectedComponentId !== 'entire' && (
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold truncate max-w-[180px]">
                      Isolated: {garment.components.find((c) => c.id === selectedComponentId)?.name}
                    </span>
                  </div>
                  <button
                    onClick={selectEntireGarment}
                    className="text-cyan-400 hover:text-white underline font-bold"
                  >
                    Reset to All
                  </button>
                </div>
              )}
            </div>

            {/* 3. FABRIC COLOR & MATERIAL SELECTION ("size coloeslam pannurom") */}
            <div className="p-3 border-b border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  Garment Color & Material
                </span>
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                  {activeFabric.name}
                </span>
              </div>

              {/* Curated Color Swatches */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {curatedColors.map((c) => {
                  const isSelected = activeFabric.color.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => setActiveFabric({ color: c.hex })}
                      className={`w-5 h-5 rounded-full border transition-all relative ${
                        isSelected
                          ? 'scale-125 ring-2 ring-white border-black z-10 shadow-md'
                          : 'border-zinc-700/80 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex}) — Instant 2D & 3D Recoloring`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white absolute inset-0 m-auto stroke-[3]" />
                      )}
                    </button>
                  );
                })}

                {/* Custom Color Input Picker */}
                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-zinc-700">
                  <input
                    type="color"
                    value={activeFabric.color}
                    onChange={(e) => setActiveFabric({ color: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border border-zinc-600 bg-transparent p-0"
                    title="Choose Custom Color Hex"
                  />
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">
                    {activeFabric.color}
                  </span>
                </div>
              </div>

              {/* Instant Sync Indicator */}
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Color dynamically rendered in CLO 3D avatar drape</span>
              </div>

              {/* Fabric Texture Presets */}
              <div className="grid grid-cols-3 gap-1 pt-1">
                {fabricPresets.map((fab) => (
                  <button
                    key={fab.name}
                    onClick={() => setActiveFabric(fab)}
                    className={`p-1 rounded text-[10px] font-bold text-center border transition-all ${
                      activeFabric.name === fab.name
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-zinc-800/60 border-zinc-700/60 hover:bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    {fab.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Sizing & Dimension Sliders ("size agisee pannura mathiri") */}
            <div className="p-3 border-b border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Fit & Sizing Deltas
                </span>
                <button
                  onClick={resetSloperDeltas}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
                >
                  Reset Fit
                </button>
              </div>

              {/* Bust Delta Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Bust / Chest Delta:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {sloperDeltas.bust > 0 ? `+${sloperDeltas.bust}` : sloperDeltas.bust} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="0.5"
                  value={sloperDeltas.bust}
                  onChange={(e) => setSloperDeltas({ bust: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Waist Delta Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Waist Delta:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {sloperDeltas.waist > 0 ? `+${sloperDeltas.waist}` : sloperDeltas.waist} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="0.5"
                  value={sloperDeltas.waist}
                  onChange={(e) => setSloperDeltas({ waist: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shoulder Delta Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Shoulder Width:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {sloperDeltas.shoulder > 0 ? `+${sloperDeltas.shoulder}` : sloperDeltas.shoulder} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="5"
                  step="0.5"
                  value={sloperDeltas.shoulder}
                  onChange={(e) => setSloperDeltas({ shoulder: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Garment Length Delta Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Total Garment Length:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {sloperDeltas.length > 0 ? `+${sloperDeltas.length}` : sloperDeltas.length} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="15"
                  step="0.5"
                  value={sloperDeltas.length}
                  onChange={(e) => setSloperDeltas({ length: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 5. Pattern Attributes & Seam Allowance */}
            <div className="p-3 border-b border-zinc-800 space-y-2.5">
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                <Scissors className="w-3 h-3 text-cyan-400" />
                Seam & Notch Specs
              </span>

              {/* Seam Allowance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Seam Allowance:</span>
                  <span className="font-mono font-bold text-cyan-300">{seamAllowanceCm.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={seamAllowanceCm}
                  onChange={(e) => setSeamAllowanceCm(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Notch Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Notch Depth:</span>
                  <span className="font-mono font-bold text-cyan-300">{notchSizeCm.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={notchSizeCm}
                  onChange={(e) => setNotchSizeCm(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Grainline & Label Toggles */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={showEasyPatternGrainline}
                    onChange={(e) => setShowEasyPatternGrainline(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Grainline</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={showEasyPatternLabel}
                    onChange={(e) => setShowEasyPatternLabel(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Pattern Label</span>
                </label>
              </div>
            </div>

            {/* 6. Pattern Piece Inventory & Live Measurements */}
            <div className="p-3 border-b border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                <Ruler className="w-3 h-3 text-cyan-400" />
                Live Pattern Specs
              </span>
              <div className="bg-[#12141a] p-2.5 rounded-lg border border-zinc-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Pieces:</span>
                  <span className="font-bold text-zinc-200">{garment.components.length} Pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chest Circumference:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {(92 + sloperDeltas.bust).toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Waist Circumference:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {(71 + sloperDeltas.waist).toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Front Center Length:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {(42 + sloperDeltas.length).toFixed(1)} cm
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Quick Modals CTAs */}
            <div className="p-3 mt-auto space-y-1.5">
              <button
                onClick={() => setActiveModal('techPack')}
                className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Tech Pack Spec</span>
              </button>
              <button
                onClick={() => setActiveModal('nesting')}
                className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nesting & Efficiency</span>
              </button>
              <button
                onClick={() => setActiveModal('export')}
                className="w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CAD / SVG</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PANE 2: TUKACAD 2D STUDIO (16-Tool Vector CAD & Canvas)       */}
        {/* ============================================================ */}
        {(layoutMode === 'triple' || layoutMode === 'dual-cad-3d' || layoutMode === 'dual-easy-cad') && (
          <div className="flex-1 h-full flex flex-col min-w-0 bg-[#0f1115] border-r border-zinc-800 overflow-hidden relative">
            {/* Pane Header */}
            <div className="h-9 px-3 bg-[#171922] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rotate-45 inline-block rounded-xs" />
                <h3 className="font-extrabold text-xs text-rose-300">
                  2. TUKAcad 2D Studio
                </h3>
                <span className="text-[10px] text-zinc-400">
                  16-Tool Vector CAD & Grading
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="font-mono">Piece: {garment.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                  Unit: mm / cm
                </span>
              </div>
            </div>

            {/* 16 TUKA Drawing Tools Bar */}
            <div className="shrink-0">
              <TukaDrawingToolbar />
            </div>

            {/* Embedded Pattern Workspace (SVG Canvas, Piece shelf, Rulers) */}
            <div className="flex-1 relative overflow-hidden">
              <PatternWorkspace />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PANE 3: CLO 3D STUDIO (Avatar Drape & Live 3D Simulation)    */}
        {/* ============================================================ */}
        {(layoutMode === 'triple' || layoutMode === 'dual-cad-3d' || layoutMode === 'dual-easy-3d') && (
          <div className="w-80 xl:w-96 2xl:w-[440px] h-full flex flex-col shrink-0 bg-[#14151a] overflow-hidden relative">
            {/* Pane Header */}
            <div className="h-9 px-3 bg-[#191b22] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-blue-400" />
                <h3 className="font-extrabold text-xs text-blue-300">
                  3. CLO 3D Studio
                </h3>
                <span className="text-[10px] text-zinc-400">
                  3D Drape & Virtual Fit
                </span>
              </div>

              {/* Simulation State Badge */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                  }`}
                />
                <span className="text-[10px] font-bold font-mono text-zinc-300">
                  {isSimulating ? '60 FPS' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Three.js 3D Viewport with Avatar Drape */}
            <div className="flex-1 relative overflow-hidden">
              <Clo3DViewport />
            </div>

            {/* Bottom Controls inside CLO 3D Pane */}
            <div className="p-2.5 bg-[#171920] border-t border-zinc-800 space-y-2 shrink-0">
              {/* Surface Rendering Modes */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Surface Mode:
                </span>
                <div className="flex items-center gap-1">
                  {(['textured', 'wireframe', 'stressMap', 'translucent'] as SurfaceMode[]).map(
                    (m) => (
                      <button
                        key={m}
                        onClick={() => setSurfaceMode(m)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold capitalize transition-colors ${
                          surfaceMode === m
                            ? 'bg-blue-600 text-white'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {m === 'stressMap' ? 'Stress' : m}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Avatar Pose Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Pose:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[240px]">
                  {poses.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedAvatarPose(p.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-colors ${
                        selectedAvatarPose === p.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Preset Selection */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Fabric:
                </span>
                <div className="flex items-center gap-1">
                  {fabricPresets.map((fab) => (
                    <button
                      key={fab.name}
                      onClick={() => setActiveFabric(fab)}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        activeFabric.name === fab.name
                          ? 'ring-2 ring-blue-400 scale-110 border-white'
                          : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: fab.color }}
                      title={`${fab.name} (${fab.weight} g/m²)`}
                    />
                  ))}
                  <span className="text-[10px] font-semibold text-zinc-300 ml-1 truncate max-w-[90px]">
                    {activeFabric.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
