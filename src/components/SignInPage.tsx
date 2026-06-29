import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, ArrowLeft, Calendar, Zap, Brain } from 'lucide-react';

interface SignInPageProps {
  onEnter: () => void;
  onBack: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onEnter, onBack }) => {
  const { loginWithGoogle } = useTasks();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-70px)] relative overflow-y-auto p-6 md:p-12 bg-transparent text-text-primary">
      {/* Background blobs & glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-600/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Floating AI Orb back-decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/3 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

      {/* Back to Home Button */}
      <button 
        onClick={onBack} 
        className="absolute top-6 left-6 text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-none border-none cursor-pointer outline-none z-25"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Responsive Two-Column Grid */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-6xl w-full mx-auto relative z-10">
        
        {/* LEFT COLUMN: Welcome & Value Proposition (45%) */}
        <div className="flex-1 text-left space-y-6 max-w-lg lg:max-w-none">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/15 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Alchemi
          </span>
          
          <div className="space-y-4">
            <h1 className="text-[42px] font-black heading-outfit text-white leading-tight">
              Your AI Productivity Companion
            </h1>
            <p className="text-lg font-bold text-cyan-400 leading-normal">
              Plan smarter. Beat procrastination. Finish before deadlines.
            </p>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Alchemi uses AI to prioritize your work, calculate your Panic Index dynamically, build intelligent schedules, and help you stay ahead of deadlines.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-xs font-semibold text-white bg-white/3 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" /> AI Planning
            </span>
            <span className="text-xs font-semibold text-white bg-white/3 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Smart Scheduling
            </span>
            <span className="text-xs font-semibold text-white bg-white/3 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Google Calendar Sync
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Card (55%) */}
        <div className="flex-1 flex justify-center w-full max-w-[480px]">
          <div className="glass-panel p-8 w-full border-white/8 shadow-2xl rounded-[24px] space-y-6 text-left animate-fadeIn">
            
            {/* Card Header */}
            <div className="space-y-1.5">
              <h2 className="text-[32px] font-extrabold heading-outfit text-white leading-none">
                Sign In
              </h2>
              <p className="text-sm text-text-secondary">
                Continue to your AI Productivity Workspace
              </p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-slate-100 transition-all font-bold text-sm py-3.5 rounded-xl shadow-lg hover:shadow-white/5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">OR</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            {/* Demo Login Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full glass-btn justify-center text-xs py-3 border-violet-500/20 text-violet-300 hover:bg-violet-500/5 font-semibold"
            >
              One-Click Demo Login (Alex Mercer)
            </button>

            {/* Custom Profile Section */}
            <form onSubmit={handleCustomLogin} className="space-y-4 pt-2">
              <span className="text-xs font-bold text-text-secondary block border-b border-white/5 pb-2">
                Create Custom Profile
              </span>
              
              <div className="space-y-3">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input text-xs py-3"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g., john.doe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input text-xs py-3"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full glass-btn glass-btn-primary justify-center text-xs py-3.5 mt-2 font-bold"
              >
                ✨ Enter Workspace
              </button>
            </form>

            {/* Terms & Privacy */}
            <p className="text-[10px] text-text-muted text-center leading-normal pt-2 select-none">
              By continuing, you agree to the Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
