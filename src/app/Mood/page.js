'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    Inhale: { 
      scale: 1.5, 
      borderColor: "rgba(147, 197, 253, 1)",
      backgroundColor: "rgba(59, 130, 246, 0.4)",
      transition: { duration: 4, ease: "easeInOut" } 
    },
    HoldTop: { 
      scale: 1.5, 
      borderColor: "rgba(255, 255, 255, 1)", 
      backgroundColor: "rgba(59, 130, 246, 0.6)", 
      transition: { duration: 0 } 
    },
    Exhale: { 
      scale: 1.0, 
      borderColor: "rgba(147, 197, 253, 0.5)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 4, ease: "easeInOut" } 
    },
    HoldBottom: { 
      scale: 1.0, 
      borderColor: "rgba(255, 255, 255, 0.5)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 0 } 
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        <motion.div
          animate={phase}
          variants={variants}
          className="w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]"
        >
          <span className="text-4xl font-bold text-white">{count}</span>
        </motion.div>
        
        <div className="absolute -bottom-4 text-center">
          <div className="text-xl font-medium tracking-wide text-white mb-1">{displayLabel}</div>
          <p className="text-white/50 text-sm">Follow the rhythm</p>
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
    <div className="flex flex-col items-center justify-center py-6">
      <div className="text-6xl font-mono font-bold tracking-widest mb-6 text-blue-200">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-4 w-full justify-center">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-sm font-medium transition"
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => { setSeconds(900); setIsActive(false); }}
          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-sm font-medium transition"
        >
          Reset
        </button>
      </div>
      <p className="text-white/50 text-xs mt-6 text-center bg-white/5 p-3 rounded-lg w-full">
        ⚠️ Ensure you are parked in a safe location before resting.
      </p>
    </div>
  );
}

