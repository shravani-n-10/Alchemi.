export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export interface UserSettings {
  geminiApiKey: string;
  useLocalAI: boolean;
  theme: 'dark' | 'obsidian';
  voiceEnabled: boolean;
  soundVolume: number;
  workStartHour: number; // e.g., 9 (9:00 AM)
  workEndHour: number;   // e.g., 18 (6:00 PM)
}

export interface SubTask {
  id: string;
  title: string;
  duration: number; // in minutes
  completed: boolean;
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
}

export interface AIDraft {
  type: 'email' | 'outline' | 'summary' | 'code';
  title: string;
  content: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Work' | 'Study' | 'Personal' | 'Finance' | 'Urgent';
  dueDate: string; // ISO string
  estimatedEffort: number; // in hours
  energyLevel: 'low' | 'medium' | 'high';
  completed: boolean;
  panicIndex: number;
  silentKiller: boolean;
  subtasks: SubTask[];
  procrastinationWarning?: string;
  starterAsset?: AIDraft;
  createdAt: string;
}

export interface DailyTimelineBlock {
  id: string;
  timeSlot: string; // e.g., "09:30 - 11:30"
  activityType: 'task' | 'meeting' | 'break' | 'meal';
  referenceId?: string; // Task ID or Subtask ID
  label: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  timeline: DailyTimelineBlock[];
}

export interface FocusSession {
  id: string;
  taskId: string;
  subtaskId?: string;
  startTime: string; // ISO string
  endTime?: string;  // ISO string
  durationSeconds: number;
  completedMilestone: boolean;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  speechText?: string;
  timestamp: string;
}
