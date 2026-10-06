import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { GARMENT_SIZES, GarmentSize, SizeTable } from '@shared/types';
import { DEFAULT_SIZE_TABLE } from '@shared/constants';
import { X, TableProperties, RotateCcw, Check, Save } from 'lucide-react';

export const GradeTablesModal: React.FC = () => {
  const { activeModal, setActiveModal, garment, setGarment } = useCADStore();
  const [sizeTable, setSizeTable] = useState<SizeTable>({ ...garment.sizeTable });
  const [savedMessage, setSavedMessage] = useState(false);

  if (activeModal !== 'gradeTables') return null;

  const handleCellChange = (size: GarmentSize, field: keyof SizeTable[GarmentSize], value: string) => {
    const num = parseFloat(value) || 0;
    setSizeTable((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [field]: num,
      },
    }));
  };

  const handleSave = async () => {
    // Update local garment
    const updated = {
      ...garment,
      sizeTable: sizeTable,
    };
    setGarment(updated);

    // Sync to backend sizes endpoint
    try {
      await fetch('/api/sizes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sizeTable),
      });
    } catch (e) {
      console.warn('Backend sync failed, updated locally:', e);
    }

    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setActiveModal('none');
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Reset to standard apparel size grading specs?')) {
      setSizeTable({ ...DEFAULT_SIZE_TABLE });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Configurable Apparel Grade Table (cm)</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <p className="text-[11px]">
              All measurements in metric centimeters (cm). Proportional vector grading engine interpolates these exact points during garment morphing.
            </p>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-semibold text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">SIZE</th>
                  <th className="p-2.5">BUST</th>
                  <th className="p-2.5">WAIST</th>
                  <th className="p-2.5">HIP</th>
                  <th className="p-2.5">LENGTH</th>
                  <th className="p-2.5">WIDTH (1/2)</th>
                  <th className="p-2.5">HEIGHT</th>
                  <th className="p-2.5">SLEEVE</th>
                  <th className="p-2.5">SHOULDER</th>
                  <th className="p-2.5">NECK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GARMENT_SIZES.map((sz) => {
                  const dims = sizeTable[sz];
                  return (
                    <tr key={sz} className="hover:bg-blue-50/40">
                      <td className="p-2 font-bold text-slate-800 bg-slate-50">{sz}</td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.bust}
                          onChange={(e) => handleCellChange(sz, 'bust', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center font-bold focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.waist}
                          onChange={(e) => handleCellChange(sz, 'waist', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.hip}
                          onChange={(e) => handleCellChange(sz, 'hip', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.length}
                          onChange={(e) => handleCellChange(sz, 'length', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center font-bold focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.width}
                          onChange={(e) => handleCellChange(sz, 'width', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.height}
                          onChange={(e) => handleCellChange(sz, 'height', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.sleeveLength}
                          onChange={(e) => handleCellChange(sz, 'sleeveLength', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.shoulderWidth}
                          onChange={(e) => handleCellChange(sz, 'shoulderWidth', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={dims.neckCircumference}
                          onChange={(e) => handleCellChange(sz, 'neckCircumference', e.target.value)}
                          className="w-16 p-1 border rounded text-slate-800 text-center focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {savedMessage ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs">
              <Check className="w-4 h-4" /> Size table updated and saved!
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Updates apply immediately to grading engine.</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Size Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
