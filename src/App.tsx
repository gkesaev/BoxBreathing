import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/LandingPage';
import { CountdownPhase } from './components/CountdownPhase';
import { BreathingExercise } from './components/BreathingExercise';
import { SessionComplete } from './components/SessionComplete';

type AppPhase = 'landing' | 'countdown' | 'breathing' | 'complete';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('landing');

  const handleStart = () => {
    setCurrentPhase('countdown');
  };

  const handleCountdownComplete = () => {
    setCurrentPhase('breathing');
  };

  const handleBreathingComplete = () => {
    setCurrentPhase('complete');
  };

  const handleRestart = () => {
    setCurrentPhase('countdown');
  };

  const handleExit = () => {
    setCurrentPhase('landing');
  };

  return (
    <div className="size-full relative">
      <AnimatePresence mode="wait">
        {currentPhase === 'landing' && (
          <motion.div key="landing">
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}
        
        {currentPhase === 'countdown' && (
          <motion.div key="countdown">
            <CountdownPhase onComplete={handleCountdownComplete} />
          </motion.div>
        )}
        
        {currentPhase === 'breathing' && (
          <motion.div key="breathing">
            <BreathingExercise onComplete={handleBreathingComplete} />
          </motion.div>
        )}
        
        {currentPhase === 'complete' && (
          <motion.div key="complete">
            <SessionComplete onRestart={handleRestart} onExit={handleExit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}