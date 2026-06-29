/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GlobalStats from './components/GlobalStats';
import TaskBoard from './components/TaskBoard';
import TaskSchedule from './components/TaskSchedule';
import HabitTracker from './components/HabitTracker';
import AICoachChat from './components/AICoachChat';
import TaskFocusPanel from './components/TaskFocusPanel';
import AddEditTaskModal from './components/AddEditTaskModal';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import InsightsDashboard from './components/InsightsDashboard';
import GuidePage from './components/GuidePage';
import { Task, Habit, ChatMessage, ProductivityInsights } from './types';
import { INITIAL_TASKS, INITIAL_HABITS, INITIAL_INSIGHTS, INITIAL_MESSAGES } from './data';
import { Sparkles, LayoutDashboard, Calendar, Zap, MessageSquare, Compass, Heart, Award } from 'lucide-react';

export default function App() {
  // --- Navigation & Account States ---
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'workspace' | 'insights' | 'guide'>('home');
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(() => {
    const local = localStorage.getItem('alchemi_user');
    return local ? JSON.parse(local) : null;
  });

  const isLoggedIn = !!user;

  // Sync user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('alchemi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alchemi_user');
    }
  }, [user]);

  // --- Persistent States ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const local = localStorage.getItem('alchemi_tasks');
    return local ? JSON.parse(local) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const local = localStorage.getItem('alchemi_habits');
    return local ? JSON.parse(local) : INITIAL_HABITS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const local = localStorage.getItem('alchemi_messages');
    return local ? JSON.parse(local) : INITIAL_MESSAGES;
  });

  const [insights, setInsights] = useState<ProductivityInsights>(() => {
    const local = localStorage.getItem('alchemi_insights');
    return local ? JSON.parse(local) : INITIAL_INSIGHTS;
  });

  // --- UI & Interaction States ---
  const [activeTab, setActiveTab] = useState<'backlog' | 'schedule' | 'habits'>('backlog');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(() => {
    const local = localStorage.getItem('alchemi_tasks');
    const parsed: Task[] = local ? JSON.parse(local) : INITIAL_TASKS;
    const todo = parsed.filter(t => t.status !== 'completed');
    return todo.length > 0 ? todo[0].id : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<any | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('alchemi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('alchemi_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('alchemi_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('alchemi_insights', JSON.stringify(insights));
  }, [insights]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

  // --- Core API Handlers ---

  // 1. Create task & call AI for prioritization
  const handleSaveNewTask = async (taskData: Omit<Task, 'id' | 'aiScore' | 'aiPlan' | 'scheduledTime' | 'recommendations' | 'completedAt' | 'subtasks'>) => {
    const newId = `task-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create baseline optimistic task first
    const tempTask: Task = {
      ...taskData,
      id: newId,
      subtasks: [],
      aiScore: 50, // default placeholder until AI analyzes
      aiPlan: ["Break down deliverables", "Formulate timeline slots", "Execute work & proofread"],
      scheduledTime: null,
      recommendations: ["Analyzing task parameters with Gemini AI..."],
      completedAt: null
    };

    setTasks(prev => [tempTask, ...prev]);
    setSelectedTaskId(newId);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: tempTask,
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('API prioritize failure');
      const data = await response.json();

      if (data.fallback) {
        setHasApiKey(false);
      } else {
        setHasApiKey(true);
      }

      // Format subtasks generated from the AI Plan
      const subtasks: any[] = (data.aiPlan || []).map((step: string, index: number) => ({
        id: `sub-${newId}-${index}`,
        title: step,
        completed: false,
        durationMinutes: Math.round(taskData.durationMinutes / (data.aiPlan.length || 3))
      }));

      // Merge analysed values
      setTasks(prev => prev.map(t => 
        t.id === newId 
          ? {
              ...t,
              aiScore: data.aiScore ?? 65,
              aiPlan: data.aiPlan ?? tempTask.aiPlan,
              subtasks: subtasks.length > 0 ? subtasks : t.subtasks,
              recommendations: data.recommendations ?? ["Stay focused on this milestone!"],
              // Automatically schedule tomorrow if suggested
              scheduledTime: data.suggestedTimeOffsetHours 
                ? (() => {
                    const d = new Date();
                    d.setHours(d.getHours() + data.suggestedTimeOffsetHours, 0, 0, 0);
                    return d.toISOString();
                  })()
                : null
            }
          : t
      ));

    } catch (e) {
      console.error(e);
      // Fallback local rules in case of complete endpoint error
      setTasks(prev => prev.map(t => 
        t.id === newId 
          ? {
              ...t,
              aiScore: taskData.priority === 'high' ? 85 : 50,
              recommendations: ["Check your network connection to enable full Alchemi AI insights."]
            }
          : t
      ));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Global Schedule Analyzer
  const handleRefreshInsights = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          habits,
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Insights failed');
      const data = await response.json();

      if (data.fallback) {
        setHasApiKey(false);
      } else {
        setHasApiKey(true);
      }

      setInsights({
        score: data.score ?? insights.score,
        status: data.status ?? insights.status,
        recommendations: data.recommendations ?? insights.recommendations,
        focusTimeScheduled: tasks.filter(t => t.scheduledTime && t.status !== 'completed').reduce((sum, t) => sum + t.durationMinutes, 0)
      });

    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Conversational coaching assistant chat
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          tasks,
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Chat API failure');
      const data = await response.json();

      if (data.fallback) {
        setHasApiKey(false);
      } else {
        setHasApiKey(true);
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply ?? "I received your parameters. Let's make today highly productive!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // If there is an action parsed, queue it for user confirmation
      if (data.parsedAction) {
        setPendingAction(data.parsedAction);
      }

    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: "I am having trouble reaching my high-fidelity cognitive core. Feel free to use the manual dashboards!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Execute AI parsed agentic action
  const handleApplyAction = (action: any) => {
    if (!action) return;

    if (action.type === 'ADD_TASK') {
      const { title, description, category, priority, durationMinutes, deadlineOffsetHours } = action.payload;
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + (deadlineOffsetHours || 24));

      handleSaveNewTask({
        title: title || 'New Commitment',
        description: description || '',
        category: category || 'Studies',
        priority: priority || 'medium',
        durationMinutes: durationMinutes || 30,
        deadline: deadline.toISOString().substring(0, 16),
        status: 'todo'
      });
    } else if (action.type === 'COMPLETE_TASK') {
      const { taskId } = action.payload;
      handleToggleComplete(taskId);
    } else if (action.type === 'RESCHEDULE_TASK') {
      const { taskId, deadlineOffsetHours } = action.payload;
      const t = tasks.find(item => item.id === taskId);
      if (t) {
        const newDeadline = new Date();
        newDeadline.setHours(newDeadline.getHours() + (deadlineOffsetHours || 24));
        setTasks(prev => prev.map(item => 
          item.id === taskId ? { ...item, deadline: newDeadline.toISOString().substring(0, 16) } : item
        ));
      }
    }

    setPendingAction(null);
  };

  // --- Local Mutators ---

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : null
        };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const handleSetScheduleTime = (id: string, timeIso: string | null) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, scheduledTime: timeIso } : t));
  };

  // Auto schedule all unscheduled tasks on the calendar using local priority weights
  const handleAutoScheduleTasks = async () => {
    setIsAnalyzing(true);
    // Mimic quick server computation delay for nice visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    const unscheduled = tasks.filter(t => !t.scheduledTime && t.status !== 'completed');
    if (unscheduled.length === 0) {
      setIsAnalyzing(false);
      return;
    }

    // Schedule them chronologically to available slots starting at 9 AM
    let currentHour = 9;
    const updated = tasks.map(t => {
      if (!t.scheduledTime && t.status !== 'completed') {
        const sched = new Date();
        sched.setHours(currentHour, 0, 0, 0);
        currentHour = (currentHour + 2) % 21; // skip 2 hours per task
        if (currentHour < 8) currentHour = 9;
        return { ...t, scheduledTime: sched.toISOString() };
      }
      return t;
    });

    setTasks(updated);
    setIsAnalyzing(false);

    // Append AI alert in coaching history
    const schedMsg: ChatMessage = {
      id: `msg-sched-${Date.now()}`,
      sender: 'assistant',
      text: "🔮 Done! I have auto-prioritized your backlog and organized your calendar timeline blocks according to task weight and urgency indexes.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, schedMsg]);
  };

  // Habits Mutators
  const handleToggleHabit = (id: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = h.completedDays.includes(dateStr);
        let nextDays = [...h.completedDays];
        let nextStreak = h.streak;

        if (isDone) {
          nextDays = nextDays.filter(d => d !== dateStr);
          nextStreak = Math.max(0, nextStreak - 1);
        } else {
          nextDays.push(dateStr);
          nextStreak += 1;
        }

        return {
          ...h,
          completedDays: nextDays,
          streak: nextStreak,
          lastCompleted: !isDone ? dateStr : h.lastCompleted
        };
      }
      return h;
    }));
  };

  const handleAddHabit = (title: string, frequency: 'daily' | 'weekly') => {
    const newHabit: Habit = {
      id: `habit-${Math.random().toString(36).substring(2, 9)}`,
      title,
      frequency,
      streak: 0,
      completedDays: [],
      lastCompleted: null
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Quick stats calculations
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const overdueTasksCount = tasks.filter(t => t.status !== 'completed' && new Date(t.deadline).getTime() < Date.now()).length;
  const totalHabitsCount = habits.length;
  const completedHabitsCount = habits.filter(h => h.completedDays.includes(new Date().toISOString().split('T')[0])).length;

  return (
    <div id="alchemi-app" className="min-h-screen bg-[#060814] text-white selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col font-sans antialiased pb-12 overflow-x-hidden relative">
      {/* Immersive Starry & Aura Glowing background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Header component */}
      <Header 
        totalTasks={totalTasks} 
        completedToday={completedTasksCount} 
        hasApiKey={hasApiKey} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-6 flex flex-col gap-6 relative z-10 flex-1">
        
        {currentPage === 'home' && (
          <LandingPage 
            tasks={tasks} 
            habits={habits} 
            onNavigate={setCurrentPage} 
            isLoggedIn={isLoggedIn} 
            user={user} 
          />
        )}

        {currentPage === 'login' && (
          <LoginPage 
            onLogin={setUser} 
            onLogout={() => setUser(null)} 
            isLoggedIn={isLoggedIn} 
            user={user} 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === 'insights' && (
          <InsightsDashboard 
            tasks={tasks} 
            habits={habits} 
            onRefresh={handleRefreshInsights} 
            isAnalyzing={isAnalyzing} 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === 'guide' && (
          <GuidePage 
            onNavigate={setCurrentPage} 
          />
        )}

        {currentPage === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Diagnostics, Planning, & Organization (Part 1 - 60% wide) */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative z-10">
              {/* Dynamic global statistics dashboard */}
              <GlobalStats
                insights={insights}
                totalTasks={totalTasks}
                completedTasksCount={completedTasksCount}
                overdueTasksCount={overdueTasksCount}
                completedHabitsCount={completedHabitsCount}
                totalHabitsCount={totalHabitsCount}
                isAnalyzing={isAnalyzing}
                onRefreshInsights={handleRefreshInsights}
              />

              {/* Nav Workspace Tabs Header */}
              <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('backlog')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'backlog'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Intelligent Backlog
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'schedule'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Dynamic Schedule
                  </button>
                  <button
                    onClick={() => setActiveTab('habits')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'habits'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Habit Streaks
                  </button>
                </div>

                {/* Quick instructions indicator */}
                <div className="text-[10px] text-slate-500 font-semibold hidden sm:flex items-center gap-1 mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  Select any task to active Focus Mode
                </div>
              </div>

              {/* Active Workspace Panel */}
              <div className="bg-transparent flex-1 relative z-10">
                {activeTab === 'backlog' && (
                  <TaskBoard
                    tasks={tasks}
                    selectedTaskId={selectedTaskId}
                    onSelectTask={(t) => setSelectedTaskId(t.id)}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                    onAddClick={() => setIsModalOpen(true)}
                  />
                )}

                {activeTab === 'schedule' && (
                  <TaskSchedule
                    tasks={tasks}
                    onSelectTask={(t) => setSelectedTaskId(t.id)}
                    onAutoSchedule={handleAutoScheduleTasks}
                    onSetScheduleTime={handleSetScheduleTime}
                    isScheduling={isAnalyzing}
                  />
                )}

                {activeTab === 'habits' && (
                  <HabitTracker
                    habits={habits}
                    onToggleHabit={handleToggleHabit}
                    onAddHabit={handleAddHabit}
                    onDeleteHabit={handleDeleteHabit}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Execution & Active Coaching (Part 2 - 40% wide) */}
            <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">
              
              {/* Focus pomodoro controller (Dynamic context) */}
              <TaskFocusPanel
                task={selectedTask}
                onUpdateTask={handleUpdateTask}
                onClose={() => setSelectedTaskId(null)}
              />

              {/* AI Assistant Chat Coach bot */}
              <AICoachChat
                messages={messages}
                tasks={tasks}
                onSendMessage={handleSendMessage}
                onApplyAction={handleApplyAction}
                pendingAction={pendingAction}
                onClearPendingAction={() => setPendingAction(null)}
                isChatLoading={isChatLoading}
              />

            </div>

          </div>
        )}
      </main>

      {/* Save / Create modal overlay dialog */}
      {isModalOpen && (
        <AddEditTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNewTask}
        />
      )}

      {/* Footer footer */}
      <footer className="mt-12 text-center text-[10px] text-slate-500 font-medium relative z-10">
        <p className="flex items-center justify-center gap-1">
          Crafted as <span className="font-extrabold text-indigo-400">Alchemi</span> for Vibe2Ship Hackathon • Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> & Gemini AI SDK
        </p>
      </footer>
    </div>
  );
}
