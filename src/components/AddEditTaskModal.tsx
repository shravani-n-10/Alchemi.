import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface AddEditTaskModalProps {
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'aiScore' | 'aiPlan' | 'scheduledTime' | 'recommendations' | 'completedAt' | 'subtasks'>) => void;
}

export default function AddEditTaskModal({ onClose, onSave }: AddEditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Studies');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [durationMinutes, setDurationMinutes] = useState(30);

  // Set default deadline to tomorrow at 5 PM local time
  const getDefaultDeadline = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 0, 0, 0);
    // YYYY-MM-DDTHH:mm
    return tomorrow.toISOString().substring(0, 16);
  };

  const [deadline, setDeadline] = useState(getDefaultDeadline());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      durationMinutes,
      deadline,
      status: 'todo'
    });
    onClose();
  };

  return (
    <div id="add-task-modal" className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b0f19]/90 rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="font-extrabold text-sm uppercase tracking-wide font-display">Command Center: Create Task</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-white">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Task Title / Commitment Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish chemistry final assignment"
              className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Short Context Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Needs to cover organic synthesis formulas and lab conclusions."
              className="w-full h-20 text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Deadline Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Est. Focus Time (Mins)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" /> Category Bucket
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold text-white bg-[#111625] border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                {['Studies', 'Work', 'Personal', 'Finance'].map(c => (
                  <option key={c} value={c} className="bg-[#111625] text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Baseline Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-semibold border capitalize transition cursor-pointer ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dialog Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-xl cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer transition flex items-center gap-1"
            >
              🚀 Run AI Prioritization & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
