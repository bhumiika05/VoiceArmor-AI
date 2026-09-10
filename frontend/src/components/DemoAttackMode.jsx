import React, { useState } from 'react';
import { Zap, Play, AlertOctagon, Lock, ShieldAlert, FileText, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { simulateAttack, downloadIncidentReport } from '../utils/api';

export default function DemoAttackMode({ onNavigate }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [attackData, setAttackData] = useState(null);

  const startDemoSequence = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setAttackData(null);

    // Step-by-step presentation animation for judges
    setTimeout(() => setCurrentStep(2), 1200);
    setTimeout(() => setCurrentStep(3), 2400);

    try {
      const data = await simulateAttack("Executive Wire Fraud Attack Scenario", "CEO Alexander Vance", "MONEY_TRANSFER");
      setTimeout(() => {
        setAttackData(data);
        setCurrentStep(4);
        setIsRunning(false);
      }, 3600);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-rose-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                CONTROLLED SIH DEMONSTRATION MODE
              </span>
              <span className="text-xs font-mono text-amber-400">JUDGE EVALUATION FLOW</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Simulate Executive Voice Cloning Attack
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              1-Click automated attack presentation. Demonstrates the complete VoiceArmor defense pipeline from voice input to automatic financial transaction restriction & forensic audit trail.
            </p>
          </div>

          <button
            onClick={startDemoSequence}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs shadow-xl transition-all ${
              isRunning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/30 transform hover:scale-[1.03]'
            }`}
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
            <span>{isRunning ? 'Executing Attack Sequence...' : 'START SIH DEMO ATTACK'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-500">ATTACK VECTOR</div>
          <div className="font-bold text-white">Cloned Executive Voice Call</div>
          <p className="text-[11px] text-slate-400">Attacker uses neural vocoder clone of CEO Vance demanding urgent wire transfer.</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-500">REQUESTED OPERATION</div>
          <div className="font-bold text-rose-400">High-Value Wire ($250,000)</div>
          <p className="text-[11px] text-slate-400">Sensitive financial operation requiring executive clearance.</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-500">EXPECTED SYSTEM RESPONSE</div>
          <div className="font-bold text-emerald-400">Alert + Restrict Action</div>
          <p className="text-[11px] text-slate-400">VoiceArmor flags high risk (92/100), blocks transaction, and logs incident.</p>
        </div>
      </div>

      {/* Attack Pipeline Visualizer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-slate-200">Execution Progression Steps</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          <div className={`p-4 rounded-xl border text-center transition-all ${
            currentStep >= 1 ? 'bg-indigo-950/40 border-indigo-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono mb-1">STEP 1</div>
            <div className="font-bold text-xs">Audio Stream Input</div>
            <div className="text-[10px] text-slate-400 mt-1">Cloned voice payload captured</div>
          </div>

          <div className={`p-4 rounded-xl border text-center transition-all ${
            currentStep >= 2 ? 'bg-rose-950/40 border-rose-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono mb-1">STEP 2</div>
            <div className="font-bold text-xs">AI Deepfake Analysis</div>
            <div className="text-[10px] text-slate-400 mt-1">94.2% Deepfake Probability</div>
          </div>

          <div className={`p-4 rounded-xl border text-center transition-all ${
            currentStep >= 3 ? 'bg-amber-950/40 border-amber-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono mb-1">STEP 3</div>
            <div className="font-bold text-xs">Speaker Verification</div>
            <div className="text-[10px] text-slate-400 mt-1">18.5% CEO Profile Match</div>
          </div>

          <div className={`p-4 rounded-xl border text-center transition-all ${
            currentStep >= 4 ? 'bg-emerald-950/40 border-emerald-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono mb-1">STEP 4</div>
            <div className="font-bold text-xs">Preventive Enforcement</div>
            <div className="text-[10px] text-slate-400 mt-1">Risk: 92/100 (CRITICAL)</div>
          </div>

        </div>

        {/* Results Banner when attack is detected */}
        {attackData && (
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/50 space-y-4">
            
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertOctagon className="w-8 h-8 shrink-0 animate-pulse" />
              <div>
                <h3 className="text-lg font-black text-white">🚨 POSSIBLE VOICE IMPERSONATION ATTACK DETECTED</h3>
                <p className="text-xs text-rose-300">
                  VoiceArmor Security Engine has automatically restricted the unauthorized financial transaction request.
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="text-slate-500 text-[10px] font-mono">RISK SCORE</div>
                <div className="text-2xl font-black text-rose-400">{attackData.analysis.impersonation_risk_score} / 100</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] font-mono">DEEPFAKE PROB</div>
                <div className="text-2xl font-black text-rose-400">{attackData.analysis.deepfake_probability}%</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] font-mono">SPEAKER MATCH</div>
                <div className="text-2xl font-black text-cyan-400">{attackData.analysis.speaker_match_score}%</div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] font-mono">ENFORCEMENT</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">TRANSACTION RESTRICTED</div>
              </div>
            </div>

            {/* Explanations */}
            <div className="space-y-1 text-xs text-slate-300">
              <div className="font-bold text-white">Forensic Detection Signals:</div>
              {attackData.analysis.explanations.map((exp, i) => (
                <div key={i} className="text-slate-300">{exp}</div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Incident Created: <span className="text-indigo-400 font-bold">{attackData.incident_id}</span></div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('incidents')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1"
                >
                  <span>View in Incident Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => downloadIncidentReport(attackData.incident_id, 'pdf')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Forensic PDF Report</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
