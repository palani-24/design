import React from 'react';
import { CADTheme, CADUnit } from '@shared/types';

interface RulersProps {
  zoom: number;
  panOffset: { x: number; y: number };
  cursorPos: { x: number; y: number };
  cadUnit?: CADUnit;
  cadTheme?: CADTheme;
}

export const HorizontalRuler: React.FC<RulersProps> = ({
  zoom,
  panOffset,
  cursorPos,
  cadUnit = 'in',
  cadTheme = 'tukacad-black',
}) => {
  const isInch = cadUnit === 'in';
  const isDark = cadTheme === 'tukacad-black';

  // If inches: 1 in = 25.4 units. Step = 2 inches (50.8 units)
  // If cm: 1 cm = 10 units. Step = 5 cm (50 units)
  const stepVal = isInch ? 2 : 5;
  const stepUnits = isInch ? 50.8 : 50.0;
  const count = 50; // covers full CAD table

  return (
    <div
      className={`h-6 w-full relative overflow-hidden select-none text-[9px] font-mono border-b ${
        isDark
          ? 'bg-[#18181b] border-zinc-800 text-zinc-400'
          : 'bg-slate-100 border-slate-300 text-slate-500'
      }`}
    >
      <div
        className="absolute top-0 bottom-0 flex"
        style={{
          transform: `translateX(${panOffset.x}px)`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const val = i * stepVal;
          const pixelPos = i * stepUnits * zoom;
          return (
            <div
              key={i}
              className={`absolute top-0 h-full border-l pl-1 ${
                isDark ? 'border-zinc-700' : 'border-slate-300'
              }`}
              style={{ left: `${pixelPos}px` }}
            >
              <span className="leading-tight text-[8px] font-semibold">{val}</span>
              {/* Intermediate tick marks */}
              <div className="absolute bottom-0 flex space-x-[8px] h-1.5">
                <span className={`w-[1px] h-1 ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`} />
                <span className={`w-[1px] h-1.5 ${isDark ? 'bg-zinc-500' : 'bg-slate-400'}`} />
                <span className={`w-[1px] h-1 ${isDark ? 'bg-zinc-700' : 'bg-slate-300'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Cursor Indicator */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-amber-400 z-10 transition-all pointer-events-none"
        style={{
          left: `${panOffset.x + cursorPos.x * zoom}px`,
        }}
      />
    </div>
  );
};

export const VerticalRuler: React.FC<RulersProps> = ({
  zoom,
  panOffset,
  cursorPos,
  cadUnit = 'in',
  cadTheme = 'tukacad-black',
}) => {
  const isInch = cadUnit === 'in';
  const isDark = cadTheme === 'tukacad-black';

  const stepVal = isInch ? 2 : 5;
  const stepUnits = isInch ? 50.8 : 50.0;
  const count = 40;

  return (
    <div
      className={`w-6 h-full relative overflow-hidden select-none text-[9px] font-mono border-r ${
        isDark
          ? 'bg-[#18181b] border-zinc-800 text-zinc-400'
          : 'bg-slate-100 border-slate-300 text-slate-500'
      }`}
    >
      <div
        className="absolute left-0 right-0"
        style={{
          transform: `translateY(${panOffset.y}px)`,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const val = i * stepVal;
          const pixelPos = i * stepUnits * zoom;
          return (
            <div
              key={i}
              className={`absolute left-0 w-full border-t pt-0.5 text-right pr-1 ${
                isDark ? 'border-zinc-700' : 'border-slate-300'
              }`}
              style={{ top: `${pixelPos}px` }}
            >
              <span className="leading-none text-[8px] block font-semibold">{val}</span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Cursor Indicator */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-amber-400 z-10 transition-all pointer-events-none"
        style={{
          top: `${panOffset.y + cursorPos.y * zoom}px`,
        }}
      />
    </div>
  );
};
