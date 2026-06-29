import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, AlertCircle, Info, LogIn } from 'lucide-react';

interface HeaderProps {
  totalTasks: number;
  completedToday: number;
  hasApiKey: boolean;
  currentPage: 'home' | 'login' | 'workspace' | 'insights' | 'guide';
  onNavigate: (page: 'home' | 'login' | 'workspace' | 'insights' | 'guide') => void;
  isLoggedIn: boolean;
  user: { name: string; email: string; avatarUrl?: string } | null;
  onLogout: () => void;
}

export default function Header({
  totalTasks,
  completedToday,
  hasApiKey,
  currentPage,
  onNavigate,
  isLoggedIn,
  user,
  onLogout
}: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header id="app-header" className="relative z-50 bg-[#060814]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
      {/* Branding - Clean Uppercase Text Logo */}
      <div className="flex items-center justify-between xl:justify-start gap-4">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate('home')}>
          <span className="text-xl font-black tracking-widest text-white font-display uppercase">
            ALCH<span className="text-[#c084fc]">EMI</span>
          </span>
        </div>

        {/* Mini profile or sign-in on mobile/tablet */}
        <div className="xl:hidden flex items-center gap-2">
          {isLoggedIn && user ? (
            <img 
              onClick={() => onNavigate('login')}
              src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} 
              alt="avatar" 
              className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer"
              referrerPolicy="no-referrer"
            />
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-3 py-1.5 bg-[#151729] border border-white/10 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main Multi-Dashboard Interactive Navigation from screenshot */}
      <nav className="flex items-center justify-center gap-8 self-center xl:self-auto relative z-20">
        {[
          { id: 'home', label: 'Home' },
          { id: 'workspace', label: 'Features' },
          { id: 'insights', label: 'How It Works' },
          { id: 'guide', label: 'Guide' }
        ].map(navItem => {
          const isActive = currentPage === navItem.id;
          return (
            <div key={navItem.id} className="relative py-2">
              <button
                onClick={() => onNavigate(navItem.id as any)}
                className={`text-[13px] font-bold tracking-wide transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {navItem.label}
              </button>
              {isActive && (
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#c084fc] rounded-full shadow-[0_0_8px_#c084fc]" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Controls: Date/Time + Sign In / Session controller */}
      <div className="flex flex-wrap items-center gap-4 xl:gap-6 text-sm text-slate-300 justify-between xl:justify-end">
        {/* Date & Time displayed cleanly */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-[11px] text-slate-300">{formatDate(time)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px] text-slate-300 font-medium">{formatTime(time)}</span>
          </div>
        </div>

        {/* User Session Controller */}
        <div className="relative">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-[#151729]/80 border border-white/5 hover:border-white/20 p-1.5 pr-3 rounded-xl transition cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left hidden md:block">
                  <span className="text-xs font-bold text-white block leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-500 block">Verified User</span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-12 w-48 bg-[#0b0f19] border border-white/10 shadow-2xl rounded-xl p-2 z-50 flex flex-col gap-1">
                  <div className="px-3 py-1.5 border-b border-white/5 mb-1 text-left">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Logged In As:</span>
                    <span className="text-xs font-bold text-slate-200 truncate block">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('workspace');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    Go to Workspace
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('insights');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                  >
                    View Analytics Insights
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowDropdown(false);
                      onNavigate('home');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-[#ffe4e6]/5 hover:text-rose-300 rounded-lg cursor-pointer border-t border-white/5 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 bg-[#0e0f1e]/80 border border-white/10 text-white text-[13px] font-bold rounded-xl hover:bg-white/5 transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <LogIn className="w-4 h-4 text-slate-300" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
