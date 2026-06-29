import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import TaskBoard from './TaskBoard';
import AIPlanner from './AIPlanner';
import AICoach from './AICoach';
import FocusMode from './FocusMode';
import Settings from './Settings';
import Analytics from './Analytics';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  BarChart2, 
  VolumeX, 
  AlertOctagon, 
  MoreVertical, 
  LogOut, 
  Info, 
  User, 
  BookOpen, 
  Globe 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    updateTask,
    setDailyPlan,
    dailyPlan,
    activeSession,
    userProfile,
    logout,
  } = useTasks();

  const {
    riskAssessment,
    dismissRiskAssessment,
    isSpeaking,
    stopSpeaking,
  } = useAI();

  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteRecovery = (type: 'de-scope' | 'reschedule') => {
    if (!riskAssessment) return;

    const highPanicTask = [...tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => b.panicIndex - a.panicIndex)[0];

    if (type === 'de-scope' && highPanicTask) {
      updateTask(highPanicTask.id, {
        estimatedEffort: Math.max(0.5, highPanicTask.estimatedEffort - 1),
        description: `${highPanicTask.description} (De-scoped by AI Recovery Agent)`,
      });
    } else if (type === 'reschedule') {
      if (dailyPlan) {
        setDailyPlan({
          ...dailyPlan,
          timeline: dailyPlan.timeline.filter(
            (block) => block.activityType !== 'break' && block.referenceId !== highPanicTask?.id
          ),
        });
      }
    }

    dismissRiskAssessment();
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-text-primary overflow-hidden relative z-10">
      {/* Header */}
      <header className="px-6 py-3.5 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold heading-outfit tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-violet-300">
              ALCHEMI
            </h1>
            <span className="text-[9px] text-violet-400 font-bold uppercase tracking-widest block -mt-0.5">
              The AI OS for Productivity
            </span>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-lg hover:bg-black/5 text-pink-500 flex items-center gap-1.5 text-xs font-semibold animate-pulse"
              title="Stop AI Speech"
            >
              <VolumeX className="w-4 h-4" /> Speaking
            </button>
          )}

          <button
            onClick={() => setShowAnalytics(true)}
            className="p-2 rounded-lg hover:bg-black/5 text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Reflection & Metrics"
          >
            <BarChart2 className="w-4 h-4" /> Reflection
          </button>

          {/* User Profile Card & Dropdown */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10 relative" ref={dropdownRef}>
            <img
              src={userProfile.avatarUrl || 'https://i.pravatar.cc/150'}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full border border-violet-500/20 object-cover shadow-inner"
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold block leading-none text-text-primary">{userProfile.name}</span>
              <span className="text-[9px] text-text-muted mt-0.5 block leading-none">{userProfile.email}</span>
            </div>

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded-lg hover:bg-black/5 text-text-secondary hover:text-text-primary transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 rounded-xl bg-slate-950/95 border border-white/10 shadow-2xl p-1.5 z-45 backdrop-blur-md animate-fadeIn">
                <button
                  onClick={() => {
                    setShowAbout(true);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                >
                  <Globe className="w-3.5 h-3.5" /> About Us
                </button>
                <button
                  onClick={() => {
                    setShowInfo(true);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Guide / Info
                </button>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                >
                  <SettingsIcon className="w-3.5 h-3.5" /> Account Settings
                </button>
                <div className="h-px bg-white/5 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all text-left"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="dashboard-grid">
          {/* Column 1: Task Board */}
          <section className="h-full overflow-hidden">
            <TaskBoard />
          </section>

          {/* Column 2: AI Planner & Timeline */}
          <section className="h-full overflow-hidden">
            <AIPlanner />
          </section>

          {/* Column 3: AI Coach & Soundboard */}
          <section className="h-full overflow-hidden">
            <AICoach />
          </section>
        </div>
      </main>

      {/* Proactive Risk Triage Modal */}
      {riskAssessment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-6 border-red-500/25 shadow-lg shadow-red-500/5">
            <div className="flex items-center gap-2.5 text-red-400 mb-3">
              <AlertOctagon className="w-6 h-6 animate-bounce" />
              <h3 className="text-base font-bold heading-outfit uppercase tracking-wider">
                AI Risk Triage Alert
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-normal mb-4">
              {riskAssessment.reasoning}
            </p>

            <div className="space-y-3 mb-5">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">
                Select Recovery Intervention
              </span>
              {riskAssessment.recoveryOptions.map((opt: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleExecuteRecovery(opt.type)}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-violet-400">{opt.title}</span>
                    <span className="text-[9px] text-green-400 font-mono font-semibold">
                      +{opt.timeSavedMinutes}m saved
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-normal">{opt.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={dismissRiskAssessment}
              className="w-full glass-btn justify-center text-xs py-2 text-text-secondary hover:text-white"
            >
              Dismiss Assessment
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {/* Analytics Modal */}
      {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}

      {/* About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold heading-outfit mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" /> About Alchemi
            </h3>
            <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
              <p>
                <strong>Alchemi</strong> is an AI-powered Productivity Operating System designed specifically to prevent missed deadlines through proactive, agentic planning.
              </p>
              <p>
                Instead of simple checklists that wait for you to look at them, Alchemi coordinates a network of specialized AI agents:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Prioritizer Agent</strong>: Tracks your energy and computes the dynamic Panic Index.</li>
                <li><strong>Planner Agent</strong>: Auto-schedules your tasks into a 24-hour timeline.</li>
                <li><strong>Risk Predictor</strong>: Forecasts deadline delays in the background.</li>
                <li><strong>Recovery Agent</strong>: Proposes instant de-scoping and rescheduling interventions.</li>
              </ul>
              <p>
                Built for the 10x Vibe2Ship Hackathon, Alchemi is powered by Google AI Studio's Gemini 1.5 Flash model.
              </p>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full glass-btn justify-center text-xs py-2.5 mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Guide / Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel max-w-lg w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold heading-outfit mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" /> Alchemi Quick Guide
            </h3>
            <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">1. The Panic Index Formula</h4>
                <p>Urgency is computed as: `(Effort / Time Remaining) * Energy Multiplier`. If you set your energy to "Low" (you are tired), task urgency scores will spike and cards will glow brighter.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">2. Voice Commands</h4>
                <p>Click the pulsing **AI Core** in the right column. When it turns yellow, speak clearly. Try saying: <em>"Give me a pep talk"</em> or ask a question. The coach will speak back to you.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">3. Mission Briefings & Starter Assets</h4>
                <p>When you create a task, Alchemi generates subtasks and an **AI Starter Asset** (e.g., slide outlines, email drafts, code boilerplates). Click the copy icon to use them instantly.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary">4. Focus Mode</h4>
                <p>Click **"Start Focus Session"** on any task to enter full-screen focus. Toggle **Rain** or **Brown Noise** to synthesize focus frequencies locally. Click **"Complete Milestone"** to trigger a confetti explosion and success chime.</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full glass-btn justify-center text-xs py-2.5 mt-6"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Render Focus Mode overlay if activeSession is active */}
      {activeSession && <FocusMode onClose={() => {}} />}
    </div>
  );
};
export default Dashboard;
