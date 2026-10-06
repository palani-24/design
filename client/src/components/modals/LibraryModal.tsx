import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shirt,
  Scissors,
  Check,
} from 'lucide-react';

interface TemplateCard {
  id: 'basic-tshirt' | 'polo' | 'shirt' | 'trouser';
  name: string;
  category: 'tshirt' | 'polo' | 'shirt' | 'trouser';
  categoryLabel: string;
  badge: string;
  description: string;
  componentsCount: number;
  componentsList: string[];
  specs: { label: string; value: string }[];
  isStandardBase: boolean;
}

const TEMPLATES: TemplateCard[] = [
  {
    id: 'basic-tshirt',
    name: 'Basic Crew Neck T-Shirt',
    category: 'tshirt',
    categoryLabel: 'T-Shirts',
    badge: 'Standard CAD Base v1.4',
    description:
      'Industry standard regular-fit tubular crew neck t-shirt. Full 1-object parametric grading across Front, Back, and Sleeve.',
    componentsCount: 3,
    componentsList: ['Front Panel (1/4 Fold)', 'Back Panel (1/4 Fold)', 'Sleeve (Pair)'],
    specs: [
      { label: 'Base Size', value: 'S (92cm Bust)' },
      { label: 'Body Length', value: '66.0 cm' },
      { label: '1/2 Chest', value: '48.0 cm' },
      { label: 'Sleeve Length', value: '20.5 cm' },
    ],
    isStandardBase: true,
  },
  {
    id: 'polo',
    name: 'Pique Polo T-Shirt',
    category: 'polo',
    categoryLabel: 'Polo Shirts',
    badge: 'Multi-Component v2.1',
    description:
      'Classic sportswear pique knit polo featuring a structured 2-button placket, drop-tail hem, ribbed cuffs, and flat knit collar.',
    componentsCount: 4,
    componentsList: [
      'Front (Placket)',
      'Back (Drop Hem +15mm)',
      'Sleeve (Ribbed Cuff)',
      'Ribbed Spread Collar',
    ],
    specs: [
      { label: 'Base Size', value: 'S (92cm Bust)' },
      { label: 'Body Length', value: '67.5 cm' },
      { label: 'Collar Neck', value: '40.0 cm' },
      { label: 'Cuff Rib', value: '31.0 cm' },
    ],
    isStandardBase: false,
  },
  {
    id: 'shirt',
    name: 'Casual Button-Up Shirt',
    category: 'shirt',
    categoryLabel: 'Woven Shirts',
    badge: 'Tailored Spec v1.0',
    description:
      'Casual woven cotton shirt with folded button placket, curved shirttail hem, back box pleat, long sleeves, and two-piece stand collar.',
    componentsCount: 4,
    componentsList: [
      'Shirt Front (3cm Placket)',
      'Shirt Back (Yoke & Pleat)',
      'Long Sleeve & Gauntlet',
      'Collar & Stand Leaf',
    ],
    specs: [
      { label: 'Base Size', value: 'S (96cm Chest)' },
      { label: 'Body Length', value: '72.0 cm' },
      { label: '1/2 Chest', value: '52.0 cm' },
      { label: 'Sleeve Length', value: '62.0 cm' },
    ],
    isStandardBase: false,
  },
  {
    id: 'trouser',
    name: 'Flat-Front Chino Trouser',
    category: 'trouser',
    categoryLabel: 'Trousers',
    badge: 'Parametric Leg v1.0',
    description:
      'Straight-fit casual chino trouser with slant pocket front leg, darted seat back leg, and shaped contour waistband.',
    componentsCount: 3,
    componentsList: [
      'Front Leg (Slant Pocket)',
      'Back Leg (Welt Pocket & Dart)',
      'Contour Waistband',
    ],
    specs: [
      { label: 'Base Size', value: 'S (84cm Waist)' },
      { label: 'Total Inseam', value: '78.0 cm' },
      { label: 'Outseam Length', value: '104.0 cm' },
      { label: 'Leg Hem Sweep', value: '38.0 cm' },
    ],
    isStandardBase: false,
  },
];

export const LibraryModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, loadGarmentTemplate } = useCADStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (activeModal !== 'library') return null;

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'tshirt') return tpl.category === 'tshirt' || tpl.category === 'polo';
    return tpl.category === filterCategory;
  });

  const handleSelectTemplate = (id: 'basic-tshirt' | 'polo' | 'shirt' | 'trouser') => {
    loadGarmentTemplate(id);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Industrial Apparel Pattern Library</h3>
              <p className="text-[10px] text-slate-400">
                1-Object Parametric CAD Presets • Vector Geometry & Grading Grade Rules
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold text-[11px] mr-1">FILTER:</span>
            {[
              { id: 'all', label: 'All Styles (4)' },
              { id: 'tshirt', label: 'Knits & Tees (2)' },
              { id: 'shirt', label: 'Woven Shirts (1)' },
              { id: 'trouser', label: 'Pants & Trousers (1)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterCategory === f.id
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            Active in CAD: <strong className="text-blue-600">{garment.name}</strong>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="p-5 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => {
            const isCurrentlyActive =
              (tpl.id === 'basic-tshirt' && garment.category === 't-shirt') ||
              (tpl.id === 'polo' && garment.category === 'polo') ||
              (tpl.id === 'shirt' && garment.category === 'shirt') ||
              (tpl.id === 'trouser' && garment.category === 'trouser');

            return (
              <div
                key={tpl.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                  isCurrentlyActive
                    ? 'border-blue-500 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{tpl.name}</h4>
                        {isCurrentlyActive && (
                          <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{tpl.badge}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <Shirt className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {tpl.description}
                  </p>

                  {/* Components List */}
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-600" />
                      <span>{tpl.componentsCount} Parametric Components (Unified Object):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tpl.componentsList.map((comp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-mono"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] mb-4">
                    {tpl.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono text-[10px]">{sp.label}:</span>
                        <span className="font-mono font-semibold text-slate-700">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action CTA */}
                <button
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isCurrentlyActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isCurrentlyActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Currently Loaded in Workstation</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Template Into Workstation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Strict Rule Enforced: 1 Garment = 1 Grading Object across all templates</span>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="px-3 py-1 text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
