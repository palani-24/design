import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Scissors, Layers, CheckCircle2, Download, Printer } from 'lucide-react';

export const NestingModal: React.FC = () => {
  const { activeModal, setActiveModal, garment } = useCADStore();
  const [fabricWidthCm, setFabricWidthCm] = useState(150);
  const [unitsQty, setUnitsQty] = useState(12);

  if (activeModal !== 'nesting') return null;

  // Calculate nesting metrics
  const markerLengthMeters = +(0.85 * (unitsQty / 2) + 0.35).toFixed(2);
  const efficiencyPercent = 88.6;
  const scrapPercent = +(100 - efficiencyPercent).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Industrial Nesting & Cutting Marker</h3>
              <p className="text-[10px] text-slate-400">
                1-Object Parametric Nest Optimization • Fabric Width: {fabricWidthCm}cm
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Metrics summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Marker Efficiency</span>
              <div className="text-xl font-black text-blue-900 font-mono mt-0.5">{efficiencyPercent}%</div>
              <span className="text-[9px] text-blue-600">High-yield industrial cut</span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Marker Length</span>
              <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">{markerLengthMeters} m</div>
              <span className="text-[9px] text-emerald-600">For {unitsQty} garments ({garment.currentSize})</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Avg Fabric / Piece</span>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
                {(markerLengthMeters / unitsQty).toFixed(2)} m
              </div>
              <span className="text-[9px] text-slate-500">Includes 12mm seam allowance</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Cut Waste</span>
              <div className="text-xl font-black text-amber-700 font-mono mt-0.5">{scrapPercent}%</div>
              <span className="text-[9px] text-slate-500">Recycled selvage scrap</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between bg-slate-100/80 p-2.5 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Fabric Width:</span>
                <select
                  value={fabricWidthCm}
                  onChange={(e) => setFabricWidthCm(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-xs"
                >
                  <option value={140}>140 cm (55")</option>
                  <option value={150}>150 cm (59") Standard</option>
                  <option value={160}>160 cm (63")</option>
                  <option value={180}>180 cm (71") Tubular</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Cut Quantity:</span>
                <input
                  type="number"
                  min={2}
                  max={100}
                  step={2}
                  value={unitsQty}
                  onChange={(e) => setUnitsQty(Number(e.target.value) || 2)}
                  className="w-16 bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-xs"
                />
              </label>
            </div>

            <div className="text-slate-500 font-mono text-[11px]">
              Grainline Constraint: <strong className="text-slate-800">100% Warp Aligned</strong>
            </div>
          </div>

          {/* Interactive Fabric Roll Marker Visualizer */}
          <div className="border-2 border-slate-300 rounded-lg bg-slate-900 p-4 text-white overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span>Fabric Roll Feed (Width: {fabricWidthCm} cm)</span>
              <span>Grainline Direction →</span>
            </div>

            <div className="h-64 border border-slate-700 bg-slate-950/80 rounded relative overflow-hidden flex items-center justify-center p-2">
              {/* Fabric Grid */}
              <div className="absolute inset-0 cad-workspace-grid-dark opacity-40 pointer-events-none" />

              {/* Nested pattern pieces illustration */}
              <svg viewBox="0 0 950 320" className="w-full h-full">
                {/* Marker Boundary */}
                <rect x="10" y="10" width="930" height="300" fill="none" stroke="#475569" strokeDasharray="4 4" />

                {/* Garment 1 - Front */}
                <g transform="translate(30, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(37,99,235,0.25)" stroke="#3b82f6" strokeWidth="2" rx="4" />
                  <text x="30" y="240" fill="#93c5fd" fontSize="28" fontWeight="bold">FRONT (Fold)</text>
                  <line x1="20" y1="50" x2="20" y2="600" stroke="#60a5fa" strokeDasharray="6 4" strokeWidth="2" />
                </g>

                {/* Garment 1 - Back */}
                <g transform="translate(140, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(2,132,199,0.25)" stroke="#0284c7" strokeWidth="2" rx="4" />
                  <text x="35" y="240" fill="#7dd3fc" fontSize="28" fontWeight="bold">BACK (Fold)</text>
                  <line x1="20" y1="50" x2="20" y2="600" stroke="#38bdf8" strokeDasharray="6 4" strokeWidth="2" />
                </g>

                {/* Garment 1 - Sleeve Pair (Nested top and bottom) */}
                <g transform="translate(250, 20) scale(0.38)">
                  <rect width="330" height="260" fill="rgba(79,70,229,0.25)" stroke="#6366f1" strokeWidth="2" rx="4" />
                  <text x="70" y="140" fill="#a5b4fc" fontSize="26" fontWeight="bold">SLEEVE 1</text>
                </g>

                <g transform="translate(250, 150) scale(0.38)">
                  <rect width="330" height="260" fill="rgba(79,70,229,0.25)" stroke="#6366f1" strokeWidth="2" rx="4" />
                  <text x="70" y="140" fill="#a5b4fc" fontSize="26" fontWeight="bold">SLEEVE 2</text>
                </g>

                {/* Garment 2 (Interlocked nesting) */}
                <g transform="translate(390, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(37,99,235,0.25)" stroke="#3b82f6" strokeWidth="2" rx="4" />
                  <text x="30" y="240" fill="#93c5fd" fontSize="28" fontWeight="bold">FRONT (Fold)</text>
                </g>

                <g transform="translate(500, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(2,132,199,0.25)" stroke="#0284c7" strokeWidth="2" rx="4" />
                  <text x="35" y="240" fill="#7dd3fc" fontSize="28" fontWeight="bold">BACK (Fold)</text>
                </g>

                <g transform="translate(610, 20) scale(0.38)">
                  <rect width="330" height="260" fill="rgba(79,70,229,0.25)" stroke="#6366f1" strokeWidth="2" rx="4" />
                  <text x="70" y="140" fill="#a5b4fc" fontSize="26" fontWeight="bold">SLEEVE 1</text>
                </g>

                <g transform="translate(610, 150) scale(0.38)">
                  <rect width="330" height="260" fill="rgba(79,70,229,0.25)" stroke="#6366f1" strokeWidth="2" rx="4" />
                  <text x="70" y="140" fill="#a5b4fc" fontSize="26" fontWeight="bold">SLEEVE 2</text>
                </g>

                {/* Garment 3 (Partial repeat) */}
                <g transform="translate(750, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(37,99,235,0.25)" stroke="#3b82f6" strokeWidth="2" rx="4" />
                  <text x="30" y="240" fill="#93c5fd" fontSize="28" fontWeight="bold">FRONT</text>
                </g>

                <g transform="translate(860, 20) scale(0.38)">
                  <rect width="250" height="660" fill="rgba(2,132,199,0.25)" stroke="#0284c7" strokeWidth="2" rx="4" />
                  <text x="35" y="240" fill="#7dd3fc" fontSize="28" fontWeight="bold">BACK</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Optimized for automatic CNC cutter • Nesting Tolerance: ±0.05 mm
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Exporting Cut Marker for ${garment.name} (${garment.currentSize}) to CNC Cutter stream.`)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export CNC Cut Marker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
