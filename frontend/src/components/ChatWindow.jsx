import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, AlertTriangle, CloudRain, Zap, Activity } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, isTyping, currentEmotion }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col gap-8 pb-10 min-h-full transition-all duration-700">
      
      {/* Intro Message / Welcome */}
      <div className="w-full text-center space-y-3 opacity-20 hover:opacity-100 transition duration-500 cursor-default">
           <div className="flex justify-center gap-1 text-[10px] items-center text-slate-500 font-bold uppercase tracking-[.25em]">
                <Activity size={10} /> INITIALIZING SENSORS
           </div>
           <p className="text-xs text-slate-600 font-medium">Chat is encrypted and session-based.</p>
      </div>

      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className="max-w-[85%] relative group">
                    {msg.sender === 'bot' && (
                        <div className="absolute -top-6 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
                             <div className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/10">ANALYZED: {msg.emotion}</div>
                        </div>
                    )}
                    
                    <div className={`
                        px-5 py-3.5 rounded-3xl shadow-xl transition-all duration-300 border
                        ${msg.sender === 'user' 
                          ? 'bg-blue-600 text-white border-blue-500/20 rounded-tr-none hover:shadow-blue-600/20' 
                          : 'bg-slate-800/80 text-slate-100 backdrop-blur-md border-white/5 rounded-tl-none hover:shadow-black/20'}
                    `}>
                        <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                    </div>
                    
                    {msg.sender === 'user' && (
                        <div className="flex justify-end mt-1.5 px-1 opacity-0 group-hover:opacity-40 transition-opacity">
                            <span className="text-[10px] text-slate-500 font-bold">SENT</span>
                        </div>
                    )}
                </div>
            </motion.div>
        ))}
      </AnimatePresence>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-start"
        >
          <div className="bg-slate-800/80 backdrop-blur-md border border-white/5 px-6 py-4 rounded-3xl rounded-tl-none shadow-xl flex gap-1.5 items-center">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-0"></div>
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </motion.div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatWindow;