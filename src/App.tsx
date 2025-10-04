import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';

type AppState = 'idle' | 'countdown' | 'breathing' | 'complete';

const breathingInstructions = ['Inhale', 'Hold', 'Exhale', 'Hold'];
const squareSize = 500;

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentSide, setCurrentSide] = useState(0);
  const [sideProgress, setSideProgress] = useState(0);
  const [sideCountdown, setSideCountdown] = useState(4);
  const animationRef = useRef<number | null>(null);

  const totalRounds = 3;
  const sidesDuration = 4000; // 4 seconds per side

  // Get dot position based on current side and progress
  const getDotPosition = (side: number, progress: number) => {
    const progressAlongSide = progress;

    switch (side) {
      case 0: // Top: left to right
        return {
          x: progressAlongSide * squareSize,
          y: 0
        };
      case 1: // Right: top to bottom
        return {
          x: squareSize,
          y: progressAlongSide * squareSize
        };
      case 2: // Bottom: right to left
        return {
          x: squareSize - (progressAlongSide * squareSize),
          y: squareSize
        };
      case 3: // Left: bottom to top
        return {
          x: 0,
          y: squareSize - (progressAlongSide * squareSize)
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  // Handle initial countdown (3, 2, 1)
  useEffect(() => {
    if (state === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setState('breathing');
        setCurrentRound(1);
        setCurrentSide(0);
        setSideProgress(0);
        setSideCountdown(4);
      }
    }
  }, [state, countdown]);

  // Handle breathing animation
  useEffect(() => {
    if (state !== 'breathing') return;

    const startTime = Date.now();

    const updateBreathing = () => {
      const elapsed = Date.now() - startTime;
      const totalElapsed = elapsed + (currentRound - 1) * 16000 + currentSide * 4000;

      // Calculate progress within current side (0-1)
      const currentSideElapsed = elapsed % sidesDuration;
      const progress = Math.min(currentSideElapsed / sidesDuration, 1);

      setSideProgress(progress);

      // Update side countdown (4, 3, 2, 1)
      const newSideCountdown = Math.max(1, 4 - Math.floor(progress * 4));
      setSideCountdown(newSideCountdown);

      // Check if side is complete
      if (elapsed >= sidesDuration) {
        const nextSide = (currentSide + 1) % 4;
        const nextRound = nextSide === 0 ? currentRound + 1 : currentRound;

        if (nextRound > totalRounds) {
          setState('complete');
          return;
        }

        setCurrentSide(nextSide);
        setCurrentRound(nextRound);
        setSideProgress(0);
        setSideCountdown(4);
        return;
      }

      animationRef.current = requestAnimationFrame(updateBreathing);
    };

    animationRef.current = requestAnimationFrame(updateBreathing);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, currentSide, currentRound]);

  const handleStart = () => {
    setState('countdown');
    setCountdown(3);
  };

  const handleRestart = () => {
    setState('idle');
    setCurrentRound(0);
    setCurrentSide(0);
    setSideProgress(0);
  };

  const dotPosition = getDotPosition(currentSide, sideProgress);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #581c87, #1e3a8a, #0f766e)',
      }}
    >
      {/* Animated magical background overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-teal-500/40 animate-pulse"></div>
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3), rgba(6, 182, 212, 0.3))",
                "linear-gradient(225deg, rgba(236, 72, 153, 0.3), rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3))",
                "linear-gradient(315deg, rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.4), transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.4), transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.4), transparent 50%)",
                "radial-gradient(circle at 60% 30%, rgba(147, 51, 234, 0.4), transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Enhanced floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'bg-cyan-300/40' : i % 3 === 1 ? 'bg-purple-300/40' : 'bg-pink-300/40'
          }`}
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${5 + Math.random() * 90}%`,
            top: '110%',
          }}
          animate={{
            y: [-30, -150],
            x: [0, Math.random() * 120 - 60],
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.2, 0.3],
            rotate: [0, 360]
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Swirling wave effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: `conic-gradient(from ${i * 120}deg, transparent, rgba(${i === 0 ? '147, 51, 234' : i === 1 ? '6, 182, 212' : '236, 72, 153'}, 0.2), transparent)`,
            borderRadius: '50%'
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* The magical square */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: state === 'idle'
              ? [0.95, 1.05, 0.95]
              : state === 'breathing'
                ? [1, 1.02, 1]
                : 1,
            opacity: 1
          }}
          transition={{
            scale: {
              duration: state === 'idle' ? 5 : 4,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { duration: 1 }
          }}
          className="relative"
          style={{
            width: squareSize,
            height: squareSize,
          }}
        >
          {/* Square border with magical glow - EXACTLY match dot path */}
          <motion.div
            className="absolute"
            animate={{
              boxShadow: state === 'idle'
                ? [
                    '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)',
                    '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.8)',
                    '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)'
                  ]
                : '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8)'
            }}
            transition={{
              boxShadow: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              border: '12px solid #FFFFFF',
            }}
          />

          {/* Countdown numbers */}
          <AnimatePresence mode="wait">
            {state === 'countdown' && countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center text-6xl font-light text-white"
                style={{ textShadow: '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8)' }}
              >
                {countdown}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breathing dot - make it more visible and aligned with border */}
          {state === 'breathing' && (
            <motion.div
              className="absolute rounded-full z-20"
              style={{
                width: '24px',
                height: '24px',
                left: dotPosition.x - 12,
                top: dotPosition.y - 12,
                background: '#FF2D9E',
                boxShadow: `
                  0 0 30px rgba(255, 45, 158, 0.9),
                  0 0 60px rgba(255, 45, 158, 0.6)
                `,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {/* Instruction text and countdown - PERFECTLY CENTERED inside the square */}
          <AnimatePresence mode="wait">
            {state === 'breathing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className="text-center space-y-4 px-4 flex flex-col items-center justify-center">
                  <motion.h2
                    key={`${currentRound}-${currentSide}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-light text-white"
                    style={{ textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)' }}
                  >
                    {breathingInstructions[currentSide]}
                  </motion.h2>
                  <motion.div
                    key={`countdown-${sideCountdown}`}
                    initial={{ scale: 1.3, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-light text-white mt-2 mb-2"
                    style={{ textShadow: '0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.8)' }}
                  >
                    {sideCountdown}
                  </motion.div>
                  <p className="text-sm text-white/80 mt-2" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}>
                    Round {currentRound} of {totalRounds}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Start button */}
        {state === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleStart}
              size="lg"
              className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
              }}
            >
              Start
            </Button>
          </motion.div>
        )}

        {/* Completion state */}
        {state === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-light text-cyan-200" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}>
              Well done
            </h2>
            <p className="text-cyan-300/80 leading-relaxed">
              Take a moment to notice how you feel.
            </p>
            <Button
              onClick={handleRestart}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
              }}
            >
              Restart
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
