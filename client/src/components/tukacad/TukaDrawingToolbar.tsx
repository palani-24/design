import React from 'react';
import { useCADStore } from '../../store/useCADStore';
import { TukacadTool } from '@shared/types';
import {
  Dot,
  Minus,
  Spline,
  Circle,
  Square,
  Compass,
  RotateCw,
  FlipHorizontal,
  Scissors,
  Maximize2,
  Minimize2,
  Type,
  Layers,
  Sparkles,
  MousePointer,
  Crosshair,
  CornerDownRight,
  Split,
  Combine,
} from 'lucide-react';

export const TukaDrawingToolbar: React.FC = () => {
  const { tukacadTool, setTukacadTool, setNotification } = useCADStore();

  const tools: Array<{ id: TukacadTool; name: string; icon: React.FC<{ className?: string }>; desc: string }> = [
    { id: 'point', name: 'Point', icon: Dot, desc: 'Add precision anchor point' },
    { id: 'line', name: 'Line', icon: Minus, desc: 'Draw straight segment' },
    { id: 'curve', name: 'Curve', icon: Spline, desc: 'Draw Bezier contour curve' },
    { id: 'arc', name: 'Arc', icon: Compass, desc: 'Draw circular arc' },
    { id: 'rectangle', name: 'Rectangle', icon: Square, desc: 'Draw box or pocket contour' },
    { id: 'circle', name: 'Circle', icon: Circle, desc: 'Draw drill hole or circle' },
    { id: 'spline', name: 'Spline', icon: Spline, desc: 'Multi-node spline interpolator' },
    { id: 'fillet', name: 'Fillet', icon: CornerDownRight, desc: 'Round corner fillet' },
    { id: 'offset', name: 'Offset', icon: Maximize2, desc: 'Parallel contour offset (SA)' },
    { id: 'mirror', name: 'Mirror', icon: FlipHorizontal, desc: 'Mirror piece across fold line' },
    { id: 'rotate', name: 'Rotate', icon: RotateCw, desc: 'Rotate piece or dart angle' },
    { id: 'trim', name: 'Trim', icon: Scissors, desc: 'Trim segment to intersection' },
    { id: 'extend', name: 'Extend', icon: Minimize2, desc: 'Extend segment to boundary' },
    { id: 'break', name: 'Break', icon: Split, desc: 'Break segment at coordinate' },
    { id: 'join', name: 'Join', icon: Combine, desc: 'Join segments into closed piece' },
    { id: 'text', name: 'Text', icon: Type, desc: 'Place pattern grainline label' },
  ];

  return (
    <div className="bg-[#0f172a] border-b border-zinc-800 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto select-none">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 mr-2 border-r border-zinc-700/80 pr-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            TUKAcAd 16 Drawing Tools:
          </span>
        </div>

        {/* 16 Advanced Vector Tools matching Step 2 in Infographic */}
        <div className="flex items-center gap-0.5">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = tukacadTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTukacadTool(t.id);
                  setNotification(`Active Tool: ${t.name} (${t.desc})`);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs font-bold ring-1 ring-rose-400'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
                title={`${t.name} — ${t.desc}`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden xl:inline">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tool Feedback Chip */}
      <div className="hidden md:flex items-center gap-2 pl-3 border-l border-zinc-800 font-mono text-[11px]">
        <span className="text-zinc-400">Active:</span>
        <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-600/40 text-rose-300 rounded font-bold uppercase">
          {tukacadTool}
        </span>
      </div>
    </div>
  );
};
