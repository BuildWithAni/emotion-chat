import React from 'react';
import { motion } from 'framer-motion';

const EmotionIndicator = ({ emotion }) => {
  const getLabel = () => {
    switch(emotion) {
      case 'happy': return 'Positive Vibes';
      case 'sad': return 'Feeling Down';
      case 'angry': return 'Frustrated';
      case 'fear': return 'Anxious';
      case 'neutral': return 'Calm';
      default: return 'Observing...';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-1"
    >
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Internal State</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${emotion === 'happy' ? 'bg-green-500' : emotion === 'sad' ? 'bg-blue-500' : emotion === 'angry' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
        <span className="text-sm font-semibold text-slate-300">{getLabel()}</span>
      </div>
    </motion.div>
  );
};

export default EmotionIndicator;