import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../context/AIContext';
import { useTasks } from '../context/TaskContext';
import audioSynth from '../services/audio';
import { Send, Mic, Volume2, Flame, Heart, Headphones, Check } from 'lucide-react';

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

  const { habits, toggleHabit, settings, updateSettings } = useTasks();

  const [inputText, setInputText] = useState('');
  const [rainOn, setRainOn] = useState(false);
  const [noiseOn, setNoiseOn] = useState(false);
  const [rainVolume, setRainVolume] = useState(settings.soundVolume);
  const [noiseVolume, setNoiseVolume] = useState(settings.soundVolume);

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

  // Soundboard toggles
  const handleToggleRain = () => {
    if (rainOn) {
      audioSynth.stopRain();
    } else {
      audioSynth.startRain(rainVolume);
    }
    setRainOn(!rainOn);
  };

  const handleToggleNoise = () => {
    if (noiseOn) {
      audioSynth.stopBrownNoise();
    } else {
      audioSynth.startBrownNoise(noiseVolume);
    }
    setNoiseOn(!noiseOn);
  };

  const handleRainVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setRainVolume(vol);
    if (rainOn) {
      audioSynth.setRainVolume(vol);
    }
    updateSettings({ soundVolume: vol });
  };

  const handleNoiseVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setNoiseVolume(vol);
    if (noiseOn) {
      audioSynth.setBrownNoiseVolume(vol);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* AI Pulse Core */}
      <div className="glass-panel p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div
          onClick={triggerVoiceAssistant}
          className={`ai-core-orb mb-3 ${
            isListening ? 'listening' : isSpeaking ? 'pulsing' : ''
          }`}
        ></div>
        <span className="text-xs font-bold text-text-primary heading-outfit">
          {isListening ? 'Listening to you...' : isSpeaking ? 'Alchem-AI Speaking' : 'Tap Orb to Speak'}
        </span>
        <span className="text-[10px] text-text-secondary mt-1">
          {isListening
            ? 'Speak your command now...'
            : isSpeaking
            ? 'Click to silence coach.'
            : 'Ask: "Give me a pep talk"'}
        </span>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="text-[9px] text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded mt-2 hover:bg-violet-950/20 transition-all"
          >
            Mute Voice
          </button>
        )}
      </div>

      {/* Ambient Soundboard */}
      <div className="glass-panel p-4 space-y-3">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold flex items-center gap-1">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" /> Focus Soundscapes
        </span>
        <div className="space-y-2.5">
          {/* Rain */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleToggleRain}
              className={`py-1 px-3 rounded text-xs font-semibold border transition-all shrink-0 ${
                rainOn
                  ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300'
                  : 'border-slate-800 text-text-secondary hover:border-slate-700'
              }`}
            >
              Rain
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!rainOn}
              value={rainVolume}
              onChange={handleRainVolumeChange}
              className="flex-1 accent-cyan-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Brown Noise */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleToggleNoise}
              className={`py-1 px-3 rounded text-xs font-semibold border transition-all shrink-0 ${
                noiseOn
                  ? 'bg-violet-950/20 border-violet-500 text-violet-300'
                  : 'border-slate-800 text-text-secondary hover:border-slate-700'
              }`}
            >
              Brown Noise
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!noiseOn}
              value={noiseVolume}
              onChange={handleNoiseVolumeChange}
              className="flex-1 accent-violet-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Alchem-AI Chat */}
      <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mb-2 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-pink-400" /> AI Coaching Chat
        </span>

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
              <span className="text-[9px] text-text-muted mt-1">{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            placeholder="Ask Alchem-AI..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            className="flex-1 glass-input text-xs py-2 pr-8"
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={triggerPepTalk}
          disabled={isProcessing}
          className="glass-btn text-[10px] py-1.5 justify-center border border-pink-500/20 hover:border-pink-500/40 text-pink-300 mt-2"
        >
          Request Pep Talk
        </button>
      </div>

      {/* Habit Tracker */}
      <div className="glass-panel p-4">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mb-3 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-red-400" /> Momentum Habits
        </span>
        <div className="space-y-2">
          {habits.map((habit) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isCompletedToday = habit.lastCompleted === todayStr;

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isCompletedToday
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isCompletedToday && <Check className="w-3 h-3" />}
                  </div>
                  <span className={isCompletedToday ? 'line-through text-text-muted' : 'text-text-primary'}>
                    {habit.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="text-[10px] font-mono text-text-secondary font-semibold">
                    {habit.streak}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AICoach;
