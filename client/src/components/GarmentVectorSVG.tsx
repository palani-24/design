import React, { useState } from 'react';
import { useCADStore } from '../store/useCADStore';
import { calculateGarmentBounds, pathCommandsToSvgString } from '@shared/gradingEngine';
import { PatternComponent, Point2D } from '@shared/types';

interface GarmentVectorSVGProps {
  onPointClick?: (pt: Point2D) => void;
}

export const GarmentVectorSVG: React.FC<GarmentVectorSVGProps> = ({ onPointClick }) => {
  const {
    garment,
    selectedComponentId,
    activeTool,
    moveEntireGarment,
    setSelectedComponent,
    handleMeasureClick,
    cadTheme,
    showSeamAllowance,
    seamAllowanceWidthMm,
    showInternals,
    showGrainlines,
    showNotches,
    showPointLabels,
  } = useCADStore();

  const [isDraggingGarment, setIsDraggingGarment] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const bounds = calculateGarmentBounds(garment);
  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;
  const isTukaDark = cadTheme === 'tukacad-black';
  const isBlueprint = cadTheme === 'blueprint-light';

  // Garment drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      setIsDraggingGarment(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingGarment && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        moveEntireGarment(dx, dy);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingGarment(false);
    setDragStart(null);
  };

  const primaryStroke = isTukaDark ? '#00ff44' : isBlueprint ? '#1d4ed8' : '#2563eb';
  const selectedStroke = isTukaDark ? '#f97316' : '#2563eb';

  return (
    <g
      id="garment-vector-root"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={isDraggingGarment ? 'cursor-grabbing' : ''}
    >
      {/* ================= ONE-OBJECT BOUNDING BOX ================= */}
      {isEntireSelected && (
        <g
          id="garment-one-object-bounds-group"
          className="cursor-move"
          onMouseDown={handleMouseDown}
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
            <rect
              width="380"
              height="20"
              fill={isTukaDark ? '#f97316' : '#2563eb'}
              rx="3"
            />
            <text
              x="10"
              y="14"
              fill="#ffffff"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ◆ ENTIRE GARMENT: {garment.name.toUpperCase()} (ONE OBJECT GRADING BOUNDS)
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
      <g id="tuka-cad-crosshairs" stroke={isTukaDark ? '#ffffff' : '#64748b'} strokeDasharray="6 4" strokeWidth="0.9" opacity={isTukaDark ? 0.75 : 0.4}>
        {/* Horizontal Crease Axis */}
        <line
          x1={bounds.minX - 50}
          y1={bounds.minY + bounds.height * 0.42}
          x2={bounds.maxX + 50}
          y2={bounds.minY + bounds.height * 0.42}
        />
        {/* Vertical Center Axis */}
        <line
          x1={bounds.minX + bounds.width * 0.48}
          y1={bounds.minY - 50}
          x2={bounds.minX + bounds.width * 0.48}
          y2={bounds.maxY + 50}
        />
      </g>

      {/* Guide lines connecting Front, Back and Sleeve across horizontal levels */}
      <g id="horizontal-cad-guides" stroke={isTukaDark ? '#475569' : '#94a3b8'} strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6">
        {/* Bust Level alignment guide */}
        <line
          x1={bounds.minX + 30}
          y1={garment.position.y + 80 + 270}
          x2={bounds.maxX - 30}
          y2={garment.position.y + 80 + 270}
        />
        {/* Waist Level alignment guide */}
        <line
          x1={bounds.minX + 30}
          y1={garment.position.y + 80 + 440}
          x2={bounds.maxX - 150}
          y2={garment.position.y + 80 + 440}
        />
        {/* Hem Level alignment guide */}
        <line
          x1={bounds.minX + 30}
          y1={garment.position.y + 80 + 660}
          x2={bounds.maxX - 150}
          y2={garment.position.y + 80 + 660}
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
            onClick={(e) => {
              e.stopPropagation();
              if (activeTool === 'select') {
                setSelectedComponent(component.id);
              }
            }}
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
              className="transition-colors cursor-pointer"
            />

            {/* Internal Contours & Pocket Placements (TUKAcad Signature) */}
            {showInternals &&
              component.internals?.map((internal) => {
                if (internal.type === 'graphic' && internal.graphicSvg === 'butterfly') {
                  const p0 = internal.points[0];
                  const p2 = internal.points[2] || { x: p0.x + 120, y: p0.y + 95 };
                  const w = p2.x - p0.x;
                  const h = p2.y - p0.y;

                  return (
                    <g key={internal.id} transform={`translate(${p0.x}, ${p0.y})`}>
                      {/* Translucent placement frame with dashed border */}
                      <rect
                        width={w}
                        height={h}
                        fill="rgba(255, 255, 255, 0.95)"
                        stroke="#3b82f6"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                        rx="2"
                      />
                      {/* Butterfly Line Artwork (Authentic to TUKAcad screenshot) */}
                      <g transform="translate(14, 10) scale(0.9)">
                        <path d="M50 30 Q50 80 50 85 M48 25 Q50 30 52 25" stroke="#1d4ed8" strokeWidth="2.8" fill="none" />
                        <path d="M50 35 C35 15 10 20 15 45 C18 60 40 60 50 55" stroke="#2563eb" strokeWidth="2" fill="rgba(37,99,235,0.15)" />
                        <path d="M50 35 C65 15 90 20 85 45 C82 60 60 60 50 55" stroke="#2563eb" strokeWidth="2" fill="rgba(37,99,235,0.15)" />
                        <path d="M50 55 C38 58 20 65 25 80 C29 90 45 80 50 68" stroke="#1d4ed8" strokeWidth="2" fill="rgba(37,99,235,0.1)" />
                        <path d="M50 55 C62 58 80 65 75 80 C71 90 55 80 50 68" stroke="#1d4ed8" strokeWidth="2" fill="rgba(37,99,235,0.1)" />
                        <circle cx="50" cy="30" r="3" fill="#1d4ed8" />
                        <path d="M48 27 Q40 18 35 20 M52 27 Q60 18 65 20" stroke="#1e40af" strokeWidth="1.6" fill="none" />
                      </g>
                      {/* Transform Corner Handles */}
                      <rect x="-3" y="-3" width="6" height="6" fill="#facc15" stroke="#000" strokeWidth="0.8" />
                      <rect x={w - 3} y="-3" width="6" height="6" fill="#facc15" stroke="#000" strokeWidth="0.8" />
                      <rect x="-3" y={h - 3} width="6" height="6" fill="#facc15" stroke="#000" strokeWidth="0.8" />
                      <rect x={w - 3} y={h - 3} width="6" height="6" fill="#facc15" stroke="#000" strokeWidth="0.8" />
                    </g>
                  );
                }

                // Yellow Pocket Placement Contour (As seen on Pant Back in screenshot)
                const ptsString = internal.points.map((p) => `${p.x},${p.y}`).join(' ');
                return (
                  <g key={internal.id}>
                    <polygon
                      points={ptsString}
                      fill="none"
                      stroke={internal.color || '#facc15'}
                      strokeWidth="1.8"
                    />
                    {internal.points.map((pt, pIdx) => (
                      <circle
                        key={pIdx}
                        cx={pt.x}
                        cy={pt.y}
                        r="3"
                        fill="#facc15"
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
                {/* Arrow head on grainline */}
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
            {component.notches.map((notch, idx) => (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMeasureClick({ x: compX + notch.x, y: compY + notch.y });
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
                <circle
                  cx={notch.x}
                  cy={notch.y}
                  r="2"
                  fill="#ef4444"
                />
              </g>
            ))}

            {/* Control & Anchor Points */}
            {component.paths.map((cmd, cmdIdx) =>
              cmd.points.map((pt, ptIdx) => {
                if (pt.isControl) {
                  return (
                    <circle
                      key={`ctrl-${cmdIdx}-${ptIdx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="2.5"
                      fill="#ffffff"
                      stroke={isTukaDark ? '#facc15' : '#f97316'}
                      strokeWidth="1.2"
                      className="opacity-80 hover:opacity-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeasureClick({ x: compX + pt.x, y: compY + pt.y });
                      }}
                    />
                  );
                }
                return isTukaDark ? (
                  <rect
                    key={`pt-${cmdIdx}-${ptIdx}`}
                    x={pt.x - 2.8}
                    y={pt.y - 2.8}
                    width="5.6"
                    height="5.6"
                    fill={isSelected ? '#f97316' : (cmdIdx % 2 === 0 ? '#00ff44' : '#ffffff')}
                    stroke={cmdIdx % 2 === 0 ? '#000000' : '#000000'}
                    strokeWidth="0.9"
                    className="hover:scale-150 transition-transform cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMeasureClick({ x: compX + pt.x, y: compY + pt.y });
                    }}
                  >
                    <title>{pt.name || `Grading Node (${pt.x}, ${pt.y})`}</title>
                  </rect>
                ) : (
                  <circle
                    key={`pt-${cmdIdx}-${ptIdx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill={isSelected ? '#2563eb' : '#ffffff'}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    className="hover:scale-125 transition-transform cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMeasureClick({ x: compX + pt.x, y: compY + pt.y });
                    }}
                  >
                    <title>{pt.name || `Point (${pt.x}, ${pt.y})`}</title>
                  </circle>
                );
              })
            )}


            {/* Text Annotations & Labels */}
            {component.labels.map((lbl, idx) => {
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
          </g>
        );
      })}
    </g>
  );
};
