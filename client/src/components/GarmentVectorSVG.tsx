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
  } = useCADStore();

  const [isDraggingGarment, setIsDraggingGarment] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const bounds = calculateGarmentBounds(garment);
  const isEntireSelected = selectedComponentId === 'entire' || selectedComponentId === null;

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
            fill="rgba(37, 99, 235, 0.02)"
            stroke="#2563eb"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            rx="4"
          />

          {/* Top Bounding Badge */}
          <g transform={`translate(${bounds.minX + 8}, ${bounds.minY - 24})`}>
            <rect
              width="360"
              height="20"
              fill="#2563eb"
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
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {/* Guide lines connecting Front, Back and Sleeve across horizontal levels */}
      <g id="horizontal-cad-guides" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.65">
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
            {/* Pattern Geometry Path */}
            <path
              d={pathData}
              fill={isSelected ? 'rgba(37, 99, 235, 0.05)' : '#ffffff'}
              stroke={
                isSelected
                  ? '#2563eb'
                  : component.id === 'front'
                  ? '#1d4ed8'
                  : component.id === 'back'
                  ? '#0284c7'
                  : '#4338ca'
              }
              strokeWidth={isSelected ? '2.2' : '1.8'}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-colors cursor-pointer"
            />

            {/* Grainline */}
            {component.grainline && (
              <g className="select-none">
                <line
                  x1={component.grainline.start.x}
                  y1={component.grainline.start.y}
                  x2={component.grainline.end.x}
                  y2={component.grainline.end.y}
                  stroke="#334155"
                  strokeWidth="1.2"
                  strokeDasharray="8 4"
                />
                {/* Arrow heads on grainline */}
                <polygon
                  points={`${component.grainline.start.x},${component.grainline.start.y} ${component.grainline.start.x - 3},${component.grainline.start.y + 8} ${component.grainline.start.x + 3},${component.grainline.start.y + 8}`}
                  fill="#334155"
                />
                <polygon
                  points={`${component.grainline.end.x},${component.grainline.end.y} ${component.grainline.end.x - 3},${component.grainline.end.y - 8} ${component.grainline.end.x + 3},${component.grainline.end.y - 8}`}
                  fill="#334155"
                />
                <text
                  x={component.grainline.start.x + 10}
                  y={(component.grainline.start.y + component.grainline.end.y) / 2}
                  fill="#475569"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                  transform={`rotate(-90, ${component.grainline.start.x + 10}, ${(component.grainline.start.y + component.grainline.end.y) / 2})`}
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
                      stroke="#f97316"
                      strokeWidth="1.2"
                      className="opacity-70 hover:opacity-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeasureClick({ x: compX + pt.x, y: compY + pt.y });
                      }}
                    />
                  );
                }
                return (
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
                  fill={isTitle ? '#0f172a' : isGuide ? '#2563eb' : '#64748b'}
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
