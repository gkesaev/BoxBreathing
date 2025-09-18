import { motion } from "motion/react";
import { Button } from "./ui/button";

interface SessionCompleteProps {
  onRestart: () => void;
  onExit: () => void;
}

export function SessionComplete({ onRestart, onExit }: SessionCompleteProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-blue-100"
    >
      <div className="text-center space-y-8 px-6 max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-6xl"
          >
            ✨
          </motion.div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-light text-slate-700">
              Well done
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Take a moment to notice how you feel.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Button
            onClick={onRestart}
            variant="default"
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Restart
          </Button>
          
          <Button
            onClick={onExit}
            variant="outline"
            className="px-8 py-3 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-full transition-all duration-300"
          >
            Exit
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}