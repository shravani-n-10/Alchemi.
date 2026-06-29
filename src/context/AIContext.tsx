import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTasks } from './TaskContext';
import { CoachMessage, Task } from '../types';
import * as gemini from '../services/gemini';
import * as localAI from '../utils/localAI';
import speechService from '../services/speech';
import audioSynth from '../services/audio';

interface AIContextType {
  chatHistory: CoachMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  briefing: string;
  riskAssessment: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasoning: string;
    recoveryOptions: { type: 'de-scope' | 'reschedule'; title: string; description: string; timeSavedMinutes: number }[];
  } | null;
  sendMessage: (text: string) => Promise<void>;
  triggerVoiceAssistant: () => void;
  stopSpeaking: () => void;
  getTaskBreakdown: (title: string, description: string, category: string) => Promise<{
    subtasks: { title: string; duration: number }[];
    procrastinationWarning: string;
    starterAsset: any;
  }>;
  generateBriefing: () => Promise<void>;
  checkRiskAssessment: () => Promise<void>;
  generateEODReflection: () => Promise<any>;
  dismissRiskAssessment: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, energyLevel, settings, setDailyPlan, dailyPlan, updateTask, updateSettings, habits, focusSessions, googleCalendarSynced } = useTasks();

  const [chatHistory, setChatHistory] = useState<CoachMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [briefing, setBriefing] = useState('');
  const [riskAssessment, setRiskAssessment] = useState<any>(null);

  // Initialize chat history with a dynamic greeting from Alchem-AI
  useEffect(() => {
    if (tasks.length > 0) {
      const active = tasks.filter(t => !t.completed);
      if (active.length > 0) {
        const highest = [...active].sort((a, b) => b.panicIndex - a.panicIndex)[0];
        let greetingText = `👋 Good Afternoon! You have ${active.length} active task${active.length > 1 ? 's' : ''} today. Your highest priority is "${highest.title}".`;
        
        if (!dailyPlan) {
          greetingText += " Would you like me to build today's schedule?";
        } else {
          greetingText += " Your daily schedule is ready. Let's start a focus session when you are ready!";
        }

        setChatHistory([
          {
            id: `msg-init-${Date.now()}`,
            sender: 'ai',
            text: greetingText,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        return;
      }
    }

    // Default welcome
    const defaultGreeting = "Greetings! I am Alchem-AI, your productivity coach. Tell me, what is our goal today?";
    setChatHistory([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'ai',
        text: defaultGreeting,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [tasks.length, !!dailyPlan]);

  const apiKey = settings.geminiApiKey;
  const useLocal = !apiKey || settings.useLocalAI;

  /**
   * Helper to append messages to chat
   */
  const appendMessage = (sender: 'user' | 'ai', text: string, speechText?: string) => {
    setChatHistory((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender,
        text,
        speechText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  /**
   * Generates a task breakdown (subtasks, warnings, assets)
   */
  const getTaskBreakdown = async (title: string, description: string, category: string) => {
    setIsProcessing(true);
    try {
      if (useLocal) {
        // Artificial delay to make it feel like AI is thinking
        await new Promise((r) => setTimeout(r, 1000));
        const res = localAI.generateLocalAIResponse(title, description, category);
        return {
          subtasks: res.subtasks,
          procrastinationWarning: res.procrastinationWarning,
          starterAsset: res.starterAsset,
        };
      } else {
        const res = await gemini.generateTaskBreakdown(apiKey, title, description, category);
        return res;
      }
    } catch (e) {
      console.error('Gemini breakdown failed, falling back to local:', e);
      const res = localAI.generateLocalAIResponse(title, description, category);
      return {
        subtasks: res.subtasks,
        procrastinationWarning: res.procrastinationWarning,
        starterAsset: res.starterAsset,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Sends a chat message to Alchem-AI
   */
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    appendMessage('user', text);
    setIsProcessing(true);

    try {
      let reply = '';
      let speechText = '';

      if (useLocal) {
        await new Promise((r) => setTimeout(r, 800));
        const activeTask = tasks.find((t) => !t.completed);
        
        // Simple local pattern matching
        const msg = text.toLowerCase();
        if (msg.includes('pep') || msg.includes('motivation') || msg.includes('tired') || msg.includes('lazy')) {
          reply = "Focus isn't about being motivated; it's about doing the work anyway. Procrastination is just fear of starting. Pick the smallest, easiest subtask on your plate. Do it for just 5 minutes. You'll find your momentum. Let's go!";
        } else if (msg.includes('hello') || msg.includes('hi ')) {
          reply = "Hello! I'm tracking your tasks. Your highest-panic task needs attention. What can we start on right now?";
        } else {
          reply = activeTask
            ? `I see you have "${activeTask.title}" active (Panic Index: ${activeTask.panicIndex}%). My recommendation is to enter Focus Mode immediately and tackle the first subtask. Shall we start?`
            : "All your tasks are currently under control. Would you like to add a new task or review your daily habits?";
        }
        speechText = reply;
      } else {
        const activeTask = tasks.find((t) => !t.completed);
        const res = await gemini.generateCoachingResponse(apiKey, tasks, activeTask, chatHistory, text);
        reply = res.reply;
        speechText = res.speechText || res.reply;

        if (res.suggestedAction === 'START_FOCUS_MODE' && activeTask) {
          // Can trigger Focus Mode UI
        }
      }

      appendMessage('ai', reply, speechText);
      if (settings.voiceEnabled) {
        setIsSpeaking(true);
        await speechService.speak(speechText, () => setIsSpeaking(false));
      }
    } catch (e) {
      console.error('Coaching failed:', e);
      appendMessage('ai', "I encountered a minor disruption in my connection. However, my advice remains: focus on your highest-panic task and take action now.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Voice Assistant: Listens to voice command, parses with Gemini, and executes action
   */
  const triggerVoiceAssistant = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    speechService.stopListening(); // Make sure it's clean
    speechService.stopSpeaking();
    setIsSpeaking(false);

    speechService.startListening(
      async (transcript) => {
        appendMessage('user', `[Voice] ${transcript}`);
        setIsProcessing(true);

        try {
          if (useLocal) {
            // Local voice command parsing (simple regex)
            const t = transcript.toLowerCase();
            if (t.includes('add') || t.includes('remind')) {
              appendMessage('ai', `I heard you want to add a task. Let's create it in the task panel! Or connect your Gemini API Key for autonomous voice task creation.`);
              if (settings.voiceEnabled) {
                setIsSpeaking(true);
                await speechService.speak("I heard you want to add a task. Let's create it in the task panel.", () => setIsSpeaking(false));
              }
            } else if (t.includes('pep') || t.includes('coach') || t.includes('motivation')) {
              await sendMessage('Give me a pep talk');
            } else {
              await sendMessage(transcript);
            }
          } else {
            // Parse voice command using Gemini
            const res = await gemini.parseVoiceCommand(apiKey, transcript);
            
            if (res.intent === 'ADD_TASK' && res.task) {
              const createdTask = await useTasks().addTask({
                title: res.task.title,
                description: `Created via Voice: ${transcript}`,
                category: res.task.category || 'Work',
                dueDate: res.task.dueDate || new Date(Date.now() + 24*3600*1000).toISOString(),
                estimatedEffort: res.task.estimatedEffort || 1,
                energyLevel: 'medium'
              });

              // Trigger breakdown immediately
              const breakdown = await getTaskBreakdown(createdTask.title, createdTask.description, createdTask.category);
              updateTask(createdTask.id, {
                subtasks: breakdown.subtasks.map((sub: any, idx: number) => ({
                  id: `sub-${idx}-${Date.now()}`,
                  title: sub.title,
                  duration: sub.duration,
                  completed: false
                })),
                procrastinationWarning: breakdown.procrastinationWarning,
                starterAsset: breakdown.starterAsset
              });

              appendMessage('ai', res.coachingReply || `I have successfully added the task "${res.task.title}" and generated a 5-step action plan for you.`);
              if (settings.voiceEnabled) {
                setIsSpeaking(true);
                await speechService.speak(res.coachingReply || `Added task: ${res.task.title}. Planning complete.`, () => setIsSpeaking(false));
              }
            } else if (res.intent === 'PEP_TALK') {
              await sendMessage('Give me a pep talk');
            } else {
              appendMessage('ai', res.coachingReply || "I heard you, but I wasn't able to map that to a specific action. How else can I assist you?");
              if (settings.voiceEnabled) {
                setIsSpeaking(true);
                await speechService.speak(res.coachingReply || "How else can I assist you?", () => setIsSpeaking(false));
              }
            }
          }
        } catch (e) {
          console.error('Voice parsing failed:', e);
          appendMessage('ai', "I heard your voice, but had trouble parsing the command. Let's try again or use text.");
        } finally {
          setIsProcessing(false);
        }
      },
      (err) => {
        console.error('Speech Recognition Error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  /**
   * Generates a morning / daily briefing
   */
  const generateBriefing = async () => {
    setIsProcessing(true);
    try {
      const activeTasks = tasks.filter((t) => !t.completed);
      let briefingText = '';
      let speechText = '';

      if (useLocal) {
        const res = localAI.generateLocalDailyBriefing(activeTasks, googleCalendarSynced);
        briefingText = res.briefingText;
        speechText = res.speechText;

        setDailyPlan({
          date: new Date().toISOString().split('T')[0],
          timeline: localAI.generateLocalDailyTimeline(activeTasks, googleCalendarSynced)
        });
      } else {
        const commitments = dailyPlan ? dailyPlan.timeline.filter(t => t.activityType === 'meeting').map(t => t.label) : [];
        const res = await gemini.generateDailyTimeline(apiKey, activeTasks, commitments);
        // Map timeline
        if (res.timeline) {
          setDailyPlan({
            date: new Date().toISOString().split('T')[0],
            timeline: res.timeline.map((item: any, idx: number) => ({
              id: `block-${idx}-${Date.now()}`,
              timeSlot: item.timeSlot,
              activityType: item.activityType,
              referenceId: item.referenceId,
              label: item.label
            }))
          });
        }
        
        // Quick briefing prompt
        const briefingRes = await gemini.generateCoachingResponse(apiKey, activeTasks, null, [], "Give me a daily briefing of my schedule.");
        briefingText = briefingRes.reply;
        speechText = briefingRes.speechText || briefingRes.reply;
      }

      setBriefing(briefingText);
      appendMessage('ai', briefingText, speechText);
      
      if (settings.voiceEnabled) {
        setIsSpeaking(true);
        await speechService.speak(speechText, () => setIsSpeaking(false));
      }
    } catch (e) {
      console.error('Briefing failed:', e);
      setBriefing("You have active tasks on your plate today. Focus on completing them before their deadlines.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Risk Predictor: Periodically runs in background to detect deadline slippage
   */
  const checkRiskAssessment = async () => {
    const activeTasks = tasks.filter((t) => !t.completed);
    if (activeTasks.length === 0) return;

    try {
      let res;
      if (useLocal) {
        res = localAI.generateLocalRiskAssessment(activeTasks, energyLevel);
      } else {
        res = await gemini.generateRiskAssessment(apiKey, activeTasks, energyLevel);
      }

      if (res.riskLevel === 'HIGH' || res.riskLevel === 'MEDIUM') {
        setRiskAssessment(res);
        // Play a subtle notification chime
        audioSynth.playSuccessChime(); // (Or use a warning chime, success chime is pleasant enough)
      } else {
        setRiskAssessment(null);
      }
    } catch (e) {
      console.error('Risk assessment failed:', e);
    }
  };

  // Run Risk Assessment every 5 minutes in background
  useEffect(() => {
    if (tasks.length > 0) {
      checkRiskAssessment();
    }
    const interval = setInterval(() => {
      if (tasks.length > 0) {
        checkRiskAssessment();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [tasks, energyLevel]);

  const dismissRiskAssessment = () => {
    setRiskAssessment(null);
  };

  /**
   * Reflection Agent: End of Day review
   */
  const generateEODReflection = async () => {
    setIsProcessing(true);
    try {
      const completedToday = tasks.filter(t => t.completed);
      const slippedToday = tasks.filter(t => !t.completed && new Date(t.dueDate).getTime() < Date.now());
      const totalFocusMins = Math.round(focusSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);

      if (useLocal) {
        await new Promise((r) => setTimeout(r, 1000));
        return {
          victory: completedToday.length > 0 
            ? `Completed ${completedToday.length} task(s), including "${completedToday[0].title}".`
            : "No tasks completed today, but tomorrow is a fresh start.",
          procrastinationInsight: "You tended to delay starting tasks during the afternoon. Try scheduling shorter 20-minute focus blocks tomorrow.",
          tomorrowTimeline: [
            { timeSlot: "09:30 - 11:30", activity: "Deep Work: Complete remaining tasks" },
            { timeSlot: "11:30 - 12:00", activity: "Administrative: Plan and review" }
          ]
        };
      } else {
        const res = await gemini.generateReflection(apiKey, completedToday, slippedToday, totalFocusMins, habits);
        return res;
      }
    } catch (e) {
      console.error('Reflection failed:', e);
      return {
        victory: "Completed tasks today.",
        procrastinationInsight: "Maintain focus tomorrow by starting tasks early.",
        tomorrowTimeline: []
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        chatHistory,
        isListening,
        isSpeaking,
        isProcessing,
        briefing,
        riskAssessment,
        sendMessage,
        triggerVoiceAssistant,
        stopSpeaking,
        getTaskBreakdown,
        generateBriefing,
        checkRiskAssessment,
        generateEODReflection,
        dismissRiskAssessment,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};
