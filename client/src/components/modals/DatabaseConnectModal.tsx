import React, { useState, useEffect } from 'react';
import { useCADStore } from '../../store/useCADStore';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Server,
  Cloud,
} from 'lucide-react';

export const DatabaseConnectModal: React.FC = () => {
  const { activeModal, setActiveModal, setNotification } = useCADStore();
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    isConnected: boolean;
    type: 'atlas' | 'local' | 'in-memory';
    host: string;
    name: string;
    maskedUri: string;
    projectsCount?: number;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setStatus(json.data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch db status:', e);
    }
  };

  useEffect(() => {
    if (activeModal === 'dbConnect') {
      fetchDbStatus();
      setFeedback(null);
    }
  }, [activeModal]);

  if (activeModal !== 'dbConnect') return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uri.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a valid MongoDB connection string' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/db/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: uri.trim() }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setFeedback({
          type: 'success',
          message: json.message || 'Successfully connected to MongoDB Atlas!',
        });
        setNotification('Connected to MongoDB Atlas cluster');
        await fetchDbStatus();
        setTimeout(() => {
          setActiveModal('none');
        }, 1800);
      } else {
        setFeedback({
          type: 'error',
          message: json.message || 'Connection failed. Check username, password, or IP whitelist.',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Network error: ${(err as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">MongoDB Atlas Connection Manager</h3>
              <p className="text-[10px] text-slate-400">Cloud database persistence for Easy Pattern CAD</p>
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Current Live Status Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status?.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div>
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {status?.type === 'atlas' ? (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>MongoDB Atlas (Connected)</span>
                    </>
                  ) : status?.isConnected ? (
                    <>
                      <Server className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Local MongoDB (Connected)</span>
                    </>
                  ) : (
                    <span>In-Memory Fallback Active</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Host: {status?.host || 'localhost'} • Database: {status?.name || 'easypattern'}
                </div>
              </div>
            </div>
            <button
              onClick={fetchDbStatus}
              title="Refresh Status"
              className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleConnect} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                MongoDB Atlas Connection String (URI)
              </label>
              <textarea
                rows={3}
                required
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                placeholder="mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/easypattern?retryWrites=true&w=majority"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Replace <code>&lt;username&gt;</code> and <code>&lt;password&gt;</code> with your MongoDB Atlas database user credentials.
              </span>
            </div>

            {/* Atlas Quick Checklist */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>MongoDB Atlas Setup Checklist</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[10px]">
                <li><strong>Network Access:</strong> Click <em>Network Access</em> in Atlas and allow <code>0.0.0.0/0</code> (Access from anywhere).</li>
                <li><strong>Database User:</strong> In <em>Database Access</em>, ensure you have created a user with Read and Write permissions.</li>
                <li><strong>Auto-Save:</strong> Once verified, this URL is automatically saved to your <code>.env</code> file.</li>
              </ul>
            </div>

            {feedback && (
              <div
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

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
                disabled={loading}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                {loading ? 'Testing & Connecting...' : 'Connect to MongoDB Atlas'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
