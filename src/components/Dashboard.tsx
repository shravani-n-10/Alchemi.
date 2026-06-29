import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import TaskBoard from './TaskBoard';
import AIPlanner from './AIPlanner';
import AICoach from './AICoach';
import FocusMode from './FocusMode';
import { AlertOctagon, Flame, Calendar } from 'lucide-react';

interface DashboardProps {
  onCreateTask: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateTask }) => {
  const {
    tasks,
    updateTask,
    setDailyPlan,
    dailyPlan,
    activeSession,
    userProfile,
    syncGoogleCalendar,
    googleCalendarSynced,
    habits,
    toggleHabit,
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

  const activeTasks = tasks.filter((t) => !t.completed);
  const totalEffort = activeTasks.reduce((sum, t) => sum + t.estimatedEffort, 0);
  const highestTask = [...activeTasks].sort((a, b) => b.panicIndex - a.panicIndex)[0];
  const riskLevel = riskAssessment?.riskLevel || (highestTask?.panicIndex > 75 ? 'HIGH' : highestTask?.panicIndex > 40 ? 'MEDIUM' : 'LOW');

  // 1. FIRST-TIME USER ONBOARDING VIEW
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-8 animate-fadeIn h-[calc(100vh-70px)] overflow-y-auto relative z-10">
        <div className="space-y-3">
          <h2 className="text-[40px] font-black heading-outfit text-white leading-tight">
            👋 Welcome, {userProfile.name || 'Alchemist'}
          </h2>
          <p className="text-[20px] text-text-secondary max-w-xl mx-auto leading-normal">
            Your AI Productivity Companion is ready. Let's build today's plan.
          </p>
        </div>

        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={onCreateTask}
            className="glass-btn glass-btn-primary py-3.5 px-8 text-sm font-bold"
          >
            ➕ Create Your First Task
          </button>
          {!googleCalendarSynced ? (
            <button
              onClick={syncGoogleCalendar}
              className="glass-btn py-3.5 px-8 text-sm border-white/8 hover:border-white/15"
            >
              📅 Import Google Calendar
            </button>
          ) : (
            <span className="glass-btn py-3.5 px-8 text-sm border-green-500/20 text-green-300 bg-green-950/5">
              🟢 Calendar Imported (3 events)
            </span>
          )}
        </div>

        {/* First Time User Card */}
        <div className="glass-panel p-8 max-w-lg w-full border-violet-500/10 shadow-2xl text-left space-y-6">
          <h3 className="text-[22px] font-extrabold heading-outfit text-white">Welcome to Alchemi</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <div>
                <h4 className="text-sm font-bold text-white">Create your first task</h4>
                <p className="text-xs text-text-secondary mt-0.5">Tell Alchemi what you need to achieve and when it's due.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div>
                <h4 className="text-sm font-bold text-white">AI calculates Panic Index</h4>
                <p className="text-xs text-text-secondary mt-0.5">Our agents compute your deadline risk based on energy and effort.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div>
                <h4 className="text-sm font-bold text-white">AI builds your schedule</h4>
                <p className="text-xs text-text-secondary mt-0.5">Alchemi fits study blocks around your meetings and classes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
              <div>
                <h4 className="text-sm font-bold text-white">Focus Mode begins</h4>
                <p className="text-xs text-text-secondary mt-0.5">Start work with ambient soundscapes and get starter assets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FULL ACTIVE USER DASHBOARD VIEW
  return (
    <div className="flex-1 flex flex-col overflow-y-auto h-[calc(100vh-70px)] bg-transparent text-text-primary relative z-10 p-6 space-y-6">
      
      {/* Today's AI Briefing (Large Card) */}
      <div className="glass-panel p-6 border-violet-500/10 relative overflow-hidden animate-fadeIn shrink-0">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-violet-600/5 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span> Today's AI Briefing
            </span>
            <h3 className="text-[22px] font-extrabold heading-outfit text-white">
              Ready to conquer your day, {userProfile.name || 'Alchemist'}?
            </h3>
            <p className="text-xs text-text-secondary max-w-xl">
              You have <strong>{activeTasks.length} active tasks</strong> requiring approximately <strong>{totalEffort} hours</strong> of focus today. 
              {highestTask && (
                <> Your next recommended action is to start a focus session on <strong>{highestTask.title}</strong>.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/2 border border-white/5 p-4 rounded-xl">
            <div className="text-center border-r border-white/10 pr-6">
              <span className="text-[9px] text-text-muted uppercase font-bold block">Risk Level</span>
              <span className={`text-sm font-black font-mono block mt-1 ${riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'}`}>
                {riskLevel}
              </span>
            </div>
            {highestTask && (
              <div className="text-center border-r border-white/10 pr-6">
                <span className="text-[9px] text-text-muted uppercase font-bold block">Highest Panic</span>
                <span className="text-sm font-black font-mono block mt-1 text-pink-400">
                  {highestTask.panicIndex}%
                </span>
              </div>
            )}
            <div className="text-center">
              <span className="text-[9px] text-text-muted uppercase font-bold block">Est. Completion</span>
              <span className="text-sm font-black font-mono block mt-1 text-cyan-400">
                {dailyPlan ? dailyPlan.timeline[dailyPlan.timeline.length - 1]?.timeSlot.split(' - ')[1] || '18:00' : '18:00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start flex-1 min-h-0">
        {/* Column 1: Task Board (Urgency Queue) */}
        <section className="h-full overflow-hidden min-h-[450px]">
          <TaskBoard onCreateTask={onCreateTask} />
        </section>

        {/* Column 2: AI Planner & Daily Timeline */}
        <section className="h-full overflow-hidden min-h-[450px]">
          <AIPlanner />
        </section>
      </div>

      {/* Momentum Habits Section (Bottom of page) */}
      <div className="pt-4 shrink-0">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 px-1 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" /> Momentum Habits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isCompletedToday = habit.lastCompleted === todayStr;
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`glass-panel p-4 cursor-pointer flex items-center justify-between border transition-all ${
                  isCompletedToday 
                    ? 'border-green-500/20 bg-green-950/5 shadow-md shadow-green-500/5' 
                    : 'border-white/5 bg-white/2 hover:border-white/10'
                }`}
              >
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${isCompletedToday ? 'text-green-300 line-through' : 'text-white'}`}>
                    {habit.title}
                  </h4>
                  <span className="text-[10px] text-text-secondary">
                    Streak: <strong>{habit.streak} days</strong>
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isCompletedToday 
                    ? 'border-green-400 bg-green-500/20 text-green-400' 
                    : 'border-slate-700 text-transparent'
                }`}>
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Collapsible AI Coach widget */}
      <AICoach />

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
