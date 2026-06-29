import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Sparkles, ArrowLeft } from 'lucide-react';

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
    <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-70px)] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="modal-container animate-fadeIn relative z-10">
        {/* Back button */}
        <button 
          onClick={onBack} 
          className="absolute top-5 left-5 text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-none border-none cursor-pointer outline-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col items-center mt-6">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mb-2">
            {/* Google Icon */}
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
          <h3 className="modal-title">
            Sign in with Google
          </h3>
          <p className="modal-subtitle">
            To continue to your Alchemi Productivity Workspace
          </p>
        </div>

        {/* Quick One-Click Google Login */}
        <button
          onClick={handleDemoLogin}
          className="google-signin-btn"
        >
          One-Click Demo Login (Alex Mercer)
        </button>

        <div className="modal-divider">
          <div className="modal-divider-line"></div>
          <span className="modal-divider-text">Or Customize Account</span>
          <div className="modal-divider-line"></div>
        </div>

        {/* Custom Google Login Form */}
        <form onSubmit={handleCustomLogin} className="flex flex-col items-center w-full">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g., john.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="glass-btn glass-btn-primary w-full justify-center text-xs py-3 mt-2"
          >
            Sign In & Enter Workspace
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
