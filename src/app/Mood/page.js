'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Wind, 
  Coffee, 
  MapPin, 
  Music, 
  Phone, 
  Zap, 
  Moon, 
  Activity, 
  Timer,
  Navigation,
  VolumeX,
  X,
  Play,
  Smile,
  Frown,
  Target
} from 'lucide-react';

function BreathingExercise() {
  const [phase, setPhase] = useState('Inhale');
  const [displayLabel, setDisplayLabel] = useState('Inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    let timer;
    let isActive = true;

    const cycle = async () => {
      const runPhase = (phaseName, labelText, duration) => {
        if (!isActive) return;
        setPhase(phaseName);
        setDisplayLabel(labelText);
        setCount(duration);
        return new Promise((resolve) => {
          let c = duration;
          const i = setInterval(() => {
            if (!isActive) {
              clearInterval(i);
              resolve();
              return;
            }
            c--;
            setCount(c);
            if (c <= 0) {
              clearInterval(i);
              resolve();
            }
          }, 1000);
        });
      };

      while (isActive) {
        await runPhase('Inhale', 'Inhale Deeply', 4);
        await runPhase('HoldTop', 'Hold Breath', 4);
        await runPhase('Exhale', 'Exhale Slowly', 4);
        await runPhase('HoldBottom', 'Hold Breath', 4);
      }
    };

    cycle();
    return () => { isActive = false; clearTimeout(timer); };
  }, []);

  const variants = {
    Inhale: { scale: 1.3, borderColor: "rgba(59, 130, 246, 1)", backgroundColor: "rgba(59, 130, 246, 0.3)", transition: { duration: 4, ease: "easeInOut" } },
    HoldTop: { scale: 1.3, borderColor: "rgba(255, 255, 255, 1)", backgroundColor: "rgba(59, 130, 246, 0.5)", transition: { duration: 0 } },
    Exhale: { scale: 1.0, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(59, 130, 246, 0.1)", transition: { duration: 4, ease: "easeInOut" } },
    HoldBottom: { scale: 1.0, borderColor: "rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(59, 130, 246, 0.1)", transition: { duration: 0 } },
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative flex items-center justify-center w-56 h-56">
        <motion.div
          animate={phase}
          variants={variants}
          className="w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        >
          <span className="text-3xl font-bold text-white">{count}</span>
        </motion.div>
        <div className="absolute -bottom-2 text-center">
          <div className="text-lg font-semibold text-blue-200 mb-1">{displayLabel}</div>
          <p className="text-slate-400 text-xs">Follow the rhythm</p>
        </div>
      </div>
    </div>
  );
}

function NapTimer() {
  const [seconds, setSeconds] = useState(900);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <div className="text-5xl font-mono font-bold tracking-widest mb-8 text-blue-300">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3 w-full px-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-sm font-medium transition-colors"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => { setSeconds(900); setIsActive(false); }}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="mt-6 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-200 text-xs mx-4">
        <VolumeX size={14} />
        <span>Ensure you are parked safely before resting.</span>
      </div>
    </div>
  );
}

