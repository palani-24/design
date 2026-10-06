import React, { useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { X, Save, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export const SaveProjectModal: React.FC = () => {
  const { activeModal, setActiveModal, currentProject, garment, loadProject, setNotification } = useCADStore();
  const [title, setTitle] = useState(currentProject.title);
  const [description, setDescription] = useState(currentProject.description || '');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (activeModal !== 'save') return null;

  const handleSaveToBackend = async () => {
    setSaving(true);
    setStatusMessage(null);

    const updatedProject = {
      ...currentProject,
      title: title.trim() || 'Untitled Garment',
      description: description.trim(),
      garment,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      loadProject(updatedProject);
      setStatusMessage({ type: 'success', text: 'Project successfully saved to MongoDB database!' });
      setNotification(`Project saved: ${updatedProject.title}`);

      setTimeout(() => {
        setActiveModal('none');
      }, 1200);
    } catch (err) {
      console.warn('Backend save issue, project saved to local store:', err);
      loadProject(updatedProject);
      setStatusMessage({
        type: 'success',
        text: 'Saved to local workspace store (Server fallback active).',
      });
      setTimeout(() => {
        setActiveModal('none');
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadJSON = () => {
    const updatedProject = {
      ...currentProject,
      title: title.trim() || 'Untitled Garment',
      description: description.trim(),
      garment,
      updatedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(updatedProject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${updatedProject.title.toLowerCase().replace(/\s+/g, '-')}-v1.4.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({ type: 'success', text: 'JSON project file downloaded successfully!' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Save Project</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Standard 1-Object Parametric Nest with Front, Back and Sleeve."
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Current Size:</span>
              <span className="font-bold text-slate-800 font-mono">Size {garment.currentSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Components:</span>
              <span className="font-bold text-slate-800 font-mono">{garment.components.length} (Front, Back, Sleeve)</span>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-2.5 rounded-lg flex items-center gap-2 text-[11px] font-semibold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleSaveToBackend}
              disabled={saving}
              id="confirm-save-project-btn"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save to MongoDB Database'}
            </button>

            <button
              onClick={handleDownloadJSON}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Download Local Project JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
