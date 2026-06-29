import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import { calculatePanicIndex, getPanicStatus } from '../utils/panic';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

interface CreateTaskPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTaskPage: React.FC<CreateTaskPageProps> = ({ onBack, onSuccess }) => {
  const { addTask, updateTask, energyLevel } = useTasks();
  const { getTaskBreakdown, generateBriefing } = useAI();

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal' | 'Finance' | 'Urgent'>('Work');
  const [effort, setEffort] = useState('2');
  const [dueDate, setDueDate] = useState('');

  // Loading state
  const [isBuilding, setIsBuilding] = useState(false);

  // Live AI Preview calculations
  const [livePanic, setLivePanic] = useState(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [estimatedSessions, setEstimatedSessions] = useState(4);
  const [suggestedFocusTime, setSuggestedFocusTime] = useState('120 mins');
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [riskColor, setRiskColor] = useState('#10b981');

  // Recalculate AI Preview dynamically when inputs change
  useEffect(() => {
    const hours = parseFloat(effort) || 2;
    
    // Difficulty
    if (hours <= 2) setDifficulty('Easy');
    else if (hours <= 5) setDifficulty('Medium');
    else setDifficulty('Hard');

    // Sessions & Time
    const sessions = Math.ceil(hours / 0.75); // 45-min Pomodoro focus sessions
    setEstimatedSessions(sessions);
    setSuggestedFocusTime(`${Math.round(hours * 60)} mins`);

    // Panic Index & Risk Level
    if (dueDate) {
      const panic = calculatePanicIndex(hours, new Date(dueDate).toISOString(), energyLevel);
      setLivePanic(panic);
      
      const { status, color } = getPanicStatus(panic);
      setRiskLevel(status.toUpperCase());
      setRiskColor(color);
    } else {
      setLivePanic(0);
      setRiskLevel('LOW');
      setRiskColor('#10b981');
    }
  }, [effort, dueDate, energyLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || isBuilding) return;

    setIsBuilding(true);

    try {
      // 1. Add the task
      const createdTask = await addTask({
        title: title.trim(),
        description: desc.trim(),
        category,
        dueDate: new Date(dueDate).toISOString(),
        estimatedEffort: parseFloat(effort) || 2,
        energyLevel: 'medium',
      });

      // 2. Fetch AI breakdown in background
      const breakdown = await getTaskBreakdown(createdTask.title, createdTask.description, createdTask.category);
      
      updateTask(createdTask.id, {
        subtasks: breakdown.subtasks.map((sub: any, idx: number) => ({
          id: `sub-${idx}-${Date.now()}`,
          title: sub.title,
          duration: sub.duration,
          completed: false,
        })),
        procrastinationWarning: breakdown.procrastinationWarning,
        starterAsset: breakdown.starterAsset,
      });

      // 3. Auto-schedule daily timeline
      await generateBriefing();

      // Artificial delay for loading screen animation effect
      setTimeout(() => {
        setIsBuilding(false);
        onSuccess();
      }, 2000);

    } catch (err) {
      console.error('Failed to create task:', err);
      setIsBuilding(false);
    }
  };

  if (isBuilding) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] text-center p-6 bg-slate-950/20 backdrop-blur-md relative z-10 animate-fadeIn">
        <div className="space-y-4 max-w-sm">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold heading-outfit text-white">
            Alchemi is building your execution plan...
          </h3>
          <p className="text-xs text-text-secondary">
            Calculating Panic Index, generating subtask milestones, and auto-scheduling focus blocks around your calendar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-6 md:p-12 max-w-5xl mx-auto w-full relative z-10 animate-fadeIn h-[calc(100vh-70px)] overflow-y-auto">
      {/* Header */}
      <div className="w-full flex flex-col items-start gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-none border-none cursor-pointer outline-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-extrabold heading-outfit text-white">Create New Task</h2>
          <p className="text-xs text-text-secondary">
            Tell Alchemi what you need to accomplish, and it will build an intelligent execution plan.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
        {/* Left Side: Form (2/3 width) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          
          {/* Section 1: What do you need to do? */}
          <div className="glass-panel p-6 space-y-4 text-left">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              1. What do you need to do?
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Finish React Lab Record"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input text-sm py-3"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Describe your task in detail..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="form-input text-xs py-3 h-28 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: When should it be done? */}
          <div className="glass-panel p-6 space-y-4 text-left">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              2. When should it be done?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Due Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input text-xs py-3"
                />
              </div>
              <div>
                <label className="form-label">Estimated Hours</label>
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  required
                  value={effort}
                  onChange={(e) => setEffort(e.target.value)}
                  className="form-input text-xs py-3"
                />
                <span className="text-[10px] text-text-muted mt-1 block">
                  Used to calculate the Panic Index.
                </span>
              </div>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-input text-xs py-3"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Finance">Finance</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="glass-btn glass-btn-primary py-3 px-8 text-xs font-bold"
            >
              ✨ Create Task & Generate AI Plan
            </button>
            <button
              type="button"
              onClick={onBack}
              className="glass-btn py-3 px-6 text-xs border-white/5 text-text-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Right Side: AI Preview (1/3 width, Desktop Only) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 border-violet-500/10 text-left space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Live AI Preview
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-text-muted uppercase font-bold block">Estimated Panic Index</span>
                <span className="text-2xl font-black font-mono block mt-1" style={{ color: riskColor }}>
                  {livePanic}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold block">Difficulty</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{difficulty}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold block">Risk Level</span>
                  <span className="text-xs font-black block mt-0.5" style={{ color: riskColor }}>{riskLevel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold block">Focus Sessions</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{estimatedSessions} Pomodoros</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold block">Suggested Focus</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{suggestedFocusTime}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-950/10 border border-violet-900/20 text-[11px] text-violet-300 leading-normal">
              Alchemi will break this task into <strong>{estimatedSessions} actionable steps</strong>, generate a custom <strong>AI Draft</strong>, and fit them into your calendar gaps.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
