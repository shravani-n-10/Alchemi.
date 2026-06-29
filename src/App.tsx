import React, { useState, useEffect, useRef } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AIProvider, useAI } from './context/AIContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { 
  LogIn, 
  LogOut, 
  Settings as SettingsIcon, 
  BarChart2, 
  VolumeX, 
  MoreVertical, 
  Globe,
  LayoutDashboard,
  HelpCircle,
  BookOpen
} from 'lucide-react';

// Generate static list of random sparkles once to avoid re-rendering flashes
const sparklesArray = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 7}s`,
  scale: 0.4 + Math.random() * 0.8,
}));

const starsArray = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${8 + Math.random() * 8}s`,
  scale: 0.5 + Math.random() * 0.8,
  char: Math.random() > 0.5 ? '✦' : '★',
}));



const AppContent: React.FC = () => {
  const { userProfile, logout } = useTasks();
  const { isSpeaking, stopSpeaking } = useAI();
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'guide' | 'dashboard' | 'analytics'>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync page with login status
  useEffect(() => {
    if (userProfile.isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, [userProfile.isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10 text-text-primary">
      {/* Global Glassmorphic Navbar */}
      <header className="navbar">
        {/* Left Side: Brand Logo */}
        <div className="navbar-logo" onClick={() => setCurrentPage(userProfile.isLoggedIn ? 'dashboard' : 'home')}>
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H15M10 3V8.462L5.277 17.908C4.55 19.362 5.606 21 7.231 21H16.769C18.394 21 19.45 19.362 18.723 17.908L14 8.462V3" stroke="url(#navFlask)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 16.5C9.5 14.5 10.5 18.5 12.5 16.5C14.5 14.5 15.5 18.5 16.5 16.5" stroke="url(#navLiquid)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 11L12.5 12.5L14 13L12.5 13.5L12 15L11.5 13.5L10 13L11.5 12.5L12 11Z" fill="#ffffff"/>
            <defs>
              <linearGradient id="navFlask" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c084fc"/>
                <stop offset="100%" stopColor="#6366f1"/>
              </linearGradient>
              <linearGradient id="navLiquid" x1="7.5" y1="15" x2="16.5" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ec4899"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <h1>ALCHEMI</h1>
          </div>
        </div>

        {/* Right Side: Navigation Links & Actions grouped together */}
        <div className="navbar-right">
          <nav className="navbar-links">
            {!userProfile.isLoggedIn ? (
              <>
                <button 
                  onClick={() => setCurrentPage('home')} 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                >
                  About Us
                </button>
                <button 
                  onClick={() => setCurrentPage('guide')} 
                  className={`nav-link ${currentPage === 'guide' ? 'active' : ''}`}
                >
                  Guide / Info
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentPage('dashboard')} 
                  className={`nav-link flex items-center gap-1.5 ${currentPage === 'dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Workspace
                </button>
                <button 
                  onClick={() => setCurrentPage('analytics')} 
                  className={`nav-link flex items-center gap-1.5 ${currentPage === 'analytics' ? 'active' : ''}`}
                >
                  <BarChart2 className="w-3.5 h-3.5" /> Reflection
                </button>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className={`nav-link flex items-center gap-1.5 ${currentPage === 'about' ? 'active' : ''}`}
                >
                  <Globe className="w-3.5 h-3.5" /> About
                </button>
                <button 
                  onClick={() => setCurrentPage('guide')} 
                  className={`nav-link flex items-center gap-1.5 ${currentPage === 'guide' ? 'active' : ''}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Guide
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-lg hover:bg-black/5 text-pink-500 flex items-center gap-1.5 text-xs font-semibold animate-pulse"
                title="Stop AI Speech"
              >
                <VolumeX className="w-4 h-4" /> Speaking
              </button>
            )}

            {!userProfile.isLoggedIn ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="glass-btn text-xs py-1.5 px-4 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            ) : (
              <div className="flex items-center gap-2.5 pl-3 border-l border-white/10 relative" ref={dropdownRef}>
                <img
                  src={userProfile.avatarUrl || 'https://i.pravatar.cc/150'}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full border border-violet-500/20 object-cover shadow-inner"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold block leading-none text-text-primary">{userProfile.name}</span>
                  <span className="text-[9px] text-text-muted mt-0.5 block leading-none">{userProfile.email}</span>
                </div>

                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-text-secondary hover:text-text-primary transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-12 w-48 rounded-xl bg-slate-950/95 border border-white/10 shadow-2xl p-1.5 z-50 backdrop-blur-md animate-fadeIn">
                    <button
                      onClick={() => {
                        setCurrentPage('about');
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                    >
                      <Globe className="w-3.5 h-3.5" /> About Us
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('guide');
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Guide / Info
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" /> Account Settings
                    </button>
                    <div className="h-px bg-white/5 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Pages Content router */}
      <div className="flex-1 flex flex-col">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <LandingPage onEnter={() => setCurrentPage('dashboard')} showModal={showAuthModal} onCloseModal={() => setShowAuthModal(false)} />
        )}

        {/* ABOUT PAGE */}
        {currentPage === 'about' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="glass-panel p-8 space-y-6 border-violet-500/10 shadow-2xl">
              <h3 className="text-2xl font-bold heading-outfit flex items-center justify-center gap-2.5">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H15M10 3V8.462L5.277 17.908C4.55 19.362 5.606 21 7.231 21H16.769C18.394 21 19.45 19.362 18.723 17.908L14 8.462V3" stroke="url(#aboutFlask)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 16.5C9.5 14.5 10.5 18.5 12.5 16.5C14.5 14.5 15.5 18.5 16.5 16.5" stroke="url(#aboutLiquid)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 11L12.5 12.5L14 13L12.5 13.5L12 15L11.5 13.5L10 13L11.5 12.5L12 11Z" fill="#ffffff"/>
                  <defs>
                    <linearGradient id="aboutFlask" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#c084fc"/>
                      <stop offset="100%" stopColor="#6366f1"/>
                    </linearGradient>
                    <linearGradient id="aboutLiquid" x1="7.5" y1="15" x2="16.5" y2="18" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ec4899"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg> About Alchemi
              </h3>
              <div className="space-y-4 text-sm text-text-secondary leading-relaxed text-left">
                <p>
                  <strong>Alchemi</strong> is an AI-powered Productivity Operating System designed specifically to prevent missed deadlines through proactive, agentic planning.
                </p>
                <p>
                  Instead of simple checklists that wait for you to look at them, Alchemi coordinates a network of specialized AI agents:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Prioritizer Agent</strong>: Tracks your energy and computes the dynamic Panic Index.</li>
                  <li><strong>Planner Agent</strong>: Auto-schedules your tasks into a 24-hour timeline.</li>
                  <li><strong>Risk Predictor</strong>: Forecasts deadline delays in the background.</li>
                  <li><strong>Recovery Agent</strong>: Proposes instant de-scoping and rescheduling interventions.</li>
                </ul>
                <p>
                  Built for the 10x Vibe2Ship Hackathon, Alchemi is powered by Google AI Studio's Gemini 1.5 Flash model.
                </p>
              </div>
              <button
                onClick={() => setCurrentPage(userProfile.isLoggedIn ? 'dashboard' : 'home')}
                className="glass-btn glass-btn-primary py-2.5 px-6 text-xs"
              >
                Go to {userProfile.isLoggedIn ? 'Workspace' : 'Home'}
              </button>
            </div>
          </div>
        )}

        {/* GUIDE PAGE */}
        {currentPage === 'guide' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto text-center space-y-6">
            <div className="glass-panel p-8 space-y-6 border-violet-500/10 shadow-2xl text-left">
              <h3 className="text-2xl font-bold heading-outfit mb-2 flex items-center gap-2 text-center justify-center">
                <BookOpen className="w-6 h-6 text-violet-400" /> Alchemi User Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs">1</span>
                    Panic Index Formula
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Urgency is computed dynamically as: `(Effort / Time Remaining) * Energy Multiplier`. If you set your energy to "Low" (you are tired), task urgency scores will spike and cards will glow brighter to prevent procrastination.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs">2</span>
                    Voice-Enabled Coach
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Click the pulsing **AI Core** in the right column. When it turns yellow, speak clearly. Try saying: <em>"Give me a pep talk"</em> or ask a question. The coach will speak back to you using text-to-speech.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs">3</span>
                    Briefings & Starter Assets
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    When you create a task, Alchemi generates subtasks and an **AI Starter Asset** (e.g., slide outlines, email drafts, code boilerplates). Click the copy icon in the planner to use them instantly.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs">4</span>
                    Immersive Focus Mode
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Click **"Start Focus Session"** on any task to enter full-screen focus. Toggle **Rain** or **Brown Noise** to synthesize focus frequencies. Click **"Complete Milestone"** to trigger a confetti explosion.
                  </p>
                </div>
              </div>
              <div className="text-center pt-4">
                <button
                  onClick={() => setCurrentPage(userProfile.isLoggedIn ? 'dashboard' : 'home')}
                  className="glass-btn glass-btn-primary py-2.5 px-6 text-xs"
                >
                  Go to {userProfile.isLoggedIn ? 'Workspace' : 'Home'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE (DASHBOARD) */}
        {currentPage === 'dashboard' && userProfile.isLoggedIn && (
          <Dashboard />
        )}

        {/* REFLECTION & ANALYTICS */}
        {currentPage === 'analytics' && userProfile.isLoggedIn && (
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="max-w-4xl w-full h-[80vh]">
              <Analytics onClose={() => setCurrentPage('dashboard')} />
            </div>
          </div>
        )}
      </div>

      {/* Account Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <AIProvider>
        {/* Background Sparkles & Stars Container */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {sparklesArray.map((sparkle) => (
            <div
              key={`sparkle-${sparkle.id}`}
              className="sparkle"
              style={{
                left: sparkle.left,
                animationDelay: sparkle.delay,
                animationDuration: sparkle.duration,
                transform: `scale(${sparkle.scale})`,
              }}
            />
          ))}
          {starsArray.map((star) => (
            <div
              key={`star-${star.id}`}
              className="sparkle-star"
              style={{
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration,
                transform: `scale(${star.scale})`,
              }}
            >
              {star.char}
            </div>
          ))}
        </div>

        {/* Main Routed Content */}
        <AppContent />
      </AIProvider>
    </TaskProvider>
  );
};

export default App;
