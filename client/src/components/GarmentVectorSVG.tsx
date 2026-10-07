import React, { useState, useRef, useCallback } from 'react';
import { useCADStore } from '../store/useCADStore';
import { calculateGarmentBounds, pathCommandsToSvgString } from '@shared/gradingEngine';
import { PatternComponent, Point2D, TukacadTool } from '@shared/types';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  X,
  Plus,
  Scissors,
  Check,
} from 'lucide-react';

interface GarmentVectorSVGProps {
  onPointClick?: (pt: Point2D) => void;
}

export const GarmentVectorSVG: React.FC<GarmentVectorSVGProps> = ({ onPointClick }) => {
  const {
    garment,
    selectedComponentId,
    activeTool,
    moveEntireGarment,
    moveComponent,
    updatePointPosition,
    addPointToComponent,
    addInternalLine,
    addInternalContour,
    addNotchToComponent,
    addLabelToComponent,
    mirrorComponent,
    rotateComponent,
    offsetComponentContour,
    filletCornerPoint,
    trimNearestInternalOrNotch,
    breakSegmentAtPoint,
    joinEndpoints,
    duplicateComponent,
    removeComponent,
    setSelectedComponent,
    selectEntireGarment,
    handleMeasureClick,
    cadTheme,
    showSeamAllowance,
    showInternals,
    showGrainlines,
    showNotches,
    showPointLabels,
    tukacadTool,
    setTukacadTool,
    zoom,
    panOffset,
    cursorPos,
    setNotification,
  } = useCADStore();

  // Drag states
  const [isDraggingGarment, setIsDraggingGarment] = useState(false);
  const [dragGarmentStart, setDragGarmentStart] = useState<{ x: number; y: number } | null>(null);

  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragCompStart, setDragCompStart] = useState<{ x: number; y: number } | null>(null);

  const [draggedPoint, setDraggedPoint] = useState<{
    componentId: string;
    cmdIdx: number;
    ptIdx: number;
    origX: number;
    origY: number;
    mouseStartX: number;
    mouseStartY: number;
  } | null>(null);

  // Drawing tool state
  const [drawStartPt, setDrawStartPt] = useState<Point2D | null>(null);
  const [hoveredPointInfo, setHoveredPointInfo] = useState<string | null>(null);

  const bounds = calculateGarmentBounds(garment);
  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;
  const isTukaDark = cadTheme === 'tukacad-black';
  const isBlueprint = cadTheme === 'blueprint-light';

  const primaryStroke = isTukaDark ? '#00ff44' : isBlueprint ? '#1d4ed8' : '#2563eb';
  const selectedStroke = isTukaDark ? '#f97316' : '#2563eb';

  // Find active component if any
  const activeComponent =
    !isEntireSelected && selectedComponentId
      ? garment.components.find((c) => c.id === selectedComponentId)
      : null;

  // Convert mouse event to local piece coordinate
  const getPieceLocalCoords = (e: React.MouseEvent, comp: PatternComponent): Point2D => {
    const compWorldX = garment.position.x + comp.offset.x;
    const compWorldY = garment.position.y + comp.offset.y;

    // Use current world cursor pos (in mm)
    const localX = cursorPos.x - compWorldX;
    const localY = cursorPos.y - compWorldY;
    return { x: Math.round(localX), y: Math.round(localY) };
  };

  // Garment (1-Object) Drag Handlers
  const handleGarmentMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select' && isEntireSelected) {
      e.stopPropagation();
      setIsDraggingGarment(true);
      setDragGarmentStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Individual Component Drag Handlers
  const handleComponentMouseDown = (e: React.MouseEvent, component: PatternComponent) => {
    e.stopPropagation();

    // If an interactive drawing tool is active, handle drawing tool click instead
    if (tukacadTool && tukacadTool !== 'point' && handleToolClick(e, component)) {
      return;
    }

    if (activeTool === 'select') {
      setSelectedComponent(component.id);
      setDraggedCompId(component.id);
      setDragCompStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Point Drag Handler
  const handlePointMouseDown = (
    e: React.MouseEvent,
    componentId: string,
    cmdIdx: number,
    ptIdx: number,
    pt: Point2D
  ) => {
    e.stopPropagation();

    // If Fillet tool is active, clicking rounds this corner
    if (tukacadTool === 'fillet') {
      filletCornerPoint(componentId, cmdIdx, ptIdx, 15);
      return;
    }

    if (activeTool === 'select' || tukacadTool === 'point') {
      setDraggedPoint({
        componentId,
        cmdIdx,
        ptIdx,
        origX: pt.x,
        origY: pt.y,
        mouseStartX: e.clientX,
        mouseStartY: e.clientY,
      });
    }
  };

  // Global SVG Mouse Move for Dragging
  const handleRootMouseMove = (e: React.MouseEvent) => {
    // 1. Point Dragging
    if (draggedPoint) {
      const dx = (e.clientX - draggedPoint.mouseStartX) / zoom;
      const dy = (e.clientY - draggedPoint.mouseStartY) / zoom;
      const nextX = Math.round(draggedPoint.origX + dx);
      const nextY = Math.round(draggedPoint.origY + dy);
      updatePointPosition(draggedPoint.componentId, draggedPoint.cmdIdx, draggedPoint.ptIdx, nextX, nextY, false);
      return;
    }

    // 2. Individual Component Dragging
    if (draggedCompId && dragCompStart) {
      const dx = (e.clientX - dragCompStart.x) / zoom;
      const dy = (e.clientY - dragCompStart.y) / zoom;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        moveComponent(draggedCompId, dx, dy, false);
        setDragCompStart({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    // 3. Entire Garment Dragging
    if (isDraggingGarment && dragGarmentStart) {
      const dx = (e.clientX - dragGarmentStart.x) / zoom;
      const dy = (e.clientY - dragGarmentStart.y) / zoom;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        moveEntireGarment(dx, dy);
        setDragGarmentStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  // Global Mouse Up
  const handleRootMouseUp = () => {
    if (draggedPoint) {
      // Commit final position to history
      const { componentId, cmdIdx, ptIdx } = draggedPoint;
      const comp = garment.components.find((c) => c.id === componentId);
      const pt = comp?.paths[cmdIdx]?.points[ptIdx];
      if (pt) {
        updatePointPosition(componentId, cmdIdx, ptIdx, pt.x, pt.y, true);
      }
      setDraggedPoint(null);
    }

    if (draggedCompId) {
      // Save move to undo history
      moveComponent(draggedCompId, 0, 0, true);
      setDraggedCompId(null);
      setDragCompStart(null);
    }

    if (isDraggingGarment) {
      setIsDraggingGarment(false);
      setDragGarmentStart(null);
    }
  };

  // Interactive 16-Tool Click Logic
  const handleToolClick = (e: React.MouseEvent, component: PatternComponent): boolean => {
    const local = getPieceLocalCoords(e, component);

    switch (tukacadTool) {
      case 'point': {
        addPointToComponent(component.id, local);
        return true;
      }
      case 'line': {
        if (!drawStartPt) {
          setDrawStartPt(local);
          setNotification(`Line Start set at (${local.x}, ${local.y}). Click second point to complete.`);
        } else {
          addInternalLine(component.id, drawStartPt, local);
          setDrawStartPt(null);
        }
        return true;
      }
      case 'rectangle': {
        if (!drawStartPt) {
          setDrawStartPt(local);
          setNotification(`Corner 1 set at (${local.x}, ${local.y}). Click opposite corner.`);
        } else {
          const p1 = drawStartPt;
          const p2 = local;
          addInternalContour(component.id, {
            id: `pocket-${Date.now()}`,
            name: 'Pocket / Welt Box',
            type: 'pocket',
            closed: true,
            color: '#facc15',
            points: [
              { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) },
              { x: Math.max(p1.x, p2.x), y: Math.min(p1.y, p2.y) },
              { x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) },
              { x: Math.min(p1.x, p2.x), y: Math.max(p1.y, p2.y) },
            ],
          });
          setDrawStartPt(null);
        }
        return true;
      }
      case 'circle': {
        const radius = 12;
        addInternalContour(component.id, {
          id: `drill-${Date.now()}`,
          name: 'Drill Hole / Button Mark',
          type: 'pocket',
          closed: true,
          color: '#38bdf8',
          points: [
            { x: local.x, y: local.y - radius },
            { x: local.x + radius, y: local.y },
            { x: local.x, y: local.y + radius },
            { x: local.x - radius, y: local.y },
          ],
        });
        return true;
      }
      case 'curve':
      case 'spline': {
        if (!drawStartPt) {
          setDrawStartPt(local);
          setNotification(`Curve origin set at (${local.x}, ${local.y}). Click end point.`);
        } else {
          const midX = (drawStartPt.x + local.x) / 2;
          const midY = (drawStartPt.y + local.y) / 2 - 25;
          addInternalContour(component.id, {
            id: `curve-${Date.now()}`,
            name: 'Style Curve',
            type: 'line',
            color: '#38bdf8',
            points: [drawStartPt, { x: midX, y: midY }, local],
          });
          setDrawStartPt(null);
        }
        return true;
      }
      case 'arc': {
        if (!drawStartPt) {
          setDrawStartPt(local);
          setNotification(`Arc start at (${local.x}, ${local.y}). Click arc endpoint.`);
        } else {
          const arcP1 = drawStartPt;
          const arcP2 = local;
          const arcMid = { x: (arcP1.x + arcP2.x) / 2, y: (arcP1.y + arcP2.y) / 2 + 30 };
          addInternalContour(component.id, {
            id: `arc-${Date.now()}`,
            name: 'Contour Arc',
            type: 'line',
            color: '#38bdf8',
            points: [arcP1, arcMid, arcP2],
          });
          setDrawStartPt(null);
        }
        return true;
      }
      case 'mirror': {
        mirrorComponent(component.id, 'x');
        return true;
      }
      case 'rotate': {
        rotateComponent(component.id, 45);
        return true;
      }
      case 'offset': {
        offsetComponentContour(component.id, 5);
        return true;
      }
      case 'trim': {
        trimNearestInternalOrNotch(component.id, local);
        return true;
      }
      case 'break': {
        breakSegmentAtPoint(component.id, local);
        return true;
      }
      case 'join': {
        joinEndpoints(component.id);
        return true;
      }
      case 'text': {
        addLabelToComponent(component.id, 'GRAINLINE ↑ SIZE M', local);
        return true;
      }
      default:
        return false;
    }
  };

  return (
    <g
      id="garment-vector-root"
      onMouseMove={handleRootMouseMove}
      onMouseUp={handleRootMouseUp}
      className={
        isDraggingGarment || draggedCompId || draggedPoint
          ? 'cursor-grabbing'
          : tukacadTool === 'point'
          ? 'cursor-crosshair'
          : tukacadTool === 'line' || tukacadTool === 'rectangle'
          ? 'cursor-crosshair'
          : 'cursor-default'
      }
    >
      {/* ================= ONE-OBJECT BOUNDING BOX ================= */}
      {isEntireSelected && (
        <g
          id="garment-one-object-bounds-group"
          className="cursor-move"
          onMouseDown={handleGarmentMouseDown}
        >
          {/* Main Bounding Box */}
          <rect
            x={bounds.minX}
            y={bounds.minY}
            width={bounds.width}
            height={bounds.height}
            fill={isTukaDark ? 'rgba(249, 115, 22, 0.03)' : 'rgba(37, 99, 235, 0.02)'}
            stroke={isTukaDark ? '#f97316' : '#2563eb'}
            strokeWidth="1.2"
            strokeDasharray="6 4"
            rx="4"
          />

          {/* Top Bounding Badge */}
          <g transform={`translate(${bounds.minX + 8}, ${bounds.minY - 24})`}>
            <rect width="420" height="20" fill={isTukaDark ? '#f97316' : '#2563eb'} rx="3" />
            <text
              x="10"
              y="14"
              fill="#ffffff"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ◆ ENTIRE GARMENT: {garment.name.toUpperCase()} (1-OBJECT PARAMETRIC GROUP)
            </text>
          </g>

          {/* Corner and Edge Transform Handles */}
          {[
            { x: bounds.minX, y: bounds.minY },
            { x: bounds.maxX, y: bounds.minY },
            { x: bounds.minX, y: bounds.maxY },
            { x: bounds.maxX, y: bounds.maxY },
            { x: bounds.minX, y: (bounds.minY + bounds.maxY) / 2 },
            { x: bounds.maxX, y: (bounds.minY + bounds.maxY) / 2 },
            { x: (bounds.minX + bounds.maxX) / 2, y: bounds.minY },
            { x: (bounds.minX + bounds.maxX) / 2, y: bounds.maxY },
          ].map((handle, idx) => (
            <rect
              key={idx}
              x={handle.x - 3.5}
              y={handle.y - 3.5}
              width="7"
              height="7"
              fill={isTukaDark ? '#f97316' : '#ffffff'}
              stroke={isTukaDark ? '#ffffff' : '#2563eb'}
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {/* TUKAcad Centerline Crosshairs (Dashed axis through pattern) */}
      <g
        id="tuka-cad-crosshairs"
        stroke={isTukaDark ? '#ffffff' : '#64748b'}
        strokeDasharray="6 4"
        strokeWidth="0.9"
        opacity={isTukaDark ? 0.75 : 0.4}
      >
        <line
          x1={bounds.minX - 50}
          y1={bounds.minY + bounds.height * 0.42}
          x2={bounds.maxX + 50}
          y2={bounds.minY + bounds.height * 0.42}
        />
        <line
          x1={bounds.minX + bounds.width * 0.48}
          y1={bounds.minY - 50}
          x2={bounds.minX + bounds.width * 0.48}
          y2={bounds.maxY + 50}
        />
      </g>

      {/* Guide lines connecting pieces across horizontal levels */}
      <g
        id="horizontal-cad-guides"
        stroke={isTukaDark ? '#475569' : '#94a3b8'}
        strokeDasharray="3 3"
        strokeWidth="0.8"
        opacity="0.6"
      >
        <line
          x1={bounds.minX + 30}
          y1={garment.position.y + 80 + 270}
          x2={bounds.maxX - 30}
          y2={garment.position.y + 80 + 270}
        />
        <line
          x1={bounds.minX + 30}
          y1={garment.position.y + 80 + 440}
          x2={bounds.maxX - 30}
          y2={garment.position.y + 80 + 440}
        />
      </g>

      {/* ================= GARMENT COMPONENTS ================= */}
      {garment.components.map((component: PatternComponent) => {
        const compX = garment.position.x + component.offset.x;
        const compY = garment.position.y + component.offset.y;
        const pathData = pathCommandsToSvgString(component.paths);
        const isSelected = selectedComponentId === component.id;

        return (
          <g
            key={component.id}
            id={`component-${component.id}`}
            transform={`translate(${compX}, ${compY})`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
            className="cursor-pointer"
          >
            {/* Seam Allowance (SA) Offset Outline */}
            {showSeamAllowance && (
              <path
                d={pathData}
                fill="none"
                stroke={isTukaDark ? '#ffffff' : '#60a5fa'}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.88"
              />
            )}

            {/* Main Pattern Geometry Path */}
            <path
              d={pathData}
              fill={
                isSelected
                  ? isTukaDark
                    ? 'rgba(249, 115, 22, 0.12)'
                    : 'rgba(37, 99, 235, 0.05)'
                  : isTukaDark
                  ? 'rgba(0, 0, 0, 0.6)'
                  : '#ffffff'
              }
              stroke={isSelected ? selectedStroke : primaryStroke}
              strokeWidth={isSelected ? '2.5' : '1.8'}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-colors"
            />

            {/* Selected Component Highlighting Bounding Outline */}
            {isSelected && (
              <rect
                x="-12"
                y="-12"
                width="280"
                height="480"
                fill="none"
                stroke={isTukaDark ? '#f97316' : '#2563eb'}
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.5"
                rx="3"
              />
            )}

            {/* Internal Contours, Darts & Pocket Placements */}
            {showInternals &&
              component.internals?.map((internal) => {
                if (internal.type === 'graphic' && internal.graphicSvg === 'butterfly') {
                  const p0 = internal.points[0];
                  const p2 = internal.points[2] || { x: p0.x + 120, y: p0.y + 95 };
                  const w = p2.x - p0.x;
                  const h = p2.y - p0.y;

                  return (
                    <g key={internal.id} transform={`translate(${p0.x}, ${p0.y})`}>
                      <rect
                        width={w}
                        height={h}
                        fill="rgba(255, 255, 255, 0.95)"
                        stroke="#3b82f6"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                        rx="2"
                      />
                      <g transform="translate(14, 10) scale(0.9)">
                        <path d="M50 30 Q50 80 50 85 M48 25 Q50 30 52 25" stroke="#1d4ed8" strokeWidth="2.8" fill="none" />
                        <path d="M50 35 C35 15 10 20 15 45 C18 60 40 60 50 55" stroke="#2563eb" strokeWidth="2" fill="rgba(37,99,235,0.15)" />
                        <path d="M50 35 C65 15 90 20 85 45 C82 60 60 60 50 55" stroke="#2563eb" strokeWidth="2" fill="rgba(37,99,235,0.15)" />
                        <path d="M50 55 C38 58 20 65 25 80 C29 90 45 80 50 68" stroke="#1d4ed8" strokeWidth="2" fill="rgba(37,99,235,0.1)" />
                        <path d="M50 55 C62 58 80 65 75 80 C71 90 55 80 50 68" stroke="#1d4ed8" strokeWidth="2" fill="rgba(37,99,235,0.1)" />
                        <circle cx="50" cy="30" r="3" fill="#1d4ed8" />
                      </g>
                    </g>
                  );
                }

                // Normal internal lines, darts, pockets
                const ptsString = internal.points.map((p) => `${p.x},${p.y}`).join(' ');
                return (
                  <g key={internal.id}>
                    {internal.points.length === 2 ? (
                      <line
                        x1={internal.points[0].x}
                        y1={internal.points[0].y}
                        x2={internal.points[1].x}
                        y2={internal.points[1].y}
                        stroke={internal.color || '#facc15'}
                        strokeWidth="1.8"
                        strokeDasharray="4 2"
                      />
                    ) : (
                      <polygon
                        points={ptsString}
                        fill={internal.closed ? 'rgba(250, 204, 21, 0.08)' : 'none'}
                        stroke={internal.color || '#facc15'}
                        strokeWidth="1.8"
                      />
                    )}
                    {internal.points.map((pt, pIdx) => (
                      <circle
                        key={pIdx}
                        cx={pt.x}
                        cy={pt.y}
                        r="3"
                        fill={internal.color || '#facc15'}
                        stroke="#000000"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                );
              })}

            {/* Grainline */}
            {showGrainlines && component.grainline && (
              <g className="select-none">
                <line
                  x1={component.grainline.start.x}
                  y1={component.grainline.start.y}
                  x2={component.grainline.end.x}
                  y2={component.grainline.end.y}
                  stroke={isTukaDark ? '#00ff44' : '#334155'}
                  strokeWidth="1.4"
                  strokeDasharray={isTukaDark ? 'none' : '8 4'}
                />
                <polygon
                  points={`${component.grainline.end.x},${component.grainline.end.y} ${component.grainline.end.x - 12},${component.grainline.end.y - 5} ${component.grainline.end.x - 12},${component.grainline.end.y + 5}`}
                  fill={isTukaDark ? '#00ff44' : '#334155'}
                />
                <text
                  x={component.grainline.start.x + 10}
                  y={(component.grainline.start.y + component.grainline.end.y) / 2}
                  fill={isTukaDark ? '#00ff44' : '#475569'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {component.grainline.label}
                </text>
              </g>
            )}

            {/* Notches */}
            {showNotches &&
              component.notches.map((notch, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tukacadTool === 'trim') {
                      trimNearestInternalOrNotch(component.id, notch);
                    } else {
                      handleMeasureClick({ x: compX + notch.x, y: compY + notch.y });
                    }
                  }}
                >
                  <line
                    x1={notch.x - 4}
                    y1={notch.y - 4}
                    x2={notch.x + 4}
                    y2={notch.y + 4}
                    stroke="#ef4444"
                    strokeWidth="2.2"
                  />
                  <circle cx={notch.x} cy={notch.y} r="2" fill="#ef4444" />
                </g>
              ))}

            {/* Control & Anchor Points - Interactive Dragging & Editing */}
            {component.paths.map((cmd, cmdIdx) =>
              cmd.points.map((pt, ptIdx) => {
                const isPointHovered = hoveredPointInfo === `${component.id}-${cmdIdx}-${ptIdx}`;

                if (pt.isControl) {
                  return (
                    <circle
                      key={`ctrl-${cmdIdx}-${ptIdx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke={isTukaDark ? '#facc15' : '#f97316'}
                      strokeWidth="1.5"
                      className="cursor-move hover:scale-150 transition-transform"
                      onMouseDown={(e) => handlePointMouseDown(e, component.id, cmdIdx, ptIdx, pt)}
                      onMouseEnter={() => setHoveredPointInfo(`${component.id}-${cmdIdx}-${ptIdx}`)}
                      onMouseLeave={() => setHoveredPointInfo(null)}
                    >
                      <title>{`Control Point (${pt.x}, ${pt.y})`}</title>
                    </circle>
                  );
                }

                // Regular Anchor / Grading Point
                return (
                  <g
                    key={`pt-${cmdIdx}-${ptIdx}`}
                    className="cursor-move"
                    onMouseDown={(e) => handlePointMouseDown(e, component.id, cmdIdx, ptIdx, pt)}
                    onMouseEnter={() => setHoveredPointInfo(`${component.id}-${cmdIdx}-${ptIdx}`)}
                    onMouseLeave={() => setHoveredPointInfo(null)}
                  >
                    {isTukaDark ? (
                      <rect
                        x={pt.x - 3.2}
                        y={pt.y - 3.2}
                        width="6.4"
                        height="6.4"
                        fill={
                          isSelected
                            ? isPointHovered
                              ? '#facc15'
                              : '#f97316'
                            : cmdIdx % 2 === 0
                            ? '#00ff44'
                            : '#ffffff'
                        }
                        stroke="#000000"
                        strokeWidth="1"
                        className="hover:scale-150 transition-transform"
                      />
                    ) : (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isPointHovered ? '4.5' : '3.5'}
                        fill={isSelected ? '#2563eb' : '#ffffff'}
                        stroke="#1e293b"
                        strokeWidth="1.5"
                        className="hover:scale-125 transition-transform"
                      />
                    )}

                    {/* Point Coordinate Tooltip when Hovered */}
                    {isPointHovered && (
                      <g transform={`translate(${pt.x + 8}, ${pt.y - 12})`}>
                        <rect
                          width="90"
                          height="16"
                          fill="rgba(0,0,0,0.85)"
                          stroke="#facc15"
                          strokeWidth="0.8"
                          rx="2"
                        />
                        <text
                          x="5"
                          y="11"
                          fill="#ffffff"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          X:{pt.x} Y:{pt.y}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })
            )}

            {/* Text Annotations & Labels */}
            {showPointLabels &&
              component.labels.map((lbl, idx) => {
                const isTitle = lbl.type === 'title';
                const isGuide = lbl.type === 'guide';
                return (
                  <text
                    key={idx}
                    x={lbl.position.x}
                    y={lbl.position.y}
                    fill={
                      isTukaDark
                        ? isTitle
                          ? '#ffffff'
                          : isGuide
                          ? '#38bdf8'
                          : '#94a3b8'
                        : isTitle
                        ? '#0f172a'
                        : isGuide
                        ? '#2563eb'
                        : '#64748b'
                    }
                    fontSize={isTitle ? '14' : isGuide ? '9' : '10'}
                    fontFamily="monospace"
                    fontWeight={isTitle ? 'bold' : isGuide ? '600' : 'normal'}
                  >
                    {lbl.text}
                  </text>
                );
              })}

            {/* Live Drawing Preview Segment when drawing line or rectangle */}
            {drawStartPt && isSelected && (
              <g id="live-draw-preview">
                <line
                  x1={drawStartPt.x}
                  y1={drawStartPt.y}
                  x2={getPieceLocalCoords({} as any, component).x}
                  y2={getPieceLocalCoords({} as any, component).y}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx={drawStartPt.x} cy={drawStartPt.y} r="4" fill="#38bdf8" />
              </g>
            )}

            {/* ================= FLOATING QUICK EDIT HUD OVER SELECTED PIECE ================= */}
            {isSelected && (
              <g
                id="selected-piece-floating-toolbar"
                transform="translate(0, -38)"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background pill */}
                <rect
                  width="280"
                  height="26"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={isTukaDark ? '#f97316' : '#2563eb'}
                  strokeWidth="1.2"
                  rx="5"
                />

                {/* Piece Code Badge */}
                <text
                  x="8"
                  y="17"
                  fill="#facc15"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {component.pieceCode || component.name}
                </text>

                {/* Quick Action: Rotate +45° */}
                <g
                  transform="translate(85, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => rotateComponent(component.id, 45)}
                >
                  <rect width="26" height="18" fill="#1e293b" rx="3" />
                  <text x="5" y="13" fill="#ffffff" fontSize="10" fontFamily="sans-serif">
                    ↺45°
                  </text>
                </g>

                {/* Quick Action: Mirror Horiz */}
                <g
                  transform="translate(116, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => mirrorComponent(component.id, 'x')}
                >
                  <rect width="24" height="18" fill="#1e293b" rx="3" />
                  <text x="4" y="13" fill="#38bdf8" fontSize="10" fontFamily="sans-serif">
                    ⇄
                  </text>
                </g>

                {/* Quick Action: Mirror Vert */}
                <g
                  transform="translate(144, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => mirrorComponent(component.id, 'y')}
                >
                  <rect width="24" height="18" fill="#1e293b" rx="3" />
                  <text x="5" y="13" fill="#38bdf8" fontSize="10" fontFamily="sans-serif">
                    ⇅
                  </text>
                </g>

                {/* Quick Action: Offset +5mm SA */}
                <g
                  transform="translate(172, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => offsetComponentContour(component.id, 5)}
                >
                  <rect width="26" height="18" fill="#1e293b" rx="3" />
                  <text x="4" y="13" fill="#4ade80" fontSize="9" fontFamily="monospace">
                    +5SA
                  </text>
                </g>

                {/* Quick Action: Clone Piece */}
                <g
                  transform="translate(202, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => duplicateComponent(component.id)}
                >
                  <rect width="22" height="18" fill="#1e293b" rx="3" />
                  <text x="4" y="13" fill="#e2e8f0" fontSize="11">
                    ⧉
                  </text>
                </g>

                {/* Quick Action: Delete Piece */}
                <g
                  transform="translate(228, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => removeComponent(component.id)}
                >
                  <rect width="22" height="18" fill="#ef4444" rx="3" />
                  <text x="5" y="13" fill="#ffffff" fontSize="10">
                    ✕
                  </text>
                </g>

                {/* Close / Deselect to Entire Garment */}
                <g
                  transform="translate(254, 4)"
                  className="cursor-pointer hover:opacity-80"
                  onClick={selectEntireGarment}
                >
                  <rect width="20" height="18" fill="#334155" rx="3" />
                  <text x="5" y="13" fill="#ffffff" fontSize="10">
                    ✓
                  </text>
                </g>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
