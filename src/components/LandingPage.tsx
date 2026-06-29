import React from 'react';
import { Sparkles, Calendar, ChevronRight, Compass } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
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
            onClick={onStart}
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
        <p>© 2026 Alchemi Productivity Inc. All Rights Reserved.</p>
        <p>Developed for the Coding Ninjas 10x Vibe2Ship Hackathon</p>
        <p>Powered by Google AI Studio</p>
      </footer>
    </div>
  );
};

export default LandingPage;
