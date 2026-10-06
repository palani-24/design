import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  MousePointer,
  Scissors,
  Ruler,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Workflow,
  Sparkles,
  Link2,
} from 'lucide-react';

export const Clo2DPatternWindow: React.FC = () => {
  const { language, activeFabric } = useCADStore();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [selectedPiece, setSelectedPiece] = useState<string | null>('bodiceFront');
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeSewingMode, setActiveSewingMode] = useState<boolean>(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      // Middle or right click: Pan
      setIsPanning(true);
      setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(2.5, Math.max(0.4, z * zoomFactor)));
  };

  return (
    <div
      className="relative flex-1 h-full w-full overflow-hidden bg-[#cbd5e1] select-none border-l border-[#475569]/40"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Header Overlay: 2D Pattern Window Title */}
      <div className="absolute top-2.5 left-3 pointer-events-none flex items-center gap-2 z-20">
        <span className="font-mono text-xs text-[#1e293b] bg-white/70 backdrop-blur-md px-2.5 py-1 rounded shadow-xs font-semibold">
          {t('patternWindow')}
        </span>
        <span className="text-[10px] bg-sky-500/10 text-sky-700 px-2 py-0.5 rounded border border-sky-300 font-mono font-medium">
          {activeSewingMode ? 'Seam Sewing Active' : 'Transform Mode'}
        </span>
      </div>

      {/* 2. Top Right Quick 2D Tools */}
      <div className="absolute top-2.5 right-3 flex items-center gap-1 z-20 bg-white/80 backdrop-blur-md p-1 rounded border border-slate-300 shadow-xs">
        <button
          onClick={() => setActiveSewingMode(!activeSewingMode)}
          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
            activeSewingMode
              ? 'bg-[#00a8ff] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
          title="Toggle Seam Sewing Lines"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{t('seamLinks')}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        <button
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
          className="p-1 rounded text-slate-700 hover:bg-slate-200"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
          className="p-1 rounded text-slate-700 hover:bg-slate-200"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1 rounded text-slate-700 hover:bg-slate-200"
          title="Reset 2D View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Infinite Grid Canvas SVG */}
      <svg
        className="w-full h-full cursor-crosshair"
        style={{
          backgroundColor: '#d8dee9',
          backgroundImage: `
            radial-gradient(#94a3b8 1px, transparent 1px),
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 120px 120px, 120px 120px',
        }}
      >
        <g transform={`translate(${pan.x + 380}, ${pan.y + 110}) scale(${zoom})`}>
          {/* A. Ghost Silhouette of Avatar Backdrop (Matching CLO 3D Screenshot) */}
          <g opacity="0.16" transform="translate(0, -30)">
            {/* Stylized Avatar Silhouette for scale reference */}
            <ellipse cx="0" cy="40" rx="36" ry="46" fill="#475569" />
            <rect x="-14" y="80" width="28" height="34" rx="10" fill="#475569" />
            <path
              d="M-80 114 C -60 110, 60 110, 80 114 L 64 260 C 40 280, -40 280, -64 260 Z"
              fill="#475569"
            />
            {/* Avatar Legs Outline */}
            <path
              d="M-55 260 L -45 520 L -30 520 L -25 260 Z M 25 260 L 30 520 L 45 520 L 55 260 Z"
              fill="#475569"
            />
          </g>

          {/* B. Cyan Seam Sewing Link Lines (Connecting corresponding edges) */}
          {activeSewingMode && (
            <g stroke="#00b4d8" strokeWidth="2.5" strokeDasharray="5,4" opacity="0.9">
              {/* Bodice Shoulder Seam Link */}
              <line x1="-120" y1="120" x2="120" y2="120" />
              {/* Bodice Side Seam Link */}
              <line x1="-70" y1="210" x2="70" y2="210" />
              {/* Skirt Side Seam Link */}
              <line x1="-15" y1="380" x2="15" y2="380" />
              {/* Waist Connection Seam (Bodice Waist to Skirt Waist) */}
              <line x1="-100" y1="260" x2="-100" y2="275" stroke="#38bdf8" strokeWidth="3" />
              <line x1="100" y1="260" x2="100" y2="275" stroke="#38bdf8" strokeWidth="3" />
            </g>
          )}

          {/* C. Pattern Piece 1: Bodice Front (Left Top) */}
          <g
            id="bodice-front"
            transform="translate(-160, 40)"
            className="cursor-pointer transition-all hover:opacity-95"
            onClick={() => setSelectedPiece('bodiceFront')}
          >
            {/* White Pattern Panel with Drop Shadow */}
            <path
              d="
                M -65 80
                C -45 86, -20 90, 0 90
                C 20 90, 45 86, 65 80
                L 75 120
                C 50 135, 45 160, 50 180
                L 50 220
                L 35 220
                L 25 160
                L 15 220
                L -15 220
                L -25 160
                L -35 220
                L -50 220
                L -50 180
                C -45 160, -50 135, -75 120
                Z
              "
              fill="#ffffff"
              stroke={selectedPiece === 'bodiceFront' ? '#0284c7' : '#334155'}
              strokeWidth={selectedPiece === 'bodiceFront' ? '3' : '1.5'}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))"
            />
            {/* Waist Dart Seam Indentations */}
            <line x1="25" y1="160" x2="25" y2="220" stroke="#00a8ff" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="-25" y1="160" x2="-25" y2="220" stroke="#00a8ff" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Dart Apex Nodes */}
            <circle cx="25" cy="160" r="3.5" fill="#00a8ff" />
            <circle cx="-25" cy="160" r="3.5" fill="#00a8ff" />

            {/* Label */}
            <text x="0" y="145" textAnchor="middle" fill="#1e293b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              BODICE FRONT (1)
            </text>
            <text x="0" y="160" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              Silk Charmeuse • S
            </text>
          </g>

          {/* D. Pattern Piece 2: Bodice Back (Right Top) */}
          <g
            id="bodice-back"
            transform="translate(160, 40)"
            className="cursor-pointer transition-all hover:opacity-95"
            onClick={() => setSelectedPiece('bodiceBack')}
          >
            <path
              d="
                M -65 72
                C -45 76, -20 78, 0 78
                C 20 78, 45 76, 65 72
                L 75 116
                C 50 130, 45 158, 50 178
                L 50 220
                L 35 220
                L 25 155
                L 15 220
                L -15 220
                L -25 155
                L -35 220
                L -50 220
                L -50 178
                C -45 158, -50 130, -75 116
                Z
              "
              fill="#ffffff"
              stroke={selectedPiece === 'bodiceBack' ? '#0284c7' : '#334155'}
              strokeWidth={selectedPiece === 'bodiceBack' ? '3' : '1.5'}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))"
            />
            {/* Back Waist Dart Lines */}
            <line x1="25" y1="155" x2="25" y2="220" stroke="#00a8ff" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="-25" y1="155" x2="-25" y2="220" stroke="#00a8ff" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="25" cy="155" r="3.5" fill="#00a8ff" />
            <circle cx="-25" cy="155" r="3.5" fill="#00a8ff" />

            {/* Label */}
            <text x="0" y="140" textAnchor="middle" fill="#1e293b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              BODICE BACK (1)
            </text>
            <text x="0" y="155" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              Silk Charmeuse • S
            </text>
          </g>

          {/* E. Pattern Piece 3: A-Line Flared Skirt Front (Bottom Left) */}
          <g
            id="skirt-front"
            transform="translate(-160, 310)"
            className="cursor-pointer transition-all hover:opacity-95"
            onClick={() => setSelectedPiece('skirtFront')}
          >
            {/* Trapezoid Flared Panel */}
            <path
              d="
                M -70 0
                C -35 6, 35 6, 70 0
                L 125 190
                C 65 204, -65 204, -125 190
                Z
              "
              fill="#ffffff"
              stroke={selectedPiece === 'skirtFront' ? '#00a8ff' : '#334155'}
              strokeWidth={selectedPiece === 'skirtFront' ? '3' : '1.5'}
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
            />
            {/* Highlighted Cyan Hem Edge (Matches CLO 3D Screenshot) */}
            <path
              d="M -125 190 C -65 204, 65 204, 125 190"
              stroke="#00a8ff"
              strokeWidth="4"
              fill="none"
            />
            <text x="0" y="90" textAnchor="middle" fill="#1e293b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              SKIRT FRONT (1)
            </text>
            <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              A-Line Flared • 0.46m
            </text>
          </g>

          {/* F. Pattern Piece 4: A-Line Flared Skirt Back (Bottom Right) */}
          <g
            id="skirt-back"
            transform="translate(160, 310)"
            className="cursor-pointer transition-all hover:opacity-95"
            onClick={() => setSelectedPiece('skirtBack')}
          >
            <path
              d="
                M -70 0
                C -35 6, 35 6, 70 0
                L 125 190
                C 65 204, -65 204, -125 190
                Z
              "
              fill="#ffffff"
              stroke={selectedPiece === 'skirtBack' ? '#00a8ff' : '#334155'}
              strokeWidth={selectedPiece === 'skirtBack' ? '3' : '1.5'}
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
            />
            {/* Highlighted Cyan Hem Edge */}
            <path
              d="M -125 190 C -65 204, 65 204, 125 190"
              stroke="#00a8ff"
              strokeWidth="4"
              fill="none"
            />
            <text x="0" y="90" textAnchor="middle" fill="#1e293b" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              SKIRT BACK (1)
            </text>
            <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              A-Line Flared • 0.46m
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
