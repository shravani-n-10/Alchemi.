import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, Calendar, LogIn, ChevronRight, Compass } from 'lucide-react';

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
    <div className="flex flex-col justify-between relative overflow-hidden text-text-primary">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <main className="hero-container relative z-20">
        <div className="hero-badge">
          <Sparkles className="w-3.5 h-3.5" /> Introducing Alchemi 1.0 — Proactive Multi-Agent OS
        </div>

        <h2 className="hero-title">
          Conquer Your Deadlines <br />
          <span className="gradient">Before the Panic Sets In.</span>
        </h2>

        <div className="hero-divider">── ✦ ──</div>

        <p className="hero-description">
          Alchemi helps you beat procrastination by converting passive reminders into active, AI-scheduled task execution. It calculates your urgency using a dynamic <span className="text-pink">Panic Index</span>, breaks down complex goals, and generates <span className="text-cyan">AI Starter Drafts</span> so you can begin working immediately.
        </p>

        <div className="hero-buttons">
          <button
            onClick={openAuthModal}
            className="glass-btn glass-btn-primary py-3.5 px-8"
          >
            Get Started Free <Sparkles className="w-4 h-4" />
          </button>
          <a
            href="#features"
            className="glass-btn py-3.5 px-8 border border-white/8 hover:border-white/15"
          >
            Explore Features <span className="text-xs">↗</span>
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="features-section relative z-20">
        <div className="features-header">
          <h3 className="features-title">How Alchemi Helps You Execute</h3>
          <p className="features-subtitle">
            Three autonomous AI agents work together behind the scenes to help you plan, prioritize, and complete your work before deadlines.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Beat Procrastination */}
          <div className="feature-card-glow card-glow-pink">
            <div className="card-header-row">
              <div className="feature-card-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                <Compass className="w-5 h-5" />
              </div>
              <span className="card-badge">1</span>
            </div>

            <div className="card-info">
              <h4 className="feature-card-title">🔥 Beat Procrastination</h4>
              <p className="feature-card-desc">
                Calculates your Panic Index dynamically using deadlines, workload, estimated effort, and energy level.
              </p>
              <p className="feature-card-desc">
                Highlights high-risk tasks before they become emergencies.
              </p>
            </div>

            <div className="card-preview-box">
              <div>
                <div className="panic-preview-title">Panic Index</div>
                <div className="panic-preview-value">89%</div>
              </div>
              <svg className="panic-preview-chart" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 30C15 30 20 10 35 15C50 20 55 5 70 10C85 15 90 2 100 5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Card 2: Auto-Schedule Your Day */}
          <div className="feature-card-glow card-glow-cyan">
            <div className="card-header-row">
              <div className="feature-card-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#0ea5e9' }}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="card-badge">2</span>
            </div>

            <div className="card-info">
              <h4 className="feature-card-title">🧠 Auto-Schedule Your Day</h4>
              <p className="feature-card-desc">
                Breaks goals into milestones.
              </p>
              <p className="feature-card-desc">
                Automatically builds a balanced schedule while protecting meetings, meals, and breaks.
              </p>
            </div>

            <div className="card-preview-box" style={{ padding: '12px' }}>
              <div className="schedule-preview-list">
                <div className="schedule-preview-item">
                  <span className="schedule-preview-time">9:00</span>
                  <span className="schedule-preview-label">Deep Work</span>
                </div>
                <div className="schedule-preview-item">
                  <span className="schedule-preview-time">11:00</span>
                  <span className="schedule-preview-label">Meeting</span>
                </div>
                <div className="schedule-preview-item">
                  <span className="schedule-preview-time">1:00</span>
                  <span className="schedule-preview-label">Lunch Break</span>
                </div>
                <div className="schedule-preview-item">
                  <span className="schedule-preview-time">2:00</span>
                  <span className="schedule-preview-label">Project Work</span>
                </div>
                <div className="schedule-preview-item">
                  <span className="schedule-preview-time">4:30</span>
                  <span className="schedule-preview-label">Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Starter Drafts */}
          <div className="feature-card-glow card-glow-purple">
            <div className="card-header-row">
              <div className="feature-card-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc' }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="card-badge">3</span>
            </div>

            <div className="card-info">
              <h4 className="feature-card-title">✨ AI Starter Drafts</h4>
              <p className="feature-card-desc">
                Instantly generates checklists, outlines, email drafts, coding boilerplates, and research summaries.
              </p>
              <p className="feature-card-desc">
                Provides starter assets so users can take action and begin working immediately.
              </p>
            </div>

            <div className="card-preview-box" style={{ padding: '12px', background: 'transparent', border: 'none' }}>
              <div className="asset-preview-list">
                <div className="asset-preview-item">
                  <span className="text-violet-400" style={{ marginRight: '2px' }}>✓</span> Checklist
                </div>
                <div className="asset-preview-item">
                  <span className="text-violet-400" style={{ marginRight: '2px' }}>✉</span> Email
                </div>
                <div className="asset-preview-item">
                  <span className="text-violet-400" style={{ marginRight: '2px' }}>&lt;/&gt;</span> Code
                </div>
                <div className="asset-preview-item">
                  <span className="text-violet-400" style={{ marginRight: '2px' }}>☰</span> Outline
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container relative z-20">
        <div className="footer-logo">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15M10 3V8.462L5.277 17.908C4.55 19.362 5.606 21 7.231 21H16.769C18.394 21 19.45 19.362 18.723 17.908L14 8.462V3" stroke="url(#footerFlask)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 16.5C9.5 14.5 10.5 18.5 12.5 16.5C14.5 14.5 15.5 18.5 16.5 16.5" stroke="url(#footerLiquid)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 11L12.5 12.5L14 13L12.5 13.5L12 15L11.5 13.5L10 13L11.5 12.5L12 11Z" fill="#ffffff"/>
            <defs>
              <linearGradient id="footerFlask" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c084fc"/>
                <stop offset="100%" stopColor="#6366f1"/>
              </linearGradient>
              <linearGradient id="footerLiquid" x1="7.5" y1="15" x2="16.5" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ec4899"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p>© 2026 Alchemi Productivity Inc. All rights reserved.</p>
        <p>Developed for the Coding Ninjas 10x Vibe2Ship Hackathon</p>
        <p>Powered by Google AI Studio</p>
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
