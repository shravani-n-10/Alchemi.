export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO String (YYYY-MM-DDTHH:mm)
  durationMinutes: number; // estimated effort needed
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  category: string; // "Work", "Studies", "Personal", "Finance", etc.
  subtasks: SubTask[];
  aiScore: number; // 0-100 score indicating urgency and importance
  aiPlan: string[]; // Step-by-step autonomous breakdown plan
  scheduledTime: string | null; // ISO String for starting work slot
  recommendations: string[]; // Custom AI tips for this task
  completedAt: string | null;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDays: string[]; // Dates in "YYYY-MM-DD" format
  lastCompleted: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string; // HH:MM
}

export interface ProductivityInsights {
  score: number; // Daily productivity score 0-100
  focusTimeScheduled: number; // Minutes
  status: 'chill' | 'optimal' | 'intense' | 'critical';
  recommendations: string[];
}
