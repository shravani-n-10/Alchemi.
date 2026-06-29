import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { validateApiKey } from '../services/gemini';
import { Sparkles, Key, AlertTriangle, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const { settings, updateSettings } = useTasks();
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [useLocal, setUseLocal] = useState(settings.useLocalAI);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (useLocal) {
      updateSettings({
        geminiApiKey: '',
        useLocalAI: true,
      });
      onEnter();
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter a valid Gemini API Key or choose Demo Mode.');
      return;
    }

    setIsValidating(true);
    const isValid = await validateApiKey(apiKey.trim());
    setIsValidating(false);

    if (isValid) {
      updateSettings({
        geminiApiKey: apiKey.trim(),
        useLocalAI: false,
      });
      onEnter();
    } else {
      setError('Failed to validate API Key. Please check the key and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark">
      <div className="glass-panel max-w-lg w-full p-8 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600 rounded-full blur-[100px] opacity-35 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600 rounded-full blur-[100px] opacity-35 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold heading-outfit tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-violet-300">
            ALCHEMI
          </h1>
          <p className="text-violet-400 text-xs font-semibold tracking-widest uppercase mt-1">
            The AI OS for Productivity
          </p>
          <p className="text-text-secondary text-sm mt-3 max-w-sm">
            Stop ignoring passive notifications. Connect Alchemi to coordinate your tasks, auto-schedule your day, and predict deadline risks.
          </p>
        </div>

        <form onSubmit={handleConnect} className="space-y-6 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              1. Choose Operation Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setUseLocal(false);
                  setError(null);
                }}
                className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                  !useLocal
                    ? 'border-violet-500 bg-violet-950/20 text-white'
                    : 'border-slate-800 bg-slate-950/20 text-text-secondary hover:border-slate-700'
                }`}
              >
                Google Gemini Mode
                <span className="block text-[10px] font-normal text-violet-400 mt-1">
                  Requires AI Studio Key
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseLocal(true);
                  setError(null);
                }}
                className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                  useLocal
                    ? 'border-violet-500 bg-violet-950/20 text-white'
                    : 'border-slate-800 bg-slate-950/20 text-text-secondary hover:border-slate-700'
                }`}
              >
                Local Demo Mode
                <span className="block text-[10px] font-normal text-text-muted mt-1">
                  Fully Simulated AI
                </span>
              </button>
            </div>
          </div>

          {!useLocal && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-violet-400" /> Enter Google AI Studio Key
                </label>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-400 hover:underline"
                >
                  Get a free key
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full glass-input"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-950/25 border border-red-900/45 flex items-start gap-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-normal">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating}
            className="w-full glass-btn glass-btn-primary justify-center text-sm py-3"
          >
            {isValidating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Validating Key...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Enter Alchemi Workspace <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/65 text-center relative z-10">
          <p className="text-[10px] text-text-muted">
            Designed for the Coding Ninjas 10x Vibe2Ship Hackathon.<br />
            API keys are saved locally in your browser and are never sent to external servers.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
