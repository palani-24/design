import React from 'react';
import {
  X,
  Sparkles,
  Zap,
  Layers,
  Printer,
  CheckCircle2,
  ArrowRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { useCADStore } from '../../store/useCADStore';
import { createMensShirtBasicPattern } from '@shared/constants';

interface MensShirtMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: () => void;
}

export const MensShirtMasterModal: React.FC<MensShirtMasterModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  const { setGarment, setCADEngineMode, setEasyPatternStep } = useCADStore();

  if (!isOpen) return null;

  const handleApplyAndDraft = () => {
    const shirt = createMensShirtBasicPattern();
    setGarment(shirt);
    setEasyPatternStep(3);
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  const handleApplyAndCollab = () => {
    const shirt = createMensShirtBasicPattern();
    setGarment(shirt);
    setCADEngineMode('collab');
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  const handleApplyAndTukacad = () => {
    const shirt = createMensShirtBasicPattern();
    setGarment(shirt);
    setCADEngineMode('tukacad');
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#0f2744] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-blue-300">
              👔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight uppercase">
                  Men's Shirt – Basic Pattern (With Measurements)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase">
                  Image 1 Exact Specification
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Master Apparel CAD Drafting & Technical Specification Sheet • 10 Production Pieces • Finished Chest 100cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body - Recreating Image 1 Layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          {/* TOP SECTION: Garment Flats + Finished Measurements + Actual Body Measurements + Seam Allowance & Symbols */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Front & Back Technical Illustrations (Left 4 cols) */}
            <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-around gap-4 py-2">
                {/* Front Flat Sketch */}
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 160 210" className="w-36 h-48 drop-shadow-sm">
                    {/* Collar & Stand */}
                    <path d="M 64 24 L 72 38 L 80 44 L 88 38 L 96 24 L 88 18 L 80 20 L 72 18 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <path d="M 60 24 L 70 42 L 80 44 L 90 42 L 100 24" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                    {/* Shirt Body Front */}
                    <path
                      d="M 60 24 L 28 42 L 20 160 L 32 162 L 40 70 L 40 185 C 60 190, 100 190, 120 185 L 120 70 L 128 162 L 140 160 L 132 42 L 100 24"
                      fill="#f8fafc"
                      stroke="#1e293b"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    {/* Center Front Button Placket */}
                    <path d="M 76 44 L 76 188 M 84 44 L 84 188" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 2" />
                    {/* Buttons */}
                    {[60, 85, 110, 135, 160].map((y) => (
                      <circle key={y} cx="80" cy={y} r="2.2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                    ))}
                    {/* Chest Patch Pocket (Wearer Left) */}
                    <path d="M 94 80 L 114 80 L 114 105 L 104 112 L 94 105 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                    <path d="M 96 82 L 112 82 L 112 103 L 104 109 L 96 103 Z" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2 2" />
                    {/* Sleeves Cuffs */}
                    <rect x="20" y="152" width="12" height="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                    <rect x="128" y="152" width="12" height="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                  </svg>
                  <span className="text-[11px] font-black uppercase text-slate-700 mt-1">FRONT VIEW</span>
                </div>

                {/* Back Flat Sketch */}
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 160 210" className="w-36 h-48 drop-shadow-sm">
                    {/* Collar Back */}
                    <path d="M 60 22 C 73 18, 87 18, 100 22 L 96 30 C 85 27, 75 27, 64 30 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    {/* Back Body */}
                    <path
                      d="M 60 22 L 28 42 L 20 160 L 32 162 L 40 70 L 40 185 C 60 190, 100 190, 120 185 L 120 70 L 128 162 L 140 160 L 132 42 L 100 22"
                      fill="#f8fafc"
                      stroke="#1e293b"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    {/* Back Yoke Seam */}
                    <path d="M 40 68 C 65 72, 95 72, 120 68" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                    {/* Center Box Pleat */}
                    <path d="M 77 69 L 77 187 M 83 69 L 83 187" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 2" />
                    {/* Cuffs */}
                    <rect x="20" y="152" width="12" height="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                    <rect x="128" y="152" width="12" height="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                  </svg>
                  <span className="text-[11px] font-black uppercase text-slate-700 mt-1">BACK VIEW</span>
                </div>
              </div>
            </div>

            {/* Finished Garment Measurements (3 cols) */}
            <div className="lg:col-span-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="bg-[#e0e7ff] text-[#1e3a8a] text-center font-black text-[11px] uppercase py-1 rounded-t-lg tracking-wide">
                FINISHED GARMENT MEASUREMENTS
              </div>
              <table className="w-full text-xs mt-1 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                    <th className="p-1.5 text-left">PARTICULARS</th>
                    <th className="p-1.5 text-right">SIZE (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr><td className="p-1.5 font-medium text-slate-700">Chest</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">100</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Waist</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">92</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Hip</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">100</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Shoulder Width</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">44</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Back Length</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">76</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Sleeve Length</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">60</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Neck Circumference</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">40</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Collar Width</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">4.5</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Cuff Width</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">11</td></tr>
                </tbody>
              </table>
            </div>

            {/* Actual Body Measurements (3 cols) */}
            <div className="lg:col-span-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="bg-[#e0e7ff] text-[#1e3a8a] text-center font-black text-[11px] uppercase py-1 rounded-t-lg tracking-wide">
                MEASUREMENTS USED FOR PATTERN
              </div>
              <div className="text-[10px] text-center text-slate-500 italic mt-0.5 mb-1">
                (Actual Body Measurements)
              </div>
              <table className="w-full text-xs border-collapse">
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr><td className="p-1.5 font-medium text-slate-700">Chest :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">100 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Waist :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">92 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Hip :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">100 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Shoulder :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">44 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Back Length :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">76 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Sleeve Length :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">60 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Neck :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">40 cm</td></tr>
                  <tr><td className="p-1.5 font-medium text-slate-700">Cuff :</td><td className="p-1.5 text-right font-mono font-bold text-slate-900">11 cm</td></tr>
                </tbody>
              </table>
            </div>

            {/* Seam Allowance & Symbols Legend (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              {/* Seam Allowance */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="bg-slate-100 text-slate-800 text-center font-black text-[10px] uppercase py-0.5 rounded">
                  SEAM ALLOWANCE
                </div>
                <div className="mt-2 text-[11px] text-slate-700 leading-snug">
                  <div className="font-bold">All around : 1 cm</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">(except hem : 3 cm)</div>
                </div>
              </div>

              {/* Symbols Legend */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="bg-slate-100 text-slate-800 text-center font-black text-[10px] uppercase py-0.5 rounded mb-2">
                  SYMBOLS
                </div>
                <div className="space-y-1.5 text-[10px] font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-slate-900 inline-block" />
                    <span>Cutting line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 border-b border-dashed border-blue-600 inline-block" />
                    <span>Stitching line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-red-500 inline-block" />
                    <span>Centre line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-emerald-600 inline-block" />
                    <span>Fold line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700">Y</span>
                    <span>Notch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: 10 PATTERN PIECES WITH MEASUREMENTS (EXACT VECTOR REPLICA OF IMAGE 1) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-black text-sm text-[#1e3a5f] uppercase tracking-wide">
                PATTERN PIECES WITH MEASUREMENTS
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                10 Master Pieces • Dimensions in Centimeters (cm)
              </span>
            </div>

            {/* Vector Canvas Recreating the Entire Image 1 Pattern Pieces Layout */}
            <div className="w-full overflow-x-auto bg-[#fafbfc] p-3 rounded-xl border border-slate-100">
              <svg viewBox="0 0 1000 640" className="w-full min-w-[900px] h-auto select-none font-sans">
                {/* 1. FRONT (CUT 2) */}
                <g id="front-piece-svg" transform="translate(30, 20)">
                  {/* Outer pink piece fill */}
                  <path
                    d="M 15 48 C 25 48, 45 28, 55 10 L 130 25 C 135 100, 145 160, 160 170 L 160 480 L 15 480 Z"
                    fill="#fee2e2"
                    stroke="#1e293b"
                    strokeWidth="1.8"
                  />
                  {/* Placket fold line */}
                  <line x1="30" y1="48" x2="30" y2="480" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" />
                  {/* Pocket outline on chest */}
                  <path d="M 65 210 L 120 210 L 120 270 L 92.5 285 L 65 270 Z" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 2" />
                  {/* Pocket dimension labels */}
                  <text x="85" y="205" fill="#1e293b" fontSize="10" fontWeight="bold">13</text>
                  <text x="124" y="248" fill="#1e293b" fontSize="10" fontWeight="bold">14</text>
                  {/* Piece title */}
                  <text x="68" y="505" fill="#1e293b" fontSize="12" fontWeight="900" textAnchor="middle">FRONT</text>
                  <text x="68" y="520" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">(CUT 2)</text>

                  {/* Measurement Callouts */}
                  {/* Neck width 7 */}
                  <line x1="15" y1="4" x2="55" y2="4" stroke="#2563eb" strokeWidth="1" markerEnd="url(#arrow)" />
                  <text x="32" y="0" fill="#2563eb" fontSize="10" fontWeight="bold">7</text>
                  {/* Shoulder width 11.5 */}
                  <line x1="55" y1="4" x2="130" y2="4" stroke="#2563eb" strokeWidth="1" />
                  <text x="80" y="0" fill="#2563eb" fontSize="10" fontWeight="bold">11.5</text>
                  {/* Shoulder drop 2.5 */}
                  <line x1="135" y1="10" x2="135" y2="25" stroke="#2563eb" strokeWidth="1" />
                  <text x="140" y="20" fill="#2563eb" fontSize="9" fontWeight="bold">2.5</text>
                  {/* Scye depth 26 */}
                  <line x1="8" y1="10" x2="8" y2="170" stroke="#2563eb" strokeWidth="1" />
                  <text x="-8" y="95" fill="#2563eb" fontSize="10" fontWeight="bold">26</text>
                  {/* Side seam 50 */}
                  <line x1="8" y1="170" x2="8" y2="480" stroke="#2563eb" strokeWidth="1" />
                  <text x="-8" y="330" fill="#2563eb" fontSize="10" fontWeight="bold">50</text>
                  {/* Total length 76 */}
                  <line x1="172" y1="10" x2="172" y2="480" stroke="#2563eb" strokeWidth="1" />
                  <text x="178" y="250" fill="#2563eb" fontSize="11" fontWeight="bold">76</text>
                  {/* Hem width 25 */}
                  <line x1="15" y1="488" x2="160" y2="488" stroke="#2563eb" strokeWidth="1" />
                  <text x="80" y="498" fill="#2563eb" fontSize="10" fontWeight="bold">25</text>
                </g>

                {/* 2. BACK (CUT 1) */}
                <g id="back-piece-svg" transform="translate(260, 20)">
                  <path
                    d="M 15 20 C 35 20, 50 15, 60 10 L 140 25 C 145 100, 145 160, 160 170 L 160 480 L 15 480 Z"
                    fill="#fee2e2"
                    stroke="#1e293b"
                    strokeWidth="1.8"
                  />
                  {/* Piece title */}
                  <text x="88" y="505" fill="#1e293b" fontSize="12" fontWeight="900" textAnchor="middle">BACK</text>
                  <text x="88" y="520" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">(CUT 1)</text>

                  {/* Measurement Callouts */}
                  {/* Shoulder 21 */}
                  <line x1="15" y1="4" x2="140" y2="4" stroke="#2563eb" strokeWidth="1" />
                  <text x="70" y="0" fill="#2563eb" fontSize="10" fontWeight="bold">21</text>
                  {/* Slope 2.5 */}
                  <text x="148" y="20" fill="#2563eb" fontSize="9" fontWeight="bold">2.5</text>
                  {/* Scye depth 26 */}
                  <line x1="8" y1="10" x2="8" y2="170" stroke="#2563eb" strokeWidth="1" />
                  <text x="-8" y="95" fill="#2563eb" fontSize="10" fontWeight="bold">26</text>
                  {/* Total 76 */}
                  <line x1="172" y1="10" x2="172" y2="480" stroke="#2563eb" strokeWidth="1" />
                  <text x="178" y="250" fill="#2563eb" fontSize="11" fontWeight="bold">76</text>
                  {/* Width 25 */}
                  <line x1="15" y1="488" x2="160" y2="488" stroke="#2563eb" strokeWidth="1" />
                  <text x="80" y="498" fill="#2563eb" fontSize="10" fontWeight="bold">25</text>
                </g>

                {/* 3. SLEEVE (CUT 2) */}
                <g id="sleeve-piece-svg" transform="translate(480, 20)">
                  <path
                    d="M 15 110 C 45 60, 80 15, 115 15 C 150 15, 185 60, 215 110 L 180 470 L 50 470 Z"
                    fill="#fee2e2"
                    stroke="#1e293b"
                    strokeWidth="1.8"
                  />
                  {/* Piece title */}
                  <text x="115" y="505" fill="#1e293b" fontSize="12" fontWeight="900" textAnchor="middle">SLEEVE</text>
                  <text x="115" y="520" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">(CUT 2)</text>

                  {/* Bicep width 36 */}
                  <line x1="15" y1="10" x2="215" y2="10" stroke="#2563eb" strokeWidth="1" />
                  <text x="110" y="6" fill="#2563eb" fontSize="10" fontWeight="bold">36</text>
                  {/* Cap height 15 */}
                  <line x1="225" y1="15" x2="225" y2="110" stroke="#2563eb" strokeWidth="1" />
                  <text x="232" y="65" fill="#2563eb" fontSize="10" fontWeight="bold">15</text>
                  {/* Total sleeve length 60 */}
                  <line x1="8" y1="15" x2="8" y2="470" stroke="#2563eb" strokeWidth="1" />
                  <text x="-8" y="245" fill="#2563eb" fontSize="11" fontWeight="bold">60</text>
                  {/* Cuff width 22 */}
                  <line x1="50" y1="478" x2="180" y2="478" stroke="#2563eb" strokeWidth="1" />
                  <text x="110" y="492" fill="#2563eb" fontSize="10" fontWeight="bold">22</text>
                </g>

                {/* RIGHT COLUMN: Small Pieces (Collar, Collar Stand, Pocket, Yokes, Cuff, Placket) */}
                {/* 4. COLLAR (CUT 2) */}
                <g id="collar-svg" transform="translate(730, 20)">
                  <rect x="0" y="0" width="230" height="26" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <rect x="5" y="4" width="220" height="18" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3 2" />
                  <text x="115" y="42" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">COLLAR (CUT 2)</text>
                  <text x="110" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">44</text>
                  <text x="235" y="18" fill="#2563eb" fontSize="9" fontWeight="bold">4.5</text>
                </g>

                {/* 5. COLLAR STAND (CUT 2) */}
                <g id="collar-stand-svg" transform="translate(730, 75)">
                  <rect x="0" y="0" width="230" height="18" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <rect x="5" y="3" width="220" height="12" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3 2" />
                  <text x="115" y="34" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">COLLAR STAND (CUT 2)</text>
                  <text x="110" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">44</text>
                  <text x="235" y="14" fill="#2563eb" fontSize="9" fontWeight="bold">3</text>
                </g>

                {/* 6. POCKET (CUT 1) */}
                <g id="pocket-svg" transform="translate(745, 130)">
                  <path d="M 0 0 L 70 0 L 70 65 L 35 80 L 0 65 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <path d="M 5 5 L 65 5 L 65 62 L 35 75 L 5 62 Z" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="35" y="96" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">POCKET (CUT 1)</text>
                  <text x="30" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">13</text>
                  <text x="75" y="45" fill="#2563eb" fontSize="9" fontWeight="bold">14</text>
                </g>

                {/* 7. BACK YOKE (CUT 1) */}
                <g id="back-yoke-svg" transform="translate(30, 545)">
                  <path d="M 0 0 L 220 0 L 220 38 C 160 48, 60 48, 0 38 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="110" y1="0" x2="110" y2="43" stroke="#ef4444" strokeWidth="1.2" />
                  <text x="110" y="60" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">BACK YOKE (CUT 1)</text>
                  <text x="105" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">44</text>
                  <text x="-12" y="22" fill="#2563eb" fontSize="9" fontWeight="bold">8</text>
                </g>

                {/* 8. FRONT YOKE (CUT 2) */}
                <g id="front-yoke-svg" transform="translate(280, 545)">
                  <path d="M 0 0 L 120 0 L 120 38 C 85 48, 35 48, 0 38 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="60" y="60" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">FRONT YOKE (CUT 2)</text>
                  <text x="55" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">22</text>
                  <text x="-12" y="22" fill="#2563eb" fontSize="9" fontWeight="bold">8</text>
                </g>

                {/* 9. CUFF (CUT 2) */}
                <g id="cuff-svg" transform="translate(440, 545)">
                  <rect x="0" y="0" width="120" height="48" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="0" y1="24" x2="120" y2="24" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 2" />
                  <rect x="5" y="4" width="110" height="40" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text x="60" y="64" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">CUFF (CUT 2)</text>
                  <text x="55" y="-4" fill="#2563eb" fontSize="9" fontWeight="bold">22</text>
                  <text x="-14" y="26" fill="#2563eb" fontSize="9" fontWeight="bold">11</text>
                </g>

                {/* 10. PLACKET (CUT 1) */}
                <g id="placket-svg" transform="translate(595, 520)">
                  <rect x="0" y="0" width="18" height="90" fill="#fee2e2" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="9" y1="2" x2="9" y2="88" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3 2" />
                  <text x="9" y="104" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">PLACKET</text>
                  <text x="9" y="116" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">(CUT 1)</text>
                  <text x="4" y="-4" fill="#2563eb" fontSize="8" fontWeight="bold">4</text>
                  <text x="24" y="50" fill="#2563eb" fontSize="8" fontWeight="bold">76</text>
                </g>

                {/* CUTTING LAYOUT (SUGGESTION) NESTED FABRIC ROLL MINIATURE */}
                <g id="cutting-layout-suggestion-svg" transform="translate(680, 260)">
                  <rect x="0" y="0" width="280" height="180" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                  <text x="12" y="16" fill="#1e293b" fontSize="10" fontWeight="900">CUTTING LAYOUT (Suggestion)</text>
                  {/* Nested pieces in Fabric */}
                  <g transform="translate(10, 24) scale(0.24)">
                    <rect x="0" y="0" width="1000" height="580" fill="#f1f5f9" stroke="#94a3b8" strokeDasharray="4 4" />
                    {/* Front Cut 2 */}
                    <path d="M 50 48 L 130 25 L 160 170 L 160 480 L 15 480 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="65" y="320" fontSize="32" fontWeight="bold">Front (Cut 2)</text>
                    {/* Back Cut 1 */}
                    <path d="M 240 20 L 340 25 L 360 170 L 360 480 L 215 480 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="260" y="320" fontSize="32" fontWeight="bold">Back (Cut 1)</text>
                    {/* Sleeve Cut 2 */}
                    <path d="M 440 110 L 515 15 L 585 110 L 550 470 L 420 470 Z" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="450" y="320" fontSize="32" fontWeight="bold">Sleeve (Cut 2)</text>
                    {/* Yoke */}
                    <rect x="680" y="30" width="220" height="70" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" rx="10" />
                    <text x="740" y="75" fontSize="28" fontWeight="bold">Yoke</text>
                    {/* Collar */}
                    <rect x="680" y="120" width="220" height="50" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="740" y="155" fontSize="28" fontWeight="bold">Collar</text>
                    {/* Collar Stand */}
                    <rect x="680" y="190" width="220" height="40" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="710" y="220" fontSize="24" fontWeight="bold">Collar Stand</text>
                    {/* Pocket */}
                    <rect x="730" y="260" width="120" height="130" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="750" y="330" fontSize="26" fontWeight="bold">Pocket</text>
                    {/* Cuff */}
                    <rect x="20" y="500" width="200" height="70" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="50" y="545" fontSize="26" fontWeight="bold">Cuff (Cut 2)</text>
                    {/* Placket */}
                    <rect x="250" y="500" width="300" height="40" fill="#fee2e2" stroke="#1e293b" strokeWidth="3" />
                    <text x="320" y="530" fontSize="24" fontWeight="bold">Placket (Cut 1)</text>
                  </g>
                  {/* Fabric dimensions */}
                  <text x="140" y="172" fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle">Fabric Length (approx. 180-200 cm)</text>
                  <text x="272" y="90" fill="#475569" fontSize="8" fontWeight="bold" transform="rotate(90, 272, 90)">Fabric Width (approx. 110 cm)</text>
                </g>
              </svg>
            </div>
          </div>

          {/* BOTTOM SECTION: NOTES & APPLICATION WORKFLOW ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Notes Section (Left 7 cols) */}
            <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>NOTES & INDUSTRIAL CUTTING RULES:</span>
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
                <li>Measurements are in centimeters (cm).</li>
                <li>Seam allowance = 1 cm (except hem = 3 cm).</li>
                <li>This is a basic shirt pattern. Adjust measurements as per your size.</li>
                <li>For better fit, make a toile (trial) before cutting final fabric.</li>
              </ol>
            </div>

            {/* Quick Action Buttons (Right 5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <button
                onClick={handleApplyAndDraft}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply & Draft in EasyPattern (Step 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleApplyAndCollab}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>3-in-1 Triple Collab</span>
                </button>
                <button
                  onClick={handleApplyAndTukacad}
                  className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>TUKAcad 2D Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
