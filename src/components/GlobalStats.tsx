import React from 'react';
import { Target, CheckCircle2, AlertCircle, Clock, Zap, Sparkles } from 'lucide-react';
import { ProductivityInsights } from '../types';

interface GlobalStatsProps {
  insights: ProductivityInsights;
  totalTasks: number;
  completedTasksCount: number;
  overdueTasksCount: number;
  completedHabitsCount: number;
  totalHabitsCount: number;
  isAnalyzing: boolean;
  onRefreshInsights: () => void;
}

export default function GlobalStats({
  insights,
  totalTasks,
  completedTasksCount,
  overdueTasksCount,
  completedHabitsCount,
  totalHabitsCount,
  isAnalyzing,
  onRefreshInsights
}: GlobalStatsProps) {
  // Safe math for radial percentages
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const habitCompletionRate = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

  // Workload status visual configs
  const statusStyles = {
    chill: {
      color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]',
      label: 'Chill / Light Load',
      tip: 'Perfect time to prepare for future commitments or build daily habits!'
    },
    optimal: {
      color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)]',
      label: 'Optimal High Performance',
      tip: 'Your schedule is perfectly tuned! Maintain this high-efficiency groove.'
    },
    intense: {
      color: 'text-orange-400 bg-orange-500/5 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.05)]',
      label: 'Intense Workload',
      tip: 'Stay laser-focused. Utilize the Focus Timer to prevent procrastination.'
    },
    critical: {
      color: 'text-rose-400 bg-rose-500/5 border-rose-500/25 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
      label: 'CRITICAL DEADLINE PRESSURES',
      tip: 'Warning: Deadlines are approaching! Alchemi recommends finishing high-urgency tasks immediately.'
    }
  };

  const activeStatus = statusStyles[insights.status] || statusStyles.optimal;

  return (
    <div id="global-stats-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      {/* 1. Overall Performance Ring */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-indigo-500/30">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">Cognitive Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white tracking-tight font-display glow-text-indigo">{insights.score}</span>
            <span className="text-sm font-semibold text-slate-500">/100</span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI-calculated focus rating
          </span>
        </div>

        {/* Circular SVG Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-white/5 fill-none"
              strokeWidth="10"
            />
            {/* Indicator ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-indigo-500 fill-none transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * insights.score) / 100}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0px 0px 4px rgba(99,102,241,0.5))' }}
            />
          </svg>
          <div className="absolute text-center flex flex-col items-center">
            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
            <span className="text-[11px] font-bold text-white mt-1">{taskCompletionRate}% done</span>
          </div>
        </div>
      </div>

      {/* 2. Workload Status */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-purple-500/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">Workload Density</span>
          <button 
            onClick={onRefreshInsights}
            disabled={isAnalyzing}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {isAnalyzing ? (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            Analyze Workload
          </button>
        </div>

        <div className="my-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${activeStatus.color}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {activeStatus.label}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed italic">
          "{activeStatus.tip}"
        </p>
      </div>

      {/* 3. Daily Stats Counters Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Task Counter */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-indigo-500/30 transition">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase font-display">Tasks</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white leading-none font-display">
              {completedTasksCount} <span className="text-xs font-normal text-slate-500">/ {totalTasks}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Completed</p>
          </div>
        </div>

        {/* Overdue / Habits */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-rose-500/30 transition">
          <div className="flex items-center justify-between">
            {overdueTasksCount > 0 ? (
              <AlertCircle className="w-5 h-5 text-rose-400 animate-bounce" />
            ) : (
              <Target className="w-5 h-5 text-purple-400" />
            )}
            <span className="text-[10px] font-bold text-slate-400 uppercase font-display">Habit Streak</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white leading-none font-display">
              {completedHabitsCount} <span className="text-xs font-normal text-slate-500">/ {totalHabitsCount}</span>
            </div>
            <p className={`text-[10px] mt-1.5 font-bold ${overdueTasksCount > 0 ? "text-rose-400" : "text-slate-400"}`}>
              {overdueTasksCount > 0 ? `${overdueTasksCount} OVERDUE DEADLINES!` : "Habits Done Today"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
