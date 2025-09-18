import { motion } from "motion/react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-blue-50 to-purple-100"
    >
      <div className="text-center space-y-8 px-6 max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-light text-slate-700 mb-4">
            Box Breathing
          </h1>
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <p>A simple breathing exercise to calm your mind and body.</p>
            <p>Inhale → Hold → Exhale → Hold. Each for 4 counts.</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-12 py-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}