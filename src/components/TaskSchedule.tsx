import React from 'react';
import { Calendar, Clock, AlertTriangle, Play, Sparkles, CheckCircle, GripVertical } from 'lucide-react';
import { Task } from '../types';

interface TaskScheduleProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAutoSchedule: () => void;
  onSetScheduleTime: (id: string, timeIso: string | null) => void;
  isScheduling: boolean;
}

export default function TaskSchedule({
  tasks,
  onSelectTask,
  onAutoSchedule,
  onSetScheduleTime,
  isScheduling
}: TaskScheduleProps) {
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const scheduledTasks = activeTasks.filter(t => t.scheduledTime);
  const unscheduledTasks = activeTasks.filter(t => !t.scheduledTime);

  // Hours array from 8 AM to 9 PM
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // [8, 9, 10, ..., 21]

  const formatHourLabel = (hour: number) => {
    return hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
  };

  // Find a task scheduled for a specific hour
  const getTasksForHour = (hour: number) => {
    return scheduledTasks.filter(t => {
      if (!t.scheduledTime) return false;
      const date = new Date(t.scheduledTime);
      return date.getHours() === hour;
    });
  };

  const getPriorityBorder = (priority: 'low' | 'medium' | 'high') => {
    if (priority === 'high') return 'border-l-4 border-l-rose-500 bg-rose-500/10';
    if (priority === 'medium') return 'border-l-4 border-l-amber-500 bg-amber-500/10';
    return 'border-l-4 border-l-emerald-500 bg-emerald-500/10';
  };

  // Helper to schedule a task to today at a specific hour
  const handleQuickAssign = (taskId: string, hour: number) => {
    const today = new Date();
    today.setHours(hour, 0, 0, 0);
    onSetScheduleTime(taskId, today.toISOString());
  };

  return (
    <div id="task-schedule-container" className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      {/* 1. Left bucket: Unscheduled Tasks sidebar */}
      <div className="xl:col-span-1 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg flex flex-col justify-between max-h-[600px]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Focus Backlog
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/5 text-slate-400 rounded-full border border-white/5">
              {unscheduledTasks.length} items
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            These tasks have no active focus slots scheduled. Use AI Auto-Schedule to design an optimal, deadline-safe plan for the day!
          </p>

          <button
            onClick={onAutoSchedule}
            disabled={isScheduling || unscheduledTasks.length === 0}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isScheduling ? (
              <>
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                Planning schedule...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-bounce text-indigo-300" />
                AI Auto-Schedule
              </>
            )}
          </button>

          {/* List of unscheduled tasks */}
          <div className="mt-5 overflow-y-auto max-h-[320px] pr-1 flex flex-col gap-2.5">
            {unscheduledTasks.length === 0 ? (
              <div className="text-center py-10 px-3 bg-white/5 rounded-xl border border-dashed border-white/10">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">Perfect! All Scheduled</p>
                <p className="text-[10px] text-slate-400 mt-1">Your entire active backlog is mapped onto your timeline.</p>
              </div>
            ) : (
              unscheduledTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-xl transition cursor-pointer flex flex-col gap-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate leading-tight group-hover:text-indigo-400">
                      {t.title}
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                      t.priority === 'high' ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-400 border-white/5'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {t.durationMinutes}m
                    </span>
                    <span className="font-semibold text-indigo-400">🔮 Score: {t.aiScore}</span>
                  </div>

                  {/* Quick drag/add trigger */}
                  <div className="hidden group-hover:flex items-center gap-1 border-t border-white/5 pt-1.5 mt-1">
                    <span className="text-[10px] text-slate-400">Schedule Today:</span>
                    <div className="flex gap-1 overflow-x-auto py-0.5 max-w-full">
                      {[9, 11, 14, 16, 19].map(hr => (
                        <button
                          key={hr}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAssign(t.id, hr);
                          }}
                          className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded text-[9px] font-bold hover:bg-indigo-500 hover:text-white transition cursor-pointer"
                        >
                          {hr > 12 ? `${hr - 12}p` : `${hr}a`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-white/10 pt-3 mt-4 text-[10px] text-slate-400 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span>High priority task / urgent focus slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span>Medium priority task blocks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Low priority or maintenance slots</span>
          </div>
        </div>
      </div>

      {/* 2. Right block: Hour-by-hour visual calendar timeline */}
      <div className="xl:col-span-3 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg flex flex-col h-full max-h-[600px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display">Dynamic Daily Schedule</h3>
            <p className="text-xs text-slate-400">Hour-by-hour visualization of your proactive focus windows.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            Today's Focus Map
          </div>
        </div>

        {/* Hourly items container */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {hours.map(hour => {
            const hourTasks = getTasksForHour(hour);

            return (
              <div key={hour} className="flex gap-4 group/hour">
                {/* Time Indicator label */}
                <div className="w-20 flex-shrink-0 text-right py-2 text-xs font-semibold text-slate-400 font-mono">
                  {formatHourLabel(hour)}
                </div>

                {/* Vertical timeline divider line */}
                <div className="w-0.5 bg-white/5 relative group-hover/hour:bg-indigo-500/30">
                  <div className="absolute top-3.5 -left-1 w-2.5 h-2.5 rounded-full border border-white/20 bg-slate-700 group-hover/hour:bg-indigo-500 group-hover/hour:scale-125 transition" />
                </div>

                {/* Tasks slotted or Empty State */}
                <div className="flex-1 pb-1">
                  {hourTasks.length === 0 ? (
                    <div className="h-10 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-slate-500 group-hover/hour:border-indigo-500/30 group-hover/hour:text-indigo-400 group-hover/hour:bg-indigo-500/5 transition duration-200">
                      Empty focus slot — Click tasks in left bucket to schedule
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {hourTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => onSelectTask(t)}
                          className={`flex items-center justify-between p-3 rounded-xl border border-white/5 shadow-md hover:border-indigo-500/30 transition-all cursor-pointer ${getPriorityBorder(t.priority)}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-white truncate">
                              {t.title}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              • <Clock className="w-3 h-3 text-slate-500" /> {t.durationMinutes}m focus
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                              🔮 Score: {t.aiScore}
                            </span>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onSetScheduleTime(t.id, null); // unschedule
                              }}
                              className="text-[10px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2 py-1 rounded transition cursor-pointer"
                            >
                              Unschedule
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
