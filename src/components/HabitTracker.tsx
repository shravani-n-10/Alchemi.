import React, { useState } from 'react';
import { Target, Flame, CheckCircle, Plus, Trash2, Calendar, Award } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string, dateStr: string) => void;
  onAddHabit: (title: string, frequency: 'daily' | 'weekly') => void;
  onDeleteHabit: (id: string) => void;
}

export default function HabitTracker({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit
}: HabitTrackerProps) {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    onAddHabit(newHabitTitle.trim(), frequency);
    setNewHabitTitle('');
  };

  return (
    <div id="habit-tracker-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative z-10">
      {/* 1. Left block: Add habit form */}
      <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between max-h-[600px]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-3 font-display">
            <Target className="w-4 h-4 text-indigo-400" />
            Establish Habits
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Consistently executing daily habits is the fastest way to master procrastination. Set atomic routines, track your streaks, and build momentum!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Habit Routine Title</label>
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="e.g. 15m Morning Meditation"
                className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                {(['daily', 'weekly'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`py-2 rounded-xl text-xs font-semibold border capitalize transition cursor-pointer ${
                      frequency === f
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newHabitTitle.trim()}
              className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-slate-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-300" />
              Build Habit
            </button>
          </form>
        </div>

        {/* Motivation corner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
            <Award className="w-4 h-4 animate-bounce" />
            Productivity Secret
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed italic">
            "Your habits are the chemical catalyst of productivity. Complete them early to generate natural dopamine blocks."
          </p>
        </div>
      </div>

      {/* 2. Middle & Right blocks: Habits tracking display */}
      <div className="lg:col-span-2 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg flex flex-col h-full max-h-[600px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display">Habit Streaks Board</h3>
            <p className="text-xs text-slate-400">Track milestones and check off items for today.</p>
          </div>
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Today: {todayStr}
          </div>
        </div>

        {/* Habit items list */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
              <Flame className="w-8 h-8 text-indigo-400 mb-2" />
              <p className="text-xs font-bold text-white">No habits tracked yet</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Define standard routines to start stacking up streak achievements!</p>
            </div>
          ) : (
            habits.map(habit => {
              const isDoneToday = habit.completedDays.includes(todayStr);

              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    isDoneToday
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-white/5 hover:border-indigo-500/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => onToggleHabit(habit.id, todayStr)}
                      className="text-slate-400 hover:text-emerald-400 transition cursor-pointer flex-shrink-0"
                    >
                      <CheckCircle
                        className={`w-6 h-6 transition ${
                          isDoneToday ? 'text-emerald-400 fill-emerald-400/10' : 'text-white/10'
                        }`}
                      />
                    </button>

                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${isDoneToday ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {habit.title}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize bg-white/5 px-1.5 py-0.5 rounded border border-white/5 inline-block mt-0.5">
                        {habit.frequency} frequency
                      </span>
                    </div>
                  </div>

                  {/* Streak displays & delete icon */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-xl border border-amber-500/20 text-xs font-bold">
                      <Flame className={`w-4 h-4 text-amber-400 ${habit.streak > 0 ? 'animate-pulse fill-amber-500/30' : ''}`} />
                      {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                    </div>

                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
