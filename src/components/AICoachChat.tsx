import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, AlertCircle, RefreshCw, Zap, CheckCircle } from 'lucide-react';
import { ChatMessage, Task } from '../types';

interface AICoachChatProps {
  messages: ChatMessage[];
  tasks: Task[];
  onSendMessage: (text: string) => void;
  onApplyAction: (action: any) => void;
  pendingAction: any | null;
  onClearPendingAction: () => void;
  isChatLoading: boolean;
}

export default function AICoachChat({
  messages,
  tasks,
  onSendMessage,
  onApplyAction,
  pendingAction,
  onClearPendingAction,
  isChatLoading
}: AICoachChatProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const suggestions = [
    "📅 Help me plan today's backlog!",
    "🚀 Break down my most critical task into steps",
    "☕ Encourage me! I am procrastinating hard",
    "🔮 Add study block for Physics on Thursday at 4 PM"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (promptText: string) => {
    if (isChatLoading) return;
    onSendMessage(promptText);
  };

  return (
    <div id="ai-coach-chat" className="flex flex-col h-[520px] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg overflow-hidden relative z-10">
      {/* Header */}
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-black tracking-tight block font-display text-white">Alchemi AI Coach</span>
            <span className="text-[10px] text-indigo-300">Proactive Mindset & Focus Planner</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-1 rounded-full text-[9px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <Bot className="w-10 h-10 text-indigo-400 mb-2 animate-bounce" />
            <p className="text-xs font-bold text-white">Conversational AI Productivity Coach</p>
            <p className="text-[10px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
              Ask Alchemi to help prioritize deadlines, suggest motivation triggers, or break complex tasks down automatically with natural language.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isAI = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* AI Avatar */}
                {isAI && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed border shadow-sm ${
                    isAI
                      ? 'bg-white/10 text-white border-white/5 rounded-tl-none'
                      : 'bg-indigo-600/80 text-white border-indigo-500/30 rounded-tr-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className={`text-[9px] text-slate-500 mt-1 font-mono ${isAI ? 'self-start' : 'self-end'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing loading indicator */}
        {isChatLoading && (
          <div className="flex gap-2.5 max-w-[85%] self-start items-center">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/5 text-slate-400 text-xs py-2 px-3 border border-white/5 rounded-2xl rounded-tl-none italic shadow-sm">
              Alchemi is analyzing backlog parameters...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested chips container */}
      {messages.length < 5 && !isChatLoading && (
        <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex gap-1.5 overflow-x-auto max-w-full">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="whitespace-nowrap bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-300 transition cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Agentic pending action trigger */}
      {pendingAction && (
        <div className="m-3 p-3 bg-indigo-500/15 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-2 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-indigo-300 block">AI Recommended Action</span>
              <span className="text-[10px] text-indigo-200 truncate block capitalize">
                {pendingAction.type.replace('_', ' ')}: {pendingAction.payload.title || pendingAction.payload.taskId || 'Update parameters'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onApplyAction(pendingAction)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-md cursor-pointer transition"
            >
              Apply Plan
            </button>
            <button
              onClick={onClearPendingAction}
              className="text-slate-400 hover:text-white text-[10px] px-2 py-1.5 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Chat input box form */}
      <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Alchemi to schedule, motivate or break down goals..."
          className="flex-1 text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
          disabled={isChatLoading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isChatLoading}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/5 disabled:text-slate-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
