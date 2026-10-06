import React from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Box,
  Layers,
  SplitSquareVertical,
  Activity,
  Command,
} from 'lucide-react';

export const CloBottomBar: React.FC = () => {
  const {
    language,
    cloViewMode,
    setCloViewMode,
    isSimulating,
    activeFabric,
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <footer className="h-6 bg-[#16171a] border-t border-[#2d2f36] text-[#8e909a] text-[10px] px-3 flex items-center justify-between select-none shrink-0 font-mono z-30">
      {/* 1. Version Label (Matches CLO 3D bottom-left text) */}
      <div className="flex items-center gap-3">
        <span className="text-[#a0a4b0]">Version: 6.1.186 (r35272)</span>
        <span className="text-[#525562]">|</span>
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
            }`}
          />
          {isSimulating ? 'Physics: Solving Cloth Mesh' : 'Physics: Idle'}
        </span>
      </div>

      {/* 2. Interactive Navigation Hints */}
      <div className="hidden md:flex items-center gap-2 text-[#717684]">
        <span>{t('controlsHint')}</span>
      </div>

      {/* 3. Bottom Right Dual-View Toggles (Matches CLO 3D Bottom-Right Icons) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCloViewMode('split')}
          className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
            cloViewMode === 'split'
              ? 'bg-[#00a8ff] text-white font-bold'
              : 'hover:text-white hover:bg-[#252830]'
          }`}
          title={t('dualSplit')}
        >
          <SplitSquareVertical className="w-3 h-3" />
          <span>3D/2D</span>
        </button>
        <button
          onClick={() => setCloViewMode('3d-only')}
          className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
            cloViewMode === '3d-only'
              ? 'bg-[#00a8ff] text-white font-bold'
              : 'hover:text-white hover:bg-[#252830]'
          }`}
          title={t('view3DOnly')}
        >
          <Box className="w-3 h-3" />
          <span>3D</span>
        </button>
        <button
          onClick={() => setCloViewMode('2d-only')}
          className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
            cloViewMode === '2d-only'
              ? 'bg-[#00a8ff] text-white font-bold'
              : 'hover:text-white hover:bg-[#252830]'
          }`}
          title={t('view2DOnly')}
        >
          <Layers className="w-3 h-3" />
          <span>2D</span>
        </button>
      </div>
    </footer>
  );
};