export default function MoodPage() {
  const [activeModal, setActiveModal] = useState(null); 

  const moods = useMemo(() => [
    { id: 'calm', label: 'Calm', icon: <Smile size={24} className="text-teal-400" /> },
    { id: 'focused', label: 'Focused', icon: <Target size={24} className="text-blue-400" /> },
    { id: 'stressed', label: 'Stressed', icon: <Frown size={24} className="text-orange-400" /> },
    { id: 'sleepy', label: 'Sleepy', icon: <Moon size={24} className="text-indigo-400" /> },
    { id: 'energetic', label: 'Energetic', icon: <Zap size={24} className="text-yellow-400" /> },
  ], []);

  const [selected, setSelected] = useState('calm');
  const [coords, setCoords] = useState(null);
  const [detectOn, setDetectOn] = useState(false);

  const suggestions = useMemo(() => {
    const baseMapsUrl = (q) => `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
    return {
      calm: {
        headline: 'Breathe and enjoy the ride',
        radio: [
          { title: 'Lata Mangeshkar Radio', tag: 'Classics' },
          { title: 'Radio City Smaran', tag: 'Devotional' },
        ],
        actions: [
          { label: 'Guided breathing', type: 'breathing', icon: <Wind size={16} /> },
          { label: 'Find tea/coffee', href: baseMapsUrl('tea coffee near me'), icon: <Coffee size={16} /> },
          { label: 'Safety Tips', type: 'tips', icon: <Zap size={16} /> },
        ],
      },
      focused: {
        headline: 'Stay in the zone',
        radio: [
          { title: 'Lofi Hiphop Focus', tag: 'Instrumental' },
          { title: 'Ambient Nature', tag: 'Focus' },
        ],
        actions: [
          { label: 'Mute notifications', type: 'mute', icon: <VolumeX size={16} /> },
          { label: 'Parking ahead', href: baseMapsUrl('parking near me'), icon: <MapPin size={16} /> },
          { label: 'Open navigation', type: 'nav', icon: <Navigation size={16} /> },
        ],
      },
      stressed: {
        headline: 'Slow down and reset',
        radio: [
          { title: 'Relaxing Piano', tag: 'Piano' },
          { title: 'Meditation Radio', tag: 'Calm' },
        ],
        actions: [
          { label: 'Nearest rest area', href: baseMapsUrl('rest area near me'), icon: <MapPin size={16} /> },
          { label: 'Breathing Box', type: 'breathing', icon: <Wind size={16} /> },
          { label: 'Call contact', type: 'call', icon: <Phone size={16} /> },
        ],
      },
      sleepy: {
        headline: 'Wake up! Safety first.',
        radio: [
          { title: 'Radio City Hindi', tag: 'Upbeat Hits' },
          { title: 'Desi Bollywood', tag: 'High Energy' },
        ],
        actions: [
          { label: 'Find coffee', href: baseMapsUrl('coffee near me'), icon: <Coffee size={16} /> },
          { label: 'Nearest rest area', href: baseMapsUrl('rest area near me'), icon: <MapPin size={16} /> },
          { label: 'Power Nap Timer', type: 'nap', icon: <Timer size={16} /> },
        ],
      },
      energetic: {
        headline: 'Channel the energy, stay smooth',
        radio: [
          { title: 'Punjabi Hits', tag: 'Bhangra' },
          { title: 'Bollywood Dance', tag: 'Party' },
        ],
        actions: [
          { label: 'Full Radio Player', type: 'open-music', icon: <Music size={16} /> },
          { label: 'Scenic spots', href: baseMapsUrl('scenic view point near me'), icon: <MapPin size={16} /> },
          { label: 'Speed Limit', type: 'speed', icon: <Activity size={16} /> },
        ],
      },
    };
  }, []);

  const current = suggestions[selected];

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords(null),
        { enableHighAccuracy: true, timeout: 4000 }
      );
    }
  }, []);

  const runAction = (action) => {
    if (action.href) {
      window.open(action.href, '_blank', 'noopener,noreferrer');
      return;
    }
    switch (action.type) {
      case 'breathing': setActiveModal('breathing'); break;
      case 'tips': setActiveModal('tips'); break;
      case 'mute': alert('Tip: Enable Do Not Disturb or Driving Focus on your device.'); break;
      case 'nav': window.open('https://www.google.com/maps', '_blank'); break;
      case 'call': window.location.href = 'tel:+1234567890'; break;
      case 'nap': setActiveModal('nap'); break;
      case 'open-music': window.location.href = '/Music'; break;
      case 'speed': setActiveModal('speed'); break;
      default: break;
    }
  };

  const openMusicPlayer = () => {
    window.location.href = '/Music';
  };

  const cardVariant = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };
  const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const listStagger = { show: { transition: { staggerChildren: 0.05 } } };
  const modalVariant = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.2 } } };

  return (

    <div className="fixed inset-0 w-full h-full bg-[#0A192F] text-white flex items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="w-full h-full md:w-[90%] md:max-w-5xl md:h-[85vh] bg-[#112240] md:rounded-2xl flex flex-col shadow-2xl relative border-0 md:border border-white/10 overflow-hidden shrink-0 z-10"
        variants={cardVariant}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'} 
              className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg tracking-wide text-white">Mood</h1>
              <p className="text-xs text-slate-400">Adaptive Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stress Scan</span>
            <button
              onClick={() => setDetectOn(!detectOn)}
              className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${detectOn ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <motion.div 
                className="w-3 h-3 bg-white rounded-full shadow-sm" 
                animate={{ x: detectOn ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
          <div className="max-w-4xl mx-auto w-full">
            
            <motion.div variants={listStagger} initial="hidden" animate="show" className="space-y-3 mb-8">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">How are you feeling?</div>
              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {moods.map((m) => {
                  const active = selected === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      variants={fadeUp}
                      onClick={() => setSelected(m.id)}
                      className={`flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border transition-all ${
                        active 
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                          : 'bg-[#173C5C] border-transparent text-slate-400 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="mb-2 transition-transform transform group-hover:scale-110">
                        {m.icon}
                      </div>
                      <span className="text-[10px] md:text-xs font-medium">{m.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div 
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/20 rounded-2xl p-6 md:p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
            >
              <div>
                <div className="text-blue-200 font-medium mb-6 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-blue-400 rounded-full"></span>
                  {current.headline}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
                    <span>Suggested Audio</span>
                    <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">LIVE</span>
                  </div>
                  
                  {current.radio.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                          <Music size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{t.title}</div>
                          <div className="text-[10px] text-slate-400">{t.tag}</div>
                        </div>
                      </div>
                      <button 
                        onClick={openMusicPlayer}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1 md:mt-12">Quick Actions</div>
                <div className="grid gap-3">
                  {current.actions.map((a, idx) => (
                    <button
                      key={idx}
                      onClick={() => runAction(a)}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#173C5C] hover:bg-[#1f4b70] border border-white/5 transition-colors text-left group"
                    >
                      <div className="p-2 bg-white/5 rounded-lg text-blue-300 group-hover:text-white transition-colors">{a.icon}</div>
                      <span className="text-sm text-slate-200 group-hover:text-white transition-colors">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>

            <p className="text-center text-[10px] text-slate-500 mt-6">
              Suggestions update instantly based on your selection.
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              className="w-full max-w-sm bg-[#112E4A] border border-white/10 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
              variants={modalVariant}
              initial="hidden"
              animate="show"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
                  {activeModal === 'breathing' && <><Wind size={20} className="text-blue-400"/> Box Breathing</>}
                  {activeModal === 'nap' && <><Moon size={20} className="text-purple-400"/> Power Nap</>}
                  {activeModal === 'speed' && <><Activity size={20} className="text-red-400"/> Speed Check</>}
                  {activeModal === 'tips' && <><Zap size={20} className="text-yellow-400"/> Safety Tips</>}
                </h3>

                <div className="min-h-[200px] flex flex-col justify-center">
                  {activeModal === 'breathing' && <BreathingExercise />}
                  
                  {activeModal === 'nap' && <NapTimer />}

                  {activeModal === 'speed' && (
                    <div className="text-center py-4">
                      <div className="text-6xl mb-6 animate-pulse">🛑</div>
                      <p className="text-white/90 text-lg font-medium leading-relaxed">
                        Stay within posted speed limits.
                      </p>
                      <p className="text-slate-400 text-sm mt-2">Adapt to current road conditions.</p>
                    </div>
                  )}

                  {activeModal === 'tips' && (
                    <div className="text-center py-4">
                      <div className="text-6xl mb-6">💡</div>
                      <p className="text-white/90 text-sm font-medium leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                        &quot;Keep distance, maintain steady speed, and take short breaks if you feel tired.&quot;
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-6 py-3 bg-white text-[#0A2740] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}