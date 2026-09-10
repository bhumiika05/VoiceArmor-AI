import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertOctagon, Mic } from 'lucide-react';
import { getChallengePhrase, processVerification } from '../utils/api';

export default function VerificationModal({ incidentId, onClose, onSuccess }) {
  const [challengePhrase, setChallengePhrase] = useState('Alpha Tango 492 Security Verification');
  const [responsePhrase, setResponsePhrase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadPhrase() {
      try {
        const data = await getChallengePhrase();
        setChallengePhrase(data.challenge_phrase);
      } catch (err) {
        console.error(err);
      }
    }
    loadPhrase();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!responsePhrase) return;

    setIsSubmitting(true);
    try {
      const res = await processVerification(incidentId, challengePhrase, responsePhrase);
      setResult(res);
      if (res.status === 'VERIFICATION_SUCCESSFUL' && onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-extrabold text-white">Secondary Voice Challenge</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <div className="text-[10px] text-slate-500 font-mono">REQUIRED VERIFICATION PHRASE</div>
          <div className="text-base font-extrabold text-cyan-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
            "{challengePhrase}"
          </div>
          <p className="text-slate-400 text-[11px]">
            Please speak or type the exact challenge phrase shown above to verify identity.
          </p>
        </div>

        {result && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            result.status === 'VERIFICATION_SUCCESSFUL'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Spoken / Typed Response Phrase</label>
            <input
              type="text"
              placeholder="Enter response phrase..."
              value={responsePhrase}
              onChange={(e) => setResponsePhrase(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => setResponsePhrase(challengePhrase)}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Auto-Fill Spoken Phrase
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Verify Challenge Response
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
