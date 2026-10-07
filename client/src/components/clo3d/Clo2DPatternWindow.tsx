import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  Link2,
  RotateCw,
  FlipHorizontal,
  Plus,
  Minus,
  Sparkles,
  Scissors,
  Palette,
  Check,
} from 'lucide-react';
import { pathCommandsToSvgString } from '@shared/gradingEngine';

export const Clo2DPatternWindow: React.FC = () => {
  const { language, activeFabric, garment, selectedComponentId, setSelectedComponent, setActiveRightTab } = useCADStore();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [selectedPiece, setSelectedPiece] = useState<string | null>('bodiceFront');
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeSewingMode, setActiveSewingMode] = useState<boolean>(true);

  // Piece Dragging State
  const [pieceOffsets, setPieceOffsets] = useState<Record<string, { x: number; y: number }>>({
    bodiceFront: { x: -160, y: 40 },
    bodiceBack: { x: 160, y: 40 },
    skirtFront: { x: -160, y: 310 },
    skirtBack: { x: 160, y: 310 },
  });

  const [draggedPiece, setDraggedPiece] = useState<{
    id: string;
    mouseStartX: number;
    mouseStartY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Piece Transformations (Rotations & Scales)
  const [pieceRotations, setPieceRotations] = useState<Record<string, number>>({});
  const [pieceScales, setPieceScales] = useState<Record<string, number>>({});
  const [pieceSA, setPieceSA] = useState<Record<string, number>>({});

  // Dart Dragging State
  const [dartOffsets, setDartOffsets] = useState<Record<string, { x: number; y: number }>>({
    'bodiceFront-d1': { x: 25, y: 160 },
    'bodiceFront-d2': { x: -25, y: 160 },
    'bodiceBack-d1': { x: 25, y: 155 },
    'bodiceBack-d2': { x: -25, y: 155 },
  });

  const [draggedDart, setDraggedDart] = useState<{
    key: string;
    mouseStartX: number;
    mouseStartY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Active Seams State (Allows clicking to toggle individual seams)
  const [activeSeamLinks, setActiveSeamLinks] = useState<Record<string, boolean>>({
    shoulder: true,
    bodiceSide: true,
    skirtSide: true,
    waistJoinLeft: true,
    waistJoinRight: true,
  });

  // Pan Handlers
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
      return;
    }

    if (draggedDart) {
      const dx = (e.clientX - draggedDart.mouseStartX) / zoom;
      const dy = (e.clientY - draggedDart.mouseStartY) / zoom;
      setDartOffsets((prev) => ({
        ...prev,
        [draggedDart.key]: {
          x: Math.round(draggedDart.origX + dx),
          y: Math.round(draggedDart.origY + dy),
        },
      }));
      return;
    }

    if (draggedPiece) {
      const dx = (e.clientX - draggedPiece.mouseStartX) / zoom;
      const dy = (e.clientY - draggedPiece.mouseStartY) / zoom;
      setPieceOffsets((prev) => ({
        ...prev,
        [draggedPiece.id]: {
          x: Math.round(draggedPiece.initialX + dx),
          y: Math.round(draggedPiece.initialY + dy),
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedPiece(null);
    setDraggedDart(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(2.5, Math.max(0.4, z * zoomFactor)));
  };

  // Start Dragging a Piece
  const startPieceDrag = (e: React.MouseEvent, pieceId: string) => {
    if (e.button !== 0) return; // Only left click drags
    e.stopPropagation();
    setSelectedPiece(pieceId);
    const currentOffset = pieceOffsets[pieceId] || { x: 0, y: 0 };
    setDraggedPiece({
      id: pieceId,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      initialX: currentOffset.x,
      initialY: currentOffset.y,
    });
  };

  // Start Dragging a Dart Node
  const startDartDrag = (e: React.MouseEvent, dartKey: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const currentPos = dartOffsets[dartKey] || { x: 0, y: 0 };
    setDraggedDart({
      key: dartKey,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
    });
  };

  // Rotate Piece Quick Action
  const rotatePiece = (pieceId: string, deltaDeg = 45) => {
    setPieceRotations((prev) => ({
      ...prev,
      [pieceId]: ((prev[pieceId] || 0) + deltaDeg) % 360,
    }));
  };

  // Scale Piece Quick Action
  const scalePiece = (pieceId: string, delta = 0.05) => {
    setPieceScales((prev) => ({
      ...prev,
      [pieceId]: Math.max(0.5, Math.min(2.0, (prev[pieceId] || 1.0) + delta)),
    }));
  };

  // Seam Allowance Quick Action
  const adjustPieceSA = (pieceId: string, deltaMm = 5) => {
    setPieceSA((prev) => ({
      ...prev,
      [pieceId]: Math.max(0, (prev[pieceId] || 10) + deltaMm),
    }));
  };

  // Toggle Seam Link
  const toggleSeam = (seamId: string) => {
    setActiveSeamLinks((prev) => ({
      ...prev,
      [seamId]: !prev[seamId],
    }));
  };

  // Determine if we should display the standard 4 academic pieces (Bodice & Skirt)
  const isBodiceAndSkirt =
    garment.name.toLowerCase().includes('bodice') ||
    garment.name.toLowerCase().includes('skirt') ||
    garment.components.length === 2;

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
        <span className="font-mono text-xs text-[#1e293b] bg-white/80 backdrop-blur-md px-2.5 py-1 rounded shadow-xs font-semibold">
          {t('patternWindow')}
        </span>
        <span className="text-[10px] bg-sky-500/15 text-sky-800 px-2 py-0.5 rounded border border-sky-300 font-mono font-bold">
          {activeSewingMode ? 'Seam Sewing Active (6 Links)' : 'Pattern Transform Mode'}
        </span>
      </div>

      {/* 2. Top Right Quick 2D Tools */}
      <div className="absolute top-2.5 right-3 flex items-center gap-1 z-20 bg-white/90 backdrop-blur-md p-1 rounded border border-slate-300 shadow-xs">
        <button
          onClick={() => setActiveSewingMode(!activeSewingMode)}
          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
            activeSewingMode ? 'bg-[#00a8ff] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
          }`}
          title="Toggle Seam Sewing Connections"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{t('seamLinks')}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        <button
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
          className="p-1 rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
          className="p-1 rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1 rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
          title="Reset 2D View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Infinite Grid Canvas SVG */}
      <svg
        className={`w-full h-full ${draggedPiece || isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
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
          {/* A. Ghost Silhouette of Avatar Backdrop */}
          <g opacity="0.16" transform="translate(0, -30)">
            <ellipse cx="0" cy="40" rx="36" ry="46" fill="#475569" />
            <rect x="-14" y="80" width="28" height="34" rx="10" fill="#475569" />
            <path
              d="M-80 114 C -60 110, 60 110, 80 114 L 64 260 C 40 280, -40 280, -64 260 Z"
              fill="#475569"
            />
            <path
              d="M-55 260 L -45 520 L -30 520 L -25 260 Z M 25 260 L 30 520 L 45 520 L 55 260 Z"
              fill="#475569"
            />
          </g>

          {/* B. Cyan Seam Sewing Link Lines */}
          {activeSewingMode && (
            <g stroke="#00b4d8" strokeWidth="2.5" strokeDasharray="5,4" opacity="0.95">
              {activeSeamLinks.shoulder && (
                <line
                  x1={pieceOffsets.bodiceFront.x + 40}
                  y1={pieceOffsets.bodiceFront.y + 80}
                  x2={pieceOffsets.bodiceBack.x - 40}
                  y2={pieceOffsets.bodiceBack.y + 80}
                  className="cursor-pointer hover:stroke-rose-500"
                  onClick={() => toggleSeam('shoulder')}
                />
              )}
              {activeSeamLinks.bodiceSide && (
                <line
                  x1={pieceOffsets.bodiceFront.x + 90}
                  y1={pieceOffsets.bodiceFront.y + 170}
                  x2={pieceOffsets.bodiceBack.x - 90}
                  y2={pieceOffsets.bodiceBack.y + 170}
                  className="cursor-pointer hover:stroke-rose-500"
                  onClick={() => toggleSeam('bodiceSide')}
                />
              )}
              {activeSeamLinks.skirtSide && (
                <line
                  x1={pieceOffsets.skirtFront.x + 145}
                  y1={pieceOffsets.skirtFront.y + 70}
                  x2={pieceOffsets.skirtBack.x - 145}
                  y2={pieceOffsets.skirtBack.y + 70}
                  className="cursor-pointer hover:stroke-rose-500"
                  onClick={() => toggleSeam('skirtSide')}
                />
              )}
              {activeSeamLinks.waistJoinLeft && (
                <line
                  x1={pieceOffsets.bodiceFront.x + 60}
                  y1={pieceOffsets.bodiceFront.y + 220}
                  x2={pieceOffsets.skirtFront.x + 60}
                  y2={pieceOffsets.skirtFront.y}
                  stroke="#38bdf8"
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-rose-500"
                  onClick={() => toggleSeam('waistJoinLeft')}
                />
              )}
              {activeSeamLinks.waistJoinRight && (
                <line
                  x1={pieceOffsets.bodiceBack.x - 60}
                  y1={pieceOffsets.bodiceBack.y + 220}
                  x2={pieceOffsets.skirtBack.x - 60}
                  y2={pieceOffsets.skirtBack.y}
                  stroke="#38bdf8"
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-rose-500"
                  onClick={() => toggleSeam('waistJoinRight')}
                />
              )}
            </g>
          )}

          {/* C. Pattern Piece 1: Bodice Front */}
          <g
            id="bodice-front"
            transform={`translate(${pieceOffsets.bodiceFront.x}, ${pieceOffsets.bodiceFront.y}) rotate(${
              pieceRotations.bodiceFront || 0
            }) scale(${pieceScales.bodiceFront || 1.0})`}
            className="cursor-grab active:cursor-grabbing transition-opacity hover:opacity-95"
            onMouseDown={(e) => startPieceDrag(e, 'bodiceFront')}
          >
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
            {/* Waist Dart Seam Indentations with Interactive Dragging */}
            <line
              x1={dartOffsets['bodiceFront-d1'].x}
              y1={dartOffsets['bodiceFront-d1'].y}
              x2="25"
              y2="220"
              stroke="#00a8ff"
              strokeWidth="1.8"
              strokeDasharray="3,3"
            />
            <line
              x1={dartOffsets['bodiceFront-d2'].x}
              y1={dartOffsets['bodiceFront-d2'].y}
              x2="-25"
              y2="220"
              stroke="#00a8ff"
              strokeWidth="1.8"
              strokeDasharray="3,3"
            />

            {/* Draggable Dart Apex Nodes */}
            <circle
              cx={dartOffsets['bodiceFront-d1'].x}
              cy={dartOffsets['bodiceFront-d1'].y}
              r="4.5"
              fill="#00a8ff"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-move hover:scale-150 transition-transform"
              onMouseDown={(e) => startDartDrag(e, 'bodiceFront-d1')}
            >
              <title>Drag Waist Dart Apex</title>
            </circle>
            <circle
              cx={dartOffsets['bodiceFront-d2'].x}
              cy={dartOffsets['bodiceFront-d2'].y}
              r="4.5"
              fill="#00a8ff"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-move hover:scale-150 transition-transform"
              onMouseDown={(e) => startDartDrag(e, 'bodiceFront-d2')}
            >
              <title>Drag Waist Dart Apex</title>
            </circle>

            {/* Labels */}
            <text x="0" y="145" textAnchor="middle" fill="#1e293b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              BODICE FRONT (1)
            </text>
            <text x="0" y="160" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              {activeFabric.name} • S • SA: {pieceSA.bodiceFront || 10}mm
            </text>

            {/* Floating Mini Toolbar when Selected */}
            {selectedPiece === 'bodiceFront' && (
              <g transform="translate(-60, 45)" onClick={(e) => e.stopPropagation()}>
                <rect width="120" height="22" fill="#1e293b" rx="4" />
                <g className="cursor-pointer" onClick={() => rotatePiece('bodiceFront', 45)}>
                  <text x="8" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold">↺ 45°</text>
                </g>
                <g className="cursor-pointer" onClick={() => scalePiece('bodiceFront', 0.05)}>
                  <text x="45" y="15" fill="#4ade80" fontSize="10" fontWeight="bold">+5%</text>
                </g>
                <g className="cursor-pointer" onClick={() => adjustPieceSA('bodiceFront', 5)}>
                  <text x="80" y="15" fill="#facc15" fontSize="10" fontWeight="bold">+SA</text>
                </g>
              </g>
            )}
          </g>

          {/* D. Pattern Piece 2: Bodice Back */}
          <g
            id="bodice-back"
            transform={`translate(${pieceOffsets.bodiceBack.x}, ${pieceOffsets.bodiceBack.y}) rotate(${
              pieceRotations.bodiceBack || 0
            }) scale(${pieceScales.bodiceBack || 1.0})`}
            className="cursor-grab active:cursor-grabbing transition-opacity hover:opacity-95"
            onMouseDown={(e) => startPieceDrag(e, 'bodiceBack')}
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
            <line
              x1={dartOffsets['bodiceBack-d1'].x}
              y1={dartOffsets['bodiceBack-d1'].y}
              x2="25"
              y2="220"
              stroke="#00a8ff"
              strokeWidth="1.8"
              strokeDasharray="3,3"
            />
            <line
              x1={dartOffsets['bodiceBack-d2'].x}
              y1={dartOffsets['bodiceBack-d2'].y}
              x2="-25"
              y2="220"
              stroke="#00a8ff"
              strokeWidth="1.8"
              strokeDasharray="3,3"
            />
            <circle
              cx={dartOffsets['bodiceBack-d1'].x}
              cy={dartOffsets['bodiceBack-d1'].y}
              r="4.5"
              fill="#00a8ff"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-move hover:scale-150 transition-transform"
              onMouseDown={(e) => startDartDrag(e, 'bodiceBack-d1')}
            />
            <circle
              cx={dartOffsets['bodiceBack-d2'].x}
              cy={dartOffsets['bodiceBack-d2'].y}
              r="4.5"
              fill="#00a8ff"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-move hover:scale-150 transition-transform"
              onMouseDown={(e) => startDartDrag(e, 'bodiceBack-d2')}
            />

            {/* Labels */}
            <text x="0" y="140" textAnchor="middle" fill="#1e293b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              BODICE BACK (1)
            </text>
            <text x="0" y="155" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              {activeFabric.name} • S • SA: {pieceSA.bodiceBack || 10}mm
            </text>

            {selectedPiece === 'bodiceBack' && (
              <g transform="translate(-60, 45)" onClick={(e) => e.stopPropagation()}>
                <rect width="120" height="22" fill="#1e293b" rx="4" />
                <g className="cursor-pointer" onClick={() => rotatePiece('bodiceBack', 45)}>
                  <text x="8" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold">↺ 45°</text>
                </g>
                <g className="cursor-pointer" onClick={() => scalePiece('bodiceBack', 0.05)}>
                  <text x="45" y="15" fill="#4ade80" fontSize="10" fontWeight="bold">+5%</text>
                </g>
                <g className="cursor-pointer" onClick={() => adjustPieceSA('bodiceBack', 5)}>
                  <text x="80" y="15" fill="#facc15" fontSize="10" fontWeight="bold">+SA</text>
                </g>
              </g>
            )}
          </g>

          {/* E. Pattern Piece 3: A-Line Flared Skirt Front */}
          <g
            id="skirt-front"
            transform={`translate(${pieceOffsets.skirtFront.x}, ${pieceOffsets.skirtFront.y}) rotate(${
              pieceRotations.skirtFront || 0
            }) scale(${pieceScales.skirtFront || 1.0})`}
            className="cursor-grab active:cursor-grabbing transition-opacity hover:opacity-95"
            onMouseDown={(e) => startPieceDrag(e, 'skirtFront')}
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
              stroke={selectedPiece === 'skirtFront' ? '#00a8ff' : '#334155'}
              strokeWidth={selectedPiece === 'skirtFront' ? '3' : '1.5'}
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
            />
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

            {selectedPiece === 'skirtFront' && (
              <g transform="translate(-60, -28)" onClick={(e) => e.stopPropagation()}>
                <rect width="120" height="22" fill="#1e293b" rx="4" />
                <g className="cursor-pointer" onClick={() => rotatePiece('skirtFront', 45)}>
                  <text x="8" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold">↺ 45°</text>
                </g>
                <g className="cursor-pointer" onClick={() => scalePiece('skirtFront', 0.05)}>
                  <text x="45" y="15" fill="#4ade80" fontSize="10" fontWeight="bold">+5%</text>
                </g>
                <g className="cursor-pointer" onClick={() => adjustPieceSA('skirtFront', 5)}>
                  <text x="80" y="15" fill="#facc15" fontSize="10" fontWeight="bold">+SA</text>
                </g>
              </g>
            )}
          </g>

          {/* F. Pattern Piece 4: A-Line Flared Skirt Back */}
          <g
            id="skirt-back"
            transform={`translate(${pieceOffsets.skirtBack.x}, ${pieceOffsets.skirtBack.y}) rotate(${
              pieceRotations.skirtBack || 0
            }) scale(${pieceScales.skirtBack || 1.0})`}
            className="cursor-grab active:cursor-grabbing transition-opacity hover:opacity-95"
            onMouseDown={(e) => startPieceDrag(e, 'skirtBack')}
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

            {selectedPiece === 'skirtBack' && (
              <g transform="translate(-60, -28)" onClick={(e) => e.stopPropagation()}>
                <rect width="120" height="22" fill="#1e293b" rx="4" />
                <g className="cursor-pointer" onClick={() => rotatePiece('skirtBack', 45)}>
                  <text x="8" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold">↺ 45°</text>
                </g>
                <g className="cursor-pointer" onClick={() => scalePiece('skirtBack', 0.05)}>
                  <text x="45" y="15" fill="#4ade80" fontSize="10" fontWeight="bold">+5%</text>
                </g>
                <g className="cursor-pointer" onClick={() => adjustPieceSA('skirtBack', 5)}>
                  <text x="80" y="15" fill="#facc15" fontSize="10" fontWeight="bold">+SA</text>
                </g>
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
