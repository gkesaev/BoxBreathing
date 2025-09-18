import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface CountdownPhaseProps {
  onComplete: () => void;
}

export function CountdownPhase({ onComplete }: CountdownPhaseProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-teal-100 to-green-100"
      style={{
        background: `
          linear-gradient(45deg, 
            rgba(147, 197, 253, 0.3) 0%, 
            rgba(134, 239, 172, 0.3) 50%, 
            rgba(196, 181, 253, 0.3) 100%
          )
        `
      }}
    >
      <div className="text-center space-y-8">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-8xl font-light text-slate-600"
        >
          {count > 0 ? count : ""}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 text-lg"
        >
          Get ready to breathe…
        </motion.p>
      </div>
    </motion.div>
  );
}