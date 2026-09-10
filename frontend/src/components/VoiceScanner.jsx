import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Upload, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Activity,
  Layers,
  Unlock,
  Lock,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AudioWaveform from './AudioWaveform';
import { analyzeVoice } from '../utils/api';

export default function VoiceScanner({ speakers, onIncidentCreated, onOpenVerification }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [sensitiveAction, setSensitiveAction] = useState('MONEY_TRANSFER');
  const [language, setLanguage] = useState('auto');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [riskTimeline, setRiskTimeline] = useState([
    { chunk: 'Chunk 1', risk: 18 },
    { chunk: 'Chunk 2', risk: 32 },
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);

  // Microphone Recording Handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], "microphone_record.wav", { type: "audio/wav" });
        setAudioFile(file);
        runAnalysis(file);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access permission required for live voice recording.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      runAnalysis(file);
    }
  };

  const runAnalysis = async (fileToAnalyze) => {
    const file = fileToAnalyze || audioFile;
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const res = await analyzeVoice(file, sensitiveAction, selectedSpeaker, language);
      setAnalysisResult(res);

      // Append to risk timeline
      setRiskTimeline((prev) => [
        ...prev,
        { chunk: `Chunk ${prev.length + 1}`, risk: res.impersonation_risk_score }
      ]);

      if (res.incident_created && onIncidentCreated) {
        onIncidentCreated(res.incident_id);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Voice Security Scanner</h1>
          <p className="text-xs text-slate-400">
            Real-time acoustic analysis, deepfake probability calculation, and impersonation defense engine.
          </p>
        </div>
        
        {/* Language selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs rounded-lg px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="auto">🌐 Auto Detect (English / Hindi)</option>
            <option value="en">English (US / IN)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Controls & Audio Input (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Audio Input Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Mic className="w-4 h-4 text-indigo-400" />
              <span>Audio Input Stream</span>
            </h2>

            {/* Live Visualizer */}
            <AudioWaveform isRecording={isRecording} analyser={analyserRef.current} />

            {/* Mic Record Controls */}
            <div className="flex items-center justify-between gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
                >
                  <Mic className="w-4 h-4 text-rose-200" />
                  <span>Start Microphone Record</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs animate-cyber-pulse transition-all"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop & Analyze ({recordingTime}s)</span>
                </button>
              )}
            </div>

            {/* File Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 text-center transition-colors">
              <input
                type="file"
                accept="audio/*,.wav,.mp3,.m4a"
                onChange={handleFileUpload}
                className="hidden"
                id="voice-file-upload"
              />
              <label htmlFor="voice-file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                <Upload className="w-6 h-6 text-indigo-400 mb-1" />
                <span className="text-xs font-semibold text-slate-300">Upload Voice Recording</span>
                <span className="text-[10px] text-slate-500">Supports WAV, MP3, M4A up to 25MB</span>
              </label>
            </div>
            
            {audioFile && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between text-slate-300 font-mono">
                <span className="truncate max-w-[200px]">{audioFile.name}</span>
                <span className="text-indigo-400">{(audioFile.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>

          {/* Context & Sensitive Action Simulator Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Target Context & Sensitive Action</span>
            </h2>

            {/* Speaker Select */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Enrolled Speaker Profile</label>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Unknown / General Speaker</option>
                {speakers && speakers.map((spk) => (
                  <option key={spk.speaker_id} value={spk.speaker_id}>
                    {spk.name} ({spk.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Sensitive Action Requested */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Simulated Action Requested by Voice</label>
              <select
                value={sensitiveAction}
                onChange={(e) => setSensitiveAction(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="MONITORING">Standard Voice Chat (Monitoring Only)</option>
                <option value="MONEY_TRANSFER">💳 High-Value Financial Transfer ($50,000+ Wire)</option>
                <option value="OTP_REQUEST">🔑 OTP / Security Auth Code Request</option>
                <option value="PASSWORD_RESET">🔓 Account Password Reset Request</option>
                <option value="EXECUTIVE_APPROVAL">👔 Executive Emergency Approval</option>
                <option value="CONFIDENTIAL_INFO">📄 Sensitive Information Disclosure</option>
              </select>
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => runAnalysis()}
              disabled={isAnalyzing || (!audioFile && !isRecording)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isAnalyzing || (!audioFile && !isRecording)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Processing Voice Features...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Execute Voice Security Analysis</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Results & Impersonation Risk Score (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {analysisResult ? (
            <>
              {/* Risk Score & Recommended Action Banner */}
              <div className={`glass-panel p-6 rounded-2xl border ${
                analysisResult.risk_level === 'CRITICAL' ? 'border-rose-500/50 bg-rose-950/20' :
                analysisResult.risk_level === 'HIGH' ? 'border-orange-500/50 bg-orange-950/20' :
                analysisResult.risk_level === 'MODERATE' ? 'border-amber-500/50 bg-amber-950/20' :
                'border-emerald-500/50 bg-emerald-950/20'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      DYNAMIC IMPERSONATION RISK SCORE
                    </div>
                    <div className="flex items-baseline space-x-3 mt-1">
                      <span className={`text-4xl font-black ${
                        analysisResult.risk_level === 'CRITICAL' ? 'text-rose-400' :
                        analysisResult.risk_level === 'HIGH' ? 'text-orange-400' :
                        analysisResult.risk_level === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {analysisResult.impersonation_risk_score} / 100
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        analysisResult.risk_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        analysisResult.risk_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                        analysisResult.risk_level === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {analysisResult.risk_level} RISK
                      </span>
                    </div>
                  </div>

                  {/* Secondary Verification Button */}
                  {analysisResult.verification_required && (
                    <button
                      onClick={() => onOpenVerification && onOpenVerification(analysisResult.incident_id || 'INC-TEMP')}
                      className="flex items-center space-x-2 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Trigger Secondary Verification</span>
                    </button>
                  )}
                </div>

                {/* Recommended Action */}
                <div className="mt-4 flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    analysisResult.is_restricted ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {analysisResult.is_restricted ? <Lock className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">RECOMMENDED SECURITY ACTION</div>
                    <div className="text-base font-extrabold text-white mt-0.5">{analysisResult.recommended_action}</div>
                    <p className="text-xs text-slate-300 mt-1">{analysisResult.action_description}</p>
                  </div>
                </div>
              </div>

              {/* Three-Way Classification + Key Signals */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Three-Way Classification Badge */}
                  <div className={`flex-1 p-4 rounded-xl border text-center ${
                    analysisResult.classification === 'LIKELY GENUINE' ? 'bg-emerald-950/30 border-emerald-500/40' :
                    analysisResult.classification === 'SUSPICIOUS DEEPFAKE' ? 'bg-rose-950/30 border-rose-500/40' :
                    'bg-amber-950/30 border-amber-500/40'
                  }`}>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">THREE-WAY AI CLASSIFICATION</div>
                    <div className={`text-sm font-extrabold ${
                      analysisResult.classification === 'LIKELY GENUINE' ? 'text-emerald-400' :
                      analysisResult.classification === 'SUSPICIOUS DEEPFAKE' ? 'text-rose-400' :
                      'text-amber-400'
                    }`}>
                      {analysisResult.classification === 'LIKELY GENUINE' ? '✓ ' : analysisResult.classification === 'SUSPICIOUS DEEPFAKE' ? '⚠ ' : 'ℹ '}
                      {analysisResult.classification}
                    </div>
                  </div>

                  {/* Deepfake Probability */}
                  <div className="flex-1 p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                    <div className="text-[10px] font-mono text-slate-400 mb-1">CALIBRATED DEEPFAKE PROB</div>
                    <div className={`text-xl font-black ${
                      analysisResult.deepfake_probability > 65 ? 'text-rose-400' :
                      analysisResult.deepfake_probability > 30 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{analysisResult.deepfake_probability}%</div>
                    {analysisResult.uncertainty_pm !== undefined && (
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">± {analysisResult.uncertainty_pm}% uncertainty</div>
                    )}
                  </div>

                  {/* Detection Confidence */}
                  <div className="flex-1 p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
                    <div className="text-[10px] font-mono text-slate-400 mb-1">DETECTION CONFIDENCE</div>
                    <div className="text-xl font-black text-cyan-400">{analysisResult.confidence}%</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">Engine certainty</div>
                  </div>
                </div>

                {/* Quality Gate + Replay Risk */}
                <div className="grid grid-cols-2 gap-3">
                  {analysisResult.quality_gate && (
                    <div className={`p-3 rounded-xl border text-xs ${
                      analysisResult.quality_gate.is_usable 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="font-mono text-[10px] opacity-70 mb-1">AUDIO QUALITY GATE</div>
                      <div className="font-bold">
                        {analysisResult.quality_gate.is_usable ? '✓ PASSED' : '⚠ LOW QUALITY'}
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        SNR: {analysisResult.quality_gate.snr_db?.toFixed(1) ?? 'N/A'} dB
                        {analysisResult.quality_gate.duration_sec && ` • ${analysisResult.quality_gate.duration_sec.toFixed(1)}s`}
                      </div>
                    </div>
                  )}
                  {analysisResult.replay_info && (
                    <div className={`p-3 rounded-xl border text-xs ${
                      analysisResult.replay_info.replay_risk === 'LOW'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : analysisResult.replay_info.replay_risk === 'HIGH'
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="font-mono text-[10px] opacity-70 mb-1">REPLAY ATTACK RISK</div>
                      <div className="font-bold">{analysisResult.replay_info.replay_risk}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        Score: {analysisResult.replay_info.replay_score?.toFixed(1) ?? 'N/A'} / 100
                      </div>
                    </div>
                  )}
                </div>

                {/* Speaker Match + Engine Mode row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
                    <div className="font-mono text-[10px] text-slate-500 mb-1">SPEAKER VOICE MATCH</div>
                    <div className="font-black text-cyan-400 text-lg">
                      {analysisResult.speaker_match_score !== null ? `${analysisResult.speaker_match_score}%` : 'N/A'}
                    </div>
                    <div className="text-[10px] text-slate-500">{analysisResult.speaker_match_status}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
                    <div className="font-mono text-[10px] text-slate-500 mb-1">AI ENGINE MODE</div>
                    <div className="font-bold text-indigo-300 truncate text-xs">{analysisResult.engine_mode}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Verified Pipeline</div>
                  </div>
                </div>
              </div>

              {/* Why is this risky? Explanations List */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Why is this risky? (Explainable Forensics)</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.explanations && analysisResult.explanations.map((exp, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Risk Timeline Graph */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                  Dynamic Risk Progression Timeline
                </h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTimeline}>
                      <XAxis dataKey="chunk" stroke="#64748b" fontSize={10} />
                      <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                      <Line type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SHA-256 Hash Evidence */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>SHA-256 Evidence Hash:</span>
                <span className="text-cyan-300 font-bold truncate max-w-[320px]">{analysisResult.audio_hash}</span>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 space-y-3">
              <Activity className="w-12 h-12 mx-auto text-slate-700 animate-pulse" />
              <div className="text-sm font-semibold text-slate-400">Ready for Voice Security Scan</div>
              <p className="text-xs max-w-sm mx-auto">
                Record your microphone input or upload an audio file on the left panel to execute full deepfake detection & impersonation risk analysis.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
