import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  X,
  Layers,
  Sparkles,
  Scissors,
  Plus,
  Trash2,
  Ruler,
  Sliders,
  Check,
} from 'lucide-react';
import { CustomGarmentInput, GarmentSize } from '../../shared/types';

interface PresetPiece {
  id: string;
  type: 'front' | 'back' | 'sleeve' | 'collar' | 'facing' | 'pocket' | 'waistband' | 'canvas';
  name: string;
  pieceCode: string;
  quantity: number;
  cutInstruction: string;
  selected: boolean;
}

const DEFAULT_PRESET_PIECES: Record<string, PresetPiece[]> = {
  jacket: [
    { id: 'p1', type: 'front', name: 'Front Body Panel', pieceCode: 'FRT', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p2', type: 'back', name: 'Back Body Panel', pieceCode: 'BK', quantity: 1, cutInstruction: 'Cut 1 on Fold', selected: true },
    { id: 'p3', type: 'sleeve', name: 'Two-Piece Top Sleeve', pieceCode: 'SLV-TOP', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p4', type: 'sleeve', name: 'Two-Piece Under Sleeve', pieceCode: 'SLV-UND', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p5', type: 'collar', name: 'Under Collar with Bridle', pieceCode: 'COL', quantity: 1, cutInstruction: 'Cut 1 on Bias', selected: true },
    { id: 'p6', type: 'pocket', name: 'Flap & Welt Pocket', pieceCode: 'PKT-WLT', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p7', type: 'facing', name: 'Front Facing', pieceCode: 'FCG', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p8', type: 'canvas', name: 'Floating Chest Canvas', pieceCode: 'CANVAS', quantity: 2, cutInstruction: 'Cut 2 in Horsehair Canvas', selected: false },
  ],
  trouser: [
    { id: 'p1', type: 'front', name: 'Front Leg with Crease', pieceCode: 'FRT-LEG', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p2', type: 'back', name: 'Back Leg with Seat Rise', pieceCode: 'BK-LEG', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p3', type: 'waistband', name: 'Contour Waistband', pieceCode: 'WB', quantity: 2, cutInstruction: 'Cut 2 (Outer + Interfacing)', selected: true },
    { id: 'p4', type: 'pocket', name: 'Slant Front Pocket Bag', pieceCode: 'PKT-BAG', quantity: 2, cutInstruction: 'Cut 2 in Pocketing Cotton', selected: true },
    { id: 'p5', type: 'facing', name: 'Zip Fly Shield & Underlap', pieceCode: 'FLY', quantity: 1, cutInstruction: 'Cut 1 Interfaced', selected: true },
  ],
  dress: [
    { id: 'p1', type: 'front', name: 'Princess Front Panel', pieceCode: 'FRT-PRN', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p2', type: 'back', name: 'Back Bodice with Zip', pieceCode: 'BK-ZIP', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p3', type: 'sleeve', name: 'Fitted Sleeve', pieceCode: 'SLV', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p4', type: 'facing', name: 'Neckline All-in-One Facing', pieceCode: 'NCK-FCG', quantity: 1, cutInstruction: 'Cut 1 on Fold', selected: true },
  ],
  skirt: [
    { id: 'p1', type: 'front', name: 'Front Skirt Gore', pieceCode: 'SKT-FRT', quantity: 1, cutInstruction: 'Cut 1 on Fold', selected: true },
    { id: 'p2', type: 'back', name: 'Back Skirt Gore (Pair)', pieceCode: 'SKT-BK', quantity: 2, cutInstruction: 'Cut 2 in Shell', selected: true },
    { id: 'p3', type: 'waistband', name: 'Waistband Facing', pieceCode: 'WB-FAC', quantity: 1, cutInstruction: 'Cut 1 on Fold', selected: true },
  ],
  shirt: [
    { id: 'p1', type: 'front', name: 'Left & Right Front Placket', pieceCode: 'SH-FRT', quantity: 2, cutInstruction: 'Cut 2 in Cotton', selected: true },
    { id: 'p2', type: 'back', name: 'Back Panel with Box Pleat', pieceCode: 'SH-BK', quantity: 1, cutInstruction: 'Cut 1 on Fold', selected: true },
    { id: 'p3', type: 'sleeve', name: 'Shirt Sleeve with Placket', pieceCode: 'SH-SLV', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p4', type: 'collar', name: 'Shirt Collar Stand & Leaf', pieceCode: 'SH-COL', quantity: 2, cutInstruction: 'Cut 2 Interfaced', selected: true },
    { id: 'p5', type: 'pocket', name: 'Chest Patch Pocket', pieceCode: 'CH-PKT', quantity: 1, cutInstruction: 'Cut 1 in Cotton', selected: true },
  ],
  outerwear: [
    { id: 'p1', type: 'front', name: 'Storm Flap Front Body', pieceCode: 'OW-FRT', quantity: 2, cutInstruction: 'Cut 2 in Gabardine', selected: true },
    { id: 'p2', type: 'back', name: 'Vented Back Body', pieceCode: 'OW-BK', quantity: 2, cutInstruction: 'Cut 2 in Gabardine', selected: true },
    { id: 'p3', type: 'sleeve', name: 'Raglan Sleeve Pair', pieceCode: 'OW-SLV', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
    { id: 'p4', type: 'collar', name: 'Convertible Storm Collar', pieceCode: 'OW-COL', quantity: 2, cutInstruction: 'Cut 2 in Gabardine', selected: true },
    { id: 'p5', type: 'pocket', name: 'Welt Handwarmer Pocket', pieceCode: 'OW-PKT', quantity: 2, cutInstruction: 'Cut 2 (Pair)', selected: true },
  ],
};

export const ManualGarmentModal: React.FC = () => {
  const { activeModal, setActiveModal, createCustomGarment } = useCADStore();

  const [name, setName] = useState('Bespoke Tailored Garment');
  const [category, setCategory] = useState<'jacket' | 'trouser' | 'dress' | 'shirt' | 'outerwear'>('jacket');
  const [baseSize, setBaseSize] = useState<GarmentSize>('S');
  const [fabricName, setFabricName] = useState('100% Super 120s Wool Worsted');

  // Spec Sheet Measurements
  const [bustChest, setBustChest] = useState(96);
  const [waist, setWaist] = useState(82);
  const [hip, setHip] = useState(98);
  const [length, setLength] = useState(72);
  const [shoulderWidth, setShoulderWidth] = useState(44);

  // Pieces List
  const [pieces, setPieces] = useState<PresetPiece[]>(DEFAULT_PRESET_PIECES.jacket);

  // New Custom Piece input
  const [newPieceName, setNewPieceName] = useState('');
  const [newPieceCode, setNewPieceCode] = useState('');
  const [newPieceQty, setNewPieceQty] = useState(2);

  if (activeModal !== 'manualGarment') return null;

  const handleCategoryChange = (cat: 'jacket' | 'trouser' | 'dress' | 'shirt' | 'outerwear') => {
    setCategory(cat);
    const preset = DEFAULT_PRESET_PIECES[cat] || DEFAULT_PRESET_PIECES.jacket;
    setPieces(preset);

    if (cat === 'jacket') {
      setName('Custom Tailored Jacket');
      setLength(72);
      setBustChest(96);
    } else if (cat === 'trouser') {
      setName('Custom Fitted Trousers');
      setLength(104);
      setWaist(82);
    } else if (cat === 'dress') {
      setName('Custom Haute Couture Dress');
      setLength(98);
      setBustChest(90);
    } else if (cat === 'shirt') {
      setName('Custom Bespoke Oxford Shirt');
      setLength(76);
      setBustChest(100);
    } else if (cat === 'outerwear') {
      setName('Custom Storm Outerwear Coat');
      setLength(108);
      setBustChest(104);
    }
  };

  const handleTogglePiece = (id: string) => {
    setPieces(pieces.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  };

  const handleAddCustomPiece = () => {
    if (!newPieceName.trim()) return;
    const pieceId = `p-${Date.now()}`;
    const code = newPieceCode.trim() || `P${pieces.length + 1}`;
    const newPiece: PresetPiece = {
      id: pieceId,
      type: 'facing',
      name: newPieceName.trim(),
      pieceCode: code.toUpperCase(),
      quantity: Number(newPieceQty) || 1,
      cutInstruction: `Cut ${newPieceQty} in Shell`,
      selected: true,
    };
    setPieces([...pieces, newPiece]);
    setNewPieceName('');
    setNewPieceCode('');
    setNewPieceQty(2);
  };

  const handleRemovePiece = (id: string) => {
    setPieces(pieces.filter((p) => p.id !== id));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPieces = pieces.filter((p) => p.selected);
    if (selectedPieces.length === 0) {
      alert('Please select at least one pattern piece.');
      return;
    }

    const payload: CustomGarmentInput = {
      name: name.trim() || 'Custom Garment',
      category,
      baseSize,
      fabricName,
      pieces: selectedPieces.map((p) => ({
        type: p.type,
        name: p.name,
        pieceCode: p.pieceCode,
        quantity: p.quantity,
        cutInstruction: p.cutInstruction,
      })),
      measurements: {
        bustChest,
        waist,
        hip,
        length,
        shoulderWidth,
      },
    };

    createCustomGarment(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400 font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Manual Garment Creator & Pattern Wizard</h2>
              <p className="text-[11px] text-slate-400">
                Design new industrial apparel blocks from scratch with customizable pieces & measurements
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

        {/* Content Body */}
        <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-5 text-xs space-y-5">
          {/* Section 1: Garment Overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              1. Garment Classification & Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Garment Model Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Single-Breasted Peak Lapel Jacket"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="jacket">Tailored Jackets & Suits</option>
                  <option value="trouser">Pants & Trousers</option>
                  <option value="dress">Dresses & Gowns</option>
                  <option value="skirt">Skirts</option>
                  <option value="shirt">Shirts & Tops</option>
                  <option value="outerwear">Outerwear & Coats</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Pattern Size</label>
                <select
                  value={baseSize}
                  onChange={(e) => setBaseSize(e.target.value as GarmentSize)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="XS">XS (Extra Small)</option>
                  <option value="S">S (Small - Standard Base)</option>
                  <option value="M">M (Medium)</option>
                  <option value="L">L (Large)</option>
                  <option value="XL">XL (Extra Large)</option>
                  <option value="XXL">XXL (Double Extra Large)</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block font-semibold text-slate-700 mb-1">Fabric & Material Composition</label>
              <input
                type="text"
                value={fabricName}
                onChange={(e) => setFabricName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 100% Cotton Twill 280gsm"
              />
            </div>
          </div>

          {/* Section 2: Key Spec Sheet Dimensions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-600" />
              2. Spec Sheet Key Dimensions (Metric cm)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bust / Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={bustChest}
                  onChange={(e) => setBustChest(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hip (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={hip}
                  onChange={(e) => setHip(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Length (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Shoulder Width (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={shoulderWidth}
                  onChange={(e) => setShoulderWidth(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pattern Components / Pieces Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                3. Pattern Pieces & Nest Composition ({pieces.filter((p) => p.selected).length} Selected)
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                1-Object Parametric Nest
              </span>
            </div>

            {/* List of Pieces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
              {pieces.map((piece) => (
                <div
                  key={piece.id}
                  onClick={() => handleTogglePiece(piece.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    piece.selected
                      ? 'bg-white border-blue-400 shadow-2xs text-slate-800'
                      : 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        piece.selected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {piece.selected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{piece.name}</div>
                      <div className="text-[10px] text-slate-500">{piece.cutInstruction}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9.5px] font-mono font-bold text-slate-600">
                      {piece.pieceCode}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePiece(piece.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Piece on the fly */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">+ Add Custom Piece:</span>
              <input
                type="text"
                placeholder="Piece Name (e.g. Back Yoke)"
                value={newPieceName}
                onChange={(e) => setNewPieceName(e.target.value)}
                className="px-2.5 py-1 border border-slate-300 rounded text-xs flex-1 min-w-[140px]"
              />
              <input
                type="text"
                placeholder="Code (e.g. YK)"
                value={newPieceCode}
                onChange={(e) => setNewPieceCode(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded text-xs w-20 font-mono"
              />
              <select
                value={newPieceQty}
                onChange={(e) => setNewPieceQty(Number(e.target.value))}
                className="px-2 py-1 border border-slate-300 rounded text-xs bg-white"
              >
                <option value={1}>Cut 1</option>
                <option value={2}>Cut 2 (Pair)</option>
                <option value={4}>Cut 4</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomPiece}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Piece
              </button>
            </div>
          </div>

          {/* Invariant Info Callout */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">Parametric Industrial Guarantee:</span> All created pieces are grouped under
              a single 1-Object grading hierarchy. Grading from base size {baseSize} will rescale all seams, collars,
              and plackets uniformly in one pass.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate & Load CAD Pattern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
