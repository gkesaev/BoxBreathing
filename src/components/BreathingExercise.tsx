import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface BreathingExerciseProps {
  onComplete: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [currentBreath, setCurrentBreath] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const totalBreaths = 6;

  const phaseLabels = {
    inhale: 'Inhale…',
    hold1: 'Hold…',
    exhale: 'Exhale…',
    hold2: 'Hold…'
  };

  const squareSize = 300;
  const dotSize = 12;
  const borderWidth = 2; // Account for border thickness

  // Calculate dot position based on phase and progress
  const getDotPosition = (phase: typeof currentPhase, progress: number) => {
    // Adjust for dot size so it appears centered on the border
    const halfDot = dotSize / 2;
    const adjustedSize = squareSize - borderWidth;

    switch (phase) {
      case 'inhale': // Top edge (left → right)
        return {
          x: (progress * adjustedSize) - halfDot + borderWidth,
          y: -halfDot + borderWidth
        };
      case 'hold1': // Right edge (top → bottom)
        return {
          x: adjustedSize - halfDot + borderWidth,
          y: (progress * adjustedSize) - halfDot + borderWidth
        };
      case 'exhale': // Bottom edge (right → left)
        return {
          x: adjustedSize - (progress * adjustedSize) - halfDot + borderWidth,
          y: adjustedSize - halfDot + borderWidth
        };
      case 'hold2': // Left edge (bottom → top)
        return {
          x: -halfDot + borderWidth,
          y: adjustedSize - (progress * adjustedSize) - halfDot + borderWidth
        };
      default:
        return { x: -halfDot + borderWidth, y: -halfDot + borderWidth };
    }
  };

  useEffect(() => {
    const phases: Array<typeof currentPhase> = ['inhale', 'hold1', 'exhale', 'hold2'];
    let phaseIndex = 0;
    let breathCount = 1;
    let startTime = Date.now();
    const phaseDuration = 4000; // 4 seconds per phase

    const updateAnimation = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / phaseDuration, 1);

      setPhaseProgress(progress);

      if (progress >= 1) {
        // Move to next phase
        phaseIndex++;
        startTime = now;

        if (phaseIndex >= phases.length) {
          phaseIndex = 0;
          breathCount++;
          setCurrentBreath(breathCount);

          if (breathCount > totalBreaths) {
            setTimeout(onComplete, 1000);
            return;
          }
        }

        setCurrentPhase(phases[phaseIndex]);
        setPhaseProgress(0);
      }

      requestAnimationFrame(updateAnimation);
    };

    const animationId = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onComplete]);

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
        {/* Square outline */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative border-2 border-teal-400/60 rounded-lg shadow-2xl"
          style={{
            width: squareSize,
            height: squareSize,
            filter: 'drop-shadow(0 0 20px rgba(56, 178, 172, 0.3))',
          }}
        >
          {/* Animated dot */}
          <motion.div
            className="absolute w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full shadow-lg"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(56, 178, 172, 0.8))',
              ...getDotPosition(currentPhase, phaseProgress),
            }}
          />
        </motion.div>

        {/* Phase guidance text */}
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-2xl text-slate-600 font-light">
            {phaseLabels[currentPhase]}
          </p>
        </motion.div>
      </div>

      {/* Breath counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 text-slate-500"
      >
        <p>Breath {currentBreath} of {totalBreaths}</p>
      </motion.div>
    </motion.div>
  );
}
