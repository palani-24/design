import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, FolderPlus, Sparkles, Wand2 } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { activeModal, setActiveModal, createNewProject, loadGarmentTemplate } = useCADStore();
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<
    | 'suit-jacket'
    | 'double-breasted-blazer'
    | 'trench-coat'
    | 'bomber-jacket'
    | 'bootcut-pant'
    | 'denim-jeans'
    | 'sheath-dress'
    | 'flared-skirt'
    | 'shirt'
    | 'basic-tshirt'
    | 'polo'
  >('suit-jacket');

  if (activeModal !== 'new') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadGarmentTemplate(selectedTemplate);
    setActiveModal('none');
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Create New CAD Project</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="block font-bold text-slate-700">Choose Industrial Garment Template</label>
            <button
              type="button"
              onClick={() => setActiveModal('manualGarment')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <Wand2 className="w-3 h-3 text-amber-600" />
              Build Manually from Scratch
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-0.5">
            {[
              { id: 'suit-jacket', name: 'Mens Tailored Suit Jacket', tag: '16 Pcs', desc: 'Chest canvas & sleeves' },
              { id: 'double-breasted-blazer', name: 'DB Peak Lapel Blazer', tag: '10 Pcs', desc: 'Overlapping button wrap' },
              { id: 'trench-coat', name: 'Classic Belted Trench Coat', tag: '14 Pcs', desc: 'Storm flaps & epaulettes' },
              { id: 'bomber-jacket', name: 'MA-1 Flight Bomber Jacket', tag: '8 Pcs', desc: 'Welt pockets & rib waist' },
              { id: 'bootcut-pant', name: 'Womens Boot Cut Pant', tag: 'Benchmark', desc: 'Graded contour waist' },
              { id: 'denim-jeans', name: '5-Pocket Raw Denim Jeans', tag: '8 Pcs', desc: 'Coin pocket & curved yoke' },
              { id: 'sheath-dress', name: 'Princess Seam Sheath Dress', tag: '6 Pcs', desc: 'Form-fitted couture bodice' },
              { id: 'flared-skirt', name: '8-Gore Flared Skirt', tag: '4 Pcs', desc: 'Balanced sweeping hemline' },
              { id: 'shirt', name: 'Casual Button-Up Oxford', tag: 'Base', desc: 'Two-piece collar & cuffs' },
              { id: 'basic-tshirt', name: 'Basic Crew-Neck T-Shirt', tag: '1-Object', desc: 'Front, Back & Sleeve' },
              { id: 'polo', name: 'Pique Polo T-Shirt', tag: 'v2.1', desc: 'Knit collar & box placket' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id as any)}
                className={`p-2 rounded-lg border text-left font-medium transition-all ${
                  selectedTemplate === t.id
                    ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-2xs ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span className="truncate">{t.name}</span>
                  <span className="text-[9px] bg-blue-600 text-white px-1 rounded ml-1 shrink-0">{t.tag}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{t.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Parametric Constraint Engine</span>
            </div>
            <span>Initializes complete multi-piece pattern nest with 1-Object synchronous grading links.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
            >
              Load & Initialize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
