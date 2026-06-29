import { SubTask, AIDraft } from '../types';

interface LocalAIResponse {
  subtasks: Omit<SubTask, 'id' | 'completed'>[];
  procrastinationWarning: string;
  starterAsset: AIDraft;
}

/**
 * Generates a mock but contextually rich AI response based on the task title and description.
 */
export function generateLocalAIResponse(title: string, description: string, category: string): LocalAIResponse {
  const t = title.toLowerCase();
  const d = description.toLowerCase();

  // 1. Coding / Development tasks
  if (t.includes('code') || t.includes('program') || t.includes('develop') || t.includes('bug') || t.includes('react') || t.includes('api') || t.includes('github')) {
    return {
      subtasks: [
        { title: 'Define data models and architectural layout', duration: 20 },
        { title: 'Implement core logic and API endpoints', duration: 60 },
        { title: 'Integrate UI components and state management', duration: 45 },
        { title: 'Run local tests and debug edge cases', duration: 30 },
        { title: 'Refactor code and push to repository', duration: 25 }
      ],
      procrastinationWarning: 'You are likely to get stuck perfecting minor CSS layout details. Get the core Javascript/TypeScript logic working first before styling.',
      starterAsset: {
        type: 'code',
        title: `${title} - Boilerplate Structure`,
        content: `// Boilerplate for: ${title}\n\nexport interface CoreModel {\n  id: string;\n  createdAt: string;\n}\n\nexport function initializeModule() {\n  console.log("Initializing ${title}...");\n  // TODO: Implement core logic\n}`
      }
    };
  }

  // 2. Writing / Documentation tasks
  if (t.includes('write') || t.includes('essay') || t.includes('report') || t.includes('document') || t.includes('blog') || t.includes('proposal') || t.includes('pitch') || t.includes('slide') || t.includes('presentation')) {
    return {
      subtasks: [
        { title: 'Create outline and gather reference materials', duration: 15 },
        { title: 'Draft the introduction and core thesis statement', duration: 30 },
        { title: 'Write the main body sections / slides', duration: 60 },
        { title: 'Draft the conclusion and call to action', duration: 20 },
        { title: 'Proofread for grammar, flow, and formatting', duration: 20 }
      ],
      procrastinationWarning: 'You might experience "blank page syndrome" trying to write the perfect opening sentence. Just write anything—even bullet points—and refine it later.',
      starterAsset: {
        type: 'outline',
        title: `${title} - Document Outline`,
        content: `# Outline: ${title}\n\n## 1. Executive Summary / Hook\n- Core message...\n\n## 2. Key Points\n- Point A...\n- Point B...\n\n## 3. Conclusion & Next Steps\n- Summary and action items...`
      }
    };
  }

  // 3. Communication / Email / Meeting tasks
  if (t.includes('email') || t.includes('mail') || t.includes('contact') || t.includes('send') || t.includes('meet') || t.includes('schedule') || t.includes('call') || t.includes('interview')) {
    return {
      subtasks: [
        { title: 'Gather recipient details and context', duration: 10 },
        { title: 'Draft the core message / email body', duration: 15 },
        { title: 'Review tone and check for clear call-to-actions', duration: 10 },
        { title: 'Send the communication and set a follow-up reminder', duration: 5 }
      ],
      procrastinationWarning: 'You may overthink the wording of this message, leading to delays. Keep it brief, professional, and send it now.',
      starterAsset: {
        type: 'email',
        title: `Draft: ${title}`,
        content: `Subject: Regarding ${title}\n\nDear [Name],\n\nI hope this email finds you well.\n\nI am writing to follow up on ${title}. [Insert specific details here].\n\nPlease let me know your thoughts or availability.\n\nBest regards,\n[Your Name]`
      }
    };
  }

  // 4. Study / Exam preparation
  if (t.includes('study') || t.includes('learn') || t.includes('exam') || t.includes('test') || t.includes('read') || t.includes('course') || t.includes('lecture') || t.includes('quiz')) {
    return {
      subtasks: [
        { title: 'Review lecture notes and active chapters', duration: 30 },
        { title: 'Create summary flashcards of key terms', duration: 45 },
        { title: 'Solve practice problems or sample questions', duration: 60 },
        { title: 'Active recall review of weakest topics', duration: 30 }
      ],
      procrastinationWarning: 'Passive reading is easy but ineffective. You will feel like you are studying, but you are not retaining it. Switch to active recall or practice problems immediately.',
      starterAsset: {
        type: 'summary',
        title: `Study Sheet: ${title}`,
        content: `# Study Sheet: ${title}\n\n## Core Concepts to Memorize\n1. [Concept 1]: Definition and formula.\n2. [Concept 2]: Definition and formula.\n\n## Active Recall Questions\n- Question 1? (Answer: ...)\n- Question 2? (Answer: ...)`
      }
    };
  }

  // 5. Financial tasks
  if (category === 'Finance' || t.includes('pay') || t.includes('bill') || t.includes('invoice') || t.includes('tax') || t.includes('rent') || t.includes('finance') || t.includes('bank') || t.includes('budget')) {
    return {
      subtasks: [
        { title: 'Log in to financial portal and verify amount due', duration: 10 },
        { title: 'Verify payment method and execute transaction', duration: 10 },
        { title: 'Record transaction receipt and update budget tracker', duration: 10 }
      ],
      procrastinationWarning: 'Ignoring bills doesn\'t make them disappear; it only adds late fees. This will take less than 15 minutes. Log in and pay it now.',
      starterAsset: {
        type: 'outline',
        title: `Financial Checklist: ${title}`,
        content: `# Payment Checklist: ${title}\n\n- [ ] Portal URL: [Link]\n- [ ] Amount Due: $_______\n- [ ] Due Date: [Date]\n- [ ] Payment Confirmation Code: __________`
      }
    };
  }

  // 6. General Fallback
  return {
    subtasks: [
      { title: 'Define initial action plan and gather resources', duration: 15 },
      { title: 'Execute the core work block', duration: 60 },
      { title: 'Review progress and refine outputs', duration: 20 },
      { title: 'Finalize and mark task as complete', duration: 10 }
    ],
    procrastinationWarning: 'The hardest part is simply starting. Break the inertia by committing to work on the first subtask for just 5 minutes.',
    starterAsset: {
      type: 'summary',
      title: `Action Plan: ${title}`,
      content: `# Action Plan: ${title}\n\n## Objective\n${description || 'Complete the task successfully.'}\n\n## Checklist\n- [ ] Step 1: Start immediately.\n- [ ] Step 2: Keep momentum.\n- [ ] Step 3: Review and finish.`
    }
  };
}

