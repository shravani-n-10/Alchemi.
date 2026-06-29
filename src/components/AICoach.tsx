import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import { useTasks } from '../context/TaskContext';
import { Send, X } from 'lucide-react';

export const AICoach: React.FC = () => {
  const {
    chatHistory,
    isListening,
    isSpeaking,
    isProcessing,
    sendMessage,
    triggerVoiceAssistant,
    stopSpeaking,
  } = useAI();

  const { settings } = useTasks();
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const triggerPepTalk = async () => {
    await sendMessage('Give me a pep talk');
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass-panel p-3.5 flex items-center gap-3.5 border-violet-500/20 shadow-2xl bg-slate-950/95 cursor-pointer hover:border-violet-500/45 hover:shadow-violet-500/10 transition-all animate-fadeIn select-none"
      >
        <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-sm relative">
          🤖
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
        </div>
        <div className="text-left pr-2">
          <span className="text-[11px] font-bold text-white block">Alchem-AI Coach</span>
          <span className="text-[9px] text-text-secondary">Need help planning today?</span>
        </div>
        <span className="text-[10px] text-violet-400 font-bold ml-auto bg-violet-500/10 px-2 py-0.5 rounded">Open</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[480px] glass-panel border-violet-500/35 shadow-2xl bg-slate-950/95 flex flex-col overflow-hidden animate-fadeIn p-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2.5 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-xs">🤖</div>
          <span className="text-xs font-bold text-white">Alchem-AI Coach</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-text-muted hover:text-white transition-colors text-xs bg-none border-none cursor-pointer outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AI Pulse Core */}
      <div className="bg-white/2 border border-white/5 rounded-xl p-3 flex items-center gap-3 mb-3 shrink-0">
        <div
          onClick={triggerVoiceAssistant}
          className={`ai-core-orb shrink-0 cursor-pointer ${
            isListening ? 'listening' : isSpeaking ? 'pulsing' : ''
          }`}
          style={{ width: '32px', height: '32px' }}
        ></div>
        <div className="text-left flex-1 min-w-0">
          <span className="text-[10px] font-bold text-white block">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Assistant'}
          </span>
          <span className="text-[9px] text-text-secondary block truncate">
            {isListening ? 'Speak now...' : isSpeaking ? 'Click to mute' : 'Tap orb to talk'}
          </span>
        </div>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="text-[8px] text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded hover:bg-violet-950/20 transition-all shrink-0"
          >
            Mute
          </button>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 text-xs">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl leading-normal ${
                msg.sender === 'user'
                  ? 'bg-violet-950/45 border border-violet-900/40 text-text-primary rounded-br-none'
                  : 'bg-white/5 border border-white/5 text-text-secondary rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[8px] text-text-muted mt-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex gap-2 relative shrink-0">
        <input
          type="text"
          placeholder="Ask Alchem-AI..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isProcessing}
          className="flex-1 glass-input text-xs py-2.5 pr-8"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white disabled:opacity-40"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <button
        onClick={triggerPepTalk}
        disabled={isProcessing}
        className="glass-btn text-[9px] py-1.5 justify-center border border-pink-500/25 hover:border-pink-500/45 text-pink-300 mt-2 shrink-0"
      >
        Request Pep Talk
      </button>
    </div>
  );
};

export default AICoach;
