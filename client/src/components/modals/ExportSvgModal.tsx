import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { generateGarmentSvg, SvgExportOptions } from '@shared/svgExport';
import { X, Download, Eye, FileCode, Check } from 'lucide-react';

export const ExportSvgModal: React.FC = () => {
  const { activeModal, setActiveModal, garment } = useCADStore();
  const [includeGrainlines, setIncludeGrainlines] = useState(true);
  const [includeNotches, setIncludeNotches] = useState(true);
  const [includeLabels, setIncludeLabels] = useState(true);
  const [includeBounds, setIncludeBounds] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [previewTab, setPreviewTab] = useState<'visual' | 'code'>('visual');

  if (activeModal !== 'export') return null;

  const exportOptions: SvgExportOptions = {
    includeGrainlines,
    includeNotches,
    includeLabels,
    includeBounds,
    strokeWidth,
  };

  const svgOutput = generateGarmentSvg(garment, exportOptions);
  const filename = `${garment.name.toLowerCase().replace(/\s+/g, '-')}-size-${garment.currentSize}.svg`;

  const handleDownload = () => {
    const blob = new Blob([svgOutput], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Export Vector SVG Pattern</h3>
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
          {/* Export Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeGrainlines}
                onChange={(e) => setIncludeGrainlines(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Grainlines
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeNotches}
                onChange={(e) => setIncludeNotches(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Notches
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeLabels}
                onChange={(e) => setIncludeLabels(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              CAD Labels
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeBounds}
                onChange={(e) => setIncludeBounds(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              1-Object Bounds
            </label>
          </div>

          {/* Stroke Width Slider */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-700">Stroke Thickness: {strokeWidth}px</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
              className="w-36 accent-blue-600"
            />
          </div>

          {/* Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex gap-1">
                <button
                  onClick={() => setPreviewTab('visual')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                    previewTab === 'visual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Visual Preview
                </button>
                <button
                  onClick={() => setPreviewTab('code')}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                    previewTab === 'code'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  SVG Markup
                </button>
              </div>
              <span className="font-mono text-[10px] text-slate-500">{filename}</span>
            </div>

            {/* Visual or Code View */}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50 h-56 flex items-center justify-center p-2">
              {previewTab === 'visual' ? (
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: svgOutput }}
                />
              ) : (
                <textarea
                  readOnly
                  value={svgOutput}
                  className="w-full h-full p-2 bg-slate-900 text-slate-200 font-mono text-[10px] resize-none focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Current Graded Size: <strong className="text-slate-800">{garment.currentSize}</strong> (Front + Back + Sleeve)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('none')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              id="confirm-download-svg-btn"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
