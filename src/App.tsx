import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { AIProvider } from './context/AIContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

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

export const App: React.FC = () => {
  const [isWorkspaceEntered, setIsWorkspaceEntered] = useState(false);

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

        {/* Main Content Layer */}
        <div className="relative z-10 min-h-screen">
          {isWorkspaceEntered ? (
            <Dashboard />
          ) : (
            <LandingPage onEnter={() => setIsWorkspaceEntered(true)} />
          )}
        </div>
      </AIProvider>
    </TaskProvider>
  );
};

export default App;
