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
    loadGarmentTemplate,
  } = useCADStore();

  const [tshirtsExpanded, setTshirtsExpanded] = useState(true);
  const [shirtsExpanded, setShirtsExpanded] = useState(false);
  const [trousersExpanded, setTrousersExpanded] = useState(false);

  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;
  const isBasicActive = garment.category === 't-shirt';
  const isPoloActive = garment.category === 'polo';
  const isShirtActive = garment.category === 'shirt';
  const isTrouserActive = garment.category === 'trouser';

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
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {(isBasicActive || isPoloActive) ? 'Active Dept' : '2 styles'}
            </span>
          </button>

          {tshirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBasicActive
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('basic-tshirt')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBasicActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span>Basic T-Shirt</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBasicActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBasicActive ? 'ACTIVE' : 'v1.4'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isPoloActive
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('polo')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPoloActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span>Polo T-Shirt</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isPoloActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isPoloActive ? 'ACTIVE' : 'v2.1'}
                </span>
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
            <span className="text-[10px] text-slate-400">{isShirtActive ? 'Active' : 'Base'}</span>
          </button>
          {shirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isShirtActive
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('shirt')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isShirtActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span>Casual Button-Up</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isShirtActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isShirtActive ? 'ACTIVE' : 'v1.0'}
                </span>
              </div>
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
              <span>Pants & Trousers (2)</span>
            </div>
            <span className="text-[10px] text-slate-400">{isTrouserActive ? 'Active' : 'Base'}</span>
          </button>
          {trousersExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              {/* Womens Boot Cut Pant (TUKA Benchmark from reference image) */}
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  garment.id.includes('bootcut')
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('bootcut-pant')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${garment.id.includes('bootcut') ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs">Womens Boot Cut Pant</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  garment.id.includes('bootcut') ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {garment.id.includes('bootcut') ? 'ACTIVE' : 'tud v4.8'}
                </span>
              </div>

              {/* Chino Trouser */}
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  garment.id === 'garment-trouser-004'
                    ? 'bg-blue-50 border border-blue-200/80 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('trouser')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${garment.id === 'garment-trouser-004' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span>Chino Trouser</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  garment.id === 'garment-trouser-004' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {garment.id === 'garment-trouser-004' ? 'ACTIVE' : 'v1.0'}
                </span>
              </div>
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
            <span>Entire {garment.name} (Root Object)</span>
          </div>

          <div className="ml-3 pl-3 border-l-2 border-slate-200 space-y-1.5 mt-1">
            {garment.components.map((comp) => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{comp.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {comp.id === 'collar' ? 'Collar' : comp.id === 'sleeve' ? 'Pair' : '1/4 Fold'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {comp.id === 'sleeve'
                      ? `Cap Scye ${comp.measurements.sleeveCapLength?.toFixed(1) || '46.2'}cm • Length ${comp.measurements.sleeveLength?.toFixed(1) || '20.5'}cm`
                      : comp.id === 'collar'
                      ? 'Flat Knit Rib • 40cm Neck'
                      : `1/2 Chest: ${comp.measurements.halfChest?.toFixed(1) || '48.0'}cm • Cut 1`}
                  </div>
                </div>
              );
            })}
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
