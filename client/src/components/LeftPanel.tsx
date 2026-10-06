import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  ChevronDown,
  ChevronRight,
  Layers,
  Component,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCADStore } from '../store/useCADStore';

export const LeftPanel: React.FC = () => {
  const {
    garment,
    selectedComponentId,
    setSelectedComponent,
    selectEntireGarment,
    setActiveModal,
  } = useCADStore();

  const [tshirtsExpanded, setTshirtsExpanded] = useState(true);
  const [shirtsExpanded, setShirtsExpanded] = useState(false);
  const [trousersExpanded, setTrousersExpanded] = useState(false);

  const frontComp = garment.components.find((c) => c.id === 'front');
  const backComp = garment.components.find((c) => c.id === 'back');
  const sleeveComp = garment.components.find((c) => c.id === 'sleeve');

  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-sm">
      {/* Garments Library Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Garments</h2>
        </div>
        <button
          onClick={() => setActiveModal('new')}
          id="left-new-garment-btn"
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      {/* Garment Categories List */}
      <div className="p-2 border-b border-slate-200 overflow-y-auto max-h-56 text-xs">
        {/* T-Shirts Category */}
        <div className="mb-1">
          <button
            onClick={() => setTshirtsExpanded(!tshirtsExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {tshirtsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>T-Shirts (2)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">Active Dept</span>
          </button>

          {tshirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className="flex items-center justify-between px-2 py-1.5 bg-blue-50 border border-blue-200/80 rounded cursor-pointer text-blue-900 font-medium"
                onClick={selectEntireGarment}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Basic T-Shirt</span>
                </div>
                <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">ACTIVE</span>
              </div>

              <div
                className="flex items-center justify-between px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                onClick={() => alert('Polo T-Shirt template is available. Select Basic T-Shirt for active grading.')}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>Polo T-Shirt</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">v2.1</span>
              </div>
            </div>
          )}
        </div>

        {/* Shirts Category */}
        <div className="mb-1">
          <button
            onClick={() => setShirtsExpanded(!shirtsExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-medium text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {shirtsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Shirts (1)</span>
            </div>
            <span className="text-[10px] text-slate-400">Base</span>
          </button>
          {shirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 py-1 text-slate-500 text-[11px]">
              Fitted Dress Shirt (v1.0)
            </div>
          )}
        </div>

        {/* Trousers Category */}
        <div>
          <button
            onClick={() => setTrousersExpanded(!trousersExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-medium text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {trousersExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Trousers (1)</span>
            </div>
            <span className="text-[10px] text-slate-400">Base</span>
          </button>
          {trousersExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 py-1 text-slate-500 text-[11px]">
              Tailored Trousers (v1.0)
            </div>
          )}
        </div>
      </div>

      {/* Garment Structure (1-Object Mode) Header */}
      <div className="p-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Garment Structure</h3>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
          1-Object
        </span>
      </div>

      {/* ENTIRE GARMENT Primary Selector Button */}
      <div className="p-2.5 pb-1">
        <button
          onClick={selectEntireGarment}
          id="select-entire-garment-main-btn"
          className={`w-full py-2.5 px-3 rounded flex items-center justify-between font-bold text-xs uppercase tracking-wide transition-all shadow-sm ${
            isEntireSelected
              ? 'bg-blue-600 text-white shadow-blue-500/20 ring-2 ring-blue-500 ring-offset-1'
              : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Entire Garment</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-extrabold ${
            isEntireSelected ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-600'
          }`}>
            {isEntireSelected ? 'SELECTED' : 'SELECT'}
          </span>
        </button>
      </div>

      {/* Prominent Select Entire Garment action if child component selected */}
      {!isEntireSelected && (
        <div className="mx-2.5 mt-1 p-2 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sub-node Selected (Read-Only)</span>
          </div>
          <p className="text-[10px] text-amber-800 leading-tight mb-2">
            Independent grading is disabled. Patterns grade as ONE unified parametric object.
          </p>
          <button
            onClick={selectEntireGarment}
            id="prominent-select-entire-btn"
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            👉 Select Entire Garment
          </button>
        </div>
      )}

      {/* Component Tree */}
      <div className="flex-1 p-2.5 overflow-y-auto">
        <div className="text-xs text-slate-600">
          <div
            className={`p-1.5 rounded flex items-center gap-1.5 font-bold cursor-pointer ${
              isEntireSelected ? 'text-blue-600 bg-blue-50/60' : 'text-slate-700 hover:bg-slate-100'
            }`}
            onClick={selectEntireGarment}
          >
            <Component className="w-3.5 h-3.5 text-blue-500" />
            <span>Entire T-Shirt (Root Object)</span>
          </div>

          <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1.5 mt-1">
            {/* Front Component */}
            <div
              onClick={() => setSelectedComponent('front')}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedComponentId === 'front'
                  ? 'bg-blue-50 border-blue-400 text-blue-900'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Front Component</span>
                <span className="text-[9px] text-slate-400 font-mono">1/4 Fold</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                1/2 Chest: {frontComp?.measurements.halfChest?.toFixed(1) || '48.0'}cm • Cut 1
              </div>
            </div>

            {/* Back Component */}
            <div
              onClick={() => setSelectedComponent('back')}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedComponentId === 'back'
                  ? 'bg-blue-50 border-blue-400 text-blue-900'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Back Component</span>
                <span className="text-[9px] text-slate-400 font-mono">1/4 Fold</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                1/2 Chest: {backComp?.measurements.halfChest?.toFixed(1) || '48.0'}cm • Cut 1
              </div>
            </div>

            {/* Sleeve Component */}
            <div
              onClick={() => setSelectedComponent('sleeve')}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedComponentId === 'sleeve'
                  ? 'bg-blue-50 border-blue-400 text-blue-900'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Sleeve (Pair)</span>
                <span className="text-[9px] text-slate-400 font-mono">Pair</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Cap Scye {sleeveComp?.measurements.sleeveCapLength?.toFixed(1) || '46.2'}cm • Length {sleeveComp?.measurements.sleeveLength?.toFixed(1) || '20.5'}cm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Invariant Callout (Reference Image bottom left callout) */}
      <div className="p-3 m-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-slate-800 text-[11px] leading-relaxed">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-900 mb-0.5">1 Garment = 1 Grading Object</div>
            <p className="text-slate-600 text-[10px] leading-snug">
              Front, Back & Sleeve are constrained parametric nodes. Changing chest/length rescales all seams proportionally in one pass.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
