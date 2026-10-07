import React, { useState } from 'react';
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
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  Share2,
  TrendingUp,
  Sliders,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Zap,
  Map,
  Boxes,
  Compass,
} from 'lucide-react';

export const EasyPatternStudio: React.FC = () => {
  const {
    garment,
    setGarment,
    currentSize,
    setCurrentSize,
    targetSize,
    setTargetSize,
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
    showEasyPatternGrading,
    setShowEasyPatternGrading,
    markerWidthCm,
    setMarkerWidthCm,
    fabricLengthMeters,
    setFabricLengthMeters,
    executeGrading,
    isGrading,
    transferToTukacad,
    setCADEngineMode,
    setIsWorkflowModalOpen,
  } = useCADStore();

  // Local state for Step 2 manual measurements
  const [measurements, setMeasurements] = useState({
    bust: 92.0,
    waist: 71.0,
    hip: 96.0,
    bodyLength: 42.0,
    shoulderWidth: 12.8,
    armhole: 22.0,
  });

  // Local state for Step 6 visible nested sizes
  const [visibleNestedSizes, setVisibleNestedSizes] = useState<Record<GarmentSize, boolean>>({
    XS: true,
    S: true,
    M: true,
    L: true,
    XL: true,
    XXL: true,
  });

  // Local state for Step 8 Export
  const [exportFormat, setExportFormat] = useState<'pdf' | 'dxf' | 'aama' | 'png'>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeGrading: true,
    includeLabels: true,
    includeNotches: true,
    includeSeamAllowance: true,
  });
  const [exportSuccess, setExportSuccess] = useState(false);

  // Load Basic Bodice if not already loaded
  const ensureBasicBodice = () => {
    if (garment.name !== 'Basic Bodice') {
      const bodice = createBasicBodice();
      setGarment(bodice);
    }
  };

  // Step 8 Export Handler with real download
  const handleExport = () => {
    let filename = `EasyPattern-${garment.name.replace(/\s+/g, '_')}-${currentSize}`;
    let content = '';
    let mimeType = 'text/plain';

    if (exportFormat === 'pdf' || exportFormat === 'png') {
      filename += `.${exportFormat === 'pdf' ? 'svg' : 'svg'}`;
      mimeType = 'image/svg+xml';
      content = `<!-- EasyPattern Vector Output - ${garment.name} (Size: ${currentSize}) -->\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">\n` +
        `  <rect width="1000" height="700" fill="#f8fafc" />\n` +
        `  <text x="50" y="40" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">EasyPattern - ${garment.name}</text>\n` +
        `  <text x="50" y="65" font-family="sans-serif" font-size="12" fill="#64748b">Size: ${currentSize} | SA: ${seamAllowanceCm}cm | Notch: ${notchSizeCm}cm</text>\n` +
        `  <!-- Front & Back Bodice Cut Contours -->\n` +
        `  <g transform="translate(60, 100)">\n` +
        `    <text x="20" y="20" font-size="14" font-weight="bold" fill="#1e293b">FRONT BODICE (Cut 1 on fold)</text>\n` +
        `  </g>\n` +
        `  <g transform="translate(420, 100)">\n` +
        `    <text x="20" y="20" font-size="14" font-weight="bold" fill="#1e293b">BACK BODICE (Cut 1 on fold)</text>\n` +
        `  </g>\n` +
        `</svg>`;
    } else if (exportFormat === 'dxf') {
      filename += '.dxf';
      content = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n` +
        `0\nTEXT\n8\nLABELS\n10\n60.0\n20\n100.0\n40\n12.0\n1\nEASYPATTERN ${garment.name.toUpperCase()} SIZE ${currentSize}\n` +
        `0\nENDSEC\n0\nEOF\n`;
    } else {
      filename += '.aama';
      content = `AAMA-ASTM-D6673-EXPORT\nSTYLE: ${garment.name}\nBASE_SIZE: ${garment.baseSize}\nACTIVE_SIZE: ${currentSize}\n` +
        `SEAM_ALLOWANCE: ${seamAllowanceCm} CM\nNOTCH_SIZE: ${notchSizeCm} CM\nPIECES: FRONT_BODICE, BACK_BODICE\n`;
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
  };

  // Navigation steps config
  const steps: Array<{ step: EasyPatternStep; title: string; subtitle: string }> = [
    { step: 1, title: 'Open EasyPattern', subtitle: 'Launch & project hub' },
    { step: 2, title: 'Select Garment & Size', subtitle: 'Category & measurements' },
    { step: 3, title: 'Draft the Pattern', subtitle: 'Basic vector draft' },
    { step: 4, title: 'Add Details & Edit', subtitle: 'Darts, seams, notches' },
    { step: 5, title: 'Grade the Pattern', subtitle: 'Rules & auto-grading' },
    { step: 6, title: 'Nest the Pattern', subtitle: 'Multi-size stack view' },
    { step: 7, title: 'Preview & Check', subtitle: 'Marker & fabric inspect' },
    { step: 8, title: 'Export Project', subtitle: 'PDF, DXF, AAMA output' },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f1f5f9] select-none font-sans text-slate-900">
      {/* 1. TOP NAVBAR: EasyPattern Brand Header + 8-Step Breadcrumb Nav */}
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
        <div className="flex items-center gap-2.5">
          {/* Interactive Workflow Guide Button */}
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
            title="Send this pattern to TUKAcAd for Professional CAD production"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Transfer to TUKAcad</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {/* Mode Switcher Pill */}
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

      {/* 2. DYNAMIC WORKFLOW STAGE CONTENT BASED ON STEP (1 TO 8) */}
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  <FolderPlus className="w-4 h-4 text-slate-500" />
                  <span>New Project</span>
                </button>
                <button
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(3);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  <FolderOpen className="w-4 h-4 text-slate-500" />
                  <span>Open Project</span>
                </button>
                <button
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings & Specs</span>
                </button>
                <button
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-xs"
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
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(3);
                  }}
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
                    <span>Open Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 3: Pattern Library */}
                <button
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(2);
                  }}
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
                    <span>Explore Templates</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Card 4: Recent Files */}
                <button
                  onClick={() => {
                    ensureBasicBodice();
                    setEasyPatternStep(3);
                  }}
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
                    <span>Resume Last Draft</span>
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
            {/* Top EasyPattern Tool Bar: 8 Tools from image */}
            <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-2xs z-20">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-2">
                  Basic Tools:
                </span>
                {[
                  { id: 'select', label: 'Select', icon: MousePointer },
                  { id: 'point', label: 'Point', icon: Dot },
                  { id: 'line', label: 'Line', icon: Minus },
                  { id: 'curve', label: 'Curve', icon: Spline },
                  { id: 'dart', label: 'Dart', icon: Scissors },
                  { id: 'seam', label: 'Seam', icon: Layers },
                  { id: 'notch', label: 'Notch', icon: Tag },
                  { id: 'measure', label: 'Measure', icon: Ruler },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = easyPatternTool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setEasyPatternTool(t.id as EasyPatternTool)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      title={t.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Center status message */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">
                  {easyPatternStep === 3 && 'Step 3: Draft the Pattern (Front & Back Bodice)'}
                  {easyPatternStep === 4 && 'Step 4: Add Details & Edit (Darts, Seam Allowance, Notches)'}
                  {easyPatternStep === 5 && 'Step 5: Grade the Pattern (S, M, L, XL, XXL)'}
                  {easyPatternStep === 6 && 'Step 6: Nest the Pattern (Graded Overlay View)'}
                  {easyPatternStep === 7 && 'Step 7: Preview & Check (Fabric Cut Marker)'}
                </span>
              </div>

              {/* Navigation stepper buttons */}
              <div className="flex items-center gap-1.5">
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
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Viewport: Left/Center Canvas + Right Properties/Grading Drawer */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Center SVG Vector Canvas */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {/* SVG Canvas Area */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[#fbfcfd]">
                  <svg
                    viewBox="0 0 760 560"
                    className="w-full max-w-4xl h-auto bg-white border border-slate-200 rounded-xl shadow-sm"
                    style={{ maxHeight: '72vh' }}
                  >
                    {/* Background Subtle Grid Pattern */}
                    <defs>
                      <pattern id="easy-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
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
                          FABRIC ROLL: WIDTH 150 cm • LENGTH 87.5 m • EFFICIENCY 88.7%
                        </text>
                      </g>
                    )}

                    {/* ============================================================== */}
                    {/* FRONT BODICE VECTOR                                            */}
                    {/* ============================================================== */}
                    <g id="front-bodice-group" transform="translate(40, 30)">
                      {/* Step 6 Nested Graded Lines (Concentric Colors: Blue, Green, Red, Yellow, Purple) */}
                      {easyPatternStep === 6 && (
                        <g id="front-nested-grading-lines">
                          {/* XS (Slate) */}
                          {visibleNestedSizes.XS && (
                            <path
                              d="M 20 90 C 45 90 85 58 98 44 L 202 78 C 182 140 206 195 218 218 L 214 252 L 140 270 L 211 290 L 204 425 L 144 425 L 132 305 L 118 425 L 20 425 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XS.hex}
                              strokeWidth="1.2"
                              opacity="0.7"
                            />
                          )}
                          {/* S (Blue - Base) */}
                          {visibleNestedSizes.S && (
                            <path
                              d="M 20 95 C 50 95 95 55 108 40 L 220 78 C 198 145 225 205 240 228 L 236 265 L 155 285 L 233 305 L 225 440 L 160 440 L 145 310 L 130 440 L 20 440 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.S.hex}
                              strokeWidth="1.8"
                            />
                          )}
                          {/* M (Green) */}
                          {visibleNestedSizes.M && (
                            <path
                              d="M 20 100 C 55 100 102 52 116 36 L 234 76 C 210 148 240 212 258 236 L 254 274 L 165 296 L 250 316 L 242 452 L 172 452 L 155 315 L 138 452 L 20 452 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.M.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* L (Red) */}
                          {visibleNestedSizes.L && (
                            <path
                              d="M 20 105 C 60 105 110 49 125 32 L 248 74 C 222 152 255 220 275 244 L 270 282 L 175 306 L 266 328 L 258 464 L 184 464 L 165 320 L 148 464 L 20 464 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.L.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* XL (Yellow) */}
                          {visibleNestedSizes.XL && (
                            <path
                              d="M 20 110 C 65 110 118 46 134 28 L 262 72 C 234 156 270 228 292 252 L 286 290 L 185 316 L 282 340 L 274 476 L 196 476 L 175 325 L 158 476 L 20 476 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XL.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* XXL (Purple) */}
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

                      {/* Seam Allowance Offset (Steps 4, 5, 7) */}
                      {seamAllowanceCm > 0 && easyPatternStep !== 3 && easyPatternStep !== 6 && (
                        <path
                          d="M 10 95 C 45 95 90 50 108 30 L 226 70 C 204 140 232 205 248 228 L 244 265 L 160 285 L 241 305 L 233 448 L 165 448 L 145 310 L 125 448 L 10 448 Z"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1"
                          strokeDasharray="4 3"
                          opacity="0.8"
                        />
                      )}

                      {/* Main Front Bodice Path */}
                      <path
                        d="M 20 95 C 50 95 95 55 108 40 L 220 78 C 198 145 225 205 240 228 L 236 265 L 155 285 L 233 305 L 225 440 L 160 440 L 145 310 L 130 440 L 20 440 Z"
                        fill="rgba(59, 130, 246, 0.04)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        className="cursor-pointer hover:stroke-blue-700 transition-colors"
                      />

                      {/* Internal Dart Lines (Steps 4, 5, 7) */}
                      {easyPatternStep >= 4 && (
                        <g id="front-dart-internals" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2">
                          {/* Side Bust Dart Legs */}
                          <line x1="236" y1="265" x2="155" y2="285" />
                          <line x1="233" y1="305" x2="155" y2="285" />
                          {/* Waist Dart Legs */}
                          <line x1="160" y1="440" x2="145" y2="310" />
                          <line x1="130" y1="440" x2="145" y2="310" />
                          {/* Bust Apex Dot */}
                          <circle cx="155" cy="285" r="3" fill="#dc2626" />
                        </g>
                      )}

                      {/* Notches (Steps 4, 5, 7) */}
                      {easyPatternStep >= 4 && (
                        <g id="front-notches" stroke="#2563eb" strokeWidth="2">
                          {/* Armhole Notch */}
                          <line x1="205" y1="160" x2="215" y2="156" />
                          {/* Side Bust Dart Notches */}
                          <line x1="236" y1="265" x2="242" y2="265" />
                          <line x1="233" y1="305" x2="239" y2="305" />
                          {/* Waist Dart Notch */}
                          <line x1="145" y1="440" x2="145" y2="446" />
                        </g>
                      )}

                      {/* Grainline Arrow (Steps 4, 5, 7) */}
                      {showEasyPatternGrainline && easyPatternStep >= 4 && (
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

                      {/* Labels (Steps 4, 5, 7) */}
                      {showEasyPatternLabel && easyPatternStep >= 4 && (
                        <g id="front-labels">
                          <text x="75" y="190" fill="#0f172a" fontSize="13" fontWeight="bold">
                            FRONT BODICE
                          </text>
                          <text x="75" y="210" fill="#64748b" fontSize="10">
                            Size: {currentSize} • Cut 1 on Fold
                          </text>
                          <text x="75" y="228" fill="#3b82f6" fontSize="9" fontWeight="bold">
                            SA: {seamAllowanceCm}cm • Notch: {notchSizeCm}cm
                          </text>
                        </g>
                      )}

                      {/* Draft Points (Step 3) */}
                      {easyPatternStep === 3 && (
                        <g id="front-draft-points">
                          {[
                            { x: 20, y: 95, label: 'Center Front Neck' },
                            { x: 108, y: 40, label: 'HPS Shoulder' },
                            { x: 220, y: 78, label: 'Shoulder Tip' },
                            { x: 240, y: 228, label: 'Underarm Scye' },
                            { x: 155, y: 285, label: 'Bust Apex' },
                            { x: 225, y: 440, label: 'Side Waist' },
                            { x: 145, y: 310, label: 'Waist Dart Apex' },
                            { x: 20, y: 440, label: 'Center Front Waist' },
                          ].map((pt, idx) => (
                            <g key={idx}>
                              <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                              <text x={pt.x + 6} y={pt.y + 3} fill="#1e293b" fontSize="8" fontFamily="sans-serif">
                                {pt.label}
                              </text>
                            </g>
                          ))}
                        </g>
                      )}
                    </g>

                    {/* ============================================================== */}
                    {/* BACK BODICE VECTOR                                             */}
                    {/* ============================================================== */}
                    <g id="back-bodice-group" transform="translate(400, 30)">
                      {/* Step 6 Nested Graded Lines for Back Bodice */}
                      {easyPatternStep === 6 && (
                        <g id="back-nested-grading-lines">
                          {/* S (Blue) */}
                          {visibleNestedSizes.S && (
                            <path
                              d="M 20 45 C 50 45 88 42 102 40 L 157 56 L 152 130 L 169 59 L 220 74 C 195 135 215 195 235 228 L 220 440 L 155 440 L 140 270 L 125 440 L 20 440 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.S.hex}
                              strokeWidth="1.8"
                            />
                          )}
                          {/* M (Green) */}
                          {visibleNestedSizes.M && (
                            <path
                              d="M 20 48 C 55 48 95 40 110 37 L 167 53 L 160 132 L 180 56 L 234 72 C 206 138 228 202 250 236 L 235 452 L 165 452 L 148 275 L 132 452 L 20 452 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.M.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* L (Red) */}
                          {visibleNestedSizes.L && (
                            <path
                              d="M 20 51 C 60 51 102 38 118 34 L 177 50 L 168 134 L 191 53 L 248 70 C 217 141 241 209 265 244 L 250 464 L 175 464 L 156 280 L 139 464 L 20 464 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.L.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* XL (Yellow) */}
                          {visibleNestedSizes.XL && (
                            <path
                              d="M 20 54 C 65 54 109 36 126 31 L 187 47 L 176 136 L 202 50 L 262 68 C 228 144 254 216 280 252 L 265 476 L 185 476 L 164 285 L 146 476 L 20 476 Z"
                              fill="none"
                              stroke={SIZE_COLOR_PALETTE.XL.hex}
                              strokeWidth="1.5"
                            />
                          )}
                          {/* XXL (Purple) */}
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

                      {/* Seam Allowance Offset */}
                      {seamAllowanceCm > 0 && easyPatternStep !== 3 && easyPatternStep !== 6 && (
                        <path
                          d="M 10 45 C 45 45 85 35 102 30 L 157 46 L 152 120 L 175 49 L 226 66 C 200 130 222 195 243 228 L 228 448 L 160 448 L 140 270 L 120 448 L 10 448 Z"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1"
                          strokeDasharray="4 3"
                          opacity="0.8"
                        />
                      )}

                      {/* Main Back Bodice Path */}
                      <path
                        d="M 20 45 C 50 45 88 42 102 40 L 157 56 L 152 130 L 169 59 L 220 74 C 195 135 215 195 235 228 L 220 440 L 155 440 L 140 270 L 125 440 L 20 440 Z"
                        fill="rgba(59, 130, 246, 0.04)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        className="cursor-pointer hover:stroke-blue-700 transition-colors"
                      />

                      {/* Back Dart Internals (Steps 4, 5, 7) */}
                      {easyPatternStep >= 4 && (
                        <g id="back-dart-internals" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2">
                          {/* Shoulder Dart */}
                          <line x1="163" y1="57.5" x2="152" y2="130" />
                          {/* Waist Dart */}
                          <line x1="140" y1="440" x2="140" y2="270" />
                          <circle cx="140" cy="270" r="3" fill="#dc2626" />
                        </g>
                      )}

                      {/* Back Notches */}
                      {easyPatternStep >= 4 && (
                        <g id="back-notches" stroke="#2563eb" strokeWidth="2">
                          {/* Double Back Armhole Notch */}
                          <line x1="200" y1="140" x2="208" y2="138" />
                          <line x1="203" y1="148" x2="211" y2="146" />
                          {/* Waist Dart Notch */}
                          <line x1="140" y1="440" x2="140" y2="446" />
                        </g>
                      )}

                      {/* Back Grainline */}
                      {showEasyPatternGrainline && easyPatternStep >= 4 && (
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
                      {showEasyPatternLabel && easyPatternStep >= 4 && (
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

                      {/* Draft Points (Step 3) */}
                      {easyPatternStep === 3 && (
                        <g id="back-draft-points">
                          {[
                            { x: 20, y: 45, label: 'Center Back Neck' },
                            { x: 102, y: 40, label: 'Back HPS' },
                            { x: 152, y: 130, label: 'Shoulder Dart' },
                            { x: 220, y: 74, label: 'Back Shoulder Tip' },
                            { x: 235, y: 228, label: 'Back Underarm' },
                            { x: 220, y: 440, label: 'Back Side Waist' },
                            { x: 140, y: 270, label: 'Back Waist Dart' },
                            { x: 20, y: 440, label: 'Center Back Waist' },
                          ].map((pt, idx) => (
                            <g key={idx}>
                              <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                              <text x={pt.x + 6} y={pt.y + 3} fill="#1e293b" fontSize="8" fontFamily="sans-serif">
                                {pt.label}
                              </text>
                            </g>
                          ))}
                        </g>
                      )}
                    </g>
                  </svg>
                </div>

                {/* Bottom Canvas Info Strip */}
                <div className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span>Tool: <strong>{easyPatternTool.toUpperCase()}</strong></span>
                    <span>Piece: <strong>Front Bodice & Back Bodice</strong></span>
                    <span>Size: <strong className="text-blue-600">{currentSize}</strong></span>
                  </div>
                  <div>
                    {easyPatternStep === 3 && 'Click canvas points to edit or measure lines.'}
                    {easyPatternStep === 4 && 'Adjust seam allowance width and notches in the right panel.'}
                    {easyPatternStep === 5 && 'Run automatic grading to generate sizes S to XXL.'}
                    {easyPatternStep === 6 && 'Inspect concentric size outlines in color.'}
                    {easyPatternStep === 7 && 'Fabric roll layout ready for cutter export.'}
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* RIGHT SIDEBAR: STEP-SPECIFIC EDIT & PROPERTIES PANEL          */}
              {/* ============================================================== */}
              <aside className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
                <div className="p-4 space-y-5">
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

                      {/* Seam Allowance Input (e.g. 1.0 cm) */}
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

                      {/* Notch Size Input (e.g. 0.3 cm) */}
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

                      {/* Table matching the image exactly! */}
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
                              onClick={() => setCurrentSize(sz)}
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
                          Seam Width (Fabric Roll):
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

                      {/* Fabric Size (Total Length) */}
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

                  {/* STEP 3 INFO */}
                  {easyPatternStep === 3 && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Draft Guide
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Basic Bodice sloper (Front & Back panels).
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-2">
                        <div className="font-bold">Drawing & Editing Tips:</div>
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-800">
                          <li>Use <strong>Point</strong> to adjust landmark coordinates.</li>
                          <li>Use <strong>Curve</strong> to shape neckline and armhole scye.</li>
                          <li>Center Front and Center Back align to the fold line.</li>
                        </ul>
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

      {/* 3. FOOTER BANNER: Infographic Summary & Why Both Bridge */}
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
