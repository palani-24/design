import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  X,
  ExternalLink,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  MousePointer,
  Dot,
  Minus,
  Spline,
  Scissors,
  Tag,
  Ruler,
  Maximize2,
  CheckCircle2,
  Info,
  TrendingUp,
  Sliders,
  Compass,
  FileCode,
  Box,
  Eye,
  Download,
  Printer,
  FolderPlus,
  FolderOpen,
} from 'lucide-react';
import { EasyPatternStep, TukacadWorkflowStep } from '@shared/types';
import { createBasicBodice } from '@shared/easyPatternConstants';

export const WorkflowGuideModal: React.FC = () => {
  const {
    isWorkflowModalOpen,
    setIsWorkflowModalOpen,
    setCADEngineMode,
    setEasyPatternStep,
    setTukacadWorkflowStep,
    setGarment,
    setActiveModal,
  } = useCADStore();

  const [activeTab, setActiveTab] = useState<'all' | 'easypattern' | 'tukacad'>('all');
  const [selectedCard, setSelectedCard] = useState<{
    section: 'easypattern' | 'tukacad';
    step: number;
    title: string;
    description: string;
    details: string[];
  } | null>(null);

  if (!isWorkflowModalOpen) return null;

  // Jump to EasyPattern step
  const jumpToEasyStep = (step: EasyPatternStep) => {
    setGarment(createBasicBodice());
    setEasyPatternStep(step);
    setCADEngineMode('easypattern');
    setIsWorkflowModalOpen(false);
  };

  // Jump to TUKAcad step
  const jumpToTukaStep = (step: TukacadWorkflowStep, openModal?: string) => {
    setTukacadWorkflowStep(step);
    setCADEngineMode('tukacad');
    if (openModal) {
      setActiveModal(openModal as any);
    }
    setIsWorkflowModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b0f19] text-white rounded-2xl border border-slate-700/80 w-full max-w-7xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* ============================================================== */}
        {/* 1. INFOGRAPHIC HEADER MATCHING USER'S IMAGE                   */}
        {/* ============================================================== */}
        <header className="px-6 py-4 bg-gradient-to-r from-[#0d1627] via-[#0f172a] to-[#1c0c16] border-b border-slate-800 flex items-center justify-between shrink-0">
          {/* Left: EasyPattern Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-cyan-500/20">
              EP
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>EasyPattern</span>
              </div>
              <p className="text-[11px] text-cyan-300 font-medium">Simple · Learn · Create</p>
              <span className="text-[10px] text-slate-400 font-medium">EasyPattern — For beginners</span>
            </div>
          </div>

          {/* Center: Main Infographic Title */}
          <div className="hidden md:flex flex-col items-center text-center">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Pattern Making & Grading Workflow</span>
            </h1>
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span>From Start to Finish</span>
              <span className="text-cyan-400 font-bold">(EasyPattern</span>
              <span className="text-slate-400">➔</span>
              <span className="text-rose-400 font-bold">TUKAcad)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              EasyPattern — For beginners &nbsp;|&nbsp; TUKAcad — For professional & advanced work
            </div>
          </div>

          {/* Right: TUKAcad Logo + Close Button */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-lg font-black tracking-tight text-white flex items-center justify-end gap-1.5">
                <span className="w-5 h-5 bg-red-600 rotate-45 inline-block rounded-xs mr-1 shadow-sm shadow-red-500/40" />
                <span>TUKAcad</span>
              </div>
              <p className="text-[11px] text-rose-300 font-medium">Professional CAD for Apparel Industry</p>
              <span className="text-[10px] text-slate-400 italic">Same idea... More precision... Bigger possibilities...</span>
            </div>

            <button
              onClick={() => setIsWorkflowModalOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors ml-2"
              title="Close Workflow Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Filter Navigation Tabs */}
        <div className="h-10 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">View Section:</span>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All 14 Steps (Complete Flow)
            </button>
            <button
              onClick={() => setActiveTab('easypattern')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeTab === 'easypattern'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              EasyPattern (8 Steps)
            </button>
            <button
              onClick={() => setActiveTab('tukacad')}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeTab === 'tukacad'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              TUKAcad (6 Steps)
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Click any step card below to interactively launch that stage!
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN SCROLLABLE CONTENT: 8 STEPS EASY + 6 STEPS TUKA       */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0a0e17]">
          {/* ------------------------------------------------------------ */}
          {/* SECTION 1: EASY PATTERN — Step by Step (Simple & Easy to Use) */}
          {/* ------------------------------------------------------------ */}
          {(activeTab === 'all' || activeTab === 'easypattern') && (
            <section className="space-y-3">
              {/* Section Header Banner */}
              <div className="flex items-center justify-between pb-1 border-b border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-cyan-600/20 text-cyan-400 font-black text-xs uppercase tracking-wider border border-cyan-500/30">
                    EASY PATTERN
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    Step by Step (Simple & Easy to Use)
                  </span>
                </div>
                <button
                  onClick={() => jumpToEasyStep(1)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Launch EasyPattern Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 8 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Open EasyPattern */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Launch Hub</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Open EasyPattern</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Launch EasyPattern and create a new project.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1">
                      <div className="flex items-center gap-1 font-bold text-slate-300">
                        <FolderPlus className="w-3 h-3 text-cyan-400" />
                        <span>Create New Pattern</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <FolderOpen className="w-3 h-3 text-slate-500" />
                        <span>Open Project</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Layers className="w-3 h-3 text-purple-400" />
                        <span>Pattern Library</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(1)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 1</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 2. Select Garment & Size Range */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Garment Config</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Select Garment & Size Range</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Choose garment type and size range. Enter measurements or use size chart.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1 font-mono">
                      <div className="text-slate-300">Garment: <strong className="text-cyan-400">Basic Bodice</strong></div>
                      <div className="flex items-center gap-1">
                        <span className="px-1 bg-cyan-900/60 text-cyan-200 rounded">S</span>
                        <span className="px-1 bg-slate-800 text-slate-300 rounded">M</span>
                        <span className="px-1 bg-slate-800 text-slate-300 rounded">L</span>
                        <span className="px-1 bg-slate-800 text-slate-300 rounded">XL</span>
                        <span className="px-1 bg-slate-800 text-slate-300 rounded">XXL</span>
                      </div>
                      <div className="text-slate-400 text-[9px]">Input: (•) Manual ( ) Chart</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(2)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 2</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3. Draft the Pattern */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Drafting</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Draft the Pattern</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Use the tools to draw the basic pattern (Front & Back Bodice sloper).
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] flex items-center justify-between font-mono">
                      <div className="flex items-center gap-1 text-[9px] text-cyan-400">
                        <span>Select</span> · <span>Point</span> · <span>Line</span> · <span>Curve</span>
                      </div>
                      <span className="text-slate-500">Bodice</span>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(3)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 3</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4. Add Details & Edit */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        4
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Properties</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Add Details & Edit</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Add darts, seam allowance, notches, labels and other details.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>Seam Allowance:</span>
                        <strong className="text-cyan-400">1.0 cm</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Notch Size:</span>
                        <strong className="text-cyan-400">0.3 cm</strong>
                      </div>
                      <div className="text-[9px] text-emerald-400">✓ Add Label  ✓ Grainline</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(4)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 4</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 5. Grade the Pattern */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        5
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Grading Rules</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Grade the Pattern</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Create multiple sizes (S, M, L, XL, XXL) with automatic grading.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[9px] space-y-0.5 font-mono">
                      <div className="flex justify-between text-blue-400">
                        <span>Bust: +2.0 cm</span>
                        <span>➔ (Blue)</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Waist: +1.5 cm</span>
                        <span>➔ (Green)</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Hip: +2.0 cm</span>
                        <span>➔ (Red)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(5)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 5</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 6. Nest the Pattern */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        6
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Nested Stack</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Nest the Pattern</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Concentric multi-size contours (S through XXL) color coded.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" title="S" />
                      <div className="w-3 h-3 rounded-full bg-emerald-600" title="M" />
                      <div className="w-3 h-3 rounded-full bg-red-600" title="L" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" title="XL" />
                      <div className="w-3 h-3 rounded-full bg-purple-600" title="XXL" />
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(6)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 6</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 7. Preview & Check */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        7
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Marker Preview</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Preview & Check</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      View the final pattern, grading lines, labels and markers.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>Seam Width:</span>
                        <strong className="text-cyan-400">150 cm</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Fabric Size:</span>
                        <strong className="text-emerald-400">87.5 m</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(7)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 7</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 8. Export Project */}
                <div className="bg-[#111827] rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        8
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Output</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Export Project</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Save your project in PDF, DXF, AAMA etc. for production.
                    </p>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 bg-slate-900 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1 font-mono">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <span>PDF</span> · <span>DXF</span> · <span>AAMA</span>
                      </div>
                      <div className="text-[9px] text-slate-400">✓ Grading ✓ Notches ✓ SA</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToEasyStep(8)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Try Step 8</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------ */}
          {/* SECTION 2: TUKAcad — Advanced Tools for Professional Work    */}
          {/* ------------------------------------------------------------ */}
          {(activeTab === 'all' || activeTab === 'tukacad') && (
            <section className="space-y-3 pt-2">
              {/* Section Header Banner */}
              <div className="flex items-center justify-between pb-1 border-b border-rose-900/40">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-rose-600/20 text-rose-400 font-black text-xs uppercase tracking-wider border border-rose-500/30">
                    TUKAcad
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    Advanced Tools for Professional Work
                  </span>
                </div>
                <button
                  onClick={() => jumpToTukaStep(1)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <span>Launch TUKAcad Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6 Cards Grid Matching Bottom of Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
                {/* 1. Open TUKAcad */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Pro CAD</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Open TUKAcad</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Launch TUKAcad and create a new industrial file.
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[10px] font-mono text-emerald-400">
                      TUKAdesign v4.8 Pitch Black
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(1)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Launch CAD</span>
                  </button>
                </div>

                {/* 2. Use Drawing Tools */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">16 Tools</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Use Drawing Tools</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Draw and edit your pattern using TUKAcad's precision tools.
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[9px] font-mono text-slate-300">
                      Point, Line, Curve, Arc, Spline, Fillet, Offset, Mirror...
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(2)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>View Tools</span>
                  </button>
                </div>

                {/* 3. Pattern Design & Edit */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Coordinates</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Pattern Design & Edit</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Add darts, notches, seam allowance, and labels with accurate measurements.
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[9px] font-mono text-slate-300 space-y-0.5">
                      <div>X: <strong className="text-amber-400">12.50 cm</strong></div>
                      <div>Y: <strong className="text-amber-400">8.20 cm</strong></div>
                      <div>Line: 24.30 cm</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(3)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Open Editor</span>
                  </button>
                </div>

                {/* 4. Grading in TUKAcad */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        4
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Matrix</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Grading in TUKAcad</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Set grading rules and create all sizes automatically.
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[9px] font-mono text-slate-300 space-y-0.5">
                      <div className="text-slate-400">Size Set: XS-XXL</div>
                      <div className="flex justify-between"><span>XS:</span><span>-2.0 / -1.5</span></div>
                      <div className="flex justify-between"><span>M:</span><span>0.0 / 0.0</span></div>
                      <div className="flex justify-between"><span>XXL:</span><span>+3.0 / +2.5</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(4, 'gradeTables')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Open Matrix</span>
                  </button>
                </div>

                {/* 5. Nesting & Marker Making */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        5
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Cut Yield</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Nesting & Marker</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Create markers, nest pieces and check fabric usage.
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[9px] font-mono text-slate-300 space-y-0.5">
                      <div>Fabric: 150 cm</div>
                      <div>Length: 2.4 m</div>
                      <div className="text-emerald-400 font-bold">Yield: 88.7%</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(5, 'nesting')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Open Nesting</span>
                  </button>
                </div>

                {/* 6. Plot / Export */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 hover:border-rose-500/50 transition-all p-3.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        6
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Plotter</span>
                    </div>
                    <h3 className="font-bold text-xs text-white">Plot / Export</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Plot or export your pattern (PDF, DXF, AAMA, HPGL plotter).
                    </p>
                    <div className="mt-3 bg-black/60 rounded-lg p-2 border border-slate-800 text-[9px] font-mono text-slate-300 space-y-0.5">
                      <div>Printer: A0 Plotter</div>
                      <div>Scale: 100%</div>
                      <div className="text-cyan-400">Full 1:1 Vector Plot</div>
                    </div>
                  </div>

                  <button
                    onClick={() => jumpToTukaStep(6, 'export')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Open Plotter</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------ */}
          {/* SECTION 3: COMPARISON BAR & TOOL SUMMARY (BOTTOM OF IMAGE)  */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            {/* Tool Comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EasyPattern Basic Tools */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  EasyPattern Tools (Basic - 8 Tools):
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                  {['Select', 'Point', 'Line', 'Curve', 'Dart', 'Seam', 'Notch', 'Measure'].map((t) => (
                    <span key={t} className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-cyan-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* TUKAcad Advanced Tools */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-2">
                  TUKAcad Tools (Advanced - 16 Tools):
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
                  {[
                    'Point', 'Line', 'Curve', 'Arc', 'Rectangle', 'Circle',
                    'Spline', 'Fillet', 'Offset', 'Mirror', 'Rotate',
                    'Trim', 'Extend', 'Break', 'Join', 'Text'
                  ].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-rose-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Both Card Matching Bottom Right of Image */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-rose-950/40 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-white text-sm">Why both?</h4>
                <div className="text-xs text-slate-300 mt-1 space-y-0.5 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">✓ EasyPattern</span>
                    <span>— Fast, simple, beginner friendly</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">✓ TUKAcad</span>
                    <span>— Professional, accurate, industry standard</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-amber-300 italic tracking-tight">
                  Start easy ➔ Grow professional
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  EasyPattern + TUKAcad = Complete Pattern Making Solution
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="h-12 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            EasyPattern + TUKAcad Unified Pipeline • One-Object Vector Parametric Grading
          </div>
          <button
            onClick={() => setIsWorkflowModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Guide
          </button>
        </footer>
      </div>
    </div>
  );
};
