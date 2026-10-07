import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Plus, Sparkles, Layers, Box } from 'lucide-react';
import { PatternComponent } from '../../shared/types';

interface PieceArchetype {
  type: string;
  name: string;
  code: string;
  cut: string;
  qty: number;
  width: number;
  height: number;
  description: string;
}

const PIECE_ARCHETYPES: PieceArchetype[] = [
  {
    type: 'pocket-flap',
    name: 'Flap Pocket',
    code: 'PKT-FLP',
    cut: 'Cut 2 in Shell + Interfaced',
    qty: 2,
    width: 140,
    height: 60,
    description: 'Finished welt pocket flap for suits & blazers',
  },
  {
    type: 'pocket-bag',
    name: 'In-Seam Pocket Bag',
    code: 'PKT-BAG',
    cut: 'Cut 4 in Pocketing Twill',
    qty: 4,
    width: 160,
    height: 180,
    description: 'Trouser & skirt deep side seam pocket bag',
  },
  {
    type: 'back-yoke',
    name: 'Shirt Back Split Yoke',
    code: 'YK',
    cut: 'Cut 2 (Inner & Outer)',
    qty: 2,
    width: 220,
    height: 85,
    description: 'Curved shoulder yoke with double yoke construction',
  },
  {
    type: 'cuff',
    name: 'Shirt Barrel Cuff',
    code: 'CUFF',
    cut: 'Cut 4 (Pair Inner & Outer)',
    qty: 4,
    width: 120,
    height: 65,
    description: 'Buttoned wrist sleeve cuff with 1cm overlap',
  },
  {
    type: 'collar-stand',
    name: 'Collar Stand Band',
    code: 'COL-STN',
    cut: 'Cut 2 (Outer + Facing)',
    qty: 2,
    width: 180,
    height: 45,
    description: 'Curved neckband stand for formal shirts & jackets',
  },
  {
    type: 'waistband',
    name: 'Curved Waistband Extension',
    code: 'WB-EXT',
    cut: 'Cut 2 in Self Fabric',
    qty: 2,
    width: 240,
    height: 55,
    description: 'Contour waistband tab extension with buttonhole zone',
  },
  {
    type: 'belt-loop',
    name: 'Belt Loops Carrier Strip',
    code: 'BLT-LP',
    cut: 'Cut 1 Strip (Cut into 5)',
    qty: 1,
    width: 300,
    height: 25,
    description: 'Folded loop carrier for trousers, jeans & trench coats',
  },
  {
    type: 'underarm-gusset',
    name: 'Underarm Pivot Gusset',
    code: 'GST',
    cut: 'Cut 2 in Shell',
    qty: 2,
    width: 80,
    height: 80,
    description: 'Diamond mobility gusset for outer jackets and flight suits',
  },
];

export const AddComponentModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, addComponentToGarment } = useCADStore();

  const [selectedArchetype, setSelectedArchetype] = useState<PieceArchetype>(PIECE_ARCHETYPES[0]);
  const [customName, setCustomName] = useState(PIECE_ARCHETYPES[0].name);
  const [customCode, setCustomCode] = useState(PIECE_ARCHETYPES[0].code);
  const [customCut, setCustomCut] = useState(PIECE_ARCHETYPES[0].cut);
  const [customQty, setCustomQty] = useState(PIECE_ARCHETYPES[0].qty);
  const [pieceWidth, setPieceWidth] = useState(PIECE_ARCHETYPES[0].width);
  const [pieceHeight, setPieceHeight] = useState(PIECE_ARCHETYPES[0].height);

  if (activeModal !== 'addComponent') return null;

  const handleSelectArchetype = (arch: PieceArchetype) => {
    setSelectedArchetype(arch);
    setCustomName(arch.name);
    setCustomCode(arch.code);
    setCustomCut(arch.cut);
    setCustomQty(arch.qty);
    setPieceWidth(arch.width);
    setPieceHeight(arch.height);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pieceId = `piece-${Date.now().toString().slice(-6)}-${customCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const w = Number(pieceWidth) || 140;
    const h = Number(pieceHeight) || 70;

    // Place offset intelligently to the right of existing pieces
    const lastComp = garment.components[garment.components.length - 1];
    const newOffsetX = lastComp ? lastComp.offset.x + 220 : 300;
    const newOffsetY = lastComp ? lastComp.offset.y : 150;

    const newComponent: PatternComponent = {
      id: pieceId,
      pieceCode: customCode.trim().toUpperCase() || 'PC',
      name: customName.trim() || 'New Pattern Piece',
      cutInstruction: customCut.trim() || `Cut ${customQty}`,
      quantity: Number(customQty) || 1,
      offset: { x: newOffsetX, y: newOffsetY },
      seamAllowanceMm: 12.7,
      grainline: {
        start: { x: 20, y: h / 2 },
        end: { x: w - 20, y: h / 2 },
        label: `${customCode || 'GRAINLINE'} ↔`,
      },
      paths: [
        { type: 'M', zone: 'waist', points: [{ x: 0, y: 0, name: 'Top Left' }] },
        { type: 'L', zone: 'waist', points: [{ x: w, y: 0, name: 'Top Right' }] },
        { type: 'L', zone: 'hem', points: [{ x: w, y: h, name: 'Bottom Right' }] },
        { type: 'L', zone: 'hem', points: [{ x: 0, y: h, name: 'Bottom Left' }] },
        { type: 'Z', zone: 'center-fold', points: [{ x: 0, y: 0 }] },
      ],
      notches: [{ x: w / 2, y: 0, name: 'Center Notch' }],
      labels: [
        { text: customCode || customName, position: { x: w / 2 - 20, y: h / 2 }, type: 'title' },
        { text: customCut, position: { x: w / 2 - 30, y: h / 2 + 15 }, type: 'meta' },
      ],
      measurements: {
        length: h / 2,
        halfChest: w / 4,
      },
    };

    addComponentToGarment(newComponent);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            <div>
              <h2 className="text-sm font-bold">Add Pattern Piece to Garment</h2>
              <p className="text-[11px] text-slate-400">
                Insert a new parametric component into <span className="text-blue-400 font-semibold">{garment.name}</span>
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-2">Select Piece Archetype Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PIECE_ARCHETYPES.map((arch) => (
                <button
                  key={arch.type}
                  type="button"
                  onClick={() => handleSelectArchetype(arch)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedArchetype.type === arch.type
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-2xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{arch.name}</div>
                  <div className="text-[9.5px] font-mono text-slate-500 mt-0.5">{arch.code}</div>
                  <div className="text-[9px] text-slate-400 mt-1 truncate">{arch.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Piece Settings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Piece Title</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Piece Code</label>
                <input
                  type="text"
                  required
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cutting Instruction</label>
                <input
                  type="text"
                  required
                  value={customCut}
                  onChange={(e) => setCustomCut(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cut Quantity</label>
                <select
                  value={customQty}
                  onChange={(e) => setCustomQty(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-medium bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 (Single Piece)</option>
                  <option value={2}>2 (Pair Left & Right)</option>
                  <option value={4}>4 (Pair Shell + Lining)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Width (CAD mm)</label>
                <input
                  type="number"
                  value={pieceWidth}
                  onChange={(e) => setPieceWidth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Height (CAD mm)</label>
                <input
                  type="number"
                  value={pieceHeight}
                  onChange={(e) => setPieceHeight(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">1-Object Invariant:</span> This piece will be linked automatically to{' '}
              <span className="font-semibold">{garment.name}</span>. When the entire garment is graded or repositioned,
              this piece scales and moves synchronously.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Piece to Garment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
