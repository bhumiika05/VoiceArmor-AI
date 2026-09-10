import React, { useEffect, useRef } from 'react';

export default function AudioWaveform({ isRecording, analyser, height = 80 }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;

    const draw = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      if (isRecording && analyser) {
        // Real microphone Web Audio API data visualization
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * h;

          const gradient = ctx.createLinearGradient(0, h, 0, 0);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(0.5, '#06b6d4');
          gradient.addColorStop(1, '#f43f5e');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, h - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else {
        // Idle / Animated Waveform
        ctx.beginPath();
        ctx.lineWidth = 2;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#06b6d4');
        gradient.addColorStop(1, '#6366f1');
        ctx.strokeStyle = gradient;

        for (let x = 0; x < width; x++) {
          const freq = isRecording ? 0.05 : 0.02;
          const amp = isRecording ? 25 : 8;
          const y = h / 2 + Math.sin(x * freq + phase) * amp * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        phase += isRecording ? 0.15 : 0.05;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, analyser]);

  return (
    <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
        <span className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`}></span>
          <span>{isRecording ? 'LIVE AUDIO INPUT STREAM' : 'ACOUSTIC WAVEFORM VISUALIZER'}</span>
        </span>
        <span>16.0 kHz MONO</span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full block rounded"
      />
    </div>
  );
}
