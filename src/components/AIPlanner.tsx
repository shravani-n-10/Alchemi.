import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import { getPanicStatus } from '../utils/panic';
import { Play, Copy, Check, Clock, AlertCircle, FileText, CheckSquare, Sparkles } from 'lucide-react';

export const AIPlanner: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    toggleSubTask,
    dailyPlan,
    startFocusSession,
  } = useTasks();

  const { generateBriefing, isProcessing } = useAI();
  const [copied, setCopied] = useState(false);
  const [showAsset, setShowAsset] = useState(true);

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const momentum = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleCopyAsset = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find the first uncompleted subtask for the focus session
  const nextSubtask = activeTask?.subtasks.find((s) => !s.completed);

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pr-1">
      {/* Momentum Meter */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold heading-outfit flex items-center gap-1.5 text-text-primary">
            <Sparkles className="w-4 h-4 text-violet-400" /> Momentum Meter
          </h2>
          <p className="text-[10px] text-text-secondary">
            Keep completing tasks and habits to maintain your daily velocity.
          </p>
        </div>
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-900"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-violet-500 transition-all duration-1000"
              strokeDasharray={`${momentum}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
            {momentum}%
          </div>
        </div>
      </div>

      {/* Active Task Details (Mission Briefing) */}
      {activeTask ? (
        <div className="glass-panel p-5 space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-violet-400">Mission Briefing</span>
                <span className="text-[10px] text-text-muted">•</span>
                <span className="text-[10px] text-text-muted font-mono">{activeTask.category}</span>
              </div>
              <h2 className="text-lg font-bold text-text-primary heading-outfit leading-tight">
                {activeTask.title}
              </h2>
              <p className="text-xs text-text-secondary mt-1">{activeTask.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span
                className="text-xs font-bold font-mono block px-2.5 py-1 rounded bg-slate-950 border border-white/5"
                style={{ color: getPanicStatus(activeTask.panicIndex).color }}
              >
                {activeTask.panicIndex}% Panic
              </span>
            </div>
          </div>

          {/* Procrastination Warning */}
          {activeTask.procrastinationWarning && (
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300 leading-normal">
                <strong className="font-semibold">Procrastination Alert:</strong> {activeTask.procrastinationWarning}
              </p>
            </div>
          )}

          {/* Subtasks Checklist */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> Action Checklist
            </h3>
            <div className="space-y-2">
              {activeTask.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => toggleSubTask(activeTask.id, sub.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => {}} // Controlled by parent click
                      className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500/20 bg-slate-950"
                    />
                    <span className={sub.completed ? 'line-through text-text-muted' : 'text-text-primary'}>
                      {sub.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3 text-text-muted" /> {sub.duration}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Starter Asset */}
          {activeTask.starterAsset && (
            <div className="space-y-2">
              <button
                onClick={() => setShowAsset(!showAsset)}
                className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 w-full justify-between py-1 border-b border-white/5"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> AI Starter Asset ({activeTask.starterAsset.type})
                </span>
                <span className="text-[10px] text-violet-400 font-normal">
                  {showAsset ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showAsset && (
                <div className="rounded-lg border border-white/5 bg-slate-950/40 overflow-hidden relative">
                  <div className="flex justify-between items-center px-4 py-2 bg-slate-950 border-b border-white/5">
                    <span className="text-xs text-text-secondary truncate">{activeTask.starterAsset.title}</span>
                    <button
                      onClick={() => handleCopyAsset(activeTask.starterAsset!.content)}
                      className="text-text-muted hover:text-white transition-colors"
                      title="Copy Draft"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-[160px] text-text-secondary leading-normal select-text">
                    {activeTask.starterAsset.content}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Start Focus Mode Button */}
          {nextSubtask ? (
            <button
              onClick={() => startFocusSession(activeTask.id, nextSubtask.id)}
              className="w-full glass-btn glass-btn-primary justify-center text-sm py-2.5"
            >
              <Play className="w-4 h-4 fill-white" /> Start Focus Session: "{nextSubtask.title}"
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-green-950/20 border border-green-500/20 text-center">
              <p className="text-xs text-green-300">All milestones completed. Mission accomplished!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Sparkles className="w-8 h-8 text-violet-400 mb-3 animate-pulse" />
          <h3 className="text-sm font-bold heading-outfit mb-1 text-text-primary">No Mission Selected</h3>
          <p className="text-xs text-text-secondary max-w-xs leading-normal">
            Select an active task from the Urgency Queue or create a new one to unlock your AI Mission Briefing.
          </p>
        </div>
      )}

      {/* Daily Timeline */}
      <div className="glass-panel p-5 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Daily Timeline Scheduler
          </span>
          {!dailyPlan && (
            <button
              onClick={generateBriefing}
              disabled={isProcessing}
              className="glass-btn text-xs py-1 px-3"
            >
              {isProcessing ? 'Scheduling...' : 'Auto-Schedule Day'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {dailyPlan ? (
            dailyPlan.timeline.map((block) => (
              <div
                key={block.id}
                className={`flex items-center gap-4 p-3 rounded-lg border text-xs transition-all ${
                  block.activityType === 'meeting'
                    ? 'bg-red-950/15 border-red-500/20'
                    : block.activityType === 'break'
                    ? 'bg-green-950/15 border-green-500/20'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <span className="font-mono text-cyan-400 text-xs w-28 shrink-0">{block.timeSlot}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-text-primary block truncate">{block.label}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-0.5">
                    {block.activityType}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xs text-text-muted">No timeline generated. Click "Auto-Schedule Day" to build it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AIPlanner;
