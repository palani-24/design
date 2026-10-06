import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  X,
  Box,
  RotateCw,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const EFitPreviewModal: React.FC = () => {
  const { activeModal, setActiveModal, garment } = useCADStore();
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'back'>('front');
  const [showStressMap, setShowStressMap] = useState<boolean>(true);
  const [fabricType, setFabricType] = useState<string>('denim');

  if (activeModal !== 'eFit') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">TUKA 3D eFit Virtual Drape Simulation</h3>
              <p className="text-[10px] text-slate-400">
                Garment: {garment.name} • Active Size: {garment.currentSize} • Tension Stress Physics
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
            {/* View Angle Rotation */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 mr-1">ANGLE:</span>
              {(['front', 'side', 'back'] as const).map((angle) => (
                <button
                  key={angle}
                  onClick={() => setViewAngle(angle)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
                    viewAngle === angle
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {angle} View
                </button>
              ))}
            </div>

            {/* Tension Map Toggle */}
            <button
              onClick={() => setShowStressMap(!showStressMap)}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showStressMap
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Tension Map {showStressMap ? 'ON' : 'OFF'}</span>
            </button>

            {/* Fabric Material */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500">FABRIC:</span>
              <select
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 outline-none"
              >
                <option value="denim">Denim Stretch (12.5 oz)</option>
                <option value="pique">Pique Knit (220 GSM)</option>
                <option value="cotton">100% Combed Cotton</option>
                <option value="twill">Chino Twill (98/2 Spandex)</option>
              </select>
            </div>
          </div>

          {/* 3D Mannequin Drape Canvas Simulation */}
          <div className="h-80 w-full bg-radial from-slate-800 to-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
            {/* 3D Grid floor */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* 3D Drape Silhouette */}
            <div className="relative flex flex-col items-center justify-center text-center">
              <svg viewBox="0 0 200 300" className="w-56 h-72 drop-shadow-2xl">
                {/* Mannequin Body Base (Gray) */}
                <path
                  d="M 85 40 Q 100 35 115 40 Q 130 50 135 75 Q 120 120 115 150 Q 125 210 130 280 L 115 280 Q 105 210 100 170 Q 95 210 85 280 L 70 280 Q 75 210 85 150 Q 80 120 65 75 Q 70 50 85 40"
                  fill="#334155"
                  opacity="0.45"
                />

                {/* Garment 3D Mesh Drape */}
                {garment.category === 'trouser' ? (
                  // Boot Cut Pant 3D drape
                  <g>
                    <path
                      d="M 75 120 L 125 120 L 132 180 Q 126 230 138 275 L 112 275 Q 106 230 100 165 Q 94 230 88 275 L 62 275 Q 74 230 68 180 Z"
                      fill={showStressMap ? 'url(#pantStressGrad)' : '#1e3a8a'}
                      stroke={showStressMap ? '#38bdf8' : '#60a5fa'}
                      strokeWidth="2.5"
                      opacity="0.9"
                    />
                    {/* Pocket embroidery detail if back view */}
                    {viewAngle === 'back' && (
                      <rect
                        x="105"
                        y="135"
                        width="18"
                        height="22"
                        rx="2"
                        fill="rgba(59,130,246,0.3)"
                        stroke="#facc15"
                        strokeWidth="1.2"
                      />
                    )}
                  </g>
                ) : (
                  // Top / T-Shirt 3D drape
                  <path
                    d="M 80 45 L 120 45 L 145 75 L 130 90 L 125 78 L 125 140 L 75 140 L 75 78 L 70 90 L 55 75 Z"
                    fill={showStressMap ? 'url(#tshirtStressGrad)' : '#2563eb'}
                    stroke={showStressMap ? '#a855f7' : '#93c5fd'}
                    strokeWidth="2.5"
                    opacity="0.92"
                  />
                )}

                {/* Gradients for Stress / Tension Heatmap */}
                <defs>
                  <linearGradient id="pantStressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                    <stop offset="25%" stopColor="#eab308" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.85" />
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="tshirtStressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#eab308" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#22c55e" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Angle HUD Badge */}
              <div className="absolute bottom-2 left-3 bg-black/60 px-2 py-0.5 rounded text-[10px] text-purple-300 font-mono">
                Camera: {viewAngle.toUpperCase()} (360° Drape)
              </div>
            </div>

            {/* Stress Map Legend on the right */}
            {showStressMap && (
              <div className="absolute top-3 right-3 bg-slate-900/80 border border-slate-700/80 p-2 rounded-lg text-[10px] font-mono text-white space-y-1">
                <span className="font-bold text-[9px] text-slate-400 block uppercase">Tension (kPa)</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span>0 - 15 kPa (Relaxed)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-yellow-400" />
                  <span>15 - 30 kPa (Optimal Comfort)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span>&gt; 30 kPa (High Pressure)</span>
                </div>
              </div>
            )}
          </div>

          {/* Fit Assessment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Waist Ease Allowance</span>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">+4.0 cm Ease</div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Zero binding tension
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Hip & Seat Drape</span>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">Smooth Contour</div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Natural drape fall
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Knee & Boot Flare</span>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">21.0" Flare Opening</div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Balanced vertical hang
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            TUKAcad 3D eFit Simulation Engine v4.8
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-sm"
          >
            Close 3D View
          </button>
        </div>
      </div>
    </div>
  );
};
