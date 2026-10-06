import React from 'react';
import { useCADStore } from '../store/useCADStore';
import { pathCommandsToSvgString } from '@shared/gradingEngine';
import { PatternComponent } from '@shared/types';
import { Layers } from 'lucide-react';

export const PieceShelf: React.FC = () => {
  const {
    garment,
    selectedComponentId,
    setSelectedComponent,
    selectEntireGarment,
    setPanOffset,
    cadTheme,
  } = useCADStore();

  const handlePieceClick = (comp: PatternComponent) => {
    setSelectedComponent(comp.id);
    // Pan to center piece roughly in the view
    setPanOffset({
      x: 180 - comp.offset.x * 0.8,
      y: 120 - comp.offset.y * 0.8,
    });
  };

  const isTukaDark = cadTheme === 'tukacad-black';

  return (
    <aside
      className={`w-18 shrink-0 flex flex-col border-r select-none transition-colors z-20 ${
        isTukaDark
          ? 'bg-[#18181b] border-zinc-800 text-zinc-300'
          : 'bg-slate-100 border-slate-300 text-slate-700'
      }`}
      style={{ minWidth: '72px', maxWidth: '76px' }}
    >
      {/* Shelf Header */}
      <div
        className={`p-1.5 border-b text-center font-bold text-[9px] uppercase tracking-wider ${
          isTukaDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-slate-200 border-slate-300 text-slate-600'
        }`}
      >
        <span>Pieces ({garment.components.length})</span>
      </div>

      {/* "ALL" / Entire Garment Thumbnail Button */}
      <button
        onClick={selectEntireGarment}
        className={`p-1 border-b text-[9px] font-mono flex flex-col items-center justify-center transition-all ${
          selectedComponentId === 'entire' || selectedComponentId === null
            ? isTukaDark
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-blue-600 text-white font-bold'
            : isTukaDark
            ? 'hover:bg-zinc-800 text-zinc-400 border-zinc-800'
            : 'hover:bg-slate-200 text-slate-600 border-slate-300'
        }`}
      >
        <Layers className="w-3.5 h-3.5 mb-0.5" />
        <span className="leading-none text-[8px]">ALL PIECES</span>
      </button>

      {/* Piece Filmstrip List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-1.5 custom-scrollbar">
        {garment.components.map((comp, idx) => {
          const isSelected = selectedComponentId === comp.id;
          const pathData = pathCommandsToSvgString(comp.paths);
          const pieceCode = comp.pieceCode || comp.id.toUpperCase();
          const cutInfo = comp.quantity ? `${idx + 1}. ${comp.quantity}` : `${idx + 1}. 1`;

          return (
            <div
              key={comp.id}
              onClick={() => handlePieceClick(comp)}
              title={`${comp.name} (${comp.cutInstruction})`}
              className={`flex flex-col items-center p-1 rounded cursor-pointer border transition-all ${
                isSelected
                  ? isTukaDark
                    ? 'bg-black border-amber-400 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-blue-600 shadow-md ring-1 ring-blue-500'
                  : isTukaDark
                  ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 text-zinc-300'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-white text-slate-700'
              }`}
            >
              {/* Mini SVG Preview */}
              <div
                className={`w-14 h-12 flex items-center justify-center rounded overflow-hidden p-0.5 mb-1 ${
                  isTukaDark ? 'bg-black/90' : 'bg-slate-200/50'
                }`}
              >
                <svg
                  viewBox="-30 -30 1100 900"
                  className="w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d={pathData}
                    fill={isSelected ? (isTukaDark ? '#f97316' : '#2563eb') : isTukaDark ? '#22c55e' : '#64748b'}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                    stroke={isSelected ? (isTukaDark ? '#fb923c' : '#2563eb') : isTukaDark ? '#22c55e' : '#334155'}
                    strokeWidth="20"
                  />
                  {/* Internal contours mini preview */}
                  {comp.internals && comp.internals.length > 0 && (
                    <polygon
                      points={comp.internals[0].points.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="15"
                    />
                  )}
                </svg>
              </div>

              {/* TUKAcad Piece Code & Cut index */}
              <div className="w-full text-center font-mono leading-tight">
                <span
                  className={`text-[9px] font-bold block truncate ${
                    isSelected
                      ? isTukaDark
                        ? 'text-amber-400'
                        : 'text-blue-600'
                      : isTukaDark
                      ? 'text-zinc-200'
                      : 'text-slate-800'
                  }`}
                >
                  {pieceCode}
                </span>
                <span className="text-[7.5px] text-zinc-400 block font-sans">
                  {cutInfo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
