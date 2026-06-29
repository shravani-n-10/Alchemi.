import React from 'react';
import { Sparkles, Calendar, Compass, Layers, Zap, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

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
          <strong>Meet Alchemi — Your AI Productivity Companion</strong><br />
          Plans your day, predicts deadline risks, breaks work into actionable steps, and helps you finish before it's too late. It calculates your urgency using a dynamic <span className="text-pink">Panic Index</span> and generates <span className="text-cyan">AI Starter Drafts</span> so you can begin working immediately.
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

        {/* Dynamic Live Product Preview Card */}
        <div className="mock-briefing-card animate-fadeIn">
          <div className="mock-briefing-header">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            🟣 AI Daily Briefing
          </div>
          <h4 className="mock-briefing-title">Good Morning 👋</h4>
          
          <div className="mock-briefing-risk-row">
            <span className="mock-briefing-risk-label">TODAY'S DEADLINE RISK</span>
            <span className="mock-briefing-risk-value">HIGH (86%)</span>
          </div>

          <div className="mock-briefing-task-box">
            <h5 className="mock-briefing-task-title">🔥 DBMS Assignment</h5>
            <span className="mock-briefing-task-due">Due: Tomorrow at 10:00 AM</span>
            
            <p className="mock-briefing-recommendation">
              <strong>Recommendation:</strong> Start now. Estimated efforts require 2h 15m. Delaying this past 6:00 PM today raises risk to critical levels.
            </p>
          </div>

          <button onClick={onStart} className="glass-btn glass-btn-primary w-full justify-center py-2.5 text-xs">
            Start Focus Session
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="landing-section relative z-20">
        <div className="section-header">
          <h3 className="section-title">How Alchemi Helps You Execute</h3>
          <p className="section-subtitle">
            Three autonomous AI agents coordinate in the background to streamline your execution and protect your focus.
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

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-section relative z-20">
        <div className="section-header">
          <h3 className="section-title">The Execution Pipeline</h3>
          <p className="section-subtitle">
            How Alchemi transforms chaotic, last-minute panic into structured, step-by-step progress.
          </p>
        </div>

        <div className="workflow-timeline">
          <div className="workflow-step">
            <div className="workflow-step-number">01</div>
            <span className="workflow-step-title">Add Goals</span>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number" style={{ borderColor: 'var(--color-warning)' }}>02</div>
            <span className="workflow-step-title">AI Computes Panic Index</span>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number" style={{ borderColor: 'var(--color-urgent)' }}>03</div>
            <span className="workflow-step-title">AI Generates Plan & Drafts</span>
          </div>
          <div className="workflow-step">
            <div className="workflow-step-number" style={{ borderColor: 'var(--color-critical)' }}>04</div>
            <span className="workflow-step-title">Execute in Focus Mode</span>
          </div>
        </div>
      </section>

      {/* Why Alchemi Section */}
      <section id="why-alchemi" className="landing-section relative z-20">
        <div className="section-header">
          <h3 className="section-title">Why Alchemi?</h3>
          <p className="section-subtitle">
            Most to-do lists are passive dumpsters of tasks. Alchemi is an active execution assistant.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature Capability</th>
                <th>Traditional To-Do Apps</th>
                <th>Alchemi OS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Task Reminders</strong></td>
                <td className="comparison-traditional">Static reminders</td>
                <td className="comparison-alchemi">Dynamic adaptive planning</td>
              </tr>
              <tr>
                <td><strong>Prioritization</strong></td>
                <td className="comparison-traditional">Manual ranking</td>
                <td className="comparison-alchemi">AI energy & deadline indexation</td>
              </tr>
              <tr>
                <td><strong>Daily Scheduling</strong></td>
                <td className="comparison-traditional">Fixed times (rigid)</td>
                <td className="comparison-alchemi">Continuous calendar block replanning</td>
              </tr>
              <tr>
                <td><strong>Deadline Risk Analysis</strong></td>
                <td className="comparison-traditional">No risk prediction</td>
                <td className="comparison-alchemi">Proactive warning indicators</td>
              </tr>
              <tr>
                <td><strong>Decision Guidance</strong></td>
                <td className="comparison-traditional">User decides everything</td>
                <td className="comparison-alchemi">AI recommends immediate next actions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Agent Section */}
      <section id="agents" className="landing-section relative z-20">
        <div className="section-header">
          <h3 className="section-title">Meet the Alchemi Agent Network</h3>
          <p className="section-subtitle">
            Five specialized autonomous agents coordinate in the background to handle the planning, scheduling, and risk assessment.
          </p>
        </div>

        <div className="agents-chain">
          <div className="agent-node">
            <div className="agent-node-icon" style={{ borderColor: '#3b82f6' }}>🧠</div>
            <span className="agent-node-name">Planner Agent</span>
          </div>
          <div className="agent-node">
            <div className="agent-node-icon" style={{ borderColor: '#f59e0b' }}>🔥</div>
            <span className="agent-node-name">Prioritizer Agent</span>
          </div>
          <div className="agent-node">
            <div className="agent-node-icon" style={{ borderColor: '#ef4444' }}>⚠</div>
            <span className="agent-node-name">Risk Predictor</span>
          </div>
          <div className="agent-node">
            <div className="agent-node-icon" style={{ borderColor: '#10b981' }}>💡</div>
            <span className="agent-node-name">Coach Agent</span>
          </div>
          <div className="agent-node">
            <div className="agent-node-icon" style={{ borderColor: '#a855f7' }}>📊</div>
            <span className="agent-node-name">Reflection Agent</span>
          </div>
        </div>
      </section>

      {/* See It in Action Demo Section */}
      <section id="demo" className="landing-section relative z-20">
        <div className="section-header">
          <h3 className="section-title">See It in Action</h3>
          <p className="section-subtitle">
            Watch how a high-urgency goal is processed from input to completion.
          </p>
        </div>

        <div className="demo-flow-wrapper">
          <div className="demo-step">
            <div className="demo-step-label">1. Goal Input</div>
            <div className="demo-step-value" style={{ color: '#c084fc' }}>React Assignment</div>
          </div>
          <div className="demo-connector"><ArrowRight className="w-5 h-5" /></div>

          <div className="demo-step" style={{ borderColor: 'rgba(236, 72, 153, 0.3)' }}>
            <div className="demo-step-label">2. AI Risk Score</div>
            <div className="demo-step-value" style={{ color: '#ec4899' }}>82% Risk</div>
          </div>
          <div className="demo-connector"><ArrowRight className="w-5 h-5" /></div>

          <div className="demo-step">
            <div className="demo-step-label">3. Deconstruct</div>
            <div className="demo-step-value">6 Subtasks</div>
          </div>
          <div className="demo-connector"><ArrowRight className="w-5 h-5" /></div>

          <div className="demo-step" style={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <div className="demo-step-label">4. Auto-Schedule</div>
            <div className="demo-step-value" style={{ color: '#22d3ee' }}>Today 6:00 PM</div>
          </div>
          <div className="demo-connector"><ArrowRight className="w-5 h-5" /></div>

          <div className="demo-step">
            <div className="demo-step-label">5. Focus Mode</div>
            <div className="demo-step-value">Ambient Noise</div>
          </div>
          <div className="demo-connector"><ArrowRight className="w-5 h-5" /></div>

          <div className="demo-step" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div className="demo-step-label">6. Outcome</div>
            <div className="demo-step-value" style={{ color: '#10b981' }}>Completed 🎉</div>
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
        
        <div className="footer-links">
          <a href="https://github.com/shravani-n-10/Alchemi." target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="#features" className="footer-link">Features</a>
          <a href="#how-it-works" className="footer-link">How It Works</a>
          <a href="#why-alchemi" className="footer-link">Why Us</a>
          <a href="#agents" className="footer-link">AI Agents</a>
        </div>

        <p>© 2026 Alchemi Productivity Inc. All Rights Reserved.</p>
        <p>Developed for the Coding Ninjas 10x Vibe2Ship Hackathon. Powered by Google AI Studio.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
