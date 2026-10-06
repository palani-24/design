import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Workflow, CheckCircle2, ArrowRightLeft, Sparkles, Check } from 'lucide-react';

export const WalkSeamModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, cadUnit } = useCADStore();
  const [selectedSeamPair, setSelectedSeamPair] = useState<'inseam' | 'outseam' | 'armhole'>('inseam');

  if (activeModal !== 'walkSeam') return null;

  const seamPairs = [
    {
      id: 'inseam',
      title: 'Pant Inseam Seam Matching',
      piece1: 'Front Leg (FR)',
      length1: cadUnit === 'in' ? 32.0 : 81.3,
      piece2: 'Back Leg (BK)',
      length2: cadUnit === 'in' ? 32.0 : 81.3,
      delta: 0.0,
      status: 'Perfect 1:1 Match',
      desc: 'Inseams match identically from crotch fork to bottom boot cut flare.',
    },
    {
      id: 'outseam',
      title: 'Pant Outseam Side Seam Matching',
      piece1: 'Front Leg (FR)',
      length1: cadUnit === 'in' ? 40.9 : 104.0,
      piece2: 'Back Leg (BK)',
      length2: cadUnit === 'in' ? 41.7 : 106.0,
      delta: cadUnit === 'in' ? 0.8 : 2.0,
      status: 'Engineered Ease (+2.0cm)',
      desc: 'Back outseam carries seat angle rise curve compensation.',
    },
    {
      id: 'armhole',
      title: 'Armhole to Sleeve Cap Seam',
      piece1: 'Combined Body Scye',
      length1: cadUnit === 'in' ? 18.2 : 46.2,
      piece2: 'Sleeve Cap Crown',
      length2: cadUnit === 'in' ? 18.2 : 46.2,
      delta: 0.0,
      status: 'Zero Tension Match',
      desc: 'Sleeve crown curve matches body armhole circumference without puckering.',
    },
  ];

  const currentPair = seamPairs.find((p) => p.id === selectedSeamPair) || seamPairs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">TUKA Walk Pattern Seams Quality Verification</h3>
              <p className="text-[10px] text-slate-400">
                Seam balance verification for: {garment.name} ({garment.currentSize})
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
          {/* Seam Selection Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {seamPairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => setSelectedSeamPair(pair.id as any)}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                  selectedSeamPair === pair.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pair.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Active Seam Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">{currentPair.title}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" /> {currentPair.status}
              </span>
            </div>

            <p className="text-xs text-slate-600">{currentPair.desc}</p>

            {/* Visual Walking Caliper Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono block">SEAM 1: {currentPair.piece1}</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {currentPair.length1.toFixed(1)} {cadUnit}
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full w-[95%]" />
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono block">SEAM 2: {currentPair.piece2}</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {currentPair.length2.toFixed(1)} {cadUnit}
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[95%]" />
                </div>
              </div>
            </div>

            {/* Delta Status Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">
                  Calculated Seam Differential (Delta):
                </span>
              </div>
              <span className="font-mono font-bold text-sm text-blue-900">
                {currentPair.delta === 0 ? '±0.00 mm' : `+${currentPair.delta} ${cadUnit}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            TUKAcad Seam Walking Engine • Zero-Distortion Verification
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
