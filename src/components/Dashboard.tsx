import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import TaskBoard from './TaskBoard';
import AIPlanner from './AIPlanner';
import AICoach from './AICoach';
import FocusMode from './FocusMode';
import { AlertOctagon } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    updateTask,
    setDailyPlan,
    dailyPlan,
    activeSession,
  } = useTasks();

  const {
    riskAssessment,
    dismissRiskAssessment,
  } = useAI();

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
    <div className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-70px)] bg-transparent text-text-primary relative z-10">
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

      {/* Render Focus Mode overlay if activeSession is active */}
      {activeSession && <FocusMode onClose={() => {}} />}
    </div>
  );
};

export default Dashboard;
