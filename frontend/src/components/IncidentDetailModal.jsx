import React from 'react';
import { X, Download, ShieldAlert, Lock, CheckCircle, FileText, Activity } from 'lucide-react';
import { downloadIncidentReport } from '../utils/api';

export default function IncidentDetailModal({ incident, onClose }) {
  if (!incident) return null;

  const handleDownloadPDF = () => {
    downloadIncidentReport(incident.incident_id, 'pdf');
  };

  const handleDownloadJSON = () => {
    downloadIncidentReport(incident.incident_id, 'json');
  };

  const isCrit = incident.risk_level === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-indigo-400">{incident.incident_id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isCrit ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {incident.risk_level} THREAT
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5">Voice Impersonation Incident Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">TIMESTAMP</div>
              <div className="font-bold text-slate-200 mt-0.5">{new Date(incident.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">TARGET SPEAKER</div>
              <div className="font-bold text-white mt-0.5">{incident.speaker_name}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">RISK SCORE</div>
              <div className={`font-black text-sm mt-0.5 ${isCrit ? 'text-rose-400' : 'text-amber-400'}`}>
                {incident.risk_score} / 100
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">SENSITIVE ACTION</div>
              <div className="font-bold text-indigo-300 mt-0.5">{incident.sensitive_action}</div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">ENFORCED PREVENTIVE ACTION</div>
            <div className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{incident.recommended_action}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Verification Status: <span className="font-bold text-cyan-300">{incident.verification_status}</span></div>
          </div>

          {/* Measured Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Deepfake Probability</div>
              <div className="text-lg font-black text-rose-400 mt-1">{incident.deepfake_probability}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Speaker Voice Similarity</div>
              <div className="text-lg font-black text-cyan-400 mt-1">{incident.speaker_match_score !== null ? `${incident.speaker_match_score}%` : 'N/A'}</div>
            </div>
          </div>

          {/* Forensics list */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200">Forensic Detection Signals</div>
            <ul className="space-y-1 text-slate-300">
              {incident.explanations && incident.explanations.map((exp, idx) => (
                <li key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                  • {exp}
                </li>
              ))}
            </ul>
          </div>

          {/* Hash Integrity */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            <div>Cryptographic Audio SHA-256 Evidence Hash:</div>
            <div className="text-cyan-300 font-bold truncate mt-1">{incident.audio_hash}</div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">VoiceArmor Forensic Report Generator</div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Incident Report</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
