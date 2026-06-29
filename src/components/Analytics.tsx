import React, { useState } from 'react';
import { useAI } from '../context/AIContext';
import { useTasks } from '../context/TaskContext';
import { X, Trophy, AlertTriangle, Calendar, Award, Hourglass } from 'lucide-react';

interface AnalyticsProps {
  onClose: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onClose }) => {
  const { generateEODReflection, isProcessing } = useAI();
  const { tasks, focusSessions, habits } = useTasks();
  const [reflection, setReflection] = useState<any>(null);

  const completedToday = tasks.filter(t => t.completed);
  const totalFocusMins = Math.round(focusSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
  const completedHabits = habits.filter(h => {
    const todayStr = new Date().toISOString().split('T')[0];
    return h.lastCompleted === todayStr;
  });

  const handleGenerateReflection = async () => {
    const res = await generateEODReflection();
    setReflection(res);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold heading-outfit mb-6 flex items-center gap-2">
          End-of-Day Reflection & Metrics
        </h2>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
            <span className="text-2xl font-bold heading-outfit">{completedToday.length}</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Completed Tasks</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
            <Hourglass className="w-6 h-6 text-cyan-400 mb-2" />
            <span className="text-2xl font-bold heading-outfit">{totalFocusMins}m</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Focus Sessions</span>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
            <Award className="w-6 h-6 text-violet-400 mb-2" />
            <span className="text-2xl font-bold heading-outfit">{completedHabits.length}</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Habits Hit</span>
          </div>
        </div>

        {!reflection ? (
          <div className="text-center py-8">
            <p className="text-sm text-text-secondary mb-4">
              Analyze your focus patterns, identify procrastination traps, and let Alchem-AI draft tomorrow's optimal schedule.
            </p>
            <button
              onClick={handleGenerateReflection}
              disabled={isProcessing}
              className="glass-btn glass-btn-primary py-2.5 px-6 text-sm"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Analyzing Today...
                </span>
              ) : (
                "Trigger AI EOD Reflection"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Victory */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1.5 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Today's Biggest Victory
              </h3>
              <p className="text-sm leading-normal">{reflection.victory}</p>
            </div>

            {/* Procrastination Diagnosis */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Procrastination Diagnosis
              </h3>
              <p className="text-sm leading-normal">{reflection.procrastinationInsight}</p>
            </div>

            {/* Tomorrow's Draft Timeline */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Tomorrow's AI Draft Schedule
              </h3>
              <div className="space-y-2">
                {reflection.tomorrowTimeline && reflection.tomorrowTimeline.length > 0 ? (
                  reflection.tomorrowTimeline.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0 text-sm">
                      <span className="font-mono text-cyan-400 text-xs w-28 shrink-0">{item.timeSlot}</span>
                      <span className="text-text-primary">{item.activity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted">No schedule drafted. Create tasks to build tomorrow's plan.</p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full glass-btn justify-center text-sm py-2.5"
            >
              Close Reflection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Analytics;
