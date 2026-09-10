import React, { useState } from 'react';
import { Users, UserPlus, Trash2, CheckCircle2, AlertTriangle, Upload, Mic, RefreshCw } from 'lucide-react';
import { enrollSpeaker, deleteSpeaker } from '../utils/api';

export default function Speakers({ speakers, onReloadSpeakers }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Executive / Employee');
  const [audioFile, setAudioFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!name || !audioFile) {
      alert("Please provide speaker name and reference voice audio file.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await enrollSpeaker(name, role, audioFile);
      setMessage({ type: 'success', text: `Speaker profile '${res.name}' enrolled successfully with ID ${res.speaker_id}. Vector embedding saved.` });
      setName('');
      setAudioFile(null);
      if (onReloadSpeakers) onReloadSpeakers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to enroll speaker profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (speakerId) => {
    if (!window.confirm(`Delete speaker profile ${speakerId}?`)) return;
    try {
      await deleteSpeaker(speakerId);
      if (onReloadSpeakers) onReloadSpeakers();
    } catch (err) {
      alert("Failed to delete speaker profile.");
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Speaker Enrollment & Identity Database</h1>
        <p className="text-xs text-slate-400">
          Enroll trusted executive voice reference profiles. VoiceArmor extracts normalized vector embeddings for privacy compliance (raw audio discarded).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Enrollment Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Register New Speaker</span>
          </h2>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Speaker Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Alexander Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Role / Designation</label>
              <input
                type="text"
                placeholder="e.g. Chief Executive Officer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Reference Voice Audio Sample *</label>
              <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 text-center">
                <input
                  type="file"
                  accept="audio/*,.wav,.mp3"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  className="hidden"
                  id="enroll-audio-upload"
                />
                <label htmlFor="enroll-audio-upload" className="cursor-pointer flex flex-col items-center space-y-1">
                  <Upload className="w-5 h-5 text-indigo-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">
                    {audioFile ? audioFile.name : 'Upload Reference Audio'}
                  </span>
                  <span className="text-[10px] text-slate-500">WAV / MP3 voice sample</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Extracting Embedding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>Enroll Speaker Embedding</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Enrolled Speaker List (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Enrolled Speaker Profiles</h2>
            <span className="text-xs font-mono text-indigo-400 font-bold">{speakers?.length || 0} Profiles</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {speakers && speakers.length > 0 ? (
              speakers.map((spk) => (
                <div key={spk.speaker_id} className="py-3.5 flex items-center justify-between hover:bg-slate-900/40 px-3 rounded-xl transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-white">{spk.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {spk.speaker_id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{spk.role}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Enrolled: {new Date(spk.enrolled_at).toLocaleString()} • Privacy Vector Stored
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(spk.speaker_id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Delete Speaker Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No enrolled speakers found in database. Use the form on the left to register a voice reference profile.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
