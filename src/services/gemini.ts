import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Validates the Gemini API key by making a simple test call.
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "valid"');
    const text = result.response.text();
    return text.toLowerCase().includes('valid');
  } catch (e) {
    console.error('API Key validation failed:', e);
    return false;
  }
}

/**
 * Breakdown Agent: Deconstructs a task into subtasks, procrastination warning, and starter asset.
 */
export async function generateTaskBreakdown(
  apiKey: string,
  title: string,
  description: string,
  category: string
): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    You are the Alchemi Breakdown Agent. Analyze this task and split it into 3 to 5 logical subtasks.
    For each subtask, estimate the duration in minutes.
    Identify one specific procrastination warning/trigger for this task type.
    Provide a starter asset (such as a structured markdown outline, an email draft, a code boilerplate, or a study sheet) to help the user get started immediately.

    Task Title: "${title}"
    Description: "${description}"
    Category: "${category}"

    Return a JSON object conforming exactly to this schema:
    {
      "subtasks": [
        { "title": "string", "duration": number }
      ],
      "procrastinationWarning": "string",
      "starterAsset": {
        "type": "email" | "outline" | "summary" | "code",
        "title": "string",
        "content": "string"
      }
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/**
 * Planner Agent: Schedules subtasks into available timeline slots.
 */
export async function generateDailyTimeline(
  apiKey: string,
  tasks: any[],
  commitments: string[]
): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    You are the Alchemi Planner Agent. You manage the user's daily micro-schedule.
    Your job is to schedule the uncompleted tasks and their subtasks into available time blocks today.
    Do not schedule tasks during known commitments. Protect meal times and break times.
    Sort them logically starting from the highest Panic Index.

    Current Time: "${new Date().toLocaleTimeString()}"
    Active Tasks: ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, panicIndex: t.panicIndex, subtasks: t.subtasks })))}
    Commitments (Busy Blocks): ${JSON.stringify(commitments)}

    Return a JSON object conforming exactly to this schema:
    {
      "timeline": [
        { "id": "string", "timeSlot": "HH:MM - HH:MM", "activityType": "task" | "meeting" | "break", "referenceId": "string", "label": "string" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/**
 * Risk Predictor & Recovery Agent: Assesses deadline risks and creates a recovery plan.
 */
export async function generateRiskAssessment(
  apiKey: string,
  tasks: any[],
  energyLevel: string
): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const prompt = `
    You are the Alchemi Risk & Recovery Agent. 
    Compare the remaining work hours for active tasks against the time left before their deadlines.
    If the user is at risk of missing a deadline, output a risk assessment and exactly two recovery options:
    1) de-scope: Suggest reducing the requirements or complexity of the task.
    2) reschedule: Identify lower-priority tasks that can be postponed to tomorrow.
    Provide reasoning and the time saved in minutes for each.

    Current Time: "${new Date().toISOString()}"
    Active Tasks & Deadlines: ${JSON.stringify(activeTasks.map(t => ({ title: t.title, dueDate: t.dueDate, estimatedEffort: t.estimatedEffort })))}
    User Energy Level: "${energyLevel}"

    Return a JSON object conforming exactly to this schema:
    {
      "riskLevel": "LOW" | "MEDIUM" | "HIGH",
      "reasoning": "string",
      "recoveryOptions": [
        { "type": "de-scope" | "reschedule", "title": "string", "description": "string", "timeSavedMinutes": number }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/**
 * Productivity Coach: Generates coaching messages, daily briefings, and parses voice commands.
 */
export async function generateCoachingResponse(
  apiKey: string,
  tasks: any[],
  activeTask: any,
  chatHistory: any[],
  userMessage: string
): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    You are Alchem-AI, the proactive productivity coach. You are supportive, direct, and energetic.
    You analyze the user's tasks and message to give them a brief, motivating reply.
    Provide a reply in text, a short version for speech synthesis, and an optional suggested action (like entering focus mode).

    Task Board Context: ${JSON.stringify(tasks.map(t => ({ title: t.title, panicIndex: t.panicIndex, completed: t.completed })))}
    Active Task: ${activeTask ? JSON.stringify({ title: activeTask.title, panicIndex: activeTask.panicIndex }) : 'None'}
    Chat History: ${JSON.stringify(chatHistory.slice(-5))}
    User Message: "${userMessage}"

    Return a JSON object conforming exactly to this schema:
    {
      "reply": "string",
      "speechText": "string",
      "suggestedAction": "START_FOCUS_MODE" | "CREATE_TASK" | "NONE"
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/**
 * Reflection Agent: Conducts end-of-day review and tomorrow's draft.
 */
export async function generateReflection(
  apiKey: string,
  completedTasks: any[],
  slippedTasks: any[],
  focusMinutes: number,
  habits: any[]
): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    You are the Alchemi Reflection Agent. Analyze the user's productivity data from today.
    Identify their biggest victory, diagnose their main procrastination pattern, and draft a clean starting schedule for tomorrow.

    Tasks Completed Today: ${JSON.stringify(completedTasks.map(t => t.title))}
    Tasks Slipped/Postponed: ${JSON.stringify(slippedTasks.map(t => t.title))}
    Focus Session Minutes: ${focusMinutes}
    Habits Completed: ${JSON.stringify(habits.filter(h => h.streak > 0).map(h => h.title))}

    Return a JSON object conforming exactly to this schema:
    {
      "victory": "string",
      "procrastinationInsight": "string",
      "tomorrowTimeline": [
        { "timeSlot": "HH:MM - HH:MM", "activity": "string" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

/**
 * Voice Parser: Extracts structured task parameters from a raw voice transcript.
 */
export async function parseVoiceCommand(apiKey: string, transcript: string): Promise<any> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    You are the Alchemi Voice Command Parser.
    Extract the user's intent and structured task details from the voice transcript.
    If the user is adding a task, extract the title, due date (relative to today ${new Date().toLocaleDateString()}), estimated effort in hours, and category.
    If they are asking a question or requesting a pep talk, set the intent accordingly.

    Voice Transcript: "${transcript}"

    Return a JSON object conforming exactly to this schema:
    {
      "intent": "ADD_TASK" | "PEP_TALK" | "FOCUS" | "UNKNOWN",
      "task": {
        "title": "string",
        "dueDate": "string (ISO Format)",
        "estimatedEffort": number,
        "category": "Work" | "Study" | "Personal" | "Finance" | "Urgent"
      },
      "coachingReply": "string"
    }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
