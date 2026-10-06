import React, { useState } from 'react';
import { useCADStore } from '../store/useCADStore';
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
  Scissors,
  Layers,
  Sparkles,
  Palette,
  Eye,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Activity,
  Workflow,
  Shirt,
  Box,
  Compass,
  FileCode,
} from 'lucide-react';
import { CADTheme, CADUnit } from '@shared/types';

export const TukaMenuBar: React.FC = () => {
  const {
    currentProject,
    activeTool,
    setTool,
    setZoom,
    fitToScreen,
    undo,
    redo,
    canUndo,
    canRedo,
    activeModal,
    setActiveModal,
    cadTheme,
    setCADTheme,
    cadUnit,
    setCADUnit,
    showSeamAllowance,
    toggleSeamAllowance,
    showInternals,
    toggleInternals,
    showGrainlines,
    toggleGrainlines,
    showNotches,
    toggleNotches,
    executeGrading,
    isGrading,
    currentSize,
    targetSize,
    garment,
    loadGarmentTemplate,
    setCADEngineMode,
  } = useCADStore();


  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const isTukaDark = cadTheme === 'tukacad-black';

  const menuItems = [
    {
      name: 'File',
      items: [
        { label: 'New Project (Ctrl+N)', action: () => setActiveModal('new') },
        { label: 'Open Pattern File (Ctrl+O)', action: () => setActiveModal('open') },
        { label: 'Save Pattern (Ctrl+S)', action: () => setActiveModal('save') },
        { divider: true },
        { label: 'Export Production SVG', action: () => setActiveModal('export') },
        { label: 'View JSON Pattern Data', action: () => setActiveModal('jsonInspector') },
        { label: 'Database / MongoDB Atlas', action: () => setActiveModal('dbConnect') },
      ],
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo (Ctrl+Z)', action: undo, disabled: !canUndo() },
        { label: 'Redo (Ctrl+Y)', action: redo, disabled: !canRedo() },
        { divider: true },
        { label: 'Select Tool (V)', action: () => setTool('select') },
        { label: 'Pan Tool (H)', action: () => setTool('pan') },
        { label: 'Measure Tool (M)', action: () => setTool('measure') },
      ],
    },
    {
      name: 'Piece',
      items: [
        { label: '★ Mens Tailored Suit Jacket (16-Piece Marker)', action: () => loadGarmentTemplate('suit-jacket') },
        { label: 'Womens Boot Cut Pant (tud v4.8)', action: () => loadGarmentTemplate('bootcut-pant') },
        { label: 'Basic T-Shirt (Crew Neck)', action: () => loadGarmentTemplate('basic-tshirt') },
        { label: 'Polo T-Shirt (Collar & Placket)', action: () => loadGarmentTemplate('polo') },
        { label: 'Casual Button-Up Shirt', action: () => loadGarmentTemplate('shirt') },
        { label: 'Chino Trouser', action: () => loadGarmentTemplate('trouser') },
        { divider: true },
        { label: 'Garment Pattern Library...', action: () => setActiveModal('library') },
      ],

    },
    {
      name: 'Grading',
      items: [
        {
          label: `⚡ Grade Entire Garment (${currentSize} → ${targetSize})`,
          action: () => executeGrading(),
        },
        { label: 'Size Grading Tables...', action: () => setActiveModal('gradeTables') },
        { divider: true },
        { label: 'Constraint Rule: 1 Garment = 1 Grading Object', action: () => {} },
      ],
    },
    {
      name: 'Internals',
      items: [
        {
          label: showInternals ? '✓ Show Internal Lines & Pockets' : 'Show Internal Lines & Pockets',
          action: toggleInternals,
        },
        { label: 'Add Dart / Pleat Contour...', action: () => setActiveModal('dartPleat') },
        { label: 'Place Graphic / Embroidery Artwork', action: () => setActiveModal('dartPleat') },
      ],
    },
    {
      name: 'Seam',
      items: [
        {
          label: showSeamAllowance ? '✓ Hide Seam Allowance (SA)' : 'Show Seam Allowance (SA)',
          action: toggleSeamAllowance,
        },
        { label: 'Configure Seam Allowance Width...', action: () => setActiveModal('seamAllowance') },
        { divider: true },
        {
          label: showNotches ? '✓ Display Seam Notches' : 'Display Seam Notches',
          action: toggleNotches,
        },
        {
          label: showGrainlines ? '✓ Display Grainlines' : 'Display Grainlines',
          action: toggleGrainlines,
        },
      ],
    },
    {
      name: 'Walk',
      items: [
        { label: 'Walk Pattern Seams Tool...', action: () => setActiveModal('walkSeam') },
        { label: 'Check Inseam Delta Length', action: () => setActiveModal('walkSeam') },
        { label: 'Check Armhole to Sleeve Cap', action: () => setActiveModal('walkSeam') },
      ],
    },
    {
      name: 'Nesting',
      items: [
        { label: 'Industrial Nesting & Cut Marker...', action: () => setActiveModal('nesting') },
        { label: 'Fabric Marker Length & Efficiency', action: () => setActiveModal('nesting') },
      ],
    },
    {
      name: 'eFit',
      items: [
        { label: '3D eFit Drape Simulation...', action: () => setActiveModal('eFit') },
        { label: 'Tension & Stretch Stress Map', action: () => setActiveModal('eFit') },
      ],
    },
    {
      name: 'Report',
      items: [
        { label: 'Apparel Tech Pack & Spec Sheet...', action: () => setActiveModal('techPack') },
        { label: 'POM Point of Measure Grading Table', action: () => setActiveModal('techPack') },
      ],
    },
    {
      name: 'View',
      items: [
        {
          label: cadTheme === 'tukacad-black' ? '✓ TUKAcad Pitch Black Theme' : 'TUKAcad Pitch Black Theme',
          action: () => setCADTheme('tukacad-black'),
        },
        {
          label: cadTheme === 'cad-slate' ? '✓ Modern Slate Theme' : 'Modern Slate Theme',
          action: () => setCADTheme('cad-slate'),
        },
        {
          label: cadTheme === 'blueprint-light' ? '✓ Technical Blueprint Theme' : 'Technical Blueprint Theme',
          action: () => setCADTheme('blueprint-light'),
        },
        { divider: true },
        {
          label: cadUnit === 'in' ? '✓ Units: Inches (in)' : 'Units: Inches (in)',
          action: () => setCADUnit('in'),
        },
        {
          label: cadUnit === 'cm' ? '✓ Units: Centimeters (cm)' : 'Units: Centimeters (cm)',
          action: () => setCADUnit('cm'),
        },
      ],
    },
  ];

  return (
    <header className="flex flex-col select-none shrink-0 border-b border-zinc-700 bg-[#1e293b] text-white">
      {/* 1. Windows Classic CAD Title Bar (Matches TUKAcad Window Header) */}
      <div className="h-6 px-3 bg-[#0f172a] text-zinc-300 border-b border-zinc-800 flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center text-[9px] font-black text-white">
            T
          </div>
          <span className="font-semibold text-zinc-100">
            {garment.name}.tud - TUKAdesign CAD Studio
          </span>
          <span className="text-zinc-500 font-mono text-[10px]">
            [1-Object Parametric Engine v4.8]
          </span>
        </div>

        {/* Quick Style Switcher & Theme Selector */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Unit Toggle */}
          <div className="flex items-center bg-zinc-800 rounded px-1.5 py-0.5 border border-zinc-700">
            <span className="text-[10px] text-zinc-400 mr-1.5">UNIT:</span>
            <button
              onClick={() => setCADUnit('in')}
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold transition-colors ${
                cadUnit === 'in' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              in (Inches)
            </button>
            <button
              onClick={() => setCADUnit('cm')}
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold transition-colors ${
                cadUnit === 'cm' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              cm
            </button>
          </div>

          {/* Theme Dropdown */}
          <div className="flex items-center bg-zinc-800 rounded px-1.5 py-0.5 border border-zinc-700">
            <Palette className="w-3 h-3 text-amber-400 mr-1" />
            <select
              value={cadTheme}
              onChange={(e) => setCADTheme(e.target.value as CADTheme)}
              className="bg-transparent text-[10px] text-zinc-200 outline-none cursor-pointer font-sans"
            >
              <option value="tukacad-black" className="bg-zinc-900 text-white">
                TUKAcad Black (#000000)
              </option>
              <option value="cad-slate" className="bg-zinc-900 text-white">
                Modern Slate Dark
              </option>
              <option value="blueprint-light" className="bg-white text-zinc-900">
                Technical Light Paper
              </option>
            </select>
          </div>

          {/* Switch to CLO 3D Studio */}
          <button
            onClick={() => setCADEngineMode('clo3d')}
            className="px-2 py-0.5 rounded bg-[#00a8ff] hover:bg-[#0096e6] text-white text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1"
            title="Switch to CLO 3D Standalone Studio"
          >
            <Box className="w-3 h-3" />
            <span>CLO 3D Studio</span>
          </button>
        </div>
      </div>


      {/* 2. Menu Bar (File, Edit, Piece, Grading, Point, Segment, Internals, Darts, Seam, Walk...) */}
      <nav className="h-6 px-2 bg-[#1e293b] text-zinc-200 border-b border-zinc-700/60 flex items-center gap-0.5 text-xs font-sans">
        {menuItems.map((menu) => (
          <div key={menu.name} className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === menu.name ? null : menu.name)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                activeMenu === menu.name
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {menu.name}
            </button>

            {/* Menu Dropdown */}
            {activeMenu === menu.name && (
              <div
                className="absolute top-full left-0 z-50 min-w-[220px] bg-zinc-900 border border-zinc-700 shadow-2xl rounded py-1 text-xs text-zinc-200 animate-fadeIn"
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.items.map((item, idx) =>
                  item.divider ? (
                    <div key={idx} className="h-[1px] bg-zinc-800 my-1" />
                  ) : (
                    <button
                      key={idx}
                      disabled={item.disabled}
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-[11px] transition-colors ${
                        item.disabled
                          ? 'opacity-40 cursor-not-allowed text-zinc-500'
                          : 'hover:bg-blue-600 hover:text-white text-zinc-300'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Right Active Style Badge */}
        <div className="ml-auto flex items-center gap-2 pr-2">
          <span className="text-[10px] text-zinc-400 font-mono">
            Active: <strong className="text-amber-400">{garment.name}</strong> ({garment.currentSize})
          </span>
        </div>
      </nav>

      {/* 3. TUKAcad High-Density Icon Toolbars */}
      <div className="h-9 px-2 bg-[#0f172a] text-zinc-200 border-b border-zinc-800 flex items-center justify-between text-xs overflow-x-auto">
        {/* Left Action Buttons: CAD Tools */}
        <div className="flex items-center gap-1">
          {/* File Quick Actions */}
          <div className="flex items-center bg-zinc-800/80 rounded border border-zinc-700 p-0.5 mr-1">
            <button
              onClick={() => setActiveModal('new')}
              title="New Project"
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveModal('open')}
              title="Open Pattern"
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveModal('save')}
              title="Save Pattern"
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-zinc-800/80 rounded border border-zinc-700 p-0.5 mr-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              title="Undo (Ctrl+Z)"
              className="p-1 hover:bg-zinc-700 disabled:opacity-30 rounded text-zinc-300"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              title="Redo (Ctrl+Y)"
              className="p-1 hover:bg-zinc-700 disabled:opacity-30 rounded text-zinc-300"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Tools */}
          <div className="flex items-center bg-zinc-800/80 rounded border border-zinc-700 p-0.5 mr-1">
            <button
              onClick={() => setTool('select')}
              className={`p-1 rounded transition-colors ${
                activeTool === 'select' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'
              }`}
              title="Select Tool (V)"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool('pan')}
              className={`p-1 rounded transition-colors ${
                activeTool === 'pan' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'
              }`}
              title="Pan Workspace (H)"
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool('measure')}
              className={`p-1 rounded transition-colors ${
                activeTool === 'measure' ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-700'
              }`}
              title="Caliper & Point Measure Tool (M)"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(3.5, z * 1.2))}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={fitToScreen}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-300"
              title="Fit Pattern to Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TUKAcad Specialized Apparel Tools */}
          <div className="flex items-center gap-1 ml-1">
            {/* Walk Seams Tool */}
            <button
              onClick={() => setActiveModal('walkSeam')}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-[11px] font-semibold text-zinc-200 flex items-center gap-1 transition-colors"
              title="Walk Seams (Compare Inseams/Outseams Length)"
            >
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
              <span>Walk Seams</span>
            </button>

            {/* Seam Allowance Toggle */}
            <button
              onClick={toggleSeamAllowance}
              className={`px-2 py-1 border rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                showSeamAllowance
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
              }`}
              title="Toggle Seam Allowance (SA)"
            >
              <Scissors className="w-3.5 h-3.5 text-emerald-400" />
              <span>SA {showSeamAllowance ? 'ON' : 'OFF'}</span>
            </button>

            {/* Darts & Pleats */}
            <button
              onClick={() => setActiveModal('dartPleat')}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-[11px] font-semibold text-zinc-200 flex items-center gap-1 transition-colors"
              title="Add Darts, Pleats and Internal Pocket lines"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Darts & Internals</span>
            </button>

            {/* 3D eFit Simulation */}
            <button
              onClick={() => setActiveModal('eFit')}
              className="px-2 py-1 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/60 rounded text-[11px] font-bold text-purple-200 flex items-center gap-1 transition-colors shadow-2xs"
              title="3D eFit Virtual Drape & Stress Map"
            >
              <Box className="w-3.5 h-3.5 text-purple-400" />
              <span>3D eFit</span>
            </button>
          </div>
        </div>

        {/* Right CTA: Quick Grade Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => executeGrading()}
            disabled={isGrading}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Grade Garment ({currentSize} → {targetSize})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
