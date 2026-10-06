import React from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Ruler,
  Download,
  Code2,
  TableProperties,
  Layers,
  Settings,
  HelpCircle,
  Scissors,
  ClipboardList,
} from 'lucide-react';
import { useCADStore } from '../store/useCADStore';

export const TopToolbar: React.FC = () => {
  const {
    currentProject,
    activeTool,
    setTool,
    zoom,
    setZoom,
    fitToScreen,
    undo,
    redo,
    canUndo,
    canRedo,
    setActiveModal,
  } = useCADStore();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200 select-none">
      {/* Top Main Navigation */}
      <div className="h-13 px-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-lg">
              EP
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1.5">
                Easy Pattern
                <span className="text-[10px] px-1 py-0.2 bg-blue-500/20 text-blue-400 font-mono rounded">CAD</span>
              </div>
              <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                Pattern CAD Engine
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 mx-1" />

          {/* Current Project Tab */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-medium max-w-[200px] truncate" title={currentProject.title}>
              {currentProject.title}
            </span>
          </div>

          {/* CAD Tabs */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            <button
              className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white shadow-sm flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Workstation
            </button>
            <button
              onClick={() => setActiveModal('open')}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Library
            </button>
            <button
              onClick={() => setActiveModal('gradeTables')}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-1"
            >
              <TableProperties className="w-3.5 h-3.5" />
              Grade Tables
            </button>
            <button
              onClick={() => alert('Nesting & Cut module is ready for full production layout in next release.')}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-1"
            >
              <Scissors className="w-3.5 h-3.5" />
              Nesting & Cut
            </button>
            <button
              onClick={() => alert('Tech Pack exporter aggregates BOM, measurements, and tolerance specs.')}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-1"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Tech Pack
            </button>
          </nav>
        </div>

        {/* CAD Toolbar Actions */}
        <div className="flex items-center gap-1">
          {/* File Operations */}
          <div className="flex items-center bg-slate-800/80 rounded border border-slate-700/60 p-0.5">
            <button
              onClick={() => setActiveModal('new')}
              title="New Project"
              id="toolbar-new-btn"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('open')}
              title="Open Project (Cloud / JSON)"
              id="toolbar-open-btn"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal('save')}
              title="Save Project (MongoDB / JSON)"
              id="toolbar-save-btn"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-800/80 rounded border border-slate-700/60 p-0.5 ml-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              id="toolbar-undo-btn"
              title="Undo (Ctrl+Z)"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              id="toolbar-redo-btn"
              title="Redo (Ctrl+Y)"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive CAD Tools */}
          <div className="flex items-center bg-slate-800/80 rounded border border-slate-700/60 p-0.5 ml-1">
            <button
              onClick={() => setTool('select')}
              id="tool-select-btn"
              title="Select / Move Garment"
              className={`px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTool === 'select'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              Select
            </button>
            <button
              onClick={() => setTool('pan')}
              id="tool-pan-btn"
              title="Pan Workspace (Hold Space / Drag)"
              className={`p-1.5 rounded transition-colors ${
                activeTool === 'pan'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Hand className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => z + 0.15)}
              id="tool-zoom-in-btn"
              title="Zoom In"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))}
              id="tool-zoom-out-btn"
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={fitToScreen}
              id="tool-fit-btn"
              title="Fit Entire Garment to Screen"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('measure')}
              id="tool-measure-btn"
              title="Measure Tool (Click two points)"
              className={`px-2 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                activeTool === 'measure'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              Measure
            </button>
          </div>

          {/* Export and Code Inspect */}
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => setActiveModal('export')}
              id="toolbar-export-svg-btn"
              title="Export Scalable Vector Graphics"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              SVG
            </button>
            <button
              onClick={() => setActiveModal('jsonInspector')}
              id="toolbar-json-inspector-btn"
              title="Pattern JSON Inspector"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded text-slate-300 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 mx-1" />

          {/* Right Extras */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => alert('CAD Preferences: Metric mm/cm, SVG Precision 0.01, Auto-Align enabled.')}
              className="p-1.5 hover:bg-slate-800 rounded hover:text-slate-200 transition-colors"
              title="CAD Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('Easy Pattern Help: 1 Garment = 1 Grading Object. Select Current Size, Target Size, and click Grade Entire Garment. Front, Back and Sleeve resize together.')}
              className="p-1.5 hover:bg-slate-800 rounded hover:text-slate-200 transition-colors"
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[11px] font-bold text-slate-300">
              EP
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header / System Status CAD Bar */}
      <div className="h-8 px-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-semibold tracking-wide">GARMENT CAD CORE v4.8</span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
            Constraint Mode: 1-Object Parametric Nest
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Tolerance: ±0.05 mm</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('jsonInspector')}
            className="hover:text-slate-200 flex items-center gap-1 text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded transition-colors"
          >
            <Code2 className="w-3 h-3 text-emerald-400" />
            JSON Inspector
          </button>
          <button
            onClick={() => setActiveModal('export')}
            className="hover:text-slate-200 flex items-center gap-1 text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded transition-colors"
          >
            <Download className="w-3 h-3 text-blue-400" />
            Export Bundle
          </button>
          <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Live Preview S→M
          </span>
          <button
            onClick={() => setActiveModal('dbConnect')}
            id="toolbar-db-connect-btn"
            title="MongoDB Atlas Connection Settings"
            className="px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-medium rounded flex items-center gap-1 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MongoDB Atlas
          </button>
        </div>
      </div>
    </header>
  );
};
