import React, { useState, useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Settings2, Save, Sparkles, Check } from 'lucide-react';
import { GarmentSize } from '../../shared/types';

export const EditGarmentModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, updateGarmentInfo } = useCADStore();

  const [name, setName] = useState(garment.name);
  const [category, setCategory] = useState(garment.category);
  const [baseSize, setBaseSize] = useState<GarmentSize>(garment.baseSize);

  useEffect(() => {
    if (garment) {
      setName(garment.name);
      setCategory(garment.category);
      setBaseSize(garment.baseSize);
    }
  }, [garment, activeModal]);

  if (activeModal !== 'editGarment') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGarmentInfo({
      name: name.trim() || garment.name,
      category,
      baseSize,
    });
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Edit Garment Properties</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Garment Model Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="jacket">Jacket / Suit</option>
                <option value="trouser">Pants / Trouser</option>
                <option value="t-shirt">T-Shirt / Knit</option>
                <option value="polo">Polo Shirt</option>
                <option value="shirt">Woven Shirt</option>
                <option value="dress">Dress</option>
                <option value="skirt">Skirt</option>
                <option value="outerwear">Outerwear</option>
                <option value="custom">Custom Block</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Pattern Size</label>
              <select
                value={baseSize}
                onChange={(e) => setBaseSize(e.target.value as GarmentSize)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Total Pattern Pieces: </span>
              {garment.components.length} components linked under 1-Object parametric hierarchy.
            </div>
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
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
