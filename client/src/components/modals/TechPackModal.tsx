import React from 'react';
import { useCADStore } from '../../store/useCADStore';
import { GARMENT_SIZES, GarmentSize } from '../../shared/types';
import { X, ClipboardList, Printer, Download, Check } from 'lucide-react';

export const TechPackModal: React.FC = () => {
  const { activeModal, setActiveModal, garment } = useCADStore();

  if (activeModal !== 'techPack') return null;

  const sizeTable = garment.sizeTable;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Industrial Apparel Tech Pack & Spec Sheet</h3>
              <p className="text-[10px] text-slate-400">
                Style: {garment.name} • Active Size: {garment.currentSize} • Tolerance: ±0.5 cm
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Style Header Block */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">STYLE NAME</span>
              <strong className="text-slate-900 text-xs">{garment.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">STYLE CODE</span>
              <span className="font-mono text-xs font-semibold">EP-CAD-{garment.category.toUpperCase()}-001</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">BASE SIZE / GRADED</span>
              <span className="font-mono text-xs font-semibold">{garment.baseSize} → {garment.currentSize}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">DATE GENERATED</span>
              <span className="font-mono text-xs text-slate-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Point of Measure (POM) Grading Chart */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">1. Point of Measure (POM) Grading Specifications</span>
              <span className="text-[10px] font-mono text-slate-500">Metric (cm) • Tolerance ±0.5cm</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-1.5 px-3">POM CODE</th>
                    <th className="py-1.5 px-3">MEASUREMENT DESCRIPTION</th>
                    <th className="py-1.5 px-2">TOL</th>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <th
                        key={sz}
                        className={`py-1.5 px-2 text-center ${
                          sz === garment.currentSize ? 'bg-blue-600 text-white font-bold' : ''
                        }`}
                      >
                        {sz}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-01</td>
                    <td className="py-1.5 px-3">Total Bust / Chest Circumference (1" below armhole)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.bust.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-02</td>
                    <td className="py-1.5 px-3">Half-Chest Width Across Body (1/2 Chest)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.width.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-03</td>
                    <td className="py-1.5 px-3">Waist Circumference (Narrowest point)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.waist.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-04</td>
                    <td className="py-1.5 px-3">Hip / Hem Sweep Circumference</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.hip.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-05</td>
                    <td className="py-1.5 px-3">Center Back Body Length (From HPS to Bottom Hem)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.length.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-06</td>
                    <td className="py-1.5 px-3">Sleeve Length (From Crown tip to Sleeve Hem)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.5</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.sleeveLength.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold text-slate-900">POM-07</td>
                    <td className="py-1.5 px-3">Shoulder Width (HPS to Shoulder tip)</td>
                    <td className="py-1.5 px-2 text-slate-400">±0.3</td>
                    {GARMENT_SIZES.map((sz: GarmentSize) => (
                      <td key={sz} className={`py-1.5 px-2 text-center ${sz === garment.currentSize ? 'font-bold text-blue-600 bg-blue-50/50' : ''}`}>
                        {sizeTable[sz]?.shoulderWidth.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill of Materials (BOM) Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">2. Bill of Materials (BOM)</span>
              <span className="text-[10px] text-slate-500">Fabric & Trims Specification</span>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-1.5 px-3">ITEM</th>
                  <th className="py-1.5 px-3">DESCRIPTION / COMPOSITION</th>
                  <th className="py-1.5 px-2">COLOR</th>
                  <th className="py-1.5 px-2">CONSUMPTION</th>
                  <th className="py-1.5 px-2">SUPPLIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-1.5 px-3 font-bold text-slate-900">Shell Fabric</td>
                  <td className="py-1.5 px-3">100% Combed Compact Cotton, Single Jersey, 180 GSM</td>
                  <td className="py-1.5 px-2">Pantone TCX</td>
                  <td className="py-1.5 px-2 font-mono">1.25 m</td>
                  <td className="py-1.5 px-2">Textile Mill A</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-bold text-slate-900">Neck Rib</td>
                  <td className="py-1.5 px-3">95% Cotton / 5% Spandex 1x1 Rib Band, 220 GSM</td>
                  <td className="py-1.5 px-2">DTM (Match)</td>
                  <td className="py-1.5 px-2 font-mono">0.08 m</td>
                  <td className="py-1.5 px-2">Textile Mill A</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-bold text-slate-900">Sewing Thread</td>
                  <td className="py-1.5 px-3">100% Core-Spun Polyester Thread 40/2 (Overlock & Topstitch)</td>
                  <td className="py-1.5 px-2">DTM</td>
                  <td className="py-1.5 px-2 font-mono">85 m / unit</td>
                  <td className="py-1.5 px-2">Coats / A&E</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3 font-bold text-slate-900">Main Label</td>
                  <td className="py-1.5 px-3">High-density Damask Woven Label with folded soft edges</td>
                  <td className="py-1.5 px-2">Brand Spec</td>
                  <td className="py-1.5 px-2 font-mono">1 pc</td>
                  <td className="py-1.5 px-2">Label Co</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Construction & Seam Standards */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-1.5">
            <span className="font-bold text-xs text-slate-800 block">3. Assembly & Construction Guidelines</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li><strong>Shoulder Seams:</strong> Reinforced with clear silicone elastic / mobilon tape inside seam.</li>
              <li><strong>Armholes & Side Seams:</strong> 4-thread overlock with 1/4" bite (10 - 12 SPI).</li>
              <li><strong>Bottom & Sleeve Hem:</strong> 2-needle coverstitch with 2.5cm hem fold (blind hem finish).</li>
              <li><strong>Neckline Finish:</strong> Clean tape finish at back neck extending shoulder-to-shoulder.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Approved for Production • Easy Pattern CAD Engine v4.8
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
