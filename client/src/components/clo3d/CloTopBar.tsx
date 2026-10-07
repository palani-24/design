import React from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Play,
  Pause,
  Cloud,
  Globe,
  Layers,
  Box,
  SplitSquareVertical,
  Maximize2,
  Sliders,
  FolderOpen,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const CloTopBar: React.FC = () => {
  const {
    language,
    setLanguage,
    cadEngineMode,
    setCADEngineMode,
    cloViewMode,
    setCloViewMode,
    isSimulating,
    toggleSimulation,
    activeFabric,
    setIsWorkflowModalOpen,
    garment,
    setActiveModal,
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <header className="h-11 bg-[#1a1b1f] border-b border-[#2d2f36] text-[#e1e2e6] flex items-center justify-between px-3 select-none shrink-0 font-sans shadow-md z-30">
      {/* 1. Left Window Control Dots & Title */}
      <div className="flex items-center gap-3">
        {/* Mac Window Dots */}
        <div className="flex items-center gap-1.5 mr-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity" />
        </div>

        {/* CLO Icon & App Name */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00a8ff] flex items-center justify-center font-bold text-white text-xs shadow-sm shadow-[#00a8ff]/30 font-['Outfit']">
            C
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-wide text-white font-['Outfit']">
                {t('appTitle')}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2b2d35] text-[#00a8ff] font-mono border border-[#393b45]">
                v6.1.186
              </span>
            </div>
            <span className="text-[9px] text-[#8e909a] font-mono -mt-0.5 flex items-center gap-1.5">
              <span>{garment.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.zprj</span>
              <span>•</span>
              <span className="text-[#00a8ff]">{activeFabric.name}</span>
              <button
                onClick={() => setActiveModal('new')}
                className="ml-1 text-[8.5px] px-1.5 py-0.2 bg-[#2d2f36] hover:bg-[#3d404d] text-white rounded font-sans cursor-pointer transition-colors"
                title="Change or Create New Garment Project"
              >
                Change Product
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Center: Mode Switcher (EasyPattern ⇄ TUKAcad ⇄ CLO 3D) & Viewport Mode Toggles */}
      <div className="flex items-center gap-2">
        {/* Studio Switcher */}
        <div className="flex items-center bg-[#121316] rounded-md p-0.5 border border-[#2d2f36]">
          <button
            onClick={() => setCADEngineMode('easypattern')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              cadEngineMode === 'easypattern'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <span>EasyPattern</span>
          </button>
          <button
            onClick={() => setCADEngineMode('tukacad')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              cadEngineMode === 'tukacad'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('tukaMode')}</span>
          </button>
          <button
            onClick={() => setCADEngineMode('clo3d')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              cadEngineMode === 'clo3d'
                ? 'bg-[#00a8ff] text-white shadow-sm'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t('cloMode')}</span>
          </button>
          <button
            onClick={() => setCADEngineMode('collab')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              cadEngineMode === 'collab'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40'
            }`}
            title="Launch 3-in-1 Triple Engine Collab Studio (EasyPattern + TUKAcad 2D + CLO 3D)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ 3-in-1 Collab</span>
          </button>
        </div>

        {/* Infographic Guide Button */}
        <button
          onClick={() => setIsWorkflowModalOpen(true)}
          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1"
          title="Open Start-to-Finish Workflow Infographic"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Workflow Guide</span>
        </button>

        {/* Viewport Layout Switcher: Split / 3D / 2D */}
        <div className="flex items-center bg-[#121316] rounded-md p-0.5 border border-[#2d2f36]">
          <button
            onClick={() => setCloViewMode('split')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              cloViewMode === 'split' ? 'bg-[#2b2d35] text-[#00a8ff] font-bold' : 'text-[#8e909a] hover:text-white'
            }`}
            title="Split 3D + 2D Pattern Window"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('dualSplit')}</span>
          </button>
          <button
            onClick={() => setCloViewMode('3d-only')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              cloViewMode === '3d-only' ? 'bg-[#2b2d35] text-[#00a8ff] font-bold' : 'text-[#8e909a] hover:text-white'
            }`}
            title="3D Drape Viewport Only"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
          <button
            onClick={() => setCloViewMode('2d-only')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              cloViewMode === '2d-only' ? 'bg-[#2b2d35] text-[#00a8ff] font-bold' : 'text-[#8e909a] hover:text-white'
            }`}
            title="2D Pattern Drafting Only"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D</span>
          </button>
        </div>
      </div>

      {/* 3. Right: Simulation Playback, Language Toggle, User Badge */}
      <div className="flex items-center gap-3">
        {/* Big CLO Simulation Play/Pause CTA */}
        <button
          onClick={toggleSimulation}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
            isSimulating
              ? 'bg-[#00a8ff] hover:bg-[#0096e6] text-white shadow-[#00a8ff]/30 animate-pulse'
              : 'bg-[#2b2d35] hover:bg-[#343740] text-[#cbd5e1] border border-[#393b45]'
          }`}
          title="Spacebar to toggle simulation"
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>{t('simulation')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('simulation')}</span>
            </>
          )}
        </button>

        {/* Language Switcher (English ⇄ Tamil) */}
        <div className="flex items-center bg-[#121316] rounded-md p-0.5 border border-[#2d2f36]">
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              language === 'ta'
                ? 'bg-[#00a8ff] text-white'
                : 'text-[#8e909a] hover:text-white'
            }`}
            title="தமிழ் பயன்முறை"
          >
            🇮🇳 தமிழ்
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              language === 'en'
                ? 'bg-[#00a8ff] text-white'
                : 'text-[#8e909a] hover:text-white'
            }`}
            title="English Mode"
          >
            EN
          </button>
        </div>

        {/* User Account & Cloud Sync Status (Matches CLO Header) */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#2d2f36] text-[11px]">
          <span className="text-[#8e909a]">
            Hello, <strong className="text-[#00a8ff] font-medium">xzhen1175</strong>
          </span>
          <div className="w-5 h-5 rounded-full bg-[#2b2d35] flex items-center justify-center text-[#00a8ff]" title="Cloud Synced">
            <Cloud className="w-3 h-3" />
          </div>
        </div>
      </div>
    </header>
  );
};
