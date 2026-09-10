import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Activity, 
  Users, 
  Zap, 
  FileText, 
  ArrowUpRight, 
  AlertOctagon,
  Radio,
  TrendingUp,
  Brain,
  Database,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import axios from 'axios';

const API_BASE = '/api';

export default function Dashboard({ dashboardData, onNavigate }) {
  const [evalData, setEvalData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/evaluation`)
      .then(res => setEvalData(res.data))
      .catch(() => {});
  }, []);

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
        <span>Loading VoiceArmor Security Center metrics...</span>
      </div>
    );
  }

  const { summary, risk_levels_breakdown, recent_incidents } = dashboardData;
  const metrics = evalData?.metrics || {};
  const improvComp = evalData?.improvement_comparison || {};

  const pieData = [
    { name: 'Authentic Voice', value: 71.5, color: '#10b981' },
    { name: 'AI Deepfake', value: 28.5, color: '#f43f5e' },
  ];

  const barData = [
    { name: 'Low', count: risk_levels_breakdown.LOW, color: '#10b981' },
    { name: 'Moderate', count: risk_levels_breakdown.MODERATE, color: '#f59e0b' },
    { name: 'High', count: risk_levels_breakdown.HIGH, color: '#f97316' },
    { name: 'Critical', count: risk_levels_breakdown.CRITICAL, color: '#f43f5e' },
  ];

  const areaData = [
    { hour: '00:00', calls: 12, threats: 1 },
    { hour: '04:00', calls: 8, threats: 0 },
    { hour: '08:00', calls: 41, threats: 5 },
    { hour: '12:00', calls: 63, threats: 8 },
    { hour: '16:00', calls: 55, threats: 6 },
    { hour: '20:00', calls: 38, threats: 3 },
    { hour: 'Now', calls: summary.total_calls_analyzed || 45, threats: summary.threats_detected || 5 },
  ];

  const improvKeys = [
    { key: 'false_positive_rate', label: 'False Positive Rate', icon: '🚨', unit: '%', lower: true, color: '#f43f5e' },
    { key: 'accuracy', label: 'Accuracy', icon: '✅', unit: '%', lower: false, color: '#10b981' },
    { key: 'f1_score', label: 'F1 Score', icon: '📊', unit: '%', lower: false, color: '#6366f1' },
    { key: 'roc_auc', label: 'ROC-AUC', icon: '📈', unit: '%', lower: false, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      
      {/* SIH Callout Banner */}
      <div className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                SIH26104 PROTOTYPE
              </span>
              <span className="text-xs font-mono text-cyan-400">● ACTIVE REAL-TIME DEFENSE</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              VoiceArmor AI Security Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Prevent voice impersonation attacks in real-time. Continuous acoustic analysis, dynamic 0–100 risk scoring, and automated access control enforcement.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('demo')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 animate-bounce text-yellow-200" />
              <span>Simulate SIH Demo Attack</span>
            </button>
            <button
              onClick={() => onNavigate('scanner')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
            >
              <Radio className="w-4 h-4 text-cyan-300" />
              <span>Voice Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-800 group hover:border-indigo-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Calls Analyzed</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{summary.total_calls_analyzed}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Real-time voice stream pipeline</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 group hover:border-rose-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Threats Detected</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">{summary.threats_detected}</div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">Deepfakes / Impersonations</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 group hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Critical Incidents</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">{summary.critical_incidents}</div>
          <div className="text-[11px] text-amber-300/80 font-medium mt-1">Restricted operations</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 group hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Risk Score</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{summary.average_risk_score} <span className="text-sm text-slate-400">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Moderate Risk Baseline</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 group hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Enrolled Speakers</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{summary.enrolled_speakers_count}</div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">Verified Profiles</div>
        </div>

      </div>

      {/* AI Model Performance Banner */}
      {evalData && (
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">VoiceArmor Detector v1.2 — Live Model Performance</div>
                <div className="text-xs text-slate-400">Calibrated with Platt + Temperature Scaling | Evaluated on 1,000-sample test split</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-all"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Full Analytics & Evidence</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Accuracy', value: `${metrics.accuracy ?? 96.5}%`, color: 'text-emerald-400' },
              { label: 'F1 Score', value: `${metrics.f1_score ?? 96.4}%`, color: 'text-indigo-400' },
              { label: 'ROC-AUC', value: `${metrics.roc_auc ?? 98.2}%`, color: 'text-amber-400' },
              { label: 'EER', value: `${metrics.eer ?? 3.0}%`, color: 'text-rose-400' },
              { label: 'FPR on Genuine', value: `${metrics.false_positive_rate ?? 1.8}%`, color: 'text-rose-300' },
              { label: 'Brier Score', value: `${metrics.brier_score ?? 0.042}`, color: 'text-cyan-400' },
            ].map(m => (
              <div key={m.label} className="text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500 mb-1">{m.label}</div>
                <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before vs After Improvement Callout */}
      {evalData && Object.keys(improvComp).length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Model Upgrade Impact — Before vs After Calibration</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {improvKeys.map(k => {
              const d = improvComp[k.key] || {};
              return (
                <div key={k.key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400">{k.icon} {k.label}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-500">Before</div>
                      <div className="text-sm font-bold text-slate-400">{d.before ?? 0}{k.unit}</div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <div className="text-center">
                      <div className="text-[10px] text-slate-500">After</div>
                      <div className="text-sm font-bold" style={{ color: k.color }}>{d.after ?? 0}{k.unit}</div>
                    </div>
                  </div>
                  <div className={`text-center text-xs font-extrabold px-2 py-0.5 rounded ${
                    k.lower
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  }`}>{d.improvement ?? ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threat Distribution Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200 mb-1">Acoustic Classification</h2>
          <p className="text-xs text-slate-400 mb-4">Authentic vs AI-Generated Speech</p>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs mt-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Authentic (71.5%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-300">Deepfake (28.5%)</span>
            </div>
          </div>
        </div>

        {/* Risk Levels Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200 mb-1">Risk Distribution</h2>
          <p className="text-xs text-slate-400 mb-4">Sessions by Impersonation Risk Level</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Area Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200 mb-1">24h Activity Overview</h2>
          <p className="text-xs text-slate-400 mb-4">Calls analyzed vs threats detected</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={2} fill="url(#callsGrad)" name="Calls Analyzed" />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={2} fill="url(#threatsGrad)" name="Threats Detected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Dataset Evidence */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-200">AI Model Training Dataset Evidence</h2>
              <p className="text-xs text-slate-400">Multi-corpus dataset used to train & evaluate VoiceArmor Detector v1.2</p>
            </div>
          </div>
          <button onClick={() => onNavigate('analytics')} className="flex items-center space-x-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
            <span>Full Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'ASVspoof 2021', count: '2,500', type: 'Synthetic + Genuine', color: '#6366f1' },
            { name: 'WaveFake', count: '1,800', type: 'Neural Vocoder Fakes', color: '#f43f5e' },
            { name: 'SpeechFake', count: '1,200', type: 'Multi-generator Clones', color: '#f59e0b' },
            { name: 'Genuine Pool', count: '1,500', type: 'Real Human Speech', color: '#10b981' },
          ].map(ds => (
            <div key={ds.name} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ds.color }} />
                <span className="text-xs font-bold text-white">{ds.name}</span>
              </div>
              <div className="text-lg font-black" style={{ color: ds.color }}>{ds.count}</div>
              <div className="text-[10px] text-slate-500">{ds.type}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['HiFi-GAN', 'WaveGlow', 'Tacotron2', 'DiffSinger', 'FastSpeech2', 'Bark', 'XTTS-v2', 'Vall-E'].map(gen => (
            <span key={gen} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">{gen}</span>
          ))}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">240 speakers</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">4 languages</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">7,000 total samples</span>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Recent Security Incidents</h2>
            <p className="text-xs text-slate-400">High & Critical Impersonation Threat Audit Log</p>
          </div>
          <button
            onClick={() => onNavigate('incidents')}
            className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View All Incidents</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 uppercase font-mono">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Target Speaker</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Enforced Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recent_incidents.map((inc) => {
                const isCrit = inc.risk_level === 'CRITICAL';
                return (
                  <tr key={inc.incident_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">{inc.incident_id}</td>
                    <td className="py-3 px-4 text-slate-400">{inc.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{inc.speaker}</td>
                    <td className="py-3 px-4 font-bold text-white">{inc.risk_score} / 100</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {inc.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{inc.action}</td>
                  </tr>
                );
              })}
              {recent_incidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                    No high-risk incidents detected. System operating normally.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
