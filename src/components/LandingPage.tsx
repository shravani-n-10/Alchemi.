import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, LayoutDashboard, Calendar, Zap, Bot, Shield, ArrowRight, CheckCircle, Brain, Target, Star, Trophy, Users } from 'lucide-react';
import { Task, Habit } from '../types';

interface LandingPageProps {
  tasks: Task[];
  habits: Habit[];
  onNavigate: (page: 'home' | 'login' | 'workspace' | 'insights') => void;
  isLoggedIn: boolean;
  user: { name: string; email: string; avatarUrl?: string } | null;
}

export default function LandingPage({ tasks, habits, onNavigate, isLoggedIn, user }: LandingPageProps) {
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const habitsCount = habits.length;
  const completedToday = tasks.filter(t => t.status === 'completed').length;

  return (
    <div id="landing-page" className="flex flex-col gap-16 relative z-10 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#a855f7]/5 border border-[#a855f7]/30 rounded-full text-xs font-semibold mb-2 shadow-[0_0_15px_rgba(168,85,247,0.05)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
          <span className="text-[#c084fc] font-bold">Introducing Alchemi 1.0</span>
          <span className="text-slate-400 font-medium">— Proactive Multi-Agent OS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white font-display"
        >
          Conquer Procrastination. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Master Every Deadline.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed"
        >
          Alchemi is an autonomous AI productivity companion that designs personalized workflow structures, organizes daily hours, and provides proactive chat coaching to keep you in focus flow state.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigate(isLoggedIn ? 'workspace' : 'login')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 group border border-white/10"
          >
            Launch Alchemi Workspace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          
          <button
            onClick={() => onNavigate('insights')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 border border-white/10"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            View Live Insights
          </button>
        </motion.div>
      </section>

      {/* Metrics Teaser Bar */}
      <section className="max-w-6xl w-full mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl text-center">
          <div>
            <span className="block text-3xl font-extrabold text-white font-mono">{activeTasksCount}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Commitments</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-3xl font-extrabold text-white font-mono">{habitsCount}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Daily Habit Goals</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-3xl font-extrabold text-indigo-400 font-mono">94%</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Deadline Safety Index</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-3xl font-extrabold text-emerald-400 font-mono">{completedToday}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Done Today</span>
          </div>
        </div>
      </section>

      {/* Feature Grid Section (The 4 Dashboards Overview) */}
      <section className="max-w-6xl w-full mx-auto px-4 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
            A Multi-Dimensional Mindset Space
          </h2>
          <p className="text-slate-400 text-xs mt-1">Four tightly integrated views built to sustain continuous execution loops.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Main Landing Dashboard */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-400/40 transition flex flex-col justify-between h-64">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">1. Cognitive Hub</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                Your high-altitude flight command dashboard. Teases habits streaks, live schedule progress, and priority scoreboards.
              </p>
            </div>
            <button onClick={() => onNavigate('home')} className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Login Credentials Dashboard */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition flex flex-col justify-between h-64">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">2. Secure Google Gate</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                Personalized user profiles. Login with Google seamlessly to bind your tasks to private database parameters.
              </p>
            </div>
            <button onClick={() => onNavigate('login')} className="text-xs font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300 transition">
              {isLoggedIn ? 'Manage Account' : 'Sign In Now'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Task Focus Workspace Dashboard */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 backdrop-blur-sm hover:border-pink-400/40 transition flex flex-col justify-between h-64">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">3. Live Focus Workspace</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                Contains the Pomodoro focus ring, the active hour-by-hour calendar schedule, and our Gemini AI chat assistant.
              </p>
            </div>
            <button onClick={() => onNavigate('workspace')} className="text-xs font-bold text-pink-400 flex items-center gap-1 hover:text-pink-300 transition">
              Enter Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Analytics Insights Dashboard */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-400/40 transition flex flex-col justify-between h-64">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display">4. Alchemi Insights</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                Rich data analysis dashboard. Dynamic productivity score indicators, bar charts of task categories, and habit records.
              </p>
            </div>
            <button onClick={() => onNavigate('insights')} className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition">
              View Statistics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Interactive Section: Focus Coach introduction */}
      <section className="max-w-6xl w-full mx-auto px-4">
        <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Proactive Mentorship</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight leading-tight">
              An AI Coach that acts, rather than just responds.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Most tools wait for you to type. Alchemi's AI coach continuously parses your active task timeline, flags impending deadlines, and suggests action items—such as auto-breaking a project into incremental subtasks—with a one-click acceptance interface.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300 font-semibold">Automatic priority rating (🔮 Alchemi score)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300 font-semibold">Task breakdown step recommendations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300 font-semibold">One-click calendar scheduling allocations</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md shadow-inner flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-none">Alchemi AI Coach</span>
                <span className="text-[9px] text-slate-500">Autonomous Core</span>
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 leading-relaxed italic">
              "Hi! I noticed your Study assignment is due in 16 hours. I've formulated a 3-step focus schedule at 2:00 PM today to guarantee safe completion. Would you like to write this to your calendar?"
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onNavigate('workspace')}
                className="flex-1 py-1.5 bg-indigo-500 text-white text-[10px] font-black rounded-lg cursor-pointer transition hover:bg-indigo-600"
              >
                Accept Allocation Plan
              </button>
              <button className="px-3 py-1.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded-lg hover:text-white transition">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* User Benefits Comparison */}
      <section className="max-w-5xl w-full mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white font-display mb-8">What Alchemi Solves</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Legacy Planning Tools</h3>
            <ul className="flex flex-col gap-3 text-xs text-slate-400 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Static lists that sit there, forgotten until overdue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Requires hours of tedious manual time-blocking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>No understanding of cognitive workload or stress indexes</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">The Alchemi Standard</h3>
            <ul className="flex flex-col gap-3 text-xs text-slate-300 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Proactive agents suggest focus times before panic sets in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>One-click AI Auto-Scheduling spreads out work balances</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Atomic habit streaks combined with active focus timers</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
