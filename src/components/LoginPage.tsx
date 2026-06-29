import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Lock, LogIn, LogOut, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string; avatarUrl?: string }) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  user: { name: string; email: string; avatarUrl?: string } | null;
  onNavigate: (page: 'home' | 'login' | 'workspace' | 'insights') => void;
}

export default function LoginPage({ onLogin, onLogout, isLoggedIn, user, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please populate all credential coordinates.');
        return;
      }
      const userData = {
        name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`
      };
      onLogin(userData);
      setSuccessMsg(`Welcome to the circle, ${name}! Your cognitive core is prepared.`);
      setTimeout(() => onNavigate('workspace'), 1500);
    } else {
      if (!email || !password) {
        setErrorMsg('Invalid coordinates. Please enter a valid email and password.');
        return;
      }
      const defaultName = email.split('@')[0];
      const userData = {
        name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
        email,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(defaultName)}`
      };
      onLogin(userData);
      setSuccessMsg('Authentication confirmed. Directing to focus environment...');
      setTimeout(() => onNavigate('workspace'), 1500);
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    // Simulate real Google Sign-In flow
    const googleUser = {
      name: 'Shravani S',
      email: 'shravanis606@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=shravani'
    };
    
    onLogin(googleUser);
    setSuccessMsg('Signed in with Google securely! Syncing tasks to Shravani S...');
    setTimeout(() => onNavigate('workspace'), 1500);
  };

  return (
    <div id="login-dashboard" className="max-w-md w-full mx-auto relative z-10 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 text-center flex flex-col gap-6"
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-display uppercase tracking-wider mt-2">
            {isLoggedIn ? 'Alchemi Profile' : 'Access Command Center'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLoggedIn 
              ? 'Your cognitive parameters are active and synchronized' 
              : 'Sign in to sync focus timelines, track streaks & access AI Coaching'
            }
          </p>
        </div>

        {/* Messaging Feedback Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2 text-left">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Display Active Logged-in Profile if logged in */}
        {isLoggedIn && user ? (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
              <img 
                src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} 
                alt="user avatar" 
                className="w-14 h-14 rounded-xl border border-white/10 bg-indigo-500/10"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-sm font-bold text-white block truncate">{user.name}</span>
                <span className="text-xs text-slate-400 block truncate">{user.email}</span>
                <span className="inline-block mt-1 text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase">
                  ACTIVE SYNC
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onNavigate('workspace')}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:opacity-95 transition shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Go to Workspace Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setSuccessMsg('Logged out successfully. Safe travels!');
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/5"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Account
              </button>
            </div>
          </div>
        ) : (
          /* Normal Sign-in / Sign-up Forms if logged out */
          <div className="flex flex-col gap-4">
            
            {/* 1. Google Single Sign-On Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-extrabold shadow-md hover:bg-slate-50 transition flex items-center justify-center gap-2.5 cursor-pointer border border-slate-200"
            >
              {/* Official Google Color G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#ea4335"
                  d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.92 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.75 2.9C6.15 7.37 8.86 5.04 12 5.04z"
                />
                <path
                  fill="#4285f4"
                  d="M23.49 12.27c0-.81-.07-1.6-.2-2.3H12v4.4h6.43c-.28 1.44-1.1 2.66-2.33 3.48l3.6 2.8c2.1-1.94 3.79-4.8 3.79-8.38z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.25 10.4c-.25-.75-.4-1.55-.4-2.4s.15-1.65.4-2.4L1.5 2.7C.54 4.62 0 6.75 0 9s.54 4.38 1.5 6.3l3.75-2.9z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.9l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.14 0-5.85-2.33-6.75-5.36L1.5 16.02C3.4 19.85 7.35 23 12 23z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Separator */}
            <div className="flex items-center gap-3 my-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex-1 h-px bg-white/10" />
              <span>or use email credentials</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-3.5 text-left">
              {isSignUp && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@domain.com"
                    className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <LogIn className="w-4 h-4" />
                {isSignUp ? 'Activate Alchemi Account' : 'Authenticate Credentials'}
              </button>
            </form>

            {/* Toggle Signin/Signup Link */}
            <div className="text-xs text-slate-400 mt-2">
              {isSignUp ? 'Already have an Alchemi hub?' : 'New to Alchemi?'}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 cursor-pointer"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