/**
 * Generates a mock Daily Briefing.
 */
export function generateLocalDailyBriefing(tasks: any[], googleCalendarSynced: boolean): { briefingText: string; speechText: string } {
  if (tasks.length === 0) {
    return {
      briefingText: "Your schedule is clear today! Focus on building healthy habits and planning ahead.",
      speechText: "Your schedule is clear today! Focus on building healthy habits and planning ahead."
    };
  }

  const highPanicTask = [...tasks].sort((a, b) => b.panicIndex - a.panicIndex)[0];
  const totalEffort = tasks.reduce((sum, t) => sum + t.estimatedEffort, 0);

  const calPrefix = googleCalendarSynced
    ? "Good morning! I synchronized your Google Calendar and found 3 commitments today. I've automatically scheduled your focus blocks during your free slots to avoid conflicts. "
    : "Good morning! I have analyzed your task list. ";

  const text = `${calPrefix}You have ${tasks.length} active task${tasks.length > 1 ? 's' : ''} requiring about ${totalEffort} hours of focus. Your highest-urgency item is "${highPanicTask.title}" with a Panic Index of ${highPanicTask.panicIndex}%. Let's make today count!`;

  return {
    briefingText: text,
    speechText: text
  };
}

export function generateLocalDailyTimeline(tasks: any[], googleCalendarSynced: boolean): any[] {
  const activeTasks = tasks.filter(t => !t.completed);
  const timeline: any[] = [];
  
  if (googleCalendarSynced) {
    // 1. Add Google Calendar commitments
    timeline.push({ id: 'cal-1', timeSlot: '09:00 - 10:30', label: '🎓 Database Systems (CS101) Class', activityType: 'meeting' });
    timeline.push({ id: 'cal-2', timeSlot: '12:00 - 13:00', label: '🍔 Project Group Lunch Meeting', activityType: 'meeting' });
    timeline.push({ id: 'cal-3', timeSlot: '15:30 - 16:30', label: '🔬 Operating Systems Lab', activityType: 'meeting' });
    
    // 2. Fit tasks in free gaps
    if (activeTasks.length > 0) {
      // Gap 1: 10:30 - 12:00 (1.5 hours)
      timeline.push({
        id: `block-task-1-${Date.now()}`,
        timeSlot: '10:30 - 12:00',
        label: `🧠 Focus Session: ${activeTasks[0].title}`,
        activityType: 'task',
        referenceId: activeTasks[0].id
      });
      
      // Gap 2: 13:00 - 15:30 (2.5 hours)
      if (activeTasks.length > 1) {
        timeline.push({
          id: `block-task-2-${Date.now()}`,
          timeSlot: '13:00 - 15:30',
          label: `🧠 Focus Session: ${activeTasks[1].title}`,
          activityType: 'task',
          referenceId: activeTasks[1].id
        });
      } else {
        timeline.push({
          id: `block-task-2-${Date.now()}`,
          timeSlot: '13:00 - 15:30',
          label: '🧠 Open Study Block & Research',
          activityType: 'task'
        });
      }
      
      // Gap 3: 16:30 - 18:00 (1.5 hours)
      if (activeTasks.length > 2) {
        timeline.push({
          id: `block-task-3-${Date.now()}`,
          timeSlot: '16:30 - 18:00',
          label: `🧠 Focus Session: ${activeTasks[2].title}`,
          activityType: 'task',
          referenceId: activeTasks[2].id
        });
      } else {
        timeline.push({
          id: `block-task-3-${Date.now()}`,
          timeSlot: '16:30 - 18:00',
          label: '☕ Habit Review & Daily Reflection',
          activityType: 'break'
        });
      }
    }
  } else {
    // Standard schedule without Google Calendar
    if (activeTasks.length > 0) {
      timeline.push({
        id: `block-task-1-${Date.now()}`,
        timeSlot: '09:00 - 11:00',
        label: `🧠 Focus Session: ${activeTasks[0].title}`,
        activityType: 'task',
        referenceId: activeTasks[0].id
      });
    }
    
    timeline.push({ id: 'block-break-1', timeSlot: '11:00 - 12:00', label: '☕ Mid-day Break & Review', activityType: 'break' });
    
    if (activeTasks.length > 1) {
      timeline.push({
        id: `block-task-2-${Date.now()}`,
        timeSlot: '12:00 - 14:00',
        label: `🧠 Focus Session: ${activeTasks[1].title}`,
        activityType: 'task',
        referenceId: activeTasks[1].id
      });
    }
    
    timeline.push({ id: 'block-break-2', timeSlot: '14:00 - 15:00', label: '🍔 Lunch Break', activityType: 'break' });
    
    if (activeTasks.length > 2) {
      timeline.push({
        id: `block-task-3-${Date.now()}`,
        timeSlot: '15:00 - 17:00',
        label: `🧠 Focus Session: ${activeTasks[2].title}`,
        activityType: 'task',
        referenceId: activeTasks[2].id
      });
    }
  }
  
  // Sort timeline by timeSlot hour
  return timeline.sort((a, b) => {
    const aHour = parseInt(a.timeSlot.split(':')[0]);
    const bHour = parseInt(b.timeSlot.split(':')[0]);
    return aHour - bHour;
  });
}

