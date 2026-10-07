import React, { useState, useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Scissors, Save, Ruler, Layers } from 'lucide-react';
import { PatternComponent } from '../../shared/types';

export const EditComponentModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, selectedComponentId, updateComponent } = useCADStore();

  const targetComponent: PatternComponent | undefined =
    selectedComponentId && selectedComponentId !== 'entire'
      ? garment.components.find((c) => c.id === selectedComponentId)
      : garment.components[0];

  const [name, setName] = useState('');
  const [pieceCode, setPieceCode] = useState('');
  const [cutInstruction, setCutInstruction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [seamAllowanceMm, setSeamAllowanceMm] = useState(12.7);

  useEffect(() => {
    if (targetComponent) {
      setName(targetComponent.name);
      setPieceCode(targetComponent.pieceCode || 'PIECE');
      setCutInstruction(targetComponent.cutInstruction);
      setQuantity(targetComponent.quantity || 1);
      setSeamAllowanceMm(targetComponent.seamAllowanceMm ?? 12.7);
    }
  }, [targetComponent, activeModal]);

  if (activeModal !== 'editComponent' || !targetComponent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComponent(targetComponent.id, {
      name: name.trim() || targetComponent.name,
      pieceCode: pieceCode.trim().toUpperCase() || targetComponent.pieceCode,
      cutInstruction: cutInstruction.trim() || targetComponent.cutInstruction,
      quantity: Number(quantity) || 1,
      seamAllowanceMm: Number(seamAllowanceMm) || 12.7,
    });
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Edit Pattern Piece Settings</h3>
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
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Piece Description</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">TUKA Code</label>
              <input
                type="text"
                required
                value={pieceCode}
                onChange={(e) => setPieceCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cutting Instruction</label>
            <input
              type="text"
              required
              value={cutInstruction}
              onChange={(e) => setCutInstruction(e.target.value)}
              placeholder="e.g. Cut 2 (Pair) • Self Fabric"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cut Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 (Single)</option>
                <option value={2}>2 (Pair / Left & Right)</option>
                <option value={4}>4 (Outer & Lining Pairs)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seam Allowance (mm)</label>
              <input
                type="number"
                step="0.5"
                value={seamAllowanceMm}
                onChange={(e) => setSeamAllowanceMm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Node Reference: <span className="font-mono text-blue-600">{targetComponent.id}</span>
            </div>
            <div>
              Connected to active garment <span className="font-semibold text-slate-800">{garment.name}</span>.
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
              Save Piece
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
