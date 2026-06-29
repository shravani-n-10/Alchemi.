import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Target, Zap, Bot, Calendar, Play, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface GuidePageProps {
  onNavigate: (page: 'home' | 'login' | 'workspace' | 'insights' | 'guide') => void;
}

type GuideTab = 'philosophy' | 'backlog' | 'focus' | 'coach';

export default function GuidePage({ onNavigate }: GuidePageProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>('philosophy');

  const guideContent = {
    philosophy: {
      title: "Core Cognitive Philosophy",
      subtitle: "Why list-making fails, and how autonomous feedback loops save your deadlines.",
      icon: <HelpCircle className="w-6 h-6 text-indigo-400" />,
      text: "Traditional todo apps act as graveyard list containers: you write a task, forget about it, and only feel panic when an overdue email arrives. Alchemi changes this dynamic by analyzing your cognitive capacity, priority density, and deadline proximity autonomously. It computes a unified stress indicator called the 'Focus Safety Rating' to actively nudge you into healthy completion states.",
      steps: [
        "Prevent Task Graveyards: Every action item is quantified by deadline weight and priority.",
        "Maintain Focus Momentum: Integrates pomodoro timers directly beside your schedule so there's no friction between planning and execution.",
        "Proactive Mentorship: A model-based companion recommends calendar positions to spread out load before panic sets in."
      ]
    },
    backlog: {
      title: "The Intelligent Backlog & 🔮 Score",
      subtitle: "Behind the math of the Alchemi Urgency Score.",
      icon: <Target className="w-6 h-6 text-purple-400" />,
      text: "Our AI prioritizes tasks using a formula called the 'Alchemi Urgency Score' (ranging from 1 to 100). Unlike generic list markers (High/Medium/Low), this calculation processes the following real-time parameters:",
      formula: [
        { name: "Time-to-Deadline (50%)", desc: "Closer deadlines raise the score exponentially. Critical tasks turn magenta when within 24 hours." },
        { name: "Estimated Effort (30%)", desc: "Longer tasks are given higher weight early on to prevent late-night rush errors." },
        { name: "Category Density (20%)", desc: "Balances study, work, and personal limits dynamically to protect mental stamina." }
      ],
      steps: [
        "Create high-altitude entries using the 'Add Task' wizard.",
        "Watch your backlog sort itself automatically using the 🔮 Alchemi Urgency Score.",
        "Tap any task to preview its autonomous work plans on the side panel."
      ]
    },
    focus: {
      title: "Focus Mode & POMODORO Loops",
      subtitle: "Engage deep work state with single-task visual tracking.",
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      text: "Multi-tasking is a high-cost cognitive context switch. When you select a task from your backlog, Alchemi hides extraneous list details and expands a dedicated Focus Stage centering a countdown timer.",
      steps: [
        "Activate: Click on any task card to slide open the Active Focus Panel.",
        "Select Duration: Pick a customizable interval (25m standard or 45m deep focus blocks).",
        "Engage: Click 'Start Focus' to initiate countdown. The ambient layout fades to maximize focus.",
        "Milestones: Track task checklist sub-steps that let you tick off minor victories without breaking flow."
      ]
    },
    coach: {
      title: "AI Coach & One-Click Actions",
      subtitle: "A collaborative partner that suggests workspace modifications.",
      icon: <Bot className="w-6 h-6 text-emerald-400" />,
      text: "Our Gemini AI Coach does more than just answer prompts. It observes your workload schedules and acts proactively. When it notices study deadlines colliding, it generates custom plans, breaks big goals down, or suggests auto-scheduling.",
      steps: [
        "Ask Anything: Use the coach chat to refine study topics, ask for learning advice, or request custom schedules.",
        "One-Click Approvals: When the coach suggests an action (e.g. 'auto-schedule all pending tasks'), you can approve or dismiss with one click.",
        "Keep Streaks Active: Get tiny, non-intrusive motivational feedback to keep daily habit counters ticking."
      ]
    }
  };

  const current = guideContent[activeTab];

  return (
    <div id="guide-page" className="flex flex-col gap-6 relative z-10 py-4 max-w-5xl mx-auto">
      
      {/* Title block */}
      <div className="text-center py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[#c084fc] text-xs font-bold uppercase tracking-widest mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          System Handbook
        </span>
        <h2 className="text-3xl font-black font-display text-white">
          Alchemi Interactive Guide
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Learn how to master our multi-agent companion to supercharge your flow state and safeguard deadlines.
        </p>
      </div>

      {/* Main split handbook */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Chapters */}
        <div className="md:col-span-4 flex flex-col gap-2 bg-[#090b14]/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 block">Handbook Chapters</span>
          
          {[
            { id: 'philosophy', label: '1. Core Philosophy', color: 'hover:border-indigo-500/30 text-indigo-300' },
            { id: 'backlog', label: '2. Urgency & Backlog', color: 'hover:border-purple-500/30 text-purple-300' },
            { id: 'focus', label: '3. Focus Stages', color: 'hover:border-amber-500/30 text-amber-300' },
            { id: 'coach', label: '4. AI Companion Coach', color: 'hover:border-emerald-500/30 text-emerald-300' }
          ].map(chapter => (
            <button
              key={chapter.id}
              onClick={() => setActiveTab(chapter.id as GuideTab)}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                activeTab === chapter.id
                  ? 'bg-white/5 border-purple-500/30 text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{chapter.label}</span>
              <ArrowRight className={`w-3.5 h-3.5 opacity-50 ${activeTab === chapter.id ? 'translate-x-1 opacity-100 text-[#c084fc]' : ''} transition-all`} />
            </button>
          ))}

          <div className="mt-6 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block mb-1">Status Report</span>
            <span className="text-[11px] text-slate-400 block leading-relaxed">
              All 4 active workspaces are configured and healthy in local sandbox mode.
            </span>
          </div>
        </div>

        {/* Right Column: Display Explanation Content */}
        <div className="md:col-span-8 p-6 bg-[#090b14]/40 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col justify-between min-h-[400px]">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {current.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display leading-tight">{current.title}</h3>
                <p className="text-xs text-[#c084fc] font-semibold mt-0.5">{current.subtitle}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              {current.text}
            </p>

            {/* If formula is present */}
            {activeTab === 'backlog' && current.formula && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                {current.formula.map(item => (
                  <div key={item.name} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-relaxed">{item.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Checklist steps */}
            <div className="space-y-2.5 pt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">How to implement:</span>
              <div className="space-y-2">
                {current.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-300 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="border-t border-white/5 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              Dynamic Sandbox Sandbox Environment Ready
            </div>
            
            <button
              onClick={() => onNavigate('workspace')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              Enter Focus Workspace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
