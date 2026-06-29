import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, ShieldAlert, Calendar, Brain, ChevronRight, LogIn } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  showModal?: boolean;
  onCloseModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, showModal, onCloseModal }) => {
  const { loginWithGoogle } = useTasks();
  const [localShowModal, setLocalShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isAuthModalOpen = showModal !== undefined ? showModal : localShowModal;

  const closeAuthModal = () => {
    if (onCloseModal) onCloseModal();
    else setLocalShowModal(false);
  };

  const openAuthModal = () => {
    setLocalShowModal(true);
  };

  const handleDemoLogin = () => {
    loginWithGoogle('Alex Mercer', 'alex.mercer@gmail.com');
    onEnter();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    loginWithGoogle(name.trim(), email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
    onEnter();
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col justify-between relative overflow-hidden text-text-primary">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-20">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/20 border border-violet-500/20 text-xs font-medium text-violet-300 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Introducing Alchemi 1.0 — Proactive Multi-Agent OS
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold heading-outfit leading-[1.15] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-violet-200">
            Conquer Your Deadlines <br />
            Before the Panic Sets In.
          </h2>

          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Alchemi helps you beat procrastination by converting passive reminders into active, AI-scheduled task execution. It calculates your urgency using a dynamic **Panic Index**, breaks down complex goals, and auto-generates **AI Starter Drafts** so you can start working instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openAuthModal}
              className="glass-btn glass-btn-primary py-3 px-8 text-sm flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="glass-btn py-3 px-8 text-sm border border-white/5 hover:border-white/10 w-full sm:w-auto justify-center"
            >
              Explore Features
            </a>
          </div>

          {/* Glassmorphic Mockup Preview */}
          <div className="pt-8 max-w-3xl mx-auto animate-fadeIn">
            <div className="glass-panel p-4 aspect-[16/9] border-violet-500/10 shadow-2xl relative overflow-hidden flex flex-col justify-between text-left">
              {/* Mockup header */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/40"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/40"></span>
                  <span className="text-[10px] text-text-muted ml-2 font-mono">alchemi.ai/workspace</span>
                </div>
                <div className="w-20 h-4 rounded bg-white/5"></div>
              </div>
              
              {/* Mockup layout */}
              <div className="flex-1 grid grid-cols-3 gap-3 pt-3">
                <div className="rounded-lg bg-white/5 border border-white/5 p-3 flex flex-col justify-between">
                  <div className="w-12 h-3 rounded bg-cyan-500/20"></div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded bg-white/5"></div>
                    <div className="w-5/6 h-2 rounded bg-white/5"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-2 rounded bg-white/5"></div>
                    <div className="w-6 h-3 rounded-full bg-cyan-500/30"></div>
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/5 p-3 flex flex-col justify-between col-span-2">
                  <div className="flex justify-between">
                    <div className="w-20 h-3 rounded bg-violet-500/20"></div>
                    <div className="w-8 h-3 rounded bg-white/5"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 rounded bg-white/5"></div>
                    <div className="w-full h-2 rounded bg-white/5"></div>
                    <div className="w-4/5 h-2 rounded bg-white/5"></div>
                  </div>
                  <div className="w-full h-6 rounded bg-violet-600/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto w-full relative z-20 border-t border-white/5">
        <div className="text-center space-y-2 mb-12">
          <h3 className="text-2xl font-bold heading-outfit">How Alchemi Helps You Execute</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Three core autonomous agents coordinate in the background to streamline your execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold heading-outfit">1. Beat Procrastination</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Calculates your **Panic Index** dynamically. Adapts to your energy level and deadlines, highlighting "Silent Killers" that need immediate attention.
            </p>
          </div>
          {/* Card 2 */}
          <div className="glass-panel p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold heading-outfit">2. Auto-Schedule Your Day</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Deconstructs your goals into milestones and **auto-schedules** them. Protects your calendar commitments, meetings, meals, and breaks automatically.
            </p>
          </div>
          {/* Card 3 */}
          <div className="glass-panel p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold heading-outfit">3. Create Starter Drafts</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              When a task is added, the AI generates a step-by-step checklist and **Starter Assets** (pre-written email drafts, code boilerplates, outlines) so you can take action instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 text-center text-[11px] text-text-muted relative z-20">
        <p>© 2026 Alchemi Productivity Inc. All rights reserved.</p>
        <p className="mt-1">
          Developed for the Coding Ninjas 10x Vibe2Ship Hackathon. Powered by Google AI Studio.
        </p>
      </footer>

      {/* Google Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel max-w-sm w-full p-6 relative text-center">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-3">
                {/* Google Colored Logo Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.3 3.49l3.85 2.99c2.25-2.08 3.51-5.14 3.51-8.63z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 10.55c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.39 3.16C.5 4.93 0 6.91 0 9s.5 4.07 1.39 5.84l3.85-2.99z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.85-2.99c-1.1.74-2.51 1.18-4.11 1.18-3.34 0-5.86-1.81-6.76-4.51L1.39 16.75C3.37 20.65 7.35 23 12 23z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold heading-outfit text-text-primary">
                Sign in with Google
              </h3>
              <p className="text-[10px] text-text-secondary mt-1">
                To continue to your Alchemi Productivity Workspace
              </p>
            </div>

            {/* Quick One-Click Google Login */}
            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-all font-semibold text-xs shadow"
            >
              One-Click Demo Login (Alex Mercer)
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-[9px] text-text-muted uppercase font-bold">Or Customize Account</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Custom Google Login Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3 text-left">
              <div>
                <span className="text-[9px] text-text-secondary uppercase tracking-wider block mb-1">Full Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g., John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input text-xs py-2"
                />
              </div>
              <div>
                <span className="text-[9px] text-text-secondary uppercase tracking-wider block mb-1">Email Address</span>
                <input
                  type="email"
                  placeholder="e.g., john.doe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input text-xs py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full glass-btn glass-btn-primary justify-center text-xs py-2.5 mt-2"
              >
                Sign In & Enter Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default LandingPage;
