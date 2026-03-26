import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Camera, Smile, LogIn, Github, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { getResponse } from './api';
import ChatWindow from './components/ChatWindow';

const App = () => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your Emotion-Aware Chatbot. How are you feeling today?", sender: "bot", emotion: "neutral" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [showWebcam, setShowWebcam] = useState(true);
  const webcamRef = useRef(null);

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'fear': return '😨';
      case 'alarmed': return '😲';
      default: return '😐';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { text: inputText, sender: "user", emotion: "neutral" };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    let imageSrc = null;
    if (showWebcam && webcamRef.current) {
        imageSrc = webcamRef.current.getScreenshot();
    }

    // Call API
    const result = await getResponse(inputText, imageSrc);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      text: result.response, 
      sender: "bot", 
      emotion: result.detected_emotion 
    }]);
    
    if (result.detected_emotion) {
       setCurrentEmotion(result.detected_emotion);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#0f172a] font-sans antialiased text-slate-200">
      
      {/* --- Sidebar (Webcam & Sentiment) --- */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 glassmorphism flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800">
        
        <div className="w-full space-y-8">
            <header className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl vibrant-gradient flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Smile className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">EmoChat</h1>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">v1.0.0 Alpha</span>
                </div>
            </header>

            {/* Webcam / Sentiment Feed */}
            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute -inset-1 animated-gradient rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative overflow-hidden rounded-2xl aspect-video bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl">
                        {showWebcam ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="object-cover w-full h-full scale-x-[-1]"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 p-8 text-slate-500">
                                <Camera size={48} className="opacity-20" />
                                <span className="text-sm font-medium">Webcam Disabled</span>
                            </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                             <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 flex items-center gap-1.5 shadow-xl">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                LIVE ANALYSIS
                             </div>
                        </div>

                        {/* Emotion Pop-up Badge */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentEmotion}
                                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -20, opacity: 0, scale: 0.8 }}
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl"
                            >
                                <span className="text-xl">{getEmotionIcon(currentEmotion)}</span>
                                <span className="text-sm font-bold capitalize">{currentEmotion}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-semibold uppercase">Emotion Tracker</span>
                        <span className="text-sm font-medium text-slate-300">Tracking expressions...</span>
                    </div>
                    <button 
                        onClick={() => setShowWebcam(!showWebcam)}
                        className={`p-2 rounded-xl transition-all duration-300 ${showWebcam ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}
                    >
                        {showWebcam ? <Camera size={20} /> : <RefreshCw size={20} />}
                    </button>
                </div>
            </div>
        </div>

        <footer className="w-full text-center py-4 border-t border-white/5 mt-auto">
             <div className="flex justify-center gap-4 text-slate-500 mb-2">
                  <Github size={18} className="hover:text-blue-400 transition-colors cursor-pointer" />
                  <LogIn size={18} className="hover:text-blue-400 transition-colors cursor-pointer" />
             </div>
             <p className="text-[10px] text-slate-600 font-medium">PRIVACY: LOCAL DATA ONLY</p>
        </footer>
      </div>

      {/* --- Main Chat Interface --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Chat Log Overflow Component */}
        <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-6 pt-10 scrollbar-hide">
            <ChatWindow messages={messages} isTyping={isTyping} currentEmotion={currentEmotion} />
        </div>

        {/* Chat Input Area */}
        <div className="w-full max-w-4xl mx-auto p-6 md:pb-10 z-10">
            <div className="relative group">
                <div className="absolute -inset-1 vibrant-gradient rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                <div className="relative flex items-center bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] px-4 py-2 shadow-2xl">
                    <div className="p-3 text-slate-400">
                        <MessageCircle size={22} className="opacity-40" />
                    </div>
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type how you're feeling..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-2 py-4 font-medium"
                    />
                    <button 
                        onClick={handleSend}
                        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 opacity-40">
                <AlertCircle size={10} className="text-slate-400" />
                <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">Bot is aware of your facial expressions</span>
            </div>
        </div>
      </main>

    </div>
  );
};

export default App;