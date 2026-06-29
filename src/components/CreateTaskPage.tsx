import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAI } from '../context/AIContext';
import { calculatePanicIndex, getPanicStatus } from '../utils/panic';
import { Sparkles, ArrowLeft, Mic, MicOff, Check, AlertCircle, Calendar } from 'lucide-react';
import speechService from '../services/speech';

interface CreateTaskPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTaskPage: React.FC<CreateTaskPageProps> = ({ onBack, onSuccess }) => {
  const { addTask, updateTask, energyLevel, googleCalendarSynced, syncGoogleCalendar } = useTasks();
  const { getTaskBreakdown, generateBriefing } = useAI();

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal' | 'Finance' | 'Urgent'>('Work');
  const [effort, setEffort] = useState('2');
  const [dueDate, setDueDate] = useState('');

  // Voice state
  const [isListening, setIsListening] = useState(false);

  // Loading states
  const [isBuilding, setIsBuilding] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // AI Assistant Chat state
  const [aiMessage, setAiMessage] = useState("Hi! I'm Alchem-AI. I'll help you create a smart execution plan. Let's start with your task: What do you need to accomplish today?");
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Live AI Preview calculations
  const [livePanic, setLivePanic] = useState(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [estimatedSessions, setEstimatedSessions] = useState(4);
  const [suggestedFocusTime, setSuggestedFocusTime] = useState('120 mins');
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [riskColor, setRiskColor] = useState('#10b981');

  // Trigger AI speech bubbles based on form inputs
  useEffect(() => {
    if (!title) return;
    
    setAiAnalyzing(true);
    const timer = setTimeout(() => {
      setAiAnalyzing(false);
      const t = title.toLowerCase();
      if (t.includes('react') || t.includes('code') || t.includes('program') || t.includes('develop') || t.includes('web')) {
        setAiMessage(`“${title}” looks like a software development goal. I'll make sure to generate code templates and outline the architectural setup in your starter drafts.`);
      } else if (t.includes('study') || t.includes('exam') || t.includes('quiz') || t.includes('learn') || t.includes('dbms') || t.includes('test')) {
        setAiMessage(`Excellent, a study task! I'll generate active recall study cards and break this down into clear learning milestones.`);
      } else if (t.length > 5) {
        setAiMessage(`“${title}” is logged. That sounds like a solid objective. Let's make sure the duration and deadline are set so I can schedule it.`);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title]);

  useEffect(() => {
    const hours = parseFloat(effort) || 2;
    if (hours === 2) return; // Ignore initial default

    setAiAnalyzing(true);
    const timer = setTimeout(() => {
      setAiAnalyzing(false);
      if (hours <= 1.5) {
        setAiMessage(`A quick ${hours}-hour task! I will schedule this in a single focused Pomodoro block so you can cross it off quickly.`);
      } else if (hours <= 4) {
        setAiMessage(`Understood. ${hours} hours is ideal. I will partition this into ${Math.ceil(hours / 0.75)} focus sessions with short breaks in between.`);
      } else {
        setAiMessage(`A larger task (${hours} hours). I highly recommend pacing this out over multiple study slots to avoid mental fatigue.`);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [effort]);

  useEffect(() => {
    if (!dueDate) return;

    setAiAnalyzing(true);
    const timer = setTimeout(() => {
      setAiAnalyzing(false);
      const diff = new Date(dueDate).getTime() - Date.now();
      const hoursRemaining = diff / (1000 * 60 * 60);

      if (hoursRemaining <= 0) {
        setAiMessage("⚠️ Wait, this deadline appears to be in the past! Please check the due date.");
      } else if (hoursRemaining <= 24) {
        setAiMessage("⚠️ Warning: This task is due within 24 hours! I will flag this as a critical priority and immediately reserve an open slot in your schedule today.");
      } else if (hoursRemaining <= 48) {
        setAiMessage("This deadline is approaching. I'll make sure we schedule a focus block tonight to get a head start.");
      } else {
        setAiMessage("Excellent, we have some breathing room. I will distribute the milestones comfortably over the coming days.");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [dueDate]);

  useEffect(() => {
    if (desc.length < 15) return;

    setAiAnalyzing(true);
    const timer = setTimeout(() => {
      setAiAnalyzing(false);
      setAiMessage("Thank you for the detailed context! My Planner Agent will use these details to generate highly specific subtask items and customized starter assets.");
    }, 1000);

    return () => clearTimeout(timer);
  }, [desc]);

  // Recalculate AI Preview stats dynamically
  useEffect(() => {
    const hours = parseFloat(effort) || 2;
    
    // Difficulty
    if (hours <= 2) setDifficulty('Easy');
    else if (hours <= 5) setDifficulty('Medium');
    else setDifficulty('Hard');

    // Sessions & Time
    const sessions = Math.ceil(hours / 0.75); // 45-min sessions
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

  // Simulated Voice Command parsing
  const handleSimulateVoice = () => {
    setIsListening(true);
    setAiMessage("Listening... Speak your task details.");
    
    setTimeout(() => {
      setIsListening(false);
      // Fill form with mock voice data
      setTitle("Finish DBMS Assignment");
      setDesc("Code the SQL queries and write the schema description.");
      setCategory("Study");
      setEffort("3");
      
      // Set due date to tomorrow at 6 PM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      
      // Format to datetime-local string
      const offset = tomorrow.getTimezoneOffset();
      const localTomorrow = new Date(tomorrow.getTime() - (offset * 60 * 1000));
      setDueDate(localTomorrow.toISOString().slice(0, 16));

      setAiMessage("🎙️ I heard: 'Finish DBMS assignment tomorrow, takes 3 hours.' I've automatically filled in the details. Ready to generate the plan?");
    }, 2500);
  };

  const handleSmartSuggestion = (type: 'gcal' | 'morning' | 'break') => {
    if (type === 'gcal') {
      syncGoogleCalendar();
      setAiMessage("📅 Connected to Google Calendar! I've imported your 3 commitments and will schedule this task around them.");
    } else if (type === 'morning') {
      setAiMessage("☀️ Got it! I've logged your preference for morning study sessions and will prioritize placing your focus blocks before 12:00 PM.");
    } else if (type === 'break') {
      setAiMessage("☕ Healthy pacing! I'll inject 15-minute breaks after every 45-minute focus session to keep your energy high.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || isBuilding) return;

    setIsBuilding(true);
    setLoadingStep(0);

    // Multi-step loading screen simulation
    const stepsInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepsInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

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

      // Redirect after steps are complete
      setTimeout(() => {
        clearInterval(stepsInterval);
        setIsBuilding(false);
        onSuccess();
      }, 3500);

    } catch (err) {
      console.error('Failed to create task:', err);
      clearInterval(stepsInterval);
      setIsBuilding(false);
    }
  };

  const loadingStepsText = [
    "🔍 Analyzing workload...",
    "🔥 Calculating Panic Index...",
    "📅 Finding free slots in Google Calendar...",
    "🧠 Generating subtask milestones...",
    "✨ Preparing today's execution plan..."
  ];

  if (isBuilding) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] text-center p-6 bg-slate-950/20 backdrop-blur-md relative z-10 animate-fadeIn">
        <div className="glass-panel p-8 max-w-sm w-full space-y-6 border-violet-500/20 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-lg mx-auto animate-pulse">
            🤖
          </div>
          <h3 className="text-base font-bold heading-outfit text-white">
            Alchem-AI is planning...
          </h3>
          
          <div className="space-y-3 text-left">
            {loadingStepsText.map((stepText, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                  idx <= loadingStep ? 'opacity-100' : 'opacity-20'
                }`}
              >
                {idx < loadingStep ? (
                  <span className="text-green-400 font-bold">✓</span>
                ) : idx === loadingStep ? (
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                )}
                <span className={idx < loadingStep ? 'text-text-secondary line-through' : 'text-white'}>
                  {stepText}
                </span>
              </div>
            ))}
          </div>
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
            Provide the details, and let Alchemi's agents structure your day.
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
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label mb-0">Task Title</label>
                  <button
                    type="button"
                    onClick={handleSimulateVoice}
                    className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded transition-all border ${
                      isListening 
                        ? 'bg-red-950/40 border-red-500/35 text-red-400 animate-pulse' 
                        : 'bg-white/5 border-white/5 text-text-secondary hover:text-white'
                    }`}
                  >
                    <Mic className="w-3 h-3" /> {isListening ? 'Listening...' : 'Add via Voice'}
                  </button>
                </div>
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
              className="glass-btn glass-btn-primary py-3.5 px-8 text-xs font-bold"
            >
              ✨ Create Task & Let Alchemi Plan It
            </button>
            <button
              type="button"
              onClick={onBack}
              className="glass-btn py-3.5 px-6 text-xs border-white/5 text-text-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Right Side: Conversational AI Assistant Panel (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Assistant Chat Bubble */}
          <div className="glass-panel p-5 border-violet-500/10 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/15 flex items-center justify-center text-base relative border border-violet-500/20 shrink-0">
                🤖
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-white block">Alchem-AI Coach</span>
                <span className="text-[9px] text-violet-400 font-semibold">Active Assistant</span>
              </div>
            </div>

            {/* Chat bubble */}
            <div className="bg-violet-950/10 border border-violet-900/20 p-4 rounded-xl relative">
              {aiAnalyzing ? (
                <div className="flex items-center gap-1.5 py-1 text-xs text-text-secondary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  Alchem-AI is thinking...
                </div>
              ) : (
                <p className="text-xs text-violet-200 leading-relaxed font-medium">
                  {aiMessage}
                </p>
              )}
            </div>

            {/* Smart suggestions */}
            <div className="space-y-2">
              <span className="text-[9px] text-text-muted uppercase font-bold block">Quick Preferences</span>
              <div className="flex flex-col gap-2">
                {!googleCalendarSynced && (
                  <button
                    type="button"
                    onClick={() => handleSmartSuggestion('gcal')}
                    className="w-full text-left text-[10px] text-text-secondary hover:text-white bg-white/3 hover:bg-white/6 border border-white/5 p-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    📅 Sync with Google Calendar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSmartSuggestion('morning')}
                  className="w-full text-left text-[10px] text-text-secondary hover:text-white bg-white/3 hover:bg-white/6 border border-white/5 p-2 rounded-lg transition-all flex items-center gap-2"
                >
                  ☀️ I prefer morning focus sessions
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartSuggestion('break')}
                  className="w-full text-left text-[10px] text-text-secondary hover:text-white bg-white/3 hover:bg-white/6 border border-white/5 p-2 rounded-lg transition-all flex items-center gap-2"
                >
                  ☕ Add 15m breaks between sessions
                </button>
              </div>
            </div>
          </div>

          {/* Live AI Preview Card */}
          <div className="glass-panel p-6 border-violet-500/10 text-left space-y-4">
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              AI Prediction Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-text-muted uppercase font-bold block">Predicted Panic Index</span>
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
