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
  Lock,
  Edit2,
  Copy,
  Trash2,
  BookmarkPlus,
  Wand2,
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
    duplicateComponent,
    removeComponent,
  } = useCADStore();

  const [bodicesExpanded, setBodicesExpanded] = useState(true);
  const [suitsExpanded, setSuitsExpanded] = useState(false);
  const [outerwearExpanded, setOuterwearExpanded] = useState(false);
  const [trousersExpanded, setTrousersExpanded] = useState(false);
  const [dressesExpanded, setDressesExpanded] = useState(false);
  const [shirtsExpanded, setShirtsExpanded] = useState(false);
  const [tshirtsExpanded, setTshirtsExpanded] = useState(false);

  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;

  // Active status indicators
  const isBodiceActive = garment.id === 'garment-basic-bodice-01' || garment.name.toLowerCase().includes('bodice');
  const isSuitActive = garment.id === 'garment-mens-suit-jacket-006';
  const isBlazerActive = garment.id === 'garment-womens-db-blazer-007';
  const isTrenchActive = garment.id === 'garment-trench-coat-011';
  const isBomberActive = garment.id === 'garment-bomber-jacket-012';
  const isBootcutActive = garment.id.includes('bootcut');
  const isChinoActive = garment.id === 'garment-trouser-004';
  const isJeansActive = garment.id === 'garment-denim-jeans-008';
  const isSheathActive = garment.id === 'garment-sheath-dress-010';
  const isSkirtActive = garment.id === 'garment-flared-skirt-009';
  const isShirtActive = garment.id === 'garment-shirt-003';
  const isBasicActive = garment.id === 'garment-basic-tshirt-001';
  const isPoloActive = garment.id === 'garment-polo-002';
  const isCustomActive = garment.id.startsWith('custom-garment');

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-sm">
      {/* Garments Library Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Garments</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveModal('manualGarment')}
            id="left-manual-create-btn"
            title="Create Custom Garment from Scratch with Wizard"
            className="text-[10.5px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Wand2 className="w-3 h-3 text-amber-600" />
            + Manual
          </button>
          <button
            onClick={() => setActiveModal('new')}
            id="left-new-garment-btn"
            title="New File (Pattern Generation Workflow)"
            className="text-[10.5px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            New File
          </button>
        </div>
      </div>

      {/* Garment Categories Accordion List */}
      <div className="p-2 border-b border-slate-200 overflow-y-auto max-h-60 text-xs space-y-1">
        {/* 0. Bodices & Slopers (EasyPattern) */}
        <div>
          <button
            onClick={() => setBodicesExpanded(!bodicesExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {bodicesExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Bodices & Slopers (1)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isBodiceActive ? 'ACTIVE' : 'Sloper'}
            </span>
          </button>
          {bodicesExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBodiceActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('basic-bodice')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBodiceActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Women's Basic Bodice</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBodiceActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBodiceActive ? 'ACTIVE' : '2 Pcs'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 1. Tailored Jackets & Suits */}
        <div>
          <button
            onClick={() => setSuitsExpanded(!suitsExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {suitsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Tailored Jackets & Suits (2)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isSuitActive || isBlazerActive ? 'ACTIVE' : '2 Styles'}
            </span>
          </button>
          {suitsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isSuitActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('suit-jacket')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSuitActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Mens Tailored Suit Jacket</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isSuitActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isSuitActive ? 'ACTIVE' : '16 Pcs'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBlazerActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('double-breasted-blazer')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBlazerActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Double-Breasted Peak Blazer</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBlazerActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBlazerActive ? 'ACTIVE' : '10 Pcs'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Outerwear & Coats */}
        <div>
          <button
            onClick={() => setOuterwearExpanded(!outerwearExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {outerwearExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Outerwear & Coats (2)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isTrenchActive || isBomberActive ? 'ACTIVE' : '2 Styles'}
            </span>
          </button>
          {outerwearExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isTrenchActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('trench-coat')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isTrenchActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Classic Belted Trench Coat</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isTrenchActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isTrenchActive ? 'ACTIVE' : '14 Pcs'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBomberActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('bomber-jacket')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBomberActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">MA-1 Flight Bomber Jacket</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBomberActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBomberActive ? 'ACTIVE' : '8 Pcs'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Pants & Trousers */}
        <div>
          <button
            onClick={() => setTrousersExpanded(!trousersExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {trousersExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Pants & Trousers (3)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isBootcutActive || isChinoActive || isJeansActive ? 'ACTIVE' : '3 Styles'}
            </span>
          </button>
          {trousersExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBootcutActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('bootcut-pant')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBootcutActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Womens Boot Cut Pant</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBootcutActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBootcutActive ? 'ACTIVE' : 'tud v4.8'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isJeansActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('denim-jeans')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isJeansActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">5-Pocket Raw Denim Jeans</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isJeansActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isJeansActive ? 'ACTIVE' : '8 Pcs'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isChinoActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('trouser')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isChinoActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Chino Trouser</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isChinoActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isChinoActive ? 'ACTIVE' : 'v1.0'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Dresses & Skirts */}
        <div>
          <button
            onClick={() => setDressesExpanded(!dressesExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {dressesExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Dresses & Skirts (2)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isSheathActive || isSkirtActive ? 'ACTIVE' : '2 Styles'}
            </span>
          </button>
          {dressesExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isSheathActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('sheath-dress')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSheathActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Princess Seam Sheath Dress</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isSheathActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isSheathActive ? 'ACTIVE' : '6 Pcs'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isSkirtActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('flared-skirt')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isSkirtActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">8-Gore Flared Skirt</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isSkirtActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isSkirtActive ? 'ACTIVE' : '4 Pcs'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Shirts & Tops */}
        <div>
          <button
            onClick={() => setShirtsExpanded(!shirtsExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {shirtsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>Shirts & Tops (1)</span>
            </div>
            <span className="text-[10px] text-slate-400">{isShirtActive ? 'ACTIVE' : 'Base'}</span>
          </button>
          {shirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isShirtActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('shirt')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isShirtActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Casual Button-Up Oxford</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isShirtActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isShirtActive ? 'ACTIVE' : 'v1.0'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6. T-Shirts & Knits */}
        <div>
          <button
            onClick={() => setTshirtsExpanded(!tshirtsExpanded)}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-100 rounded text-slate-700 font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {tshirtsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span>T-Shirts & Knits (2)</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              {isBasicActive || isPoloActive ? 'ACTIVE' : '2 Styles'}
            </span>
          </button>
          {tshirtsExpanded && (
            <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 mt-1">
              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isBasicActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('basic-tshirt')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isBasicActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Basic Crew-Neck T-Shirt</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isBasicActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isBasicActive ? 'ACTIVE' : 'v1.4'}
                </span>
              </div>

              <div
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isPoloActive
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => loadGarmentTemplate('polo')}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPoloActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="text-xs truncate">Pique Polo T-Shirt</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isPoloActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}>
                  {isPoloActive ? 'ACTIVE' : 'v2.1'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Custom / Bespoke Tag */}
        {isCustomActive && (
          <div className="p-1.5 bg-amber-50/80 border border-amber-300 rounded text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{garment.name}</span>
            </div>
            <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">
              MANUAL
            </span>
          </div>
        )}
      </div>

      {/* Garment Structure (1-Object Mode) Header */}
      <div className="p-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Garment Structure</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveModal('addComponent')}
            id="left-add-piece-btn"
            title="Add a pattern piece to this garment"
            className="text-[10px] font-bold text-blue-700 hover:text-blue-800 bg-blue-100/80 hover:bg-blue-200/80 px-2 py-0.5 rounded flex items-center gap-0.5 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Piece
          </button>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
            1-Object
          </span>
        </div>
      </div>

      {/* ENTIRE GARMENT Primary Selector Button & Edit Trigger */}
      <div className="p-2 pb-1 flex items-center gap-1.5">
        <button
          onClick={selectEntireGarment}
          id="select-entire-garment-main-btn"
          className={`flex-1 py-2 px-2.5 rounded flex items-center justify-between font-bold text-xs uppercase tracking-wide transition-all shadow-2xs ${
            isEntireSelected
              ? 'bg-blue-600 text-white shadow-blue-500/20 ring-2 ring-blue-500 ring-offset-1'
              : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">Entire Garment</span>
          </div>
          <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-extrabold ${
            isEntireSelected ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-600'
          }`}>
            {isEntireSelected ? 'SELECTED' : 'SELECT'}
          </span>
        </button>

        <button
          onClick={() => setActiveModal('editGarment')}
          id="edit-garment-meta-btn"
          title="Edit Garment Title, Category & Size"
          className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Read-Only Notice if child component selected */}
      {!isEntireSelected && (
        <div className="mx-2 mt-1 p-2 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sub-node Selected (Read-Only)</span>
          </div>
          <p className="text-[10px] text-amber-800 leading-tight mb-1.5">
            Independent grading is disabled. Patterns grade as ONE unified parametric object.
          </p>
          <button
            onClick={selectEntireGarment}
            id="prominent-select-entire-btn"
            className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Select Entire Garment
          </button>
        </div>
      )}

      {/* Component Tree with Inline Edit, Duplicate & Delete Actions */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="text-xs text-slate-600">
          <div
            className={`p-1.5 rounded flex items-center justify-between font-bold cursor-pointer ${
              isEntireSelected ? 'text-blue-600 bg-blue-50/60' : 'text-slate-700 hover:bg-slate-100'
            }`}
            onClick={selectEntireGarment}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Component className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">Entire {garment.name} (Root)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-normal shrink-0">
              {garment.components.length} Pcs
            </span>
          </div>

          <div className="ml-2.5 pl-2.5 border-l-2 border-slate-200 space-y-1 mt-1">
            {garment.components.map((comp) => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`p-2 rounded border cursor-pointer transition-all group ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate max-w-[150px]">{comp.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] px-1 py-0.2 bg-slate-200 text-slate-600 rounded font-mono font-bold">
                        {comp.pieceCode || 'PC'}
                      </span>
                      {/* Action buttons */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComponent(comp.id);
                          setActiveModal('editComponent');
                        }}
                        title="Edit Piece Properties"
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateComponent(comp.id);
                        }}
                        title="Duplicate Piece"
                        className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-white"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComponent(comp.id);
                        }}
                        title="Remove Piece"
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center justify-between">
                    <span className="truncate">{comp.cutInstruction || `Cut ${comp.quantity || 1}`}</span>
                    <span className="text-slate-400 text-[9px] shrink-0 font-bold">
                      Qty: {comp.quantity || 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Actions: Save to Library */}
      <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        <button
          onClick={() => setActiveModal('save')}
          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
          Save to Product Library
        </button>
      </div>

      {/* Invariant Callout */}
      <div className="p-2.5 m-2 bg-rose-50/70 border border-rose-200 rounded-lg text-slate-800 text-[11px] leading-relaxed">
        <div className="flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-900 text-[10.5px]">1 Garment = 1 Grading Object</div>
            <p className="text-slate-600 text-[9.5px] leading-tight mt-0.5">
              All {garment.components.length} pattern pieces are constrained parametric nodes. Changing sizes rescales all pieces uniformly.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
