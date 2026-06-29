import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import { getPanicStatus } from '../utils/panic';
import { Plus, Mic, CheckCircle, Flame, Clock, Zap } from 'lucide-react';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    addTask,
    completeTask,
    energyLevel,
    setEnergyLevel,
    activeTaskId,
    setActiveTaskId,
    updateTask,
  } = useTasks();

  const { getTaskBreakdown, triggerVoiceAssistant, isListening } = useAI();

  const [title, setTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [effort, setEffort] = useState('1');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal' | 'Finance' | 'Urgent'>('Work');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedWhyTask, setSelectedWhyTask] = useState<any | null>(null);

  const activeTasks = tasks.filter((t) => !t.completed);

  // Quick text task creation (standard enter key)
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      // 1. Create task
      const created = await addTask({
        title: title.trim(),
        description: desc.trim() || 'No description provided.',
        dueDate: dueDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        estimatedEffort: parseFloat(effort) || 1,
        category,
        energyLevel: 'medium',
      });

      setTitle('');
      setDesc('');
      setDueDate('');
      setEffort('1');
      setShowAddForm(false);

      // 2. Generate subtasks and assets in background using Breakdown Agent
      const breakdown = await getTaskBreakdown(created.title, created.description, created.category);
      updateTask(created.id, {
        subtasks: breakdown.subtasks.map((sub: any, idx: number) => ({
          id: `sub-${idx}-${Date.now()}`,
          title: sub.title,
          duration: sub.duration,
          completed: false,
        })),
        procrastinationWarning: breakdown.procrastinationWarning,
        starterAsset: breakdown.starterAsset,
      });

      // Automatically select the newly created task
      setActiveTaskId(created.id);
    } catch (e) {
      console.error('Failed to create task:', e);
    } finally {
      setIsCreating(false);
    }
  };

  // Human-readable countdown timer
  const getCountdown = (dueDateStr: string) => {
    const diff = new Date(dueDateStr).getTime() - Date.now();
    if (diff <= 0) return 'Overdue';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${mins}m remaining`;
  };

  // State ticker to update countdowns in real-time
  const [, setTicker] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Quick Input Bar */}
      <div className="glass-panel p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="I want to..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setShowAddForm(true);
          }}
          className="flex-1 bg-transparent text-sm border-none outline-none text-text-primary placeholder:text-text-muted"
        />
        <button
          onClick={triggerVoiceAssistant}
          className={`p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
              : 'hover:bg-white/5 text-text-secondary hover:text-white'
          }`}
          title="Voice Command (Speak to Alchemi)"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Extended Task Creation Form */}
      {showAddForm && (
        <form onSubmit={handleQuickAdd} className="glass-panel p-4 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Task Title</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input text-xs py-2"
              placeholder="e.g., Study for Math Exam"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">Description</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full glass-input text-xs py-2 min-h-[50px] resize-none"
              placeholder="What needs to be done?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider">Due Date</span>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full glass-input text-xs py-2"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider">Effort (Hours)</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                className="w-full glass-input text-xs py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full glass-input text-xs py-2 bg-slate-950"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Finance">Finance</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full glass-btn glass-btn-primary justify-center text-xs py-2"
              >
                {isCreating ? 'Planning...' : 'Generate Plan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Energy Level Selector */}
      <div className="glass-panel p-3">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider block mb-2 font-semibold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> State of Energy
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setEnergyLevel(level)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                energyLevel === level
                  ? 'bg-violet-950/20 border-violet-500 text-white shadow-md shadow-violet-500/10'
                  : 'bg-transparent border-slate-800/65 text-text-secondary hover:border-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Urgency Queue ({activeTasks.length})
          </span>
          {activeTasks.some((t) => t.silentKiller) && (
            <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3" /> Silent Killers Detected
            </span>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-center py-12 glass-panel">
            <p className="text-xs text-text-muted">No active tasks. Add a task to start!</p>
          </div>
        ) : (
          activeTasks.map((task) => {
            const { color, glowClass } = getPanicStatus(task.panicIndex);
            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`glass-panel p-4 cursor-pointer relative overflow-hidden ${glowClass} ${
                  activeTaskId === task.id ? 'border-violet-500 bg-violet-950/5' : ''
                }`}
              >
                {/* Visual Category tag */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-text-secondary font-medium">
                    {task.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-secondary font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-text-muted" /> {getCountdown(task.dueDate)}
                    </span>
                    {task.silentKiller && (
                      <span className="text-[9px] bg-red-950/50 text-red-400 px-1.5 py-0.2 rounded font-semibold animate-pulse" title="High effort task due in future. Start now.">
                        SK
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">
                  {task.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-1 mb-3">
                  {task.description}
                </p>

                {/* Progress bar and Panic Score */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          task.subtasks.length > 0
                            ? (task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100
                            : 0
                        }%`,
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold" style={{ color }}>
                      {task.panicIndex}%
                    </span>
                    <span className="text-[9px] text-text-muted uppercase font-semibold">Panic</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWhyTask(task);
                      }}
                      className="priority-why-btn"
                    >
                      Why?
                    </button>
                  </div>
                </div>

                {/* Action: Mark Complete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    completeTask(task.id);
                  }}
                  className="absolute top-4 right-4 text-text-muted hover:text-green-400 transition-colors opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                  title="Mark Complete"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {selectedWhyTask && (
        <div className="why-tooltip-overlay" onClick={() => setSelectedWhyTask(null)}>
          <div className="why-tooltip-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="why-tooltip-title">
              <span className="text-violet-400">🔥</span> Why is this my priority?
            </h4>
            <div className="mb-4">
              <span className="text-xs font-bold text-text-primary block mb-1">{selectedWhyTask.title}</span>
              <span className="text-[10px] text-text-muted">Panic Index: {selectedWhyTask.panicIndex}%</span>
            </div>
            <ul className="why-tooltip-reason-list">
              <li className="why-tooltip-reason-item">
                This task is due in <strong>{getCountdown(selectedWhyTask.dueDate)}</strong>.
              </li>
              <li className="why-tooltip-reason-item">
                It requires an estimated <strong>{selectedWhyTask.estimatedHours || 2} hours</strong> of focused work.
              </li>
              {selectedWhyTask.panicIndex > 75 && (
                <li className="why-tooltip-reason-item">
                  Your Panic Index is in the <strong>Critical Range</strong> due to the short time remaining.
                </li>
              )}
              {selectedWhyTask.silentKiller && (
                <li className="why-tooltip-reason-item">
                  It is flagged as a <strong>"Silent Killer"</strong>: a high-effort task that will become impossible to finish if not started now.
                </li>
              )}
              <li className="why-tooltip-reason-item">
                Energy adaptation: Current energy level is set to <strong>{energyLevel}</strong>, which scales task urgency to protect your calendar.
              </li>
            </ul>
            <button
              onClick={() => setSelectedWhyTask(null)}
              className="glass-btn w-full justify-center text-xs py-2 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskBoard;