export default function MoodPage() {
  const [activeModal, setActiveModal] = useState(null); 

  const moods = useMemo(
    () => [
      { id: 'calm', label: 'Calm', emoji: '🧘' },
      { id: 'focused', label: 'Focused', emoji: '🎯' },
      { id: 'stressed', label: 'Stressed', emoji: '😣' },
      { id: 'sleepy', label: 'Sleepy', emoji: '😪' },
      { id: 'energetic', label: 'Energetic', emoji: '⚡️' },
    ],
    []
  );

  const [selected, setSelected] = useState('calm');
  const [coords, setCoords] = useState(null);
  const [detectOn, setDetectOn] = useState(false);
  const videoRef = useRef(null);

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
          { label: 'Guided breathing (1 min)', type: 'breathing' },
          { label: 'Find tea/coffee', href: baseMapsUrl('tea coffee near me') },
          { label: 'Safety Tips', type: 'tips' },
        ],
      },
      focused: {
        headline: 'Stay in the zone',
        radio: [
          { title: 'Lofi Hiphop Focus', tag: 'Instrumental' },
          { title: 'Ambient Nature', tag: 'Focus' },
        ],
        actions: [
          { label: 'Mute notifications', type: 'mute' },
          { label: 'Parking ahead', href: baseMapsUrl('parking near me') },
          { label: 'Open navigation', type: 'nav' },
        ],
      },
      stressed: {
        headline: 'Slow down and reset',
        radio: [
          { title: 'Relaxing Piano', tag: 'Piano' },
          { title: 'Meditation Radio', tag: 'Calm' },
        ],
        actions: [
          { label: 'Nearest rest area', href: baseMapsUrl('rest area near me') },
          { label: 'Breathing Box (2 min)', type: 'breathing' },
          { label: 'Call a trusted contact', type: 'call' },
        ],
      },
      sleepy: {
        headline: 'Wake up! Safety first.',
        radio: [
          { title: 'Radio City Hindi', tag: 'Upbeat Hits' },
          { title: 'Desi Bollywood', tag: 'High Energy' },
        ],
        actions: [
          { label: 'Find coffee', href: baseMapsUrl('coffee near me') },
          { label: 'Nearest rest area', href: baseMapsUrl('rest area near me') },
          { label: 'Power Nap Timer', type: 'nap' },
        ],
      },
      energetic: {
        headline: 'Channel the energy, stay smooth',
        radio: [
          { title: 'Punjabi Hits', tag: 'Bhangra' },
          { title: 'Bollywood Dance', tag: 'Party' },
        ],
        actions: [
          { label: 'Full Radio Player', type: 'open-music' },
          { label: 'Scenic route spots', href: baseMapsUrl('scenic view point near me') },
          { label: 'Speed Limit Check', type: 'speed' },
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

  const page = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.35 } } };
  const card = { hidden: { opacity: 0, y: 16, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } } };
  const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } };
  const modalVariant = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.2 } } };

  return (
    <motion.div
      className="min-h-screen bg-[#0A2740] flex flex-col items-center justify-center text-white px-4 relative"
      initial="hidden"
      animate="show"
      variants={page}
    >
      <div className="absolute top-4 left-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 border border-white/15 text-sm transition-colors"
          aria-label="Back to Home"
        >
          <span className="inline-block rotate-180">➔</span>
          <span>Back</span>
        </motion.button>
      </div>

      <motion.div
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl"
        variants={card}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-lg">🧭</div>
            <div>
              <h1 className="text-2xl font-semibold tracking-wide">Mood & Suggestions</h1>
              <p className="text-white/80 text-sm">Select current mood to get tailored help.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/70">Stress Scan</span>
            <button
              onClick={() => setDetectOn((v) => !v)}
              className={`px-3 py-1 rounded-lg border ${detectOn ? 'bg-white/20 border-white/50' : 'bg-white/10 border-white/20'}`}
            >
              {detectOn ? 'On' : 'Off'}
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6">
          <div className="text-sm text-white/80 mb-2 font-medium">How are you feeling?</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {moods.map((m) => {
              const active = selected === m.id;
              return (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(m.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl px-3 py-3 border transition-all ${
                    active ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-sm font-medium">{m.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-2 bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="text-blue-200 font-medium mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-400 rounded-full"></span>
            {current.headline}
          </div>

          <div className="mb-6">
            <div className="text-sm text-white/60 mb-3 flex justify-between items-center">
               <span>Suggested Radio Channels</span>
               <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">Live</span>
            </div>
            <div className="grid gap-2">
              {current.radio.map((t, i) => (
                <div
                  key={`${selected}-track-${i}`}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-xs text-white/50">{t.tag}</div>
                    </div>
                  </div>
                  <button
                    className="text-xs font-bold px-4 py-2 rounded-full bg-white text-[#0A2740] hover:bg-blue-50 transition shadow-lg active:scale-95"
                    onClick={openMusicPlayer}
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-white/60 mb-3">Quick Actions</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {current.actions.map((a, idx) => (
                <button
                  key={`act-${idx}`}
                  onClick={() => runAction(a)}
                  className="rounded-lg bg-white/10 border border-white/10 px-3 py-3 hover:bg-white/20 text-sm font-medium transition text-center sm:text-left flex items-center justify-center sm:justify-start gap-2"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-4 text-center text-xs text-white/50 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Tip: Switch moods anytime; suggestions update instantly.
      </motion.div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="show"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0E3255] border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
              <div className="relative z-10">
                
                <h3 className="text-xl font-bold text-white text-center mb-6">
                  {activeModal === 'breathing' && 'Box Breathing'}
                  {activeModal === 'nap' && 'Power Nap'}
                  {activeModal === 'speed' && 'Speed Awareness'}
                  {activeModal === 'tips' && 'Safety Tips'}
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
                      <p className="text-white/60 text-sm mt-2">Adapt to current road conditions.</p>
                    </div>
                  )}

                  {activeModal === 'tips' && (
                    <div className="text-center py-4">
                      <div className="text-6xl mb-6">💡</div>
                      <p className="text-white/90 text-lg font-medium leading-relaxed">
                        Keep distance, maintain steady speed, and take short breaks if you feel tired.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 bg-white text-[#0A2740] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Dismiss
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}