import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Key, Eye, EyeOff, Save, Volume2, Moon, Clock } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useTasks();
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [useLocal, setUseLocal] = useState(settings.useLocalAI);
  const [voiceEnabled, setVoiceEnabled] = useState(settings.voiceEnabled);
  const [volume, setVolume] = useState(settings.soundVolume);
  const [startHour, setStartHour] = useState(settings.workStartHour);
  const [endHour, setEndHour] = useState(settings.workEndHour);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      geminiApiKey: apiKey.trim(),
      useLocalAI: useLocal,
      voiceEnabled,
      soundVolume: volume,
      workStartHour: startHour,
      workEndHour: endHour,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold heading-outfit mb-6 flex items-center gap-2">
          Workspace Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* AI Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              AI Intelligence Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUseLocal(false)}
                className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                  !useLocal
                    ? 'border-violet-500 bg-violet-950/20 text-white'
                    : 'border-slate-800 bg-slate-950/10 text-text-secondary'
                }`}
              >
                Google Gemini AI
              </button>
              <button
                type="button"
                onClick={() => setUseLocal(true)}
                className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                  useLocal
                    ? 'border-violet-500 bg-violet-950/20 text-white'
                    : 'border-slate-800 bg-slate-950/10 text-text-secondary'
                }`}
              >
                Local Simulated AI
              </button>
            </div>
          </div>

          {/* Gemini API Key */}
          {!useLocal && (
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full glass-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Voice Coach */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold block">Voice Assistant Feedback</span>
              <span className="text-[10px] text-text-muted">Let Alchem-AI speak briefings and nudges</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>

          {/* Audio Volume */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Soundscapes Volume ({Math.round(volume * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Daily Working Timeline
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-text-secondary block mb-1">Day Start (Hour)</span>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={startHour}
                  onChange={(e) => setStartHour(parseInt(e.target.value))}
                  className="w-full glass-input text-sm py-2"
                />
              </div>
              <div>
                <span className="text-[10px] text-text-secondary block mb-1">Day End (Hour)</span>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={endHour}
                  onChange={(e) => setEndHour(parseInt(e.target.value))}
                  className="w-full glass-input text-sm py-2"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full glass-btn glass-btn-primary justify-center text-sm mt-4 py-2.5"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Settings Saved!' : 'Save & Sync'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Settings;
