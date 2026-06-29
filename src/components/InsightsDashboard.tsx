import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Clock, Target, Calendar, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Zap, RefreshCw, BarChart3, PieChart, CheckCircle } from 'lucide-react';
import { Task, Habit } from '../types';

interface InsightsDashboardProps {
  tasks: Task[];
  habits: Habit[];
  onRefresh: () => void;
  isAnalyzing: boolean;
  onNavigate: (page: 'home' | 'login' | 'workspace' | 'insights') => void;
}

export default function InsightsDashboard({ tasks, habits, onRefresh, isAnalyzing, onNavigate }: InsightsDashboardProps) {
  const [activeChartTab, setActiveChartTab] = useState<'categories' | 'completion'>('categories');

  // Compute stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Overdue check
  const now = new Date().getTime();
  const overdueTasks = pendingTasks.filter(t => new Date(t.deadline).getTime() < now);

  // Time metrics
  const totalFocusMinutesScheduled = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedFocusMinutes = completedTasks.reduce((sum, t) => sum + t.durationMinutes, 0);

  // Category distributions for SVG Bar Chart
  const categories = ['Studies', 'Work', 'Personal', 'Finance'];
  const categoryStats = categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const catCompleted = catTasks.filter(t => t.status === 'completed');
    const totalMinutes = catTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
    return {
      name: cat,
      count: catTasks.length,
      completedCount: catCompleted.length,
      minutes: totalMinutes,
      percentage: totalTasks > 0 ? Math.round((catTasks.length / totalTasks) * 100) : 0
    };
  });

  // Calculate highest habit streaks
  const bestStreakHabit = habits.length > 0 
    ? [...habits].sort((a, b) => b.streak - a.streak)[0] 
    : null;

  // Focus safety rating calculation
  const productivityScore = Math.min(100, Math.max(0, Math.round(
    (completionRate * 0.4) + 
    ((habits.filter(h => h.streak > 0).length / (habits.length || 1)) * 30) + 
    ((tasks.filter(t => t.scheduledTime).length / (totalTasks || 1)) * 30)
  )));

  const getSafetyIndexColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const maxMinutesInCat = Math.max(...categoryStats.map(c => c.minutes), 60);

  return (
    <div id="insights-dashboard" className="flex flex-col gap-6 relative z-10 py-4">
      
      {/* Top Title & Diagnostic Refresh bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400 animate-pulse" />
            Alchemi Cognitive Analytics Panel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic diagnostics analyzing focused workload allocations and habit completion rates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isAnalyzing}
            className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Recalculating...' : 'Refresh Diagnostics'}
          </button>
          
          <button
            onClick={() => onNavigate('workspace')}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer flex items-center gap-1 border border-white/10"
          >
            Active Focus Space <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Analytics Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Stress & Productivity Rating */}
        <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus Safety Rating</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          
          <div className="my-4 flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-mono">{productivityScore}</span>
            <span className="text-xs text-slate-400">/100 Index</span>
          </div>

          <div className={`p-3 rounded-xl border text-[11px] font-semibold flex items-center gap-2 ${getSafetyIndexColor(productivityScore)}`}>
            <span>
              {productivityScore >= 80 
                ? '🟢 PEAK COGNITIVE VELOCITY: Excellent focus schedules and active habit streaks.' 
                : productivityScore >= 50 
                ? '🟡 STABLE BOUND: Workload is balanced. Consider scheduling remaining backlog items.' 
                : '🔴 OVERLOAD WARNING: High volume of unscheduled tasks or broken habits detected.'}
            </span>
          </div>
        </div>

        {/* 2. Focus Time Allocated */}
        <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Allocation Summary</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white font-mono">{Math.round(totalFocusMinutesScheduled / 60)}h</span>
              <span className="text-base font-bold text-purple-300 font-mono">{totalFocusMinutesScheduled % 60}m</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Total planned focus investment</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-400">Execution completeness:</span>
              <span className="text-white font-mono">{completedFocusMinutes}m done</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalFocusMinutesScheduled > 0 ? (completedFocusMinutes / totalFocusMinutesScheduled) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Habit Milestone Mastery */}
        <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Habit Streaks Master</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="my-4">
            {bestStreakHabit ? (
              <div>
                <span className="text-2xl font-black text-white truncate block">{bestStreakHabit.title}</span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                  🔥 Best Active Streak: {bestStreakHabit.streak} days
                </span>
              </div>
            ) : (
              <div>
                <span className="text-lg font-black text-white block">No Habit Records</span>
                <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">Create and check daily habits in the Workspace.</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Habits are completed on average once every 24 hours.</span>
          </div>
        </div>

      </div>

      {/* SVG Interactive Graphic & Category Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Category Focus Charts */}
        <div className="lg:col-span-2 p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Time Allocation by Category</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Focus time values in minutes aggregated across categories.</p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveChartTab('categories')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${activeChartTab === 'categories' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
              >
                Category Weight
              </button>
              <button
                onClick={() => setActiveChartTab('completion')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${activeChartTab === 'completion' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
              >
                Completion Ratio
              </button>
            </div>
          </div>

          {/* Real Hand-Crafted Interactive SVG Bar Chart / Visualizer */}
          {activeChartTab === 'categories' ? (
            <div className="flex-1 flex flex-col justify-between py-2 min-h-[220px]">
              <div className="space-y-4">
                {categoryStats.map(cat => {
                  const percentOfMax = (cat.minutes / maxMinutesInCat) * 100;
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-200">{cat.name}</span>
                        <span className="font-mono text-slate-400 font-bold">{cat.minutes} mins ({cat.count} tasks)</span>
                      </div>
                      <div className="relative w-full bg-white/5 h-4 rounded-md border border-white/5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-md transition-all duration-700"
                          style={{ width: `${Math.max(4, percentOfMax)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Legends */}
              <div className="flex justify-between border-t border-white/5 pt-3 mt-4 text-[9px] font-bold text-slate-500 font-mono">
                <span>0m</span>
                <span>{Math.round(maxMinutesInCat * 0.25)}m</span>
                <span>{Math.round(maxMinutesInCat * 0.5)}m</span>
                <span>{Math.round(maxMinutesInCat * 0.75)}m</span>
                <span>{maxMinutesInCat}m max</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between py-2 min-h-[220px]">
              <div className="space-y-4">
                {categoryStats.map(cat => {
                  const ratio = cat.count > 0 ? Math.round((cat.completedCount / cat.count) * 100) : 0;
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-200">{cat.name}</span>
                        <span className="font-mono text-slate-400 font-bold">{cat.completedCount} of {cat.count} completed ({ratio}%)</span>
                      </div>
                      <div className="relative w-full bg-white/5 h-4 rounded-md border border-white/5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-md transition-all duration-700"
                          style={{ width: `${Math.max(0, ratio)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between border-t border-white/5 pt-3 mt-4 text-[9px] font-bold text-slate-500 font-mono">
                <span>0% done</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% complete</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Proactive Alerts & Overdue Monitor */}
        <div className="p-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col gap-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Overdue & Risk Sentinel
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Critical markers nearing execution limits.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] flex flex-col gap-2.5 pr-1">
            {overdueTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-dashed border-emerald-500/20 text-center text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-white block">Perfect Landing!</span>
                <span className="text-[10px] mt-0.5 block leading-relaxed">No tasks currently overdue. You are safe.</span>
              </div>
            ) : (
              overdueTasks.map(t => (
                <div key={t.id} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{t.title}</span>
                    <span className="text-[9px] text-rose-400 font-bold font-mono">
                      Overdue: {new Date(t.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mindset Prompt Callout */}
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="min-w-0">
              <span className="text-[11px] font-black text-white block">Cognitive Action Reminder</span>
              <p className="text-[10px] text-slate-300 leading-relaxed mt-1">
                "Keep streaks alive! Checking off even a small 5-minute habit completes 30% of your global readiness calculation."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
