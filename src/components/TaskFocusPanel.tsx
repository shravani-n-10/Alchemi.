import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle, Sparkles, Plus, Trash, Zap, Flame, Compass } from 'lucide-react';
import { Task, SubTask } from '../types';

interface TaskFocusPanelProps {
  task: Task | null;
  onUpdateTask: (task: Task) => void;
  onClose: () => void;
}

export default function TaskFocusPanel({ task, onUpdateTask, onClose }: TaskFocusPanelProps) {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [totalInitialSeconds, setTotalInitialSeconds] = useState(25 * 60);

  // Synchronize timer to task estimation or standard 25m Pomodoro
  useEffect(() => {
    if (task) {
      const defaultMinutes = task.durationMinutes > 0 ? task.durationMinutes : 25;
      setTimerMinutes(defaultMinutes);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setTotalInitialSeconds(defaultMinutes * 60);
    }
  }, [task?.id]);

  // Timer Tick Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished
          setIsTimerRunning(false);
          if (interval) clearInterval(interval);
          alert(`🎉 Focus session complete for: "${task?.title}"! Take a 5-minute break.`);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  if (!task) {
    return (
      <div id="empty-focus-panel" className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center relative z-10">
        <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 shadow-sm">
          <Compass className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-white font-display">Select Task to Focus</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
          Click any active task in your schedule or backlog to load step-by-step AI work plans, tailored coaching strategies, and trigger your Pomodoro focus dashboard.
        </p>
      </div>
    );
  }

  // Calculate remaining percentage for SVG visual countdown
  const currentSeconds = timerMinutes * 60 + timerSeconds;
  const progressRatio = totalInitialSeconds > 0 ? currentSeconds / totalInitialSeconds : 0;
  const strokeDashoffset = 251.2 - (251.2 * progressRatio);

  // Toggle Subtask Completion
  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  // Add custom Subtask
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: SubTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false,
      durationMinutes: 10
    };

    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, newSub]
    });
    setNewSubtaskTitle('');
  };

  // Delete Subtask
  const handleDeleteSubtask = (subtaskId: string) => {
    const filtered = task.subtasks.filter(s => s.id !== subtaskId);
    onUpdateTask({ ...task, subtasks: filtered });
  };

  const getUrgencyScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'CRITICAL', color: 'bg-rose-500/25 text-rose-300 border border-rose-500/30' };
    if (score >= 50) return { label: 'URGENT', color: 'bg-amber-500/25 text-amber-300 border border-amber-500/30' };
    return { label: 'ROUTINE', color: 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30' };
  };

  const urgencyStyle = getUrgencyScoreLabel(task.aiScore);

  return (
    <div id="active-focus-panel" className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col h-full max-h-[640px] relative z-10">
      {/* Top Banner */}
      <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${urgencyStyle.color}`}>
            {urgencyStyle.label} (🔮 {task.aiScore})
          </span>
          <span className="text-[11px] font-bold text-slate-400">{task.category}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 cursor-pointer"
        >
          Close [×]
        </button>
      </div>

      <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5">
        {/* Title */}
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight leading-snug font-display">{task.title}</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {task.description || 'No description loaded. AI has generated basic tasks below.'}
          </p>
        </div>

        {/* 1. Pomodoro Focus Engine */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col items-center shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1 font-display">
            <Flame className="w-3.5 h-3.5 fill-indigo-400/20 text-indigo-400" />
            Active Pomodoro Focus Engine
          </span>

          <div className="flex items-center gap-6">
            {/* Visual SVG countdown ring */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-white/5 fill-none" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-indigo-500 fill-none transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0px 0px 4px rgba(99,102,241,0.5))' }}
                />
              </svg>
              <div className="absolute text-center font-mono text-sm font-bold text-white glow-text-indigo">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
            </div>

            {/* Timers controls */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white p-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md shadow-indigo-500/10"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4 text-indigo-200" /> : <Play className="w-4 h-4 text-indigo-200" />}
                  {isTimerRunning ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    const defaultMinutes = task.durationMinutes > 0 ? task.durationMinutes : 25;
                    setTimerMinutes(defaultMinutes);
                    setTimerSeconds(0);
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <span className="text-[9px] text-slate-400 italic font-medium">
                {isTimerRunning ? "⚡ Mental focus slot engaged. Work cleanly!" : "Standby. Hit start to trigger focus state."}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Step-by-Step AI Plan */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-2.5 flex items-center gap-1.5 font-display">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            Autonomous AI Work Plan
          </h3>

          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {task.subtasks.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">No sub-tasks. AI can break this down on command.</p>
            ) : (
              task.subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition"
                >
                  <label className="flex items-center gap-2.5 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="rounded border-white/10 bg-black/25 text-indigo-500 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`text-[11px] font-bold leading-tight ${sub.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {sub.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Subtask entry */}
          <form onSubmit={handleAddSubtask} className="flex gap-1.5 mt-2.5">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="e.g. Gather revision notes"
              className="flex-1 text-[11px] font-semibold text-white bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 disabled:bg-white/5 text-indigo-300 disabled:text-slate-600 p-1.5 px-3 rounded-lg text-xs font-extrabold cursor-pointer transition"
            >
              + Add
            </button>
          </form>
        </div>

        {/* 3. AI Copilot Tailored Advice */}
        {task.recommendations && task.recommendations.length > 0 && (
          <div className="border-t border-white/10 pt-3">
            <span className="text-xs font-bold text-white uppercase tracking-wide block mb-2 flex items-center gap-1.5 font-display">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Alchemi Proactive Tips
            </span>
            <ul className="flex flex-col gap-1.5 list-disc pl-4 text-[10px] text-slate-300 leading-relaxed font-semibold">
              {task.recommendations.map((tip, index) => (
                <li key={index} className="text-indigo-300/90 list-none flex items-start gap-1">
                  <span className="text-indigo-400 select-none mr-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
