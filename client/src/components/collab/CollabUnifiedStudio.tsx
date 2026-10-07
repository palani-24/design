import React, { useState, useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { PatternWorkspace } from '../PatternWorkspace';
import { Clo3DViewport } from '../clo3d/Clo3DViewport';
import { TukaDrawingToolbar } from '../tukacad/TukaDrawingToolbar';
import { GarmentSize, SurfaceMode, AvatarPose } from '@shared/types';
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
} from 'lucide-react';

export const CollabUnifiedStudio: React.FC = () => {
  const {
    garment,
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

  const templates: Array<{ id: any; name: string }> = [
    { id: 'basic-bodice', name: "★ Women's Basic Bodice (2 Pcs: FR-BD, BK-BD)" },
    { id: 'flared-skirt', name: 'A-Line Flared Skirt (2 Pcs)' },
    { id: 'bootcut-pant', name: "Women's Boot Cut Pant (4 Pcs)" },
    { id: 'trouser', name: 'Chino Trouser (4 Pcs)' },
    { id: 'denim-jeans', name: 'Denim Jeans (5 Pcs)' },
    { id: 'basic-tshirt', name: 'Basic Crew T-Shirt (3 Pcs)' },
    { id: 'polo', name: 'Polo Shirt (4 Pcs)' },
    { id: 'shirt', name: 'Casual Button-Up Shirt (6 Pcs)' },
    { id: 'sheath-dress', name: 'Cocktail Sheath Dress (3 Pcs)' },
    { id: 'suit-jacket', name: "Men's Tailored Suit Jacket (16 Pcs)" },
    { id: 'double-breasted-blazer', name: 'Double-Breasted Blazer (12 Pcs)' },
    { id: 'trench-coat', name: 'Classic Trench Coat (14 Pcs)' },
    { id: 'bomber-jacket', name: 'Flight Bomber Jacket (8 Pcs)' },
  ];

  // Fabric presets
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

          {/* Active Garment Selector Dropdown */}
          <div className="hidden md:flex items-center ml-2">
            <select
              value={templates.find((t) => garment.name.toLowerCase().includes(t.name.toLowerCase()))?.id || 'basic-bodice'}
              onChange={(e) => loadGarmentTemplate(e.target.value as any)}
              className="bg-[#1c1f2b] border border-zinc-700 hover:border-zinc-500 rounded-md px-2 py-1 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[210px] truncate"
              title="Switch Garment Template"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
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
          <div className="w-72 xl:w-80 h-full bg-[#161820] border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto">
            {/* Pane Header */}
            <div className="p-3 bg-[#1b1e29] border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  EP
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-cyan-300">
                    1. EasyPattern Studio
                  </h3>
                  <p className="text-[10px] text-zinc-400">Parametric Sloper & Sizing</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-700/50">
                Size {currentSize}
              </span>
            </div>

            {/* Sizing & Dimension Sliders ("size agisee pannura mathiri") */}
            <div className="p-3 border-b border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Fit & Sizing Deltas
                </span>
                <button
                  onClick={resetSloperDeltas}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Reset Fit
                </button>
              </div>

              {/* Bust Delta Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Bust / Chest:</span>
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
                  <span className="text-zinc-400">Waist:</span>
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
                  <span className="text-zinc-400">Total Body Length:</span>
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

            {/* Pattern Attributes & Seam Allowance */}
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

            {/* Pattern Piece Inventory & Live Measurements */}
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

            {/* Quick Modals CTAs */}
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
