import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Mic, 
  Radio, 
  Users, 
  AlertTriangle, 
  Zap, 
  Lock, 
  Server,
  BarChart2
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, healthData }) {
  const navItems = [
    { id: 'dashboard', label: 'Security Center', icon: Activity },
    { id: 'scanner', label: 'Voice Scanner', icon: Mic },
    { id: 'live', label: 'Live Protection', icon: Radio },
    { id: 'speakers', label: 'Speakers', icon: Users },
    { id: 'incidents', label: 'Incident Center', icon: AlertTriangle },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart2, accent: true },
    { id: 'demo', label: 'SIH Demo Attack', icon: Zap, highlight: true },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & USP */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  VoiceArmor
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI DEFENSE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Detect • Verify • Assess • Prevent
              </p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400'
                        : 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 hover:text-white border border-rose-500/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              if (item.accent) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                        : 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-cyan-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Engine Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Server className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-400">ENGINE:</span>
              <span className="text-cyan-300 font-semibold">{healthData?.ai_engine_mode || 'LIGHTWEIGHT'}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>SYSTEM ONLINE</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
