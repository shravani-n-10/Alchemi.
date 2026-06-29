import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import audioSynth from '../services/audio';
import confetti from 'canvas-confetti';
import { Play, Pause, Square, Volume2, Headphones, Sparkles, Trophy } from 'lucide-react';

interface FocusModeProps {
  onClose: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ onClose }) => {
  const { tasks, activeTaskId, endFocusSession } = useTasks();
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const nextSubtask = activeTask?.subtasks.find((s) => !s.completed);

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Soundscape state inside focus
  const [rainOn, setRainOn] = useState(false);
  const [noiseOn, setNoiseOn] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.3);
  const [noiseVolume, setNoiseVolume] = useState(0.3);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Clean up audio on exit
  useEffect(() => {
    return () => {
      audioSynth.stopAll();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleComplete = () => {
    // 1. Play synthesized chime
    audioSynth.playSuccessChime();

    // 2. Explode confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981'],
    });

    // 3. Complete milestone in TaskContext
    endFocusSession(secondsElapsed, true);
    onClose();
  };

  const handleCancel = () => {
    endFocusSession(secondsElapsed, false);
    onClose();
  };

  // Sound toggles
  const toggleRain = () => {
    if (rainOn) {
      audioSynth.stopRain();
    } else {
      audioSynth.startRain(rainVolume);
    }
    setRainOn(!rainOn);
  };

  const toggleNoise = () => {
    if (noiseOn) {
      audioSynth.stopBrownNoise();
    } else {
      audioSynth.startBrownNoise(noiseVolume);
    }
    setNoiseOn(!noiseOn);
  };

  const changeRainVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setRainVolume(vol);
    if (rainOn) {
      audioSynth.setRainVolume(vol);
    }
  };

  const changeNoiseVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setNoiseVolume(vol);
    if (noiseOn) {
      audioSynth.setBrownNoiseVolume(vol);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        {/* Mission Header */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Focus Mode Active
          </span>
          <h2 className="text-2xl font-bold heading-outfit text-text-primary">
            {activeTask?.title}
          </h2>
          <p className="text-sm text-cyan-400 font-medium font-mono">
            Target: "{nextSubtask?.title || 'Main Task'}"
          </p>
        </div>

        {/* Giant Ticking Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-violet-500/20 transition-all duration-1000 ${
              isRunning ? 'scale-105 opacity-60 animate-pulse' : 'scale-100 opacity-20'
            }`}
          ></div>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-900"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              cx="50"
              cy="50"
              r="46"
            />
            <circle
              className="text-violet-500 transition-all duration-1000"
              strokeWidth="2.5"
              strokeDasharray={`${(timeLeft / (25 * 60)) * 289}, 289`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              cx="50"
              cy="50"
              r="46"
            />
          </svg>
          <span className="text-5xl font-extrabold font-mono text-text-primary z-10 select-none tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Audio Controls Panel */}
        <div className="w-full glass-panel p-4 space-y-3 max-w-xs text-left">
          <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" /> Focus Soundboard
          </span>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={toggleRain}
                className={`py-1 px-2 rounded text-[10px] font-semibold border transition-all shrink-0 ${
                  rainOn ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300' : 'border-slate-850 text-text-secondary'
                }`}
              >
                Rain
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={!rainOn}
                value={rainVolume}
                onChange={changeRainVolume}
                className="flex-1 accent-cyan-500 h-1 bg-slate-900 rounded appearance-none cursor-pointer disabled:opacity-20"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={toggleNoise}
                className={`py-1 px-2 rounded text-[10px] font-semibold border transition-all shrink-0 ${
                  noiseOn ? 'bg-violet-950/20 border-violet-500 text-violet-300' : 'border-slate-850 text-text-secondary'
                }`}
              >
                Noise
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={!noiseOn}
                value={noiseVolume}
                onChange={changeNoiseVolume}
                className="flex-1 accent-violet-500 h-1 bg-slate-900 rounded appearance-none cursor-pointer disabled:opacity-20"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleTimer}
            className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg"
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          </button>

          <button
            onClick={handleComplete}
            className="glass-btn glass-btn-primary py-3 px-6 text-sm flex items-center gap-1.5 font-bold"
            title="Complete Milestone"
          >
            <Trophy className="w-4.5 h-4.5" /> Complete Milestone
          </button>

          <button
            onClick={handleCancel}
            className="p-4 rounded-full bg-red-950/15 border border-red-500/20 text-red-400 hover:bg-red-950/30 transition-all"
            title="Stop Session"
          >
            <Square className="w-5 h-5 fill-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FocusMode;
