import React from 'react';
import { useCADStore } from '../store/useCADStore';

export const MeasureOverlay: React.FC = () => {
  const { measureState, clearMeasure, activeTool } = useCADStore();

  if (activeTool !== 'measure' || !measureState.startPoint) {
    return null;
  }

  const { startPoint, endPoint, currentDistanceMm, currentDistanceCm } = measureState;

  return (
    <g id="cad-measure-overlay" className="pointer-events-none select-none">
      {/* Start Point Marker */}
      <circle
        cx={startPoint.x}
        cy={startPoint.y}
        r="4"
        fill="#ef4444"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Dimension Line and Tooltip if End Point exists */}
      {endPoint && (
        <>
          <circle
            cx={endPoint.x}
            cy={endPoint.y}
            r="4"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Dimension Line */}
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Dimension Callout Badge */}
          <g
            transform={`translate(${(startPoint.x + endPoint.x) / 2}, ${(startPoint.y + endPoint.y) / 2 - 12})`}
          >
            <rect
              x="-65"
              y="-10"
              width="130"
              height="20"
              rx="4"
              fill="#0f172a"
              stroke="#ef4444"
              strokeWidth="1"
            />
            <text
              x="0"
              y="4"
              fill="#ffffff"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {currentDistanceCm} cm ({currentDistanceMm} mm)
            </text>
          </g>
        </>
      )}
    </g>
  );
};
