import React from 'react';

interface RulersProps {
  zoom: number;
  panOffset: { x: number; y: number };
  cursorPos: { x: number; y: number };
}

export const HorizontalRuler: React.FC<RulersProps> = ({ zoom, panOffset, cursorPos }) => {
  // 1 cm = 10 units in workspace
  // Every 5cm = 50 units, 10cm = 100 units
  const stepCm = 5;
  const stepUnits = 50;
  const count = 35; // covers up to 175cm

  return (
    <div className="h-6 w-full bg-slate-100 border-b border-slate-300 relative overflow-hidden select-none text-[9px] font-mono text-slate-500">
      <div
        className="absolute top-0 bottom-0 flex"
        style={{
          transform: `translateX(${panOffset.x}px)`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const cm = i * stepCm;
          const pixelPos = i * stepUnits * zoom;
          return (
            <div
              key={i}
              className="absolute top-0 h-full border-l border-slate-300 pl-1"
              style={{ left: `${pixelPos}px` }}
            >
              <span className="leading-tight text-[8px]">{cm}</span>
              {/* Intermediate 1cm tick marks */}
              <div className="absolute bottom-0 flex space-x-[9px] h-1.5">
                <span className="w-[1px] h-1 bg-slate-300" />
                <span className="w-[1px] h-1.5 bg-slate-400" />
                <span className="w-[1px] h-1 bg-slate-300" />
                <span className="w-[1px] h-1 bg-slate-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Cursor Indicator */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-blue-600 z-10 transition-all pointer-events-none"
        style={{
          left: `${panOffset.x + cursorPos.x * zoom}px`,
        }}
      />
    </div>
  );
};

export const VerticalRuler: React.FC<RulersProps> = ({ zoom, panOffset, cursorPos }) => {
  const stepCm = 5;
  const stepUnits = 50;
  const count = 25; // covers up to 125cm

  return (
    <div className="w-6 h-full bg-slate-100 border-r border-slate-300 relative overflow-hidden select-none text-[9px] font-mono text-slate-500">
      <div
        className="absolute left-0 right-0"
        style={{
          transform: `translateY(${panOffset.y}px)`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const cm = i * stepCm;
          const pixelPos = i * stepUnits * zoom;
          return (
            <div
              key={i}
              className="absolute left-0 w-full border-t border-slate-300 pt-0.5 text-right pr-1"
              style={{ top: `${pixelPos}px` }}
            >
              <span className="leading-none text-[8px] block">{cm}</span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Cursor Indicator */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-blue-600 z-10 transition-all pointer-events-none"
        style={{
          top: `${panOffset.y + cursorPos.y * zoom}px`,
        }}
      />
    </div>
  );
};
