import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, SubTask, UserSettings, FocusSession, DailyPlan, UserProfile } from '../types';
import { calculatePanicIndex } from '../utils/panic';

interface Habit {
  id: string;
  title: string;
  streak: number;
  lastCompleted?: string; // YYYY-MM-DD
}

interface TaskContextType {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  dailyPlan: DailyPlan | null;
  energyLevel: 'low' | 'medium' | 'high';
  settings: UserSettings;
  userProfile: UserProfile;
  activeTaskId: string | null;
  activeSession: { taskId: string; subtaskId?: string; startTime: string } | null;
  addTask: (task: Omit<Task, 'id' | 'panicIndex' | 'silentKiller' | 'createdAt' | 'subtasks' | 'completed'> & { subtasks?: SubTask[] }) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  toggleSubTask: (taskId: string, subtaskId: string) => void;
  setEnergyLevel: (level: 'low' | 'medium' | 'high') => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  startFocusSession: (taskId: string, subtaskId?: string) => void;
  endFocusSession: (durationSeconds: number, completedMilestone: boolean) => void;
  toggleHabit: (habitId: string) => void;
  setDailyPlan: (plan: DailyPlan) => void;
  setActiveTaskId: (id: string | null) => void;
  loginWithGoogle: (name: string, email: string) => void;
  logout: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  geminiApiKey: '',
  useLocalAI: true,
  theme: 'dark',
  voiceEnabled: true,
  soundVolume: 0.5,
  workStartHour: 9,
  workEndHour: 18,
};

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', title: 'Review Calendar & Tasks', streak: 0 },
  { id: 'h2', title: 'Deep Work Session (50 mins)', streak: 0 },
  { id: 'h3', title: 'Plan Tomorrow', streak: 0 },
];

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  avatarUrl: '',
  isLoggedIn: false,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('alchemi_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('alchemi_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('alchemi_focus_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyPlan, setDailyPlanState] = useState<DailyPlan | null>(() => {
    const saved = localStorage.getItem('alchemi_daily_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [energyLevel, setEnergyLevelState] = useState<'low' | 'medium' | 'high'>(() => {
    const saved = localStorage.getItem('alchemi_energy_level');
    return (saved as any) || 'medium';
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('alchemi_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('alchemi_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<{ taskId: string; subtaskId?: string; startTime: string } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('alchemi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('alchemi_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('alchemi_focus_sessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    if (dailyPlan) {
      localStorage.setItem('alchemi_daily_plan', JSON.stringify(dailyPlan));
    } else {
      localStorage.removeItem('alchemi_daily_plan');
    }
  }, [dailyPlan]);

  useEffect(() => {
    localStorage.setItem('alchemi_energy_level', energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    localStorage.setItem('alchemi_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('alchemi_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Background Ticker: Recalculate Panic Index of all active tasks every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.completed) return task;
          const newPanic = calculatePanicIndex(task.estimatedEffort, task.dueDate, energyLevel);
          return { ...task, panicIndex: newPanic };
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [energyLevel]);

  const addTask = async (
    taskData: Omit<Task, 'id' | 'panicIndex' | 'silentKiller' | 'createdAt' | 'subtasks' | 'completed'> & { subtasks?: SubTask[] }
  ): Promise<Task> => {
    const panicIndex = calculatePanicIndex(taskData.estimatedEffort, taskData.dueDate, energyLevel);
    
    const dueTime = new Date(taskData.dueDate).getTime();
    const diffHours = (dueTime - Date.now()) / (1000 * 60 * 60);
    const silentKiller = diffHours > 48 && taskData.estimatedEffort >= 8;

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      panicIndex,
      silentKiller,
      subtasks: taskData.subtasks || [],
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => {
      const updated = [...prev, newTask];
      return updated.sort((a, b) => b.panicIndex - a.panicIndex);
    });

    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          if (updates.estimatedEffort !== undefined || updates.dueDate !== undefined) {
            updated.panicIndex = calculatePanicIndex(
              updated.estimatedEffort,
              updated.dueDate,
              energyLevel
            );
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: true,
            panicIndex: 0,
            subtasks: t.subtasks.map((sub) => ({ ...sub, completed: true })),
          };
        }
        return t;
      })
    );
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const toggleSubTask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          const allDone = updatedSubtasks.every((sub) => sub.completed);
          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allDone ? t.completed : false,
          };
        }
        return t;
      })
    );
  };

  const setEnergyLevel = (level: 'low' | 'medium' | 'high') => {
    setEnergyLevelState(level);
    setTasks((prev) =>
      prev
        .map((t) => {
          if (t.completed) return t;
          return {
            ...t,
            panicIndex: calculatePanicIndex(t.estimatedEffort, t.dueDate, level),
          };
        })
        .sort((a, b) => b.panicIndex - a.panicIndex)
    );
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const startFocusSession = (taskId: string, subtaskId?: string) => {
    setActiveSession({
      taskId,
      subtaskId,
      startTime: new Date().toISOString(),
    });
  };

  const endFocusSession = (durationSeconds: number, completedMilestone: boolean) => {
    if (!activeSession) return;

    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      taskId: activeSession.taskId,
      subtaskId: activeSession.subtaskId,
      startTime: activeSession.startTime,
      endTime: new Date().toISOString(),
      durationSeconds,
      completedMilestone,
    };

    setFocusSessions((prev) => [...prev, newSession]);

    if (completedMilestone && activeSession.subtaskId) {
      toggleSubTask(activeSession.taskId, activeSession.subtaskId);
    }

    setActiveSession(null);
  };

  const toggleHabit = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isCompletedToday = h.lastCompleted === todayStr;
          return {
            ...h,
            streak: isCompletedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
            lastCompleted: isCompletedToday ? undefined : todayStr,
          };
        }
        return h;
      })
    );
  };

  const setDailyPlan = (plan: DailyPlan) => {
    setDailyPlanState(plan);
  };

  const loginWithGoogle = (name: string, email: string) => {
    // Generate a premium avatar based on their name initials or a cool abstract shape
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarId = (hash % 70) + 1;
    setUserProfile({
      name,
      email,
      avatarUrl: `https://i.pravatar.cc/150?img=${avatarId}`,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUserProfile(DEFAULT_PROFILE);
    setDailyPlanState(null);
    setActiveTaskId(null);
    setActiveSession(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        habits,
        focusSessions,
        dailyPlan,
        energyLevel,
        settings,
        userProfile,
        activeTaskId,
        activeSession,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        toggleSubTask,
        setEnergyLevel,
        updateSettings,
        startFocusSession,
        endFocusSession,
        toggleHabit,
        setDailyPlan,
        setActiveTaskId,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
