import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Prioritize a single task & generate autonomous plan
app.post("/api/ai/prioritize", async (req, res) => {
  try {
    const { task, currentTime } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Missing task details." });
    }

    let ai;
    try {
      ai = getAIClient();
    } catch (e: any) {
      if (e.message === "GEMINI_API_KEY_MISSING") {
        return res.status(200).json({
          fallback: true,
          aiScore: Math.min(95, Math.max(15, Math.round(
            (task.priority === "high" ? 40 : task.priority === "medium" ? 25 : 10) +
            (new Date(task.deadline).getTime() - new Date(currentTime).getTime() < 86400000 * 2 ? 45 : 15)
          ))),
          aiPlan: [
            "Review task requirements and collect necessary reference files",
            "Prepare a quiet focus space and set a 25-minute study block",
            "Create a rough draft or outline addressing the key deliverables",
            "Refine work, cross-reference with deadline checklist, and submit"
          ],
          recommendations: [
            "✨ Add your GEMINI_API_KEY in the AI Studio Settings (Secrets Panel) to unlock customized cognitive analysis!",
            `This is a ${task.priority} priority task. Consider blocking out uninterrupted time before the deadline on ${new Date(task.deadline).toLocaleDateString()}.`
          ],
          suggestedTimeOffsetHours: 2
        });
      }
      throw e;
    }

    const prompt = `You are Alchemi, an elite AI productivity companion.
Analyze this task in the context of the current time.
Current local time: ${currentTime}
Task Details:
- Title: "${task.title}"
- Description: "${task.description || 'No description provided'}"
- Priority: "${task.priority}"
- Deadline: "${task.deadline}"
- Estimated Duration: ${task.durationMinutes} minutes
- Category: "${task.category}"

Please return:
1. An intelligent AI urgency and importance score (0-100). Higher scores represent high priority and close deadlines.
2. A step-by-step autonomous breakdown plan (3-5 items) to complete this task.
3. 2-3 tailored productivity recommendations, context-aware reminders, or active coaching prompts.
4. An estimated offset in hours from current time when the user should start this task (integer).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiScore: {
              type: Type.INTEGER,
              description: "A score from 0-100 representing urgency and importance combined."
            },
            aiPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 clear, actionable steps to complete this task successfully."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 3 bespoke context-aware productivity recommendations or reminders."
            },
            suggestedTimeOffsetHours: {
              type: Type.INTEGER,
              description: "Integer number of hours from now to schedule this task."
            }
          },
          required: ["aiScore", "aiPlan", "recommendations", "suggestedTimeOffsetHours"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    return res.json(data);

  } catch (error: any) {
    console.error("Error in /api/ai/prioritize:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 2. Analyze daily schedule & provide general insights
app.post("/api/ai/schedule", async (req, res) => {
  try {
    const { tasks, habits, currentTime } = req.body;

    let ai;
    try {
      ai = getAIClient();
    } catch (e: any) {
      if (e.message === "GEMINI_API_KEY_MISSING") {
        return res.status(200).json({
          fallback: true,
          score: 70,
          status: "optimal",
          recommendations: [
            "🔑 Connect your real Gemini API Key in the Settings -> Secrets panel of AI Studio to get highly accurate custom diagnostics!",
            "Your workload looks healthy. Prioritize high-impact tasks during your peak performance hours.",
            "Remember to check off habits early in the day to build momentum."
          ]
        });
      }
      throw e;
    }

    const tasksSummary = (tasks || []).map((t: any) => 
      `- [${t.status}] ${t.title} (${t.priority} priority, deadline: ${t.deadline}, duration: ${t.durationMinutes}m)`
    ).join("\n");

    const habitsSummary = (habits || []).map((h: any) =>
      `- ${h.title} (Streak: ${h.streak} days)`
    ).join("\n");

    const prompt = `You are Alchemi, the proactive AI productivity coach.
Analyze the user's workload for the day and calculate global productivity metrics.
Current Local Time: ${currentTime}

Active Tasks:
${tasksSummary || "None"}

Daily Habits/Goals:
${habitsSummary || "None"}

Based on this workload, please assess:
1. An overall daily productivity score (0-100) based on task completeness, habit streaks, and organization.
2. A general workload status indicator: "chill", "optimal", "intense", or "critical" (if too many tasks are close to deadlines).
3. 3-4 highly personalized, actionable recommendations for the day to ensure zero deadlines are missed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Global productivity score (0-100)."
            },
            status: {
              type: Type.STRING,
              description: "One of: chill, optimal, intense, critical"
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 actionable, encouraging suggestions."
            }
          },
          required: ["score", "status", "recommendations"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    return res.json(data);

  } catch (error: any) {
    console.error("Error in /api/ai/schedule:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// 3. AI Coach chat and smart actions parsing
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, tasks, currentTime } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Missing chat messages history." });
    }

    let ai;
    try {
      ai = getAIClient();
    } catch (e: any) {
      if (e.message === "GEMINI_API_KEY_MISSING") {
        const lastMsg = messages[messages.length - 1].text.toLowerCase();
        let reply = "I would be happy to help you organize that! (Note: Gemini API key is missing. Add your GEMINI_API_KEY in the Settings > Secrets panel to unlock actual AI conversational replies). For now, I can see your tasks and assist you locally.";
        let parsedAction = null;

        if (lastMsg.includes("add") || lastMsg.includes("create") || lastMsg.includes("task")) {
          reply = "I've simulated parsing your request to add a task. (Add your Gemini API Key in the AI Studio Settings -> Secrets panel to do this automatically with natural language!). Feel free to use the '+ Add Task' button at the top right of the dashboard.";
        }

        return res.status(200).json({
          fallback: true,
          reply,
          parsedAction
        });
      }
      throw e;
    }

    const conversationHistory = messages.map((m: any) => 
      `${m.sender === "user" ? "User" : "Alchemi (Coach)"}: ${m.text}`
    ).join("\n");

    const tasksSummary = (tasks || []).map((t: any) => 
      `- ID: ${t.id}, Title: "${t.title}", Status: ${t.status}, Deadline: ${t.deadline}, Category: ${t.category}`
    ).join("\n");

    const prompt = `You are Alchemi, the supportive, proactive AI Productivity Companion.
You converse with the user and help them stay focused, conquer procrastination, and manage deadlines.
Current Local Time: ${currentTime}

User's current task backlog:
${tasksSummary || "Empty backlog"}

Conversation History:
${conversationHistory}

Reply to the user in a professional, empathetic, and coaching-oriented tone.
Additionally, check if the user is asking to perform a productivity action in their latest message (e.g., creating a new task, rescheduling an existing task, completing a task, or starting a focus block).
If so, parse the request into a structured action object.

Available Actions schema to return if requested:
- ADD_TASK:
  { "type": "ADD_TASK", "payload": { "title": "...", "description": "...", "category": "...", "priority": "high|medium|low", "durationMinutes": 30, "deadlineOffsetHours": 12 } }
- COMPLETE_TASK:
  { "type": "COMPLETE_TASK", "payload": { "taskId": "..." } }
- RESCHEDULE_TASK:
  { "type": "RESCHEDULE_TASK", "payload": { "taskId": "...", "deadlineOffsetHours": 24 } }

Always provide an inspiring and helpful conversational reply in the "reply" property.
If no explicit action is matched, return null for "parsedAction".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "The supportive, helpful response text from the AI productivity coach."
            },
            parsedAction: {
              type: Type.OBJECT,
              description: "An optional parsed productivity action if the user requested it, else null.",
              properties: {
                type: {
                  type: Type.STRING,
                  description: "One of: ADD_TASK, COMPLETE_TASK, RESCHEDULE_TASK"
                },
                payload: {
                  type: Type.OBJECT,
                  description: "Key-value arguments matching the chosen action type."
                }
              },
              required: ["type", "payload"]
            }
          },
          required: ["reply"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    return res.json(data);

  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Configure Vite or production static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
