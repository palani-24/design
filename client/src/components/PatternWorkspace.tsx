import React, { useRef, useState, useCallback } from 'react';
import { useCADStore } from '../store/useCADStore';
import { HorizontalRuler, VerticalRuler } from './Rulers';
import { GarmentVectorSVG } from './GarmentVectorSVG';
import { MeasureOverlay } from './MeasureOverlay';
import {
  Grid,
  Maximize,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Activity,
  Ruler,
} from 'lucide-react';

export const PatternWorkspace: React.FC = () => {
  const {
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    activeTool,
    showGrid,
    toggleGrid,
    showRulers,
    cursorPos,
    setCursorPos,
    handleMeasureClick,
    currentSize,
    targetSize,
    clearMeasure,
  } = useCADStore();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Workspace Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan' || e.button === 1 || e.buttons === 4) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // Handle Mouse Move over Workspace
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }

      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Convert pixel coordinates to world coordinates (in mm)
        const worldX = Math.round((clientX - panOffset.x) / zoom);
        const worldY = Math.round((clientY - panOffset.y) / zoom);

        setCursorPos({ x: worldX, y: worldY });
      }
    },
    [isPanning, panStart, panOffset, zoom, setPanOffset, setCursorPos]
  );

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom((z) => Math.min(3.5, Math.max(0.2, z * zoomFactor)));
    } else {
      // Pan with trackpad
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8,
      }));
    }
  };

  // Click on SVG canvas
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'measure') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - panOffset.x) / zoom;
      const clickY = (e.clientY - rect.top - panOffset.y) / zoom;
      handleMeasureClick({ x: Math.round(clickX), y: Math.round(clickY) });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 select-none relative">
      {/* Horizontal Top Ruler */}
      {showRulers && (
        <div className="flex h-6 w-full shrink-0">
          <div className="w-6 h-6 bg-slate-200 border-r border-b border-slate-300 shrink-0 flex items-center justify-center text-[9px] text-slate-500 font-mono">
            cm
          </div>
          <div className="flex-1 overflow-hidden">
            <HorizontalRuler zoom={zoom} panOffset={panOffset} cursorPos={cursorPos} />
          </div>
        </div>
      )}

      {/* Center Canvas Area with Left Ruler */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Vertical Left Ruler */}
        {showRulers && (
          <div className="w-6 h-full shrink-0 overflow-hidden">
            <VerticalRuler zoom={zoom} panOffset={panOffset} cursorPos={cursorPos} />
          </div>
        )}

        {/* CAD SVG Workspace Container */}
        <div
          ref={workspaceRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 h-full overflow-hidden relative ${
            showGrid ? 'cad-workspace-grid' : 'bg-white'
          } ${activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'measure' ? 'cursor-crosshair' : 'cursor-default'}`}
        >
          {/* Floating Heads-Up Display (HUD) Toolbar */}
          <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs text-white border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-xl text-xs font-mono">
            <span className="text-slate-400 font-bold">{(zoom * 100).toFixed(0)}%</span>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button
              onClick={toggleGrid}
              className={`p-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                showGrid ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle CAD Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              Grid
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            {/* Active Grade HUD Indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 font-bold text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Active Grade: {currentSize} → {targetSize}
              </span>
              <span className="text-slate-500 font-mono">|</span>
              <span className="text-emerald-400 font-mono">dx: +20.0mm dy: +10.0mm</span>
              <span className="text-slate-500 font-mono">|</span>
              <span className="text-amber-300 font-mono">Proportional 1.042x</span>
            </div>

            {activeTool === 'measure' && (
              <>
                <div className="h-4 w-[1px] bg-slate-700 mx-1" />
                <button
                  onClick={clearMeasure}
                  className="px-1.5 py-0.5 bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white rounded text-[10px] transition-colors"
                >
                  Clear Measure
                </button>
              </>
            )}
          </div>

          {/* SVG Vector Drawing Canvas */}
          <svg
            id="pattern-cad-viewport"
            onClick={handleCanvasClick}
            className="w-full h-full block"
            style={{ touchAction: 'none' }}
          >
            <defs>
              <pattern id="cad-small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Transform Group representing Workspace Pan and Zoom */}
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
              <GarmentVectorSVG />
              <MeasureOverlay />
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom CAD Status Bar (Inspired by CAD standard & reference image) */}
      <footer className="h-7 bg-slate-900 border-t border-slate-800 text-slate-400 text-[11px] font-mono px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ready
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300">Mode: Vector SVG (1 Garment = 1 Object)</span>
          <span className="text-slate-700">|</span>
          <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          <span className="text-slate-700">|</span>
          <span>Grid: 10mm {showGrid ? 'ON' : 'OFF'}</span>
          <span className="text-slate-700">|</span>
          <span>Units: cm</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-300">Delta: dX: 0.00mm dY: 0.00mm</span>
          <span className="text-slate-700">|</span>
          <span className="text-blue-400 font-semibold">
            Cursor: X: {cursorPos.x.toFixed(1)}mm Y: {cursorPos.y.toFixed(1)}mm
          </span>
        </div>
      </footer>
    </div>
  );
};
