import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Compass, CheckCircle2, Sparkles, Image, Check } from 'lucide-react';

export const DartPleatModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, cadUnit } = useCADStore();
  const [internalFeature, setInternalFeature] = useState<'dart' | 'pleat' | 'artwork'>('artwork');
  const [dartDepth, setDartDepth] = useState<number>(3.0); // cm
  const [dartLength, setDartLength] = useState<number>(12.0); // cm
  const [selectedGraphic, setSelectedGraphic] = useState<string>('butterfly');

  if (activeModal !== 'dartPleat') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">TUKA Internals & Artwork Studio</h3>
              <p className="text-[10px] text-slate-400">
                Add darts, knife pleats, and graphic embroidery placements
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
          {/* Feature Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setInternalFeature('artwork')}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                internalFeature === 'artwork'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Graphic Artwork</span>
            </button>
            <button
              onClick={() => setInternalFeature('dart')}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                internalFeature === 'dart'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Contour Dart</span>
            </button>
            <button
              onClick={() => setInternalFeature('pleat')}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                internalFeature === 'pleat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Knife Pleats</span>
            </button>
          </div>

          {/* Artwork Placement View */}
          {internalFeature === 'artwork' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <strong className="text-blue-900 block text-xs">
                  Graphic Placement (TUKAdesign Signature Feature)
                </strong>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Embed scalable vector artwork and embroidery motifs directly inside pattern pieces (e.g., back pocket BK-PK).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedGraphic('butterfly')}
                  className={`p-3 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    selectedGraphic === 'butterfly'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2 mb-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 stroke-current fill-none" strokeWidth="2.5">
                      <path d="M50 30 Q50 80 50 85 M48 25 Q50 30 52 25" stroke="#1d4ed8" strokeWidth="2.5" />
                      <path d="M50 35 C35 15 10 20 15 45 C18 60 40 60 50 55" stroke="#2563eb" fill="rgba(37,99,235,0.15)" />
                      <path d="M50 35 C65 15 90 20 85 45 C82 60 60 60 50 55" stroke="#2563eb" fill="rgba(37,99,235,0.15)" />
                      <path d="M50 55 C38 58 20 65 25 80 C29 90 45 80 50 68" stroke="#1d4ed8" fill="rgba(37,99,235,0.1)" />
                      <path d="M50 55 C62 58 80 65 75 80 C71 90 55 80 50 68" stroke="#1d4ed8" fill="rgba(37,99,235,0.1)" />
                      <circle cx="50" cy="30" r="3" fill="#1d4ed8" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-slate-800">TUKA Butterfly Motif</span>
                  <span className="text-[10px] text-slate-400">Back Pocket BK-PK Artwork</span>
                </div>

                <div
                  onClick={() => setSelectedGraphic('embroidery')}
                  className={`p-3 border rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    selectedGraphic === 'embroidery'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2 mb-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600 stroke-current fill-none" strokeWidth="2.5">
                      <polygon points="50,15 62,38 88,42 68,60 74,85 50,72 26,85 32,60 12,42 38,38" fill="rgba(99,102,241,0.2)" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-slate-800">Crest / Star Insignia</span>
                  <span className="text-[10px] text-slate-400">Chest / Pocket Placement</span>
                </div>
              </div>
            </div>
          )}

          {/* Dart Manipulation View */}
          {internalFeature === 'dart' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Dart Width / Intake ({cadUnit}):
                  </label>
                  <input
                    type="number"
                    value={dartDepth}
                    onChange={(e) => setDartDepth(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Dart Apex Length ({cadUnit}):
                  </label>
                  <input
                    type="number"
                    value={dartLength}
                    onChange={(e) => setDartLength(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                    step="1.0"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                <span className="font-bold block text-slate-800 mb-0.5">Calculated Dart Flare:</span>
                Takes {dartDepth} {cadUnit} out of waist contour, tapering smoothly over {dartLength} {cadUnit}.
              </div>
            </div>
          )}

          {/* Pleat Manipulation View */}
          {internalFeature === 'pleat' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                <strong className="text-slate-800 block text-xs mb-1">Knife / Box Pleat Generation</strong>
                <p className="text-[11px] leading-relaxed">
                  Adds fold line annotations with 2.5cm knife pleat fold underlay for waistline fullness.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[10px]">
            Target Piece: Back Pocket (BK-PK)
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
          >
            Apply to Pattern
          </button>
        </div>
      </div>
    </div>
  );
};
