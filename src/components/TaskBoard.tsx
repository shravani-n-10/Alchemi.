import React, { useState } from 'react';
import { Clock, AlertCircle, Sparkles, CheckSquare, Square, Trash2, Tag, Calendar, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddClick: () => void;
}

export default function TaskBoard({
  tasks,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onAddClick
}: TaskBoardProps) {
  const [filter, setFilter] = useState<'all' | 'Studies' | 'Work' | 'Personal' | 'Finance'>('all');
  const [sortBy, setSortBy] = useState<'aiScore' | 'deadline' | 'priority'>('aiScore');

  // Categories list
  const categories = ['all', 'Studies', 'Work', 'Personal', 'Finance'] as const;

  // Filter & sort tasks
  const filteredTasks = tasks
    .filter(task => filter === 'all' || task.category === filter)
    .sort((a, b) => {
      if (sortBy === 'aiScore') {
        return b.aiScore - a.aiScore; // Higher score first
      } else if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); // Closest first
      } else {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority]; // Highest priority first
      }
    });

  // Relative deadline calculator
  const getDeadlineStatus = (deadlineStr: string, status: 'todo' | 'completed' | 'in_progress') => {
    if (status === 'completed') return { text: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };

    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) {
      return { text: 'Overdue!', color: 'text-rose-400 bg-rose-500/10 border-rose-500/35 font-extrabold animate-pulse' };
    } else if (diffHours < 2) {
      return { text: 'CRITICAL (Under 2h)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/25 font-bold' };
    } else if (diffHours < 24) {
      return { text: `Due in ${Math.round(diffHours)} hrs`, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    } else {
      const days = Math.round(diffHours / 24);
      return { text: `Due in ${days} day${days > 1 ? 's' : ''}`, color: 'text-slate-400 bg-white/5 border-white/5' };
    }
  };

  const getAiScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  return (
    <div id="task-board-container" className="flex flex-col gap-5 h-full">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                filter === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Backlog' : cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="aiScore">🔮 AI Urgency Score</option>
            <option value="deadline">⏰ Closest Deadline</option>
            <option value="priority">🔥 High Priority</option>
          </select>

          <button
            onClick={onAddClick}
            className="text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 px-3.5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition flex items-center gap-1 cursor-pointer ml-1"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Backlog List */}
      <div className="flex-1 overflow-y-auto max-h-[600px] pr-1 flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">No active tasks found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Add a task or prompt Alchemi to help you organize your day and construct an action timeline!
            </p>
            <button
              onClick={onAddClick}
              className="mt-4 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isSelected = selectedTaskId === task.id;
            const deadLineStatus = getDeadlineStatus(task.deadline, task.status);
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`group flex items-center justify-between p-4 rounded-2xl border bg-white/5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-500/10' 
                    : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/10'
                }`}
              >
                {/* Checkbox and Task Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className="mt-1 text-slate-400 hover:text-indigo-400 transition flex-shrink-0 cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-bold truncate leading-tight transition ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-white group-hover:text-indigo-400'
                      }`}>
                        {task.title}
                      </h3>
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        task.priority === 'high' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : task.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Metadata summary line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        {task.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.durationMinutes}m
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges and Drag Indicator */}
                <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                  {/* Deadline warnings */}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${deadLineStatus.color}`}>
                    {task.status !== 'completed' && <Clock className="w-3 h-3" />}
                    {deadLineStatus.text}
                  </span>

                  {/* AI Urgency Score Meter */}
                  {!isCompleted && (
                    <span className={`text-xs font-black px-2 py-1 rounded-lg border ${getAiScoreBadgeColor(task.aiScore)}`} title="AI computed urgency rating">
                      🔮 {task.aiScore}
                    </span>
                  )}

                  {/* Actions (Delete icon) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
