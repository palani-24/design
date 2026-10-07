import React from 'react';
import {
  X,
  Sparkles,
  Printer,
  CheckCircle2,
  ArrowRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { useCADStore } from '../../store/useCADStore';
import { createChinoTrouser } from '@shared/constants';

interface MensTrouserMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: () => void;
}

export const MensTrouserMasterModal: React.FC<MensTrouserMasterModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  const { setGarment, setCADEngineMode, setEasyPatternStep } = useCADStore();

  if (!isOpen) return null;

  const handleApplyAndDraft = () => {
    const trouser = createChinoTrouser();
    setGarment(trouser);
    setEasyPatternStep(3);
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  const handleApplyAndCollab = () => {
    const trouser = createChinoTrouser();
    setGarment(trouser);
    setCADEngineMode('collab');
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  const handleApplyAndTukacad = () => {
    const trouser = createChinoTrouser();
    setGarment(trouser);
    setCADEngineMode('tukacad');
    if (onApplyPreset) onApplyPreset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#14233c] to-[#0a1628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-emerald-300 text-lg">
              👖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight uppercase">
                  Men's Tailored Trouser – Master Technical Pattern
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase">
                  9 Production CAD Pieces
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Complete Professional Trouser Drafting Architecture • Waist 84cm • Hip 100cm • Inseam 78cm • Outseam 104cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
              title="Print Technical Spec Sheet"
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
          {/* TOP SECTION: Garment Flats + Measurements Table + Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 1. Trouser Flats Preview (Col 1-4) */}
            <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center">
              <span className="text-xs font-black tracking-wider text-slate-700 uppercase mb-3">
                Trouser Silhouette Architecture
              </span>
              <div className="flex items-center justify-center gap-6 w-full py-2 bg-slate-50/60 rounded-lg border border-slate-100">
                {/* Front Flat */}
                <div className="flex flex-col items-center">
                  <svg width="110" height="210" viewBox="0 0 110 210" className="drop-shadow-sm">
                    {/* Waistband */}
                    <rect x="25" y="8" width="60" height="10" rx="1.5" fill="#e2e8f0" stroke="#334155" strokeWidth="1.2" />
                    {/* Belt loops */}
                    <line x1="33" y1="8" x2="33" y2="18" stroke="#0f172a" strokeWidth="1.5" />
                    <line x1="55" y1="8" x2="55" y2="18" stroke="#0f172a" strokeWidth="1.5" />
                    <line x1="77" y1="8" x2="77" y2="18" stroke="#0f172a" strokeWidth="1.5" />
                    {/* Trouser Body (Legs) */}
                    <path
                      d="M 25 18 L 85 18 L 88 55 L 82 110 L 76 195 L 56 195 L 55 75 L 54 75 L 54 195 L 34 195 L 28 110 L 22 55 Z"
                      fill="#f1f5f9"
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />
                    {/* Fly J-Stitch */}
                    <path d="M 55 18 L 55 45 C 55 52 50 56 46 56" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 1.5" />
                    {/* Slanted Pockets */}
                    <line x1="30" y1="18" x2="24" y2="45" stroke="#475569" strokeWidth="1.2" />
                    <line x1="80" y1="18" x2="86" y2="45" stroke="#475569" strokeWidth="1.2" />
                    {/* Sharp Crease Lines */}
                    <line x1="40" y1="35" x2="45" y2="195" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 2" />
                    <line x1="70" y1="35" x2="65" y2="195" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 2" />
                    {/* Bottom Hem Lines */}
                    <line x1="34" y1="190" x2="54" y2="190" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="56" y1="190" x2="76" y2="190" stroke="#cbd5e1" strokeWidth="1" />
                  </svg>
                  <span className="text-[11px] font-extrabold text-slate-700 mt-2 uppercase tracking-wide">
                    FRONT VIEW
                  </span>
                </div>

                {/* Back Flat */}
                <div className="flex flex-col items-center">
                  <svg width="110" height="210" viewBox="0 0 110 210" className="drop-shadow-sm">
                    {/* Waistband */}
                    <rect x="25" y="8" width="60" height="10" rx="1.5" fill="#e2e8f0" stroke="#334155" strokeWidth="1.2" />
                    {/* Center Back Notch Split */}
                    <line x1="55" y1="8" x2="55" y2="18" stroke="#dc2626" strokeWidth="1.2" />
                    {/* Trouser Body (Legs) */}
                    <path
                      d="M 25 18 L 85 18 L 88 55 L 82 110 L 76 195 L 56 195 L 55 80 L 54 80 L 54 195 L 34 195 L 28 110 L 22 55 Z"
                      fill="#f1f5f9"
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />
                    {/* Back Seat Seam */}
                    <line x1="55" y1="18" x2="55" y2="80" stroke="#475569" strokeWidth="1.2" />
                    {/* Back Welt Pockets */}
                    <rect x="30" y="32" width="18" height="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
                    <circle cx="39" cy="38" r="1.5" fill="#475569" />
                    <rect x="62" y="32" width="18" height="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
                    <circle cx="71" cy="38" r="1.5" fill="#475569" />
                    {/* Back Darts */}
                    <line x1="39" y1="18" x2="39" y2="28" stroke="#dc2626" strokeWidth="1" />
                    <line x1="71" y1="18" x2="71" y2="28" stroke="#dc2626" strokeWidth="1" />
                  </svg>
                  <span className="text-[11px] font-extrabold text-slate-700 mt-2 uppercase tracking-wide">
                    BACK VIEW
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Measurements Table (Col 5-8) */}
            <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase block">
                FINISHED GARMENT & BODY MEASUREMENTS
              </span>
              <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-3 text-left">PARTICULARS</th>
                    <th className="py-1.5 px-3 text-center">FINISHED (cm)</th>
                    <th className="py-1.5 px-3 text-center">ACTUAL BODY (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Waist</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">84.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">80.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Seat / Hip</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">100.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">96.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Inseam Length</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">78.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">78.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Outseam Total Length</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">104.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">104.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Thigh Girth</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">62.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">58.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Knee Girth</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">44.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">42.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Bottom Hem Opening</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">38.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">38.0</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-1 px-3 font-sans font-medium text-slate-700">Front Rise / Back Rise</td>
                    <td className="py-1 px-3 text-center font-bold text-slate-900">26.0 / 38.0</td>
                    <td className="py-1 px-3 text-center text-slate-600">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Seam Allowance & Rules (Col 9-12) */}
            <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase block">
                PRODUCTION CAD RULES
              </span>
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Seam Allowance (SA)</span>
                </div>
                <p className="text-[11px] text-blue-900">
                  Standard Assembly: <strong>1.0 cm</strong><br />
                  Hem Turn-up: <strong>4.0 cm</strong><br />
                  Center Back Seat Outlet: <strong>2.5 cm</strong>
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-950">Drafting Symbols</div>
                <div className="text-[10px] space-y-1 text-amber-900">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-slate-900 inline-block" />
                    <span>Cutting Outer Boundary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 border-b border-dashed border-blue-600 inline-block" />
                    <span>Stitching Line (1cm SA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-emerald-600 inline-block" />
                    <span>Grainline & Crease Arrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">V</span>
                    <span>Knee & Crotch Assembly Notches</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: 9 Pattern Pieces SVG with Technical Measurements */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
                PATTERN PIECES WITH TECHNICAL MEASUREMENTS (9 CAD PIECES)
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                All Units: Centimeters (cm)
              </span>
            </div>

            <div className="w-full overflow-x-auto bg-[#0e1117] rounded-xl p-4">
              <svg viewBox="0 0 1380 720" className="w-full min-w-[960px] h-auto select-none font-sans">
                {/* 1. FRONT LEG (offset: 40, 20) */}
                <g transform="translate(40, 20)">
                  <path
                    d="M 40 40 L 240 40 C 260 90 270 170 250 220 L 220 400 L 200 600 L 80 600 L 70 400 C 50 260 40 220 20 210 C 25 160 35 90 40 40 Z"
                    fill="#fda4af"
                    fillOpacity="0.88"
                    stroke="#e11d48"
                    strokeWidth="2"
                  />
                  {/* Crease Grainline */}
                  <line x1="140" y1="60" x2="140" y2="580" stroke="#10b981" strokeWidth="2" />
                  <text x="148" y="320" fill="#10b981" fontSize="10" fontWeight="bold">GRAINLINE ↑ CREASE</text>
                  {/* Slant Pocket Line */}
                  <line x1="200" y1="40" x2="250" y2="130" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="230" y="75" fill="#2563eb" fontSize="10" fontWeight="bold">14cm Slant</text>
                  {/* Fly J-Stitch Line */}
                  <path d="M 40 40 L 40 140 C 40 180 25 190 25 190" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Label */}
                  <text x="90" y="270" fill="#881337" fontSize="13" fontWeight="bold">FRONT LEG</text>
                  <text x="105" y="290" fill="#881337" fontSize="11" fontWeight="bold">(CUT 2)</text>
                  {/* Dimensions */}
                  <text x="140" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Waist 21 (42)</text>
                  <text x="140" y="620" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Hem 19 (38)</text>
                  <text x="5" y="320" fill="#38bdf8" fontSize="12" fontWeight="bold">Total Outseam: 104cm</text>
                </g>

                {/* 2. BACK LEG (offset: 360, 20) */}
                <g transform="translate(360, 20)">
                  <path
                    d="M 30 20 L 240 50 C 270 100 280 180 260 230 L 230 410 L 210 610 L 90 610 L 70 410 C 30 290 0 240 -20 220 C 0 170 15 100 30 20 Z"
                    fill="#fda4af"
                    fillOpacity="0.88"
                    stroke="#e11d48"
                    strokeWidth="2"
                  />
                  {/* Crease Grainline */}
                  <line x1="150" y1="80" x2="150" y2="590" stroke="#10b981" strokeWidth="2" />
                  <text x="158" y="320" fill="#10b981" fontSize="10" fontWeight="bold">GRAINLINE ↑</text>
                  {/* Welt Pocket Placement */}
                  <rect x="70" y="100" width="80" height="12" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2" />
                  <text x="110" y="92" fill="#2563eb" fontSize="9" fontWeight="bold" textAnchor="middle">Welt: 13cm × 1.2cm</text>
                  {/* Darts */}
                  <line x1="110" y1="32" x2="110" y2="75" stroke="#dc2626" strokeWidth="1.5" />
                  <circle cx="110" cy="75" r="2.5" fill="#dc2626" />
                  {/* Label */}
                  <text x="100" y="270" fill="#881337" fontSize="13" fontWeight="bold">BACK LEG</text>
                  <text x="115" y="290" fill="#881337" fontSize="11" fontWeight="bold">(CUT 2)</text>
                  {/* Dimensions */}
                  <text x="135" y="10" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Waist 22 (44)</text>
                  <text x="150" y="630" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Hem 20 (40)</text>
                  <text x="275" y="320" fill="#38bdf8" fontSize="12" fontWeight="bold">Seat Pitch +30°</text>
                </g>

                {/* 3. WAISTBAND (offset: 680, 40) */}
                <g transform="translate(680, 40)">
                  <rect width="420" height="50" rx="3" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <line x1="20" y1="25" x2="400" y2="25" stroke="#10b981" strokeWidth="1.5" />
                  <text x="210" y="32" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">
                    WAISTBAND (CUT 2) • 84cm Length × 4.5cm Width
                  </text>
                </g>

                {/* 4. FLY SHIELD (offset: 680, 130) */}
                <g transform="translate(680, 130)">
                  <path d="M 0 0 L 60 0 L 60 160 C 60 200 0 200 0 200 Z" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="30" y="90" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">
                    FLY SHIELD (CUT 1)
                  </text>
                  <text x="30" y="110" fill="#881337" fontSize="9" textAnchor="middle">6cm × 20cm</text>
                </g>

                {/* 5. FLY FACING (offset: 780, 130) */}
                <g transform="translate(780, 130)">
                  <path d="M 0 0 L 55 0 L 55 150 C 55 190 0 190 0 190 Z" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="27" y="90" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">
                    FLY FACING (CUT 1)
                  </text>
                  <text x="27" y="110" fill="#881337" fontSize="9" textAnchor="middle">5.5cm × 19cm</text>
                </g>

                {/* 6. FRONT POCKET FACING (offset: 880, 130) */}
                <g transform="translate(880, 130)">
                  <polygon points="0,0 120,0 120,180 0,180" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="60" y="85" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">
                    SLANT FACING (CUT 2)
                  </text>
                  <text x="60" y="105" fill="#881337" fontSize="9" textAnchor="middle">12cm × 18cm</text>
                </g>

                {/* 7. POCKET BAG (offset: 1040, 130) */}
                <g transform="translate(1040, 130)">
                  <path d="M 0 0 L 160 0 L 160 220 C 160 270 0 270 0 220 Z" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="80" y="110" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">
                    POCKET BAG (CUT 4)
                  </text>
                  <text x="80" y="130" fill="#881337" fontSize="9" textAnchor="middle">16cm × 27cm</text>
                </g>

                {/* 8. BACK WELT FACING (offset: 680, 360) */}
                <g transform="translate(680, 360)">
                  <rect width="180" height="60" rx="3" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="90" y="32" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">
                    WELT FACING (CUT 2)
                  </text>
                  <text x="90" y="48" fill="#881337" fontSize="9" textAnchor="middle">18cm × 6cm</text>
                </g>

                {/* 9. BELT LOOPS (offset: 890, 360) */}
                <g transform="translate(890, 360)">
                  <rect width="210" height="30" rx="2" fill="#fda4af" fillOpacity="0.88" stroke="#e11d48" strokeWidth="2" />
                  <text x="105" y="20" fill="#881337" fontSize="10" fontWeight="bold" textAnchor="middle">
                    BELT LOOPS STRIP (CUT 6) • 3.5cm × 60cm
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* BOTTOM SECTION: Suggestion Fabric Roll Layout */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-black tracking-wider text-slate-900 uppercase block mb-3">
              CUTTING LAYOUT (SUGGESTION) • FABRIC ROLL 140–150cm WIDTH × 130–150cm LENGTH
            </span>
            <div className="p-4 bg-[#0e1117] rounded-xl border border-slate-800">
              <svg viewBox="0 0 960 360" className="w-full h-auto select-none font-sans">
                {/* Fabric Perimeter */}
                <rect x="20" y="20" width="920" height="310" rx="6" fill="#151b28" stroke="#38bdf8" strokeWidth="2" />
                <text x="480" y="348" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Fabric Length: approx 130–150 cm • High Efficiency 91.4%
                </text>
                <text x="935" y="175" fill="#38bdf8" fontSize="11" fontWeight="bold" transform="rotate(90, 935, 175)" textAnchor="middle">
                  Fabric Width: 140–150 cm
                </text>

                {/* Nested 9 Pieces */}
                {/* Front Leg 1 & 2 */}
                <g transform="translate(40, 40)">
                  <rect width="180" height="260" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="90" y="130" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Front Leg (L)</text>
                </g>
                <g transform="translate(230, 40)">
                  <rect width="180" height="260" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="90" y="130" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Front Leg (R)</text>
                </g>
                {/* Back Leg 1 & 2 */}
                <g transform="translate(420, 40)">
                  <rect width="200" height="260" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="100" y="130" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Back Leg (L)</text>
                </g>
                <g transform="translate(630, 40)">
                  <rect width="200" height="260" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="100" y="130" fill="#881337" fontSize="11" fontWeight="bold" textAnchor="middle">Back Leg (R)</text>
                </g>
                {/* Waistband & Small parts */}
                <g transform="translate(840, 40)">
                  <rect width="90" height="120" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="45" y="60" fill="#881337" fontSize="9" fontWeight="bold" textAnchor="middle">Waistband</text>
                  <rect y="130" width="90" height="120" rx="3" fill="#fda4af" stroke="#e11d48" strokeWidth="1.5" />
                  <text x="45" y="190" fill="#881337" fontSize="9" fontWeight="bold" textAnchor="middle">Fly & Pockets</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-emerald-400">Men's Tailored Trouser Master Spec:</span> 9 Full Pattern Pieces ready for production.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApplyAndTukacad}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Launch in TUKAcad 2D</span>
            </button>
            <button
              onClick={handleApplyAndCollab}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Launch in 3-in-1 Collab</span>
            </button>
            <button
              onClick={handleApplyAndDraft}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Load in EasyPattern Draft (Step 3)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
