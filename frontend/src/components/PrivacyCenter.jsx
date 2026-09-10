import React, { useState } from 'react';
import { Lock, ShieldCheck, Trash2, CheckCircle2, Server, Globe } from 'lucide-react';
import { clearIncidents } from '../utils/api';

export default function PrivacyCenter() {
  const [retentionMode, setRetentionMode] = useState('ZERO_STORAGE');
  const [message, setMessage] = useState(null);

  const handleClearData = async () => {
    if (!window.confirm("Permanently purge all stored voice metadata & incident history?")) return;
    try {
      await clearIncidents();
      setMessage({ type: 'success', text: 'All voice session metadata & incidents purged successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to purge data.' });
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Privacy & Multilingual Center</h1>
        <p className="text-xs text-slate-400">
          Privacy-preserving voice processing architecture and Indian language localization controls.
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Privacy Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Privacy & Storage Policies</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Raw Audio Retention: ZERO_RETENTION</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Raw voice audio is streamed through RAM buffers for feature extraction and discarded immediately. No raw voice files are saved on disk.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vector Embedding Storage Policy</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Only 32-dimensional normalized acoustic vector embeddings are stored for speaker verification. Raw speech cannot be reconstructed from embeddings.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic Evidence Integrity</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Audio payload SHA-256 hashes are computed for tamper-evident digital chain of custody audit trails.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearData}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition-all flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Stored Data & Incidents</span>
            </button>
          </div>
        </div>

        {/* Multilingual Indian Language Architecture */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Multilingual Architecture (Indian Scenarios)</span>
          </h2>

          <p className="text-xs text-slate-300">
            VoiceArmor is designed for Indian multilingual communication environments. The feature pipeline extracts language-agnostic acoustic phase and spectral characteristics.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">English (IN / US)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">FULL SUPPORT</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Hindi (हिंदी)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">FULL SUPPORT</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Tamil, Telugu, Bengali, Marathi, Gujarati</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 font-bold">ACOUSTIC ABSTRACTION</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
