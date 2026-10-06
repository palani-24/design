import React, { useEffect, useState } from 'react';
import { useCADStore } from '../../store/useCADStore';
import { Project } from '@shared/types';
import { projectSchema } from '@shared/validation';
import {
  X,
  FolderOpen,
  Upload,
  Trash2,
  Calendar,
  Layers,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const OpenProjectModal: React.FC = () => {
  const { activeModal, setActiveModal, loadProject, currentProject } = useCADStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using memory fallback:', err);
      // Fallback with current project
      setProjects([currentProject]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'open') {
      fetchProjects();
    }
  }, [activeModal]);

  if (activeModal !== 'open') return null;

  // Real File Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedJson = JSON.parse(text);
        const validated = projectSchema.safeParse(parsedJson);

        if (!validated.success) {
          setImportError('Invalid Easy Pattern project format. Schema validation failed.');
          return;
        }

        loadProject(validated.data as Project);
        setActiveModal('none');
      } catch (err) {
        setImportError(`Failed to parse JSON: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Open Garment CAD Project</h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* File Upload Banner */}
          <div className="p-3.5 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 rounded-xl text-center transition-colors">
            <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
            <div className="font-bold text-slate-800 text-xs">Import Local JSON Project File</div>
            <div className="text-[10px] text-slate-500 mb-2">
              Select or drop an exported Easy Pattern (*.json) file
            </div>
            <label className="inline-block px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer shadow-xs transition-colors">
              Browse Project File
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {importError && (
              <div className="mt-2 text-rose-600 text-[10px] font-semibold flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {importError}
              </div>
            )}
          </div>

          {/* Database Saved Projects List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Saved Projects (MongoDB Store)
              </span>
              <button
                onClick={fetchProjects}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-[10px]"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No saved projects found.</div>
            ) : (
              <div className="space-y-2">
                {projects.map((proj) => {
                  const isActive = currentProject.id === proj.id;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        loadProject(proj);
                        setActiveModal('none');
                      }}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 truncate text-xs">{proj.title}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 rounded font-mono font-bold">
                            Size {proj.garment?.currentSize || 'S'}
                          </span>
                          {isActive && (
                            <span className="text-[9px] bg-blue-600 text-white px-1 rounded font-bold">
                              OPEN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {proj.description || '1-Object Vector Pattern'}
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 font-mono mt-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {proj.garment?.components?.length || 3} Components
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(proj.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleDelete(proj.id, e)}
                          title="Delete Project"
                          className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
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
