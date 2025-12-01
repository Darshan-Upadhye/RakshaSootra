'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Lightbulb, Target, Info } from 'lucide-react';

export default function About() {
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] text-white font-sans relative flex flex-col items-center py-6 px-4 md:px-8">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]" />
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
          className="mb-8 text-center"
          variants={item}
        >
          <motion.img 
            src="/RakshaSootra_Logo.svg"
            alt="RakshaSootra Logo"
            className="w-64 h-auto object-contain mx-auto mb-4 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">About RakshaSootra</h1>
          <p className="text-cyan-400 font-medium tracking-wide uppercase text-sm md:text-base">The Sootra of Peaceful Driving</p>
        </motion.div>

        <motion.div 
          className="w-full space-y-4"
          variants={stagger}
        >
          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={80} />
              </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Info size={18} className="text-blue-400" /> Why we made it
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              RakshaSootra was created to help drivers stay safe, calm, and focused. By using AI-powered voice assistance and emotion detection, we aim to prevent accidents caused by stress, fatigue, or distraction on the road.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Users size={18} className="text-purple-400" /> Who made it
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              Developed by <span className="text-white font-semibold">Darshan Akshay Upadhye</span> & <span className="text-white font-semibold">Team RakshakTech</span> for the <span className="text-white">Tata Technologies InnoVent Hackathon</span>.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Lightbulb size={80} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-400" /> How we made it
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              Using GenAI for natural conversation, robust speech recognition for hands-free control, and connected services like parking booking & food ordering — all inside a unified voice experience.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-[#112240] p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-2">Target Audience</h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              Drivers who want a stress-free journey — from daily commuters to long-distance travelers.
            </p>
          </motion.div>

        </motion.div>

        <motion.div 
          className="mt-12 text-slate-500 text-xs"
          variants={item}
        >
          © 2025 RakshakTech. All rights reserved.
        </motion.div>

      </motion.div>
    </div>
  );
}