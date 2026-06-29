import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import TaskBoard from './TaskBoard';
import AIPlanner from './AIPlanner';
import AICoach from './AICoach';
import FocusMode from './FocusMode';
import Settings from './Settings';
import Analytics from './Analytics';
import { Sparkles, Settings as SettingsIcon, BarChart2, VolumeX, AlertOctagon, HelpCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    updateTask,
    setDailyPlan,
    dailyPlan,
    activeSession,
  } = useTasks();

  const {
    riskAssessment,
    dismissRiskAssessment,
    isSpeaking,
    stopSpeaking,
  } = useAI();

  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [focusActive, setFocusActive] = useState(false);

  // Focus Session State monitoring
  const { focusSessions } = useTasks();
  const isFocusing = focusSessions.length > 0 && !focusSessions[focusSessions.length - 1].endTime;

  // Monitor active focus session trigger
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const hasActiveSession = activeTask && activeTask.subtasks.some((s) => !s.completed);

  const handleExecuteRecovery = (type: 'de-scope' | 'reschedule') => {
    if (!riskAssessment) return;

    const highPanicTask = [...tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => b.panicIndex - a.panicIndex)[0];

    if (type === 'de-scope' && highPanicTask) {
      // Reduce estimated effort and modify description
      updateTask(highPanicTask.id, {
        estimatedEffort: Math.max(0.5, highPanicTask.estimatedEffort - 1),
        description: `${highPanicTask.description} (De-scoped by AI Recovery Agent)`,
      });
    } else if (type === 'reschedule') {
      // Remove all "Personal" or low-panic tasks from today's timeline
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
    <div className="min-h-screen flex flex-col bg-dark text-text-primary overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-md relative z-25">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold heading-outfit tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-violet-300">
              ALCHEMI
            </h1>
            <span className="text-[9px] text-violet-400 font-bold uppercase tracking-widest block -mt-0.5">
              The AI OS for Productivity
            </span>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-lg hover:bg-white/5 text-pink-400 flex items-center gap-1.5 text-xs font-semibold animate-pulse"
              title="Stop AI Speech"
            >
              <VolumeX className="w-4 h-4" /> Speaking
            </button>
          )}

          <button
            onClick={() => setShowAnalytics(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Reflection & Metrics"
          >
            <BarChart2 className="w-4 h-4" /> Reflection
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" /> Settings
          </button>
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

      {/* Focus Mode Overlay */}
      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {/* Analytics Modal */}
      {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}

      {/* Render Focus Mode overlay if activeSession is active */}
      {activeSession && <FocusMode onClose={() => {}} />}
    </div>
  );
};
export default Dashboard;
