import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, FolderPlus, Sparkles } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { activeModal, setActiveModal, createNewProject } = useCADStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'t-shirt' | 'polo' | 'shirt' | 'trouser'>('t-shirt');

  if (activeModal !== 'new') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Untitled Garment Pattern';
    createNewProject(finalTitle);
    setActiveModal('none');
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Basic T-Shirt — Size S to M v1.4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Garment Template</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('t-shirt')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  category === 't-shirt'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  Basic T-Shirt
                  <span className="text-[9px] bg-blue-600 text-white px-1 rounded">1-Object</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Front, Back & Sleeve</div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('polo')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  category === 'polo'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs">Polo T-Shirt</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ribbed collar & placket</div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Parametric Constraint Engine</span>
            </div>
            <span>New pattern initialized with standard metric size table and linked component geometry.</span>
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
