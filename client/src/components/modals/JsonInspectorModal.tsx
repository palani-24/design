import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Code2, Copy, Check } from 'lucide-react';

export const JsonInspectorModal: React.FC = () => {
  const { activeModal, setActiveModal, currentProject } = useCADStore();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'jsonInspector') return null;

  const jsonStr = JSON.stringify(currentProject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Pattern JSON Data Inspector</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">
              Full 1-Object Parametric AST (Garment, Paths, Notches, Dimensions)
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>

          <textarea
            readOnly
            value={jsonStr}
            className="flex-1 w-full bg-slate-950 text-slate-300 font-mono text-[11px] p-3 rounded-lg border border-slate-800 resize-none focus:outline-none"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