/**
 * Generates a mock Risk & Recovery Assessment.
 */
export function generateLocalRiskAssessment(tasks: any[], energyLevel: string): any {
  const activeTasks = tasks.filter(t => !t.completed);
  if (activeTasks.length === 0) {
    return { riskLevel: 'LOW', reasoning: 'All tasks are completed. You are in a safe state!', recoveryOptions: [] };
  }

  const highPanicTask = [...activeTasks].sort((a, b) => b.panicIndex - a.panicIndex)[0];

  if (highPanicTask.panicIndex >= 75) {
    return {
      riskLevel: 'HIGH',
      reasoning: `Your task "${highPanicTask.title}" is sitting at ${highPanicTask.panicIndex}% panic. With your energy level set to ${energyLevel}, you are at high risk of falling behind.`,
      recoveryOptions: [
        {
          type: 'de-scope',
          title: 'De-scope Subtasks',
          description: `Reduce the requirements of "${highPanicTask.title}". Skip advanced features and focus on a solid core prototype.`,
          timeSavedMinutes: 45
        },
        {
          type: 'reschedule',
          title: 'Reschedule Low-Urgency Work',
          description: 'Postpone your personal tasks to tomorrow, freeing up a 90-minute focus block today.',
          timeSavedMinutes: 90
        }
      ]
    };
  }

  return {
    riskLevel: 'MEDIUM',
    reasoning: 'Your workload is manageable, but you need to maintain focus to prevent task accumulation.',
    recoveryOptions: [
      {
        type: 'de-scope',
        title: 'Bite-sized Focus',
        description: 'Break the next task into smaller 15-minute segments.',
        timeSavedMinutes: 15
      }
    ]
  };
}
