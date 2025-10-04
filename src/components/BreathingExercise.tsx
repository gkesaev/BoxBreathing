import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface BreathingExerciseProps {
  onComplete: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [currentBreath, setCurrentBreath] = useState(1);
  const [progress, setProgress] = useState(0);
  const totalBreaths = 6;

  const boxSize = 300;

  // Simple dot position calculation - travels around the perimeter
  const getDotPosition = (progress: number) => {
    const sideProgress = (progress * 4) % 1;
    const side = Math.floor(progress * 4) % 4;

    switch (side) {
      case 0: // Top: left to right (center on top border)
        return { x: sideProgress * boxSize, y: -1 };
      case 1: // Right: top to bottom (center on right border)
        return { x: boxSize - 3, y: sideProgress * boxSize };
      case 2: // Bottom: right to left (center on bottom border)
        return { x: boxSize - (sideProgress * boxSize) - 5, y: boxSize - 3 };
      case 3: // Left: bottom to top (center on left border)
        return { x: -2, y: boxSize - (sideProgress * boxSize) - 1 };
      default:
        return { x: -1, y: -1 };
    }
  };

  useEffect(() => {
    if (isCountingDown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIsCountingDown(false);
      }
    }
  }, [isCountingDown, countdown]);

  useEffect(() => {
    if (isCountingDown) return;

    let breathCount = 1;
    let startTime = Date.now();
    const cycleDuration = 16000; // 16 seconds total (4 seconds per side)

    const updateAnimation = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

      setProgress(cycleProgress);

      // Debug logging
      console.log('Progress:', cycleProgress, 'Dot position:', getDotPosition(cycleProgress));

      // Complete breath cycle every 16 seconds
      if (elapsed >= cycleDuration) {
        breathCount++;
        setCurrentBreath(breathCount);
        startTime = now;

        if (breathCount > totalBreaths) {
          setTimeout(onComplete, 1000);
          return;
        }
      }

      requestAnimationFrame(updateAnimation);
    };

    const animationId = requestAnimationFrame(updateAnimation);
    return () => cancelAnimationFrame(animationId);
  }, [isCountingDown, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(45deg, rgba(56, 178, 172, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(34, 197, 94, 0.1))`,
      }}
    >
      {/* Floating particles for ambiance */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [-20, -100],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 8,
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: '100%',
          }}
        />
      ))}

      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
          style={{
            width: boxSize,
            height: boxSize,
            border: '2px solid rgba(56, 178, 172, 0.8)',
            filter: 'drop-shadow(0 0 20px rgba(56, 178, 172, 0.3))',
          }}
        >
          {isCountingDown ? (
            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: '#374151',
                fontSize: '60px',
                fontWeight: '300',
              }}
            >
              {countdown > 0 ? countdown : "Begin"}
            </motion.div>
          ) : (
            <div
              className="absolute bg-red-500 rounded-full z-50"
              style={{
                width: '20px',
                height: '20px',
                left: getDotPosition(progress).x - 10,
                top: getDotPosition(progress).y - 10,
                boxShadow: '0 0 20px rgba(239, 68, 68, 1)',
                border: '2px solid white',
              }}
            />
          )}
        </motion.div>
      </div>

      {!isCountingDown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-20 text-slate-600 font-light"
        >
          <p>Breath {currentBreath} of {totalBreaths}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
