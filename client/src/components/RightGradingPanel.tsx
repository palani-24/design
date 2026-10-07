import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCADStore } from '../store/useCADStore';
import { GarmentSize, GARMENT_SIZES } from '@shared/types';

export const RightGradingPanel: React.FC = () => {
  const {
    garment,
    currentSize,
    targetSize,
    setCurrentSize,
    setTargetSize,
    executeGrading,
    isGrading,
    lastGradingResult,
    gradingNotification,
    activeGradingStep,
    selectedComponentId,
    selectEntireGarment,
    rotateComponent,
    mirrorComponent,
    offsetComponentContour,
    setActiveModal,
  } = useCADStore();

  const [activeTab, setActiveTab] = useState<'grading' | 'matrix'>('grading');

  const activeComp =
    selectedComponentId && selectedComponentId !== 'entire'
      ? garment.components.find((c) => c.id === selectedComponentId)
      : null;

  const sizeTable = garment.sizeTable;
  const currentDims = sizeTable[currentSize] || sizeTable.S;
  const targetDims = sizeTable[targetSize] || sizeTable.M;

  // Calculate live delta projections
  const chestDeltaCm = targetDims.width - currentDims.width;
  const bustDeltaCm = targetDims.bust - currentDims.bust;
  const waistDeltaCm = targetDims.waist - currentDims.waist;
  const hipDeltaCm = targetDims.hip - currentDims.hip;
  const lengthDeltaCm = targetDims.length - currentDims.length;
  const sleeveDeltaCm = targetDims.sleeveLength - currentDims.sleeveLength;

  const handleGradeSubmit = async () => {
    try {
      await executeGrading();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="w-84 bg-white border-l border-slate-200 flex flex-col h-full select-none shadow-sm overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Garment Grading
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
          1-Object Mode
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Garment Identification */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <span>{garment.name}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Root Vector Group ({garment.components.length} Components)
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            Ready
          </span>
        </div>

        {/* Selected Pattern Piece Quick Editor */}
        {activeComp && (
          <div className="bg-amber-50/80 border border-amber-300 rounded-lg p-2.5 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Piece: {activeComp.pieceCode || activeComp.name}</span>
              </div>
              <button
                onClick={selectEntireGarment}
                className="text-[9.5px] px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-bold transition-colors cursor-pointer"
                title="Switch back to 1-Object Entire Garment"
              >
                Entire Garment
              </button>
            </div>
            <div className="text-[10px] text-amber-800 font-medium">
              {activeComp.cutInstruction} • SA: {activeComp.seamAllowanceMm ?? 12.7}mm
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button
                onClick={() => rotateComponent(activeComp.id, 45)}
                className="p-1 bg-white border border-amber-200 rounded font-semibold text-slate-700 hover:bg-amber-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Rotate 45°"
              >
                ↺ 45°
              </button>
              <button
                onClick={() => mirrorComponent(activeComp.id, 'x')}
                className="p-1 bg-white border border-amber-200 rounded font-semibold text-slate-700 hover:bg-amber-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Mirror Horizontal"
              >
                ⇄ Flip
              </button>
              <button
                onClick={() => offsetComponentContour(activeComp.id, 5)}
                className="p-1 bg-white border border-amber-200 rounded font-semibold text-slate-700 hover:bg-amber-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Add 5mm Seam Allowance"
              >
                +5mm SA
              </button>
              <button
                onClick={() => setActiveModal('editComponent')}
                className="p-1 bg-amber-600 text-white rounded font-bold hover:bg-amber-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Open Piece Settings Modal"
              >
                Edit...
              </button>
            </div>
          </div>
        )}

        {/* Size Selection Controls */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Current Size (Base)
            </label>
            <select
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value as GarmentSize)}
              id="select-current-size"
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {GARMENT_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz} — {sizeTable[sz]?.bust}cm
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Target Size (Grade To)
            </label>
            <select
              value={targetSize}
              onChange={(e) => setTargetSize(e.target.value as GarmentSize)}
              id="select-target-size"
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {GARMENT_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz} — {sizeTable[sz]?.bust}cm
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA: GRADE ENTIRE GARMENT */}
        <div>
          <button
            onClick={handleGradeSubmit}
            disabled={isGrading || currentSize === targetSize}
            id="grade-entire-garment-main-btn"
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              isGrading
                ? 'bg-blue-400 cursor-wait'
                : currentSize === targetSize
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25 ring-2 ring-blue-500/20'
            }`}
          >
            <Zap className={`w-4 h-4 ${isGrading ? 'animate-spin' : ''}`} />
            {isGrading ? 'Grading Garment...' : '⚡ Grade Entire Garment'}
          </button>
          <div className="text-[10px] text-slate-500 text-center mt-1.5 leading-snug">
            Proportional Vector Grading: All connected pieces morph together.
          </div>
        </div>

        {/* Live Notification Banner */}
        {gradingNotification && (
          <div
            id="grading-status-toast"
            className={`p-2.5 rounded-md border text-[11px] font-medium flex items-center gap-2 animate-fadeIn ${
              gradingNotification.includes('Grading Complete')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{gradingNotification}</span>
          </div>
        )}

        {/* Proportional Stepper: Neck -> Shoulder -> Bust -> Waist -> Hip -> Hem */}
        <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[11px] text-slate-700">Proportional Stepper</span>
            <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
              6/6 Nodes Aligned
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'neck'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'neck' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Neck</div>
              <div className={activeGradingStep === 'neck' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>✓ Sync</div>
            </div>

            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'shoulder'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'shoulder' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Shoulder</div>
              <div className={activeGradingStep === 'shoulder' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>✓ Sync</div>
            </div>

            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'bust'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'bust' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Bust</div>
              <div className={activeGradingStep === 'bust' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>
                {bustDeltaCm >= 0 ? `+${bustDeltaCm.toFixed(1)}cm` : `${bustDeltaCm.toFixed(1)}cm`}
              </div>
            </div>

            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'waist'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'waist' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Waist</div>
              <div className={activeGradingStep === 'waist' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>
                {waistDeltaCm >= 0 ? `+${waistDeltaCm.toFixed(1)}cm` : `${waistDeltaCm.toFixed(1)}cm`}
              </div>
            </div>

            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'hip'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'hip' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Hip</div>
              <div className={activeGradingStep === 'hip' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>
                {hipDeltaCm >= 0 ? `+${hipDeltaCm.toFixed(1)}cm` : `${hipDeltaCm.toFixed(1)}cm`}
              </div>
            </div>

            <div className={`p-1.5 rounded transition-all ${
              activeGradingStep === 'hem'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                : 'bg-white border border-slate-200 shadow-2xs'
            }`}>
              <div className={activeGradingStep === 'hem' ? 'text-blue-100 font-semibold' : 'text-slate-500 font-semibold'}>Hem/Length</div>
              <div className={activeGradingStep === 'hem' ? 'text-white font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>
                {lengthDeltaCm >= 0 ? `+${lengthDeltaCm.toFixed(1)}cm` : `${lengthDeltaCm.toFixed(1)}cm`}
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-slate-500 font-mono text-center">
            Projection {currentSize} → {targetSize}: {bustDeltaCm >= 0 ? `+${bustDeltaCm.toFixed(1)}` : bustDeltaCm.toFixed(1)} cm Chest / {lengthDeltaCm >= 0 ? `+${lengthDeltaCm.toFixed(1)}` : lengthDeltaCm.toFixed(1)} cm Length
          </div>
        </div>

        {/* Dimensional Metrics Comparison Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="bg-slate-100/80 px-2.5 py-1.5 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-[11px] text-slate-700">Dimensional Metrics</span>
            <span className="text-[10px] font-mono text-slate-500">Metric (cm)</span>
          </div>

          <div className="divide-y divide-slate-100 text-[11px] font-mono">
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Half-Chest Width</span>
              <span className="font-semibold text-slate-800">
                {currentDims.width.toFixed(1)} → {targetDims.width.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({chestDeltaCm >= 0 ? `+${chestDeltaCm.toFixed(1)}` : chestDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Total Bust Circumference</span>
              <span className="font-semibold text-slate-800">
                {currentDims.bust.toFixed(1)} → {targetDims.bust.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({bustDeltaCm >= 0 ? `+${bustDeltaCm.toFixed(1)}` : bustDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Waist Circumference</span>
              <span className="font-semibold text-slate-800">
                {currentDims.waist.toFixed(1)} → {targetDims.waist.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({waistDeltaCm >= 0 ? `+${waistDeltaCm.toFixed(1)}` : waistDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Hip Sweep</span>
              <span className="font-semibold text-slate-800">
                {currentDims.hip.toFixed(1)} → {targetDims.hip.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({hipDeltaCm >= 0 ? `+${hipDeltaCm.toFixed(1)}` : hipDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Center Back Body Length</span>
              <span className="font-semibold text-slate-800">
                {currentDims.length.toFixed(1)} → {targetDims.length.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({lengthDeltaCm >= 0 ? `+${lengthDeltaCm.toFixed(1)}` : lengthDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
            <div className="px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-slate-600">Sleeve Length (Crown to Hem)</span>
              <span className="font-semibold text-slate-800">
                {currentDims.sleeveLength.toFixed(1)} → {targetDims.sleeveLength.toFixed(1)}
                <span className="text-blue-600 font-bold ml-1">
                  ({sleeveDeltaCm >= 0 ? `+${sleeveDeltaCm.toFixed(1)}` : sleeveDeltaCm.toFixed(1)})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Size Run Grading Matrix */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="bg-slate-100/80 px-2.5 py-1.5 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-[11px] text-slate-700">Size Run Grading Matrix</span>
            <span className="text-[10px] font-mono text-slate-500">Base: {garment.baseSize}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] font-mono">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-1 px-2">SIZE</th>
                  <th className="py-1 px-1.5">BUST</th>
                  <th className="py-1 px-1.5">WAIST</th>
                  <th className="py-1 px-1.5">HIP</th>
                  <th className="py-1 px-1.5">LGTH</th>
                  <th className="py-1 px-1.5">SLV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {GARMENT_SIZES.map((sz) => {
                  const dims = sizeTable[sz];
                  const isCurrent = sz === currentSize;
                  const isTarget = sz === targetSize;
                  return (
                    <tr
                      key={sz}
                      className={`${
                        isCurrent
                          ? 'bg-slate-900 text-white font-bold'
                          : isTarget
                          ? 'bg-blue-600 text-white font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-1 px-2 font-bold">
                        {sz}
                        {isCurrent && <span className="ml-1 text-[8px] opacity-80">CURR</span>}
                        {isTarget && !isCurrent && <span className="ml-1 text-[8px] opacity-80">TARGET</span>}
                      </td>
                      <td className="py-1 px-1.5">{dims?.bust.toFixed(1)}</td>
                      <td className="py-1 px-1.5">{dims?.waist.toFixed(1)}</td>
                      <td className="py-1 px-1.5">{dims?.hip.toFixed(1)}</td>
                      <td className="py-1 px-1.5">{dims?.length.toFixed(1)}</td>
                      <td className="py-1 px-1.5">{dims?.sleeveLength.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </aside>
  );
};
