import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Star,
  Folder,
  Search,
  ChevronRight,
  FolderOpen,
  Shirt,
  User,
  Scissors,
  Sparkles,
  Layers,
  Palette,
  Sun,
  Plus,
  ArrowUp,
  FileText,
  Activity,
  Sliders,
  Check,
} from 'lucide-react';
import { AvatarPose } from '../../shared/types';

export const CloLeftDrawer: React.FC = () => {
  const {
    language,
    activeLibraryTab,
    setActiveLibraryTab,
    selectedAvatarPose,
    setSelectedAvatarPose,
    activeFabric,
    setActiveFabric,
    activeLeftDrawer,
    setActiveLeftDrawer,
    loadGarmentTemplate,
    garment,
    setActiveModal,
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const treeTabs = [
    { id: 'Garment', label: t('garment'), icon: Shirt },
    { id: 'Avatar', label: t('avatar'), icon: User },
    { id: 'Hanger', label: t('hanger'), icon: Layers },
    { id: 'Fabric', label: t('fabric'), icon: Scissors },
    { id: 'Hardware and Trims', label: t('hardwareTrims'), icon: Sliders },
    { id: 'Material', label: t('material'), icon: Palette },
    { id: 'Stage', label: t('stage'), icon: Sun },
  ];

  const poses: Array<{ id: AvatarPose; name: string }> = [
    { id: 'FV2_01_A', name: 'FV2_01_A.pos' },
    { id: 'FV2_02_Aforsize', name: 'FV2_02_Aforsize.pos' },
    { id: 'FV2_03_Attention', name: 'FV2_03_Attention.pos' },
    { id: 'FV2_04', name: 'FV2_04.pos' },
    { id: 'FV2_08_Running', name: 'FV2_08_Running.pos' },
    { id: 'FV2_09_Sitting', name: 'FV2_09_Sitting.pos' },
    { id: 'FV2_10_ArmsUp', name: 'FV2_10_ArmsUp.pos' },
  ];

  const fabricPresets = [
    {
      id: 'silk-charmeuse',
      name: 'Silk Charmeuse 16mm',
      type: 'Silk',
      color: '#a5f3fc',
      stretchWarp: 15,
      stretchWeft: 28,
      bending: 12,
      shear: 18,
      density: 110,
      thickness: 0.28,
    },
    {
      id: 'cotton-twill',
      name: 'Cotton Twill 220g',
      type: 'Cotton',
      color: '#fef08a',
      stretchWarp: 22,
      stretchWeft: 34,
      bending: 35,
      shear: 40,
      density: 220,
      thickness: 0.45,
    },
    {
      id: 'raw-denim',
      name: 'Raw Selvedge Denim 14oz',
      type: 'Denim',
      color: '#1e3a8a',
      stretchWarp: 6,
      stretchWeft: 12,
      bending: 68,
      shear: 75,
      density: 380,
      thickness: 0.82,
    },
    {
      id: 'silk-chiffon',
      name: 'Silk Chiffon Sheer',
      type: 'Chiffon',
      color: '#f472b6',
      stretchWarp: 30,
      stretchWeft: 45,
      bending: 8,
      shear: 10,
      density: 65,
      thickness: 0.18,
    },
    {
      id: 'lambskin',
      name: 'Soft Lambskin Leather',
      type: 'Leather',
      color: '#78350f',
      stretchWarp: 10,
      stretchWeft: 15,
      bending: 55,
      shear: 60,
      density: 450,
      thickness: 0.95,
    },
  ];

  return (
    <div className="flex h-full select-none z-20 shrink-0">
      {/* 1. Far Left Vertical Collapsed Strip (Matches CLO 3D Left Edge) */}
      <div className="w-8 bg-[#16171b] border-r border-[#2d2f36] flex flex-col justify-between py-3 items-center text-[10px] tracking-wider text-[#8e909a]">
        <div className="flex flex-col gap-10 items-center">
          {/* HISTORY vertical button */}
          <button
            onClick={() => {
              setActiveLeftDrawer(activeLeftDrawer === 'history' ? 'none' : 'history');
              setCollapsed(false);
            }}
            className={`py-4 px-1 rounded transition-colors [writing-mode:vertical-lr] rotate-180 uppercase font-semibold ${
              activeLeftDrawer === 'history'
                ? 'bg-[#00a8ff] text-white shadow-xs'
                : 'hover:text-white'
            }`}
          >
            {t('history')}
          </button>

          {/* MODULAR CONFIGURATOR vertical button */}
          <button
            onClick={() => {
              setActiveLeftDrawer(activeLeftDrawer === 'modular' ? 'none' : 'modular');
              setCollapsed(false);
            }}
            className={`py-4 px-1 rounded transition-colors [writing-mode:vertical-lr] rotate-180 uppercase font-semibold ${
              activeLeftDrawer === 'modular'
                ? 'bg-[#00a8ff] text-white shadow-xs'
                : 'hover:text-white'
            }`}
          >
            {t('modularConfig')}
          </button>
        </div>

        {/* Bottom Drawer Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#8e909a] hover:text-white p-1"
          title="Toggle Drawer"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* 2. Expandable Drawer Content Panel */}
      {!collapsed && (
        <div className="w-64 bg-[#1e2026] border-r border-[#2d2f36] flex flex-col text-xs text-[#cbd5e1] shadow-2xl">
          {/* Drawer Header Tabs: Favorites & Folders */}
          <div className="h-9 px-2.5 bg-[#18191e] border-b border-[#2d2f36] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button className="p-1 rounded bg-[#00a8ff]/20 text-[#00a8ff]" title="Favorites">
                <Star className="w-3.5 h-3.5 fill-[#00a8ff]" />
              </button>
              <button className="p-1 rounded hover:bg-[#2c2f38] text-[#8e909a] hover:text-white" title="Folders">
                <Folder className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-xs text-white ml-1 font-['Outfit']">
                {t('library')}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#8e909a]">
              <button className="p-1 hover:text-white" title="Add File">
                <Plus className="w-3 h-3" />
              </button>
              <button className="p-1 hover:text-white" title="Up Directory">
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-[#2d2f36]">
            <div className="flex items-center bg-[#121316] rounded px-2 py-1 border border-[#343740]">
              <Search className="w-3 h-3 text-[#8e909a] mr-1.5 shrink-0" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[11px] text-white outline-none w-full placeholder:text-[#64748b]"
              />
            </div>
          </div>

          {/* Library Hierarchy Tree */}
          <div className="border-b border-[#2d2f36] py-1 bg-[#16171c]/50">
            {treeTabs.map((item) => {
              const Icon = item.icon;
              const isSelected = activeLibraryTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveLibraryTab(item.id)}
                  className={`w-full px-3 py-1 flex items-center justify-between text-[11px] transition-colors ${
                    isSelected
                      ? 'bg-[#00a8ff]/20 text-[#00a8ff] font-bold border-l-2 border-[#00a8ff]'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#252730]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Sub-Item List Area (Matches CLO 3D Screenshot file list) */}
          <div className="flex-1 overflow-y-auto p-1.5 font-mono text-[11px]">
            {/* When AVATAR tab is selected: Poses List */}
            {activeLibraryTab === 'Avatar' && (
              <div className="flex flex-col gap-0.5">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#64748b] font-bold">
                  Name (Poses)
                </div>

                <div className="px-2 py-1 text-[#8e909a] hover:bg-[#2c2f38] rounded cursor-pointer flex items-center gap-1.5">
                  <FolderOpen className="w-3 h-3 text-[#00a8ff]" />
                  <span>..</span>
                </div>
                <div className="px-2 py-1 text-[#8e909a] hover:bg-[#2c2f38] rounded cursor-pointer flex items-center gap-1.5">
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span>Plus</span>
                </div>

                {poses.map((p) => {
                  const isActive = selectedAvatarPose === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedAvatarPose(p.id)}
                      className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-[#00a8ff] text-white font-bold shadow-xs'
                          : 'text-[#cbd5e1] hover:bg-[#2c2f38]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3 h-3 shrink-0 opacity-70" />
                        <span className="truncate">{p.name}</span>
                      </div>
                      {isActive && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* When FABRIC tab is selected: Fabrics List */}
            {activeLibraryTab === 'Fabric' && (
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#64748b] font-bold">
                  Preset Physical Fabrics
                </div>
                {fabricPresets.map((f) => {
                  const isActive = activeFabric.id === f.id || activeFabric.name === f.name;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFabric(f)}
                      className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors border ${
                        isActive
                          ? 'bg-[#252830] border-[#00a8ff] text-white'
                          : 'border-transparent hover:bg-[#252830] text-[#cbd5e1]'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: f.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[11px] truncate">{f.name}</span>
                        <span className="text-[9px] text-[#8e909a]">
                          {f.density}g/m² • Warp {f.stretchWarp}% • {f.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* When GARMENT tab is selected: Full Product Library */}
            {activeLibraryTab === 'Garment' && (
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#64748b] font-bold flex items-center justify-between">
                  <span>Product Library (13 Styles)</span>
                  <button
                    onClick={() => setActiveModal('manualGarment')}
                    className="text-[9px] text-[#00a8ff] hover:underline"
                  >
                    + Custom
                  </button>
                </div>
                {[
                  { id: 'basic-bodice', name: 'Bodice & Flared Skirt', tag: 'Academic Preset', desc: 'Crop top & A-line skirt' },
                  { id: 'basic-bodice', name: "Women's Basic Bodice", tag: '2 Pcs', desc: 'Front & Back with Darts' },
                  { id: 'sheath-dress', name: 'Princess Seam Sheath Dress', tag: '6 Pcs', desc: 'Form-fitted couture bodice' },
                  { id: 'flared-skirt', name: '8-Gore Flared Skirt', tag: '4 Pcs', desc: 'Balanced sweeping hemline' },
                  { id: 'bootcut-pant', name: 'Womens Boot Cut Pant', tag: '10 Pcs', desc: 'TUKAcad tud format v4.8' },
                  { id: 'denim-jeans', name: '5-Pocket Raw Denim Jeans', tag: '8 Pcs', desc: 'Coin pocket & curved yoke' },
                  { id: 'trench-coat', name: 'Classic Belted Trench Coat', tag: '14 Pcs', desc: 'Storm flaps & epaulettes' },
                  { id: 'bomber-jacket', name: 'MA-1 Flight Bomber Jacket', tag: '8 Pcs', desc: 'Welt pockets & rib waist' },
                  { id: 'suit-jacket', name: 'Mens Tailored Suit Jacket', tag: '16 Pcs', desc: 'Chest canvas & sleeves' },
                  { id: 'double-breasted-blazer', name: 'DB Peak Lapel Blazer', tag: '10 Pcs', desc: 'Double-breasted wrap' },
                  { id: 'shirt', name: 'Casual Button-Up Oxford', tag: 'Base', desc: 'Two-piece collar & cuffs' },
                  { id: 'basic-tshirt', name: 'Basic Crew-Neck T-Shirt', tag: '1-Object', desc: 'Front, Back & Sleeve' },
                  { id: 'polo', name: 'Pique Polo T-Shirt', tag: 'v2.1', desc: 'Knit collar & box placket' },
                ].map((g, idx) => {
                  const isActive = garment.name.toLowerCase().includes(g.id.replace('-', ' ')) ||
                    (g.id === 'basic-bodice' && garment.name.toLowerCase().includes('bodice'));
                  return (
                    <button
                      key={`${g.id}-${idx}`}
                      onClick={() => {
                        loadGarmentTemplate(g.id as any);
                      }}
                      className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors border ${
                        isActive
                          ? 'bg-[#00a8ff]/20 text-[#00a8ff] font-bold border-[#00a8ff]/40 shadow-xs'
                          : 'border-transparent hover:bg-[#252830] text-[#cbd5e1]'
                      }`}
                    >
                      <Shirt className="w-4 h-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-xs">{g.name}</span>
                          <span className="text-[9px] px-1 rounded bg-[#2b2d35] text-[#8e909a] font-mono ml-1 shrink-0">
                            {g.tag}
                          </span>
                        </div>
                        <div className="text-[9px] text-[#8e909a] truncate font-normal">{g.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
