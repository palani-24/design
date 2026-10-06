import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Scissors, Check, Settings2 } from 'lucide-react';

export const SeamAllowanceModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    seamAllowanceWidthMm,
    setSeamAllowanceWidth,
    showSeamAllowance,
    toggleSeamAllowance,
    cadUnit,
  } = useCADStore();

  const [cornerType, setCornerType] = useState<'mirror' | 'perpendicular' | 'notch'>('mirror');

  if (activeModal !== 'seamAllowance') return null;

  const presets = [
    { label: '1/4" (6.35 mm)', valueMm: 6.35, desc: 'Knits, ribbing, collars' },
    { label: '3/8" (9.52 mm)', valueMm: 9.52, desc: 'Overlock/serger seams' },
    { label: '1/2" (12.7 mm)', valueMm: 12.7, desc: 'Standard TUKAcad Default' },
    { label: '5/8" (15.87 mm)', valueMm: 15.87, desc: 'Woven tailored seams' },
    { label: '1.0" (25.4 mm)', valueMm: 25.4, desc: 'Trouser hem fold' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Seam Allowance (SA) Manager</h3>
              <p className="text-[10px] text-slate-400">
                Configure industrial seam allowances and corner miters
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-sans">
          {/* Toggle SA Active */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <strong className="text-slate-900 block text-xs">Display Seam Allowance</strong>
              <span className="text-[10px] text-slate-500">Show cutting seam allowance outline on vector canvas</span>
            </div>
            <button
              onClick={toggleSeamAllowance}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                showSeamAllowance
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {showSeamAllowance ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Width Presets */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
              Standard Apparel Presets:
            </label>
            <div className="space-y-1.5">
              {presets.map((preset) => {
                const isSelected = Math.abs(seamAllowanceWidthMm - preset.valueMm) < 0.1;
                return (
                  <div
                    key={preset.label}
                    onClick={() => setSeamAllowanceWidth(preset.valueMm)}
                    className={`p-2 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs">{preset.label}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({preset.desc})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corner Miter Style */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
              Corner Cut Style:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mirror', label: 'Mirrored Corner' },
                { id: 'perpendicular', label: 'Perpendicular 90°' },
                { id: 'notch', label: 'V-Notch Inward' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCornerType(style.id as any)}
                  className={`p-2 rounded border text-center text-[11px] font-medium transition-all ${
                    cornerType === style.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[10px]">
            Active Width: {(seamAllowanceWidthMm / (cadUnit === 'in' ? 25.4 : 10)).toFixed(2)} {cadUnit}
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
          >
            Apply Allowance
          </button>
        </div>
      </div>
    </div>
  );
};
