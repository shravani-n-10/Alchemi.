import { Task, Habit, ChatMessage, ProductivityInsights } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Organic Chemistry Lab Report',
    description: 'Summarize organic synthesis conclusions, draw compound models, and list error analysis columns.',
    category: 'Studies',
    priority: 'high',
    durationMinutes: 45,
    deadline: (() => {
      const d = new Date();
      d.setHours(d.getHours() + 4); // due in 4 hours!
      return d.toISOString().substring(0, 16);
    })(),
    status: 'todo',
    subtasks: [
      { id: 'sub-1-1', title: 'Plot carbon synthesis structures', completed: false, durationMinutes: 10 },
      { id: 'sub-1-2', title: 'Compile spectrometer chart findings', completed: false, durationMinutes: 15 },
      { id: 'sub-1-3', title: 'Proofread executive abstract paragraph', completed: false, durationMinutes: 10 }
    ],
    aiScore: 92,
    aiPlan: [
      "Plot carbon synthesis structures on molecular sketchpad",
      "Compile spectrometer chart findings and calculate error matrices",
      "Proofread executive abstract paragraph and export PDF"
    ],
    scheduledTime: (() => {
      const d = new Date();
      d.setHours(d.getHours() + 1, 0, 0, 0); // schedule for 1 hour from now
      return d.toISOString();
    })(),
    recommendations: [
      "⚠️ Urgency Alert: This task is due in 4 hours! Do not multitask.",
      "🧠 Peak Focus Advice: Take a 5m breather before starting. Work in a single 45m Pomodoro block.",
      "💡 Strategy: Complete compound charts first as they represent 60% of evaluation weight."
    ],
    completedAt: null
  },
  {
    id: 'task-2',
    title: 'Finalize Seed Pitch Deck',
    description: 'Review slide order, polish financial forecast curves, and verify market size metrics.',
    category: 'Work',
    priority: 'high',
    durationMinutes: 60,
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0); // Tomorrow morning
      return d.toISOString().substring(0, 16);
    })(),
    status: 'todo',
    subtasks: [
      { id: 'sub-2-1', title: 'Verify total addressable market (TAM) math', completed: true, durationMinutes: 15 },
      { id: 'sub-2-2', title: 'Adjust cost projection slide curves', completed: false, durationMinutes: 20 },
      { id: 'sub-2-3', title: 'Add slide transition fade effects', completed: false, durationMinutes: 15 }
    ],
    aiScore: 78,
    aiPlan: [
      "Check financial model projections logic in spreadsheet",
      "Update growth curve graphics in pitch editor",
      "Draft speaker cue cards for slides 1-10"
    ],
    scheduledTime: null, // Unscheduled initially
    recommendations: [
      "💡 Coach suggestion: Schedule this tomorrow morning during your peak cognitive energy block.",
      "🔥 High Impact Task: Focus purely on simplifying the slide layout. Keep text below 4 lines per slide."
    ],
    completedAt: null
  },
  {
    id: 'task-3',
    title: 'Pay Quarterly Income Taxes',
    description: 'Verify withholding records and transfer payment through state revenue portal.',
    category: 'Finance',
    priority: 'medium',
    durationMinutes: 30,
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      d.setHours(23, 59, 0, 0); // In 3 days
      return d.toISOString().substring(0, 16);
    })(),
    status: 'todo',
    subtasks: [
      { id: 'sub-3-1', title: 'Reconcile invoice ledger totals', completed: false, durationMinutes: 15 },
      { id: 'sub-3-2', title: 'Submit voucher through IRS portal', completed: false, durationMinutes: 15 }
    ],
    aiScore: 48,
    aiPlan: [
      "Reconcile monthly bank invoices and verify ledger match",
      "Enter data into state tax vouchers and download confirmation"
    ],
    scheduledTime: null,
    recommendations: [
      "📊 Financial Reminder: Doing this early relieves background cognitive load.",
      "⏱️ Simple Admin Task: Under 30 mins effort. Slot it between heavy studies tasks as a mental pivot."
    ],
    completedAt: null
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Drink 3L of Water',
    frequency: 'daily',
    streak: 5,
    completedDays: [
      (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split('T')[0];
      })()
    ],
    lastCompleted: null
  },
  {
    id: 'habit-2',
    title: '15m Morning Meditation',
    frequency: 'daily',
    streak: 12,
    completedDays: [], // Not done today yet
    lastCompleted: null
  },
  {
    id: 'habit-3',
    title: 'Solve 1 LeetCode Problem',
    frequency: 'daily',
    streak: 0,
    completedDays: [],
    lastCompleted: null
  }
];

export const INITIAL_INSIGHTS: ProductivityInsights = {
  score: 82,
  focusTimeScheduled: 45,
  status: 'optimal',
  recommendations: [
    "📅 Plan Summary: You have 1 highly critical task ('Organic Chemistry Lab Report') due in under 4 hours.",
    "🚀 Peak performance: Slot your heavier research work between 9 AM - 12 PM for clean focus loops.",
    "💧 Stacking habits: Meditating before diving into studies reduces stress and prevents visual multitasking."
  ]
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: "Hello! I am Alchemi, your proactive AI productivity coach. I've analyzed your backlog parameters and noticed that 'Organic Chemistry Lab Report' is due in under 4 hours! I highly recommend kicking off a 45-minute focus session now. Would you like me to map out your study blocks for today?",
    timestamp: '09:00 AM'
  }
];
