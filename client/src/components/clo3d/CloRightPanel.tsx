import React from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Sliders,
  Layers,
  ChevronLeft,
  Palette,
  Sparkles,
  Scissors,
  Eye,
  Check,
} from 'lucide-react';

export const CloRightPanel: React.FC = () => {
  const {
    language,
    activeRightTab,
    setActiveRightTab,
    activeFabric,
    setActiveFabric,
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="flex h-full select-none z-20 shrink-0">
      {/* 1. Expandable Right Drawer Panel */}
      {activeRightTab !== 'none' && (
        <div className="w-72 bg-[#1e2026] border-l border-[#2d2f36] flex flex-col text-xs text-[#cbd5e1] shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="h-9 px-3 bg-[#18191e] border-b border-[#2d2f36] flex items-center justify-between">
            <span className="font-semibold text-xs text-white font-['Outfit']">
              {activeRightTab === 'objectBrowser' ? t('objectBrowser') : t('propertyEditor')}
            </span>
            <button
              onClick={() => setActiveRightTab('none')}
              className="text-[#8e909a] hover:text-white p-1"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Tab 1: Object Browser */}
            {activeRightTab === 'objectBrowser' && (
              <div className="space-y-3 font-sans">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider mb-1.5">
                    Scene Hierarchy
                  </div>
                  <div className="bg-[#16171c] rounded border border-[#2d2f36] p-2 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between p-1 bg-[#00a8ff]/15 rounded text-[#00a8ff] font-semibold">
                      <span>👗 3D Garment (Bodice & Skirt)</span>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <div className="pl-3 space-y-1 text-zinc-300">
                      <div className="p-1 hover:bg-[#252830] rounded flex items-center justify-between">
                        <span>• Bodice Front (Crop Top)</span>
                        <span className="text-[9px] text-zinc-500">Cyan Silk</span>
                      </div>
                      <div className="p-1 hover:bg-[#252830] rounded flex items-center justify-between">
                        <span>• Bodice Back Panel</span>
                        <span className="text-[9px] text-zinc-500">Cyan Silk</span>
                      </div>
                      <div className="p-1 hover:bg-[#252830] rounded flex items-center justify-between">
                        <span>• Flared Skirt Front</span>
                        <span className="text-[9px] text-zinc-500">White Drape</span>
                      </div>
                      <div className="p-1 hover:bg-[#252830] rounded flex items-center justify-between">
                        <span>• Flared Skirt Back</span>
                        <span className="text-[9px] text-zinc-500">White Drape</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider mb-1.5">
                    Seam Pairings (6 Links)
                  </div>
                  <div className="bg-[#16171c] rounded border border-[#2d2f36] p-2 space-y-1 text-[10px] text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono">L1: Shoulder Left</span>
                      <span>124.5 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono">L2: Shoulder Right</span>
                      <span>124.5 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono">L3: Bodice Side Seam</span>
                      <span>218.0 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono">L4: Waist Join Seam</span>
                      <span>680.0 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-mono">L5: Skirt Side Seam</span>
                      <span>462.0 mm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Property Editor (Physical Fabric Parameters) */}
            {activeRightTab === 'propertyEditor' && (
              <div className="space-y-4">
                {/* Fabric Color Picker */}
                <div>
                  <label className="text-[10px] font-bold text-[#8e909a] uppercase tracking-wider block mb-1">
                    {t('colorPicker')}
                  </label>
                  <div className="flex items-center gap-2 bg-[#16171c] p-1.5 rounded border border-[#2d2f36]">
                    <input
                      type="color"
                      value={activeFabric.color}
                      onChange={(e) => setActiveFabric({ color: e.target.value })}
                      className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={activeFabric.color}
                      onChange={(e) => setActiveFabric({ color: e.target.value })}
                      className="bg-transparent text-white font-mono text-xs outline-none w-24"
                    />
                  </div>
                </div>

                {/* Warp Stretch */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('stretchWarp')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.stretchWarp}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFabric.stretchWarp}
                    onChange={(e) => setActiveFabric({ stretchWarp: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>

                {/* Weft Stretch */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('stretchWeft')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.stretchWeft}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFabric.stretchWeft}
                    onChange={(e) => setActiveFabric({ stretchWeft: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>

                {/* Bending Rigidity */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('bending')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.bending}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFabric.bending}
                    onChange={(e) => setActiveFabric({ bending: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>

                {/* Shear Modulus */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('shear')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.shear}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFabric.shear}
                    onChange={(e) => setActiveFabric({ shear: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>

                {/* Density (g/m²) */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('density')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.density} g/m²</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="10"
                    value={activeFabric.density}
                    onChange={(e) => setActiveFabric({ density: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>

                {/* Thickness (mm) */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#9ca3af]">{t('thickness')}</span>
                    <span className="font-mono text-white font-bold">{activeFabric.thickness} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={activeFabric.thickness}
                    onChange={(e) => setActiveFabric({ thickness: Number(e.target.value) })}
                    className="w-full accent-[#00a8ff] cursor-pointer h-1.5 bg-[#2d2f36] rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Far Right Vertical Collapsed Strip (Matches CLO 3D Right Edge) */}
      <div className="w-8 bg-[#16171b] border-l border-[#2d2f36] flex flex-col justify-start py-4 items-center gap-14 text-[10px] tracking-wider text-[#8e909a]">
        {/* OBJECT BROWSER vertical button */}
        <button
          onClick={() =>
            setActiveRightTab(activeRightTab === 'objectBrowser' ? 'none' : 'objectBrowser')
          }
          className={`py-4 px-1 rounded transition-colors [writing-mode:vertical-lr] uppercase font-semibold ${
            activeRightTab === 'objectBrowser'
              ? 'bg-[#00a8ff] text-white shadow-xs'
              : 'hover:text-white'
          }`}
        >
          {t('objectBrowser')}
        </button>

        {/* PROPERTY EDITOR vertical button */}
        <button
          onClick={() =>
            setActiveRightTab(activeRightTab === 'propertyEditor' ? 'none' : 'propertyEditor')
          }
          className={`py-4 px-1 rounded transition-colors [writing-mode:vertical-lr] uppercase font-semibold ${
            activeRightTab === 'propertyEditor'
              ? 'bg-[#00a8ff] text-white shadow-xs'
              : 'hover:text-white'
          }`}
        >
          {t('propertyEditor')}
        </button>
      </div>
    </div>
  );
};
