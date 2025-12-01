'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Map, 
  Zap, 
  List, 
  Users, 
  Target, 
  Lightbulb, 
  Sparkles,
  Wallet,
  CloudSun,
  Plane
} from 'lucide-react';

export default function InGeniGo() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] text-white font-sans relative flex flex-col items-center py-6 px-4 md:px-8">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between mb-8 relative z-10">
        <button 
          onClick={() => window.location.href = '/'} 
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors text-slate-200"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <motion.div 
        className="w-full max-w-2xl relative z-10 flex flex-col items-center"
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        
        <motion.div 
          className="mb-10 text-center"
          variants={item}
        >
          <motion.img 
            src="/InGeniGO.svg"
            alt="InGeniGo Logo"
            className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">InGeniGo</h1>
          <p className="text-blue-300 font-medium tracking-wide text-sm md:text-base">
            Genius-crafted journeys. It’s time to GO.
          </p>
        </motion.div>

        <motion.div 
          className="w-full space-y-4"
          variants={stagger}
        >
          
          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-400" /> Overview
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              InGeniGo is your <span className="text-white font-medium">AI-powered travel buddy</span> that makes planning trips simple, smart, and budget-friendly.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <List size={100} />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> Key Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <Map size={16} />, text: 'Auto itineraries by interest' },
                { icon: <Wallet size={16} />, text: 'Smart budget mode' },
                { icon: <Plane size={16} />, text: 'Compare buses, flights & cabs' },
                { icon: <CloudSun size={16} />, text: 'Weather-aware planning' },
                { icon: <Users size={16} />, text: 'Plan & split costs with friends' },
                { icon: <Target size={16} />, text: 'Wishlist → trips made easy' },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-blue-400">{feat.icon}</span>
                  {feat.text}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Target size={18} className="text-red-400" /> Vision
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              To be the most trusted travel partner that turns dreams into journeys—personal, affordable, and effortless.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg flex items-start gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                <Lightbulb size={20} />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white mb-1">Did you know?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  InGeniGo is also our in-house project, proudly developed by <span className="text-slate-200">Darshan Akshay Upadhye</span>.
                </p>
             </div>
          </motion.div>

          <motion.div variants={item} className="pt-4 flex justify-center">
            <a 
              href="/ComingSoonIGG" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Let&apos;s GO <ArrowLeft size={16} className="rotate-180" />
            </a>
          </motion.div>

        </motion.div>

        <motion.div 
          className="mt-12 text-slate-500 text-xs text-center"
          variants={item}
        >
          © 2025 RakshakTech. All rights reserved.
        </motion.div>

      </motion.div>
    </div>
  );
}