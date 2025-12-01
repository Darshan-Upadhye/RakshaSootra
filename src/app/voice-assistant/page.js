'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square, Settings, Send, Volume2, X, ArrowLeft, Moon, Sun } from 'lucide-react';

export default function VoiceAssistant() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  const [apiKey] = useState(() => {
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
      return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    }
    return typeof window !== 'undefined' ? localStorage.getItem('openrouter_key') || '' : '';
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isDark = theme === 'dark';
  const themeColors = {
    cardBg: isDark ? 'bg-[#112240]' : 'bg-white',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-500',
    border: isDark ? 'border-white/10' : 'border-slate-200',
    headerBg: isDark ? 'bg-white/5' : 'bg-slate-50/80',
    inputBg: isDark ? 'bg-[#0A192F]' : 'bg-slate-100',
    aiBubble: isDark ? 'bg-[#173C5C] text-white' : 'bg-slate-100 text-slate-800 border border-slate-200',
    userBubble: 'bg-blue-600 text-white',
    modalBg: isDark ? 'bg-[#112240]' : 'bg-white',
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const cleanTextForSpeech = (text) => {
    return text ? text.replace(/<think>[\s\S]*?<\/think>/g, '').trim() : '';
  };

  const speak = (text, id) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setPlayingMessageId(id);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setPlayingMessageId(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setPlayingMessageId(null);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setPlayingMessageId(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      stopSpeaking();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleUserMessage(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    const userMsgId = Date.now();
    const newMessages = [...messages, { id: userMsgId, role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');

    const aiMsgId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '...', isLoading: true }]);

    try {
      if (!apiKey) {
        throw new Error('API Key is missing. Please check your .env configuration.');
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000',
          "X-Title": "Voice Assistant Demo",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1",
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful, concise voice assistant. Avoid markdown formatting. Keep responses conversational and brief."
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API Error');
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

      setMessages((prev) => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, content: aiContent, isLoading: false } 
            : msg
        )
      );
      speak(aiContent, aiMsgId);

    } catch (error) {
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, content: `Error: ${error.message}`, isLoading: false, isError: true } 
            : msg
        )
      );
      speak(`I encountered an error: ${error.message}`, aiMsgId);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0A192F] text-white flex items-center justify-center overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className={`w-[360px] h-[640px] max-w-full max-h-full ${themeColors.cardBg} ${themeColors.text} rounded-2xl flex flex-col shadow-2xl relative border ${themeColors.border} overflow-hidden shrink-0 z-10 transition-colors duration-300`}>

        <div className={`flex items-center justify-between p-4 border-b ${themeColors.border} ${themeColors.headerBg} relative z-10 shrink-0`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'} 
              className={`p-1 hover:opacity-80 ${themeColors.textSub} transition-colors`}
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`} />
            <h1 className={`font-semibold text-lg tracking-wide ${themeColors.text}`}>Raksha Assistant</h1>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-2 hover:bg-black/5 rounded-full transition-colors ${themeColors.textSub}`}
          >
            <Settings size={20} />
          </button>
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-current"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className={`w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20`}>
                <Volume2 size={28} className="text-white" />
              </div>
              <p className={`text-lg font-medium ${themeColors.text} mb-2`}>&quot;Hello, I am Raksha.&quot;</p>
              <p className={`text-sm ${themeColors.textSub}`}>Tap the microphone to start speaking.</p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isThinking = msg.content && msg.content.includes('<think>');
            const displayContent = isThinking ? cleanTextForSpeech(msg.content) : msg.content;
            
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-xl relative group text-sm ${
                    isUser 
                      ? `${themeColors.userBubble} rounded-tr-sm` 
                      : `${themeColors.aiBubble} rounded-tl-sm`
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex gap-1.5 h-5 items-center px-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    <>
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {displayContent || <span className="italic opacity-60 text-xs">Processing response...</span>}
                      </div>
                      {!isUser && !msg.isError && (
                        <div className="absolute -bottom-7 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button 
                            onClick={() => playingMessageId === msg.id ? stopSpeaking() : speak(msg.content, msg.id)}
                            className={`p-1 border ${themeColors.border} rounded-full hover:opacity-80 ${themeColors.text} ${isDark ? 'bg-[#173C5C]' : 'bg-white'}`}
                          >
                            {playingMessageId === msg.id ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isPlaying && (
          <div className={`absolute bottom-20 left-0 right-0 h-12 bg-gradient-to-t ${isDark ? 'from-[#112240]' : 'from-white'} to-transparent pointer-events-none flex items-end justify-center gap-1 pb-2 z-0`}>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-cyan-400/80 rounded-full animate-wave"
                style={{ height: '30%', animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }} 
              />
            ))}
          </div>
        )}

        <div className={`p-4 ${themeColors.cardBg} border-t ${themeColors.border} relative z-10 flex items-center gap-2 shrink-0 transition-colors duration-300`}>
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all duration-300 shadow-lg shrink-0 ${
              isRecording 
                ? 'bg-red-500/90 shadow-red-500/30 scale-105' 
                : 'bg-blue-600/90 hover:bg-blue-500 shadow-blue-500/30'
            }`}
          >
            {isRecording ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
          </button>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleUserMessage(inputValue); }}
            className="flex-1 relative"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Type here..."}
              className={`w-full ${themeColors.inputBg} border ${themeColors.border} rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 transition-colors ${themeColors.text} placeholder-slate-500`}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/5 rounded-full disabled:opacity-30 text-blue-500 transition"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${themeColors.modalBg} border ${themeColors.border} rounded-2xl w-full max-w-[320px] p-6 shadow-2xl transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-bold ${themeColors.text}`}>Settings</h2>
              <button onClick={() => setShowSettings(false)} className={`${themeColors.textSub} hover:opacity-80`}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-medium ${themeColors.textSub} mb-3 uppercase tracking-wider`}>
                  Appearance
                </label>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl ${isDark ? 'bg-black/20' : 'bg-slate-100'}`}>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      !isDark 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDark 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowSettings(false)}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { height: 10px; }
          50% { height: 40px; }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}