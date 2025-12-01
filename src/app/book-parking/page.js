'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  X, 
  Search, 
  Car, 
  Bike, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  ParkingSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const welcomeMsg = '🚗 Need a spot? Find parking effortlessly for malls, offices, or events. Use the filters to locate the best spot near you or check out top parking apps.';

export default function BookParking() {
  const [typedText, setTypedText] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [purpose, setPurpose] = useState('Shopping');
  const [duration, setDuration] = useState('1–2 hrs');
  const [vehicle, setVehicle] = useState('Car');
  const [distance, setDistance] = useState('Near me');

  const purposeChips = ['Shopping', 'Office', 'Event', 'Travel'];
  const durationChips = ['<1 hr', '1–2 hrs', '2–4 hrs', 'Full day'];
  const vehicleChips = ['Car', 'Bike', 'EV'];
  const distanceChips = ['Near me', '1km', '2km', '5km'];

  const servicesIndia = useMemo(() => [
    { 
      name: 'Park+', 
      icon: <Zap size={32} className="text-orange-500" />, 
      link: 'https://parkplus.io/',
      desc: 'Fastag based parking'
    },
    { 
      name: 'ParkMitra', 
      icon: <Car size={32} className="text-cyan-400" />, 
      link: '#', 
      isModal: true,
      desc: 'Smart local parking solution'
    },
  ], []);

  const servicesGlobal = useMemo(() => [
    { name: 'Secure P.', icon: <ShieldCheck size={32} className="text-blue-500" />, link: 'https://www.secureparking.com.au/' },
    { name: 'JustPark', icon: <ParkingSquare size={32} className="text-purple-500" />, link: 'https://www.justpark.com/' },
  ], []);

  useEffect(() => {
    setTypedText('');
    
    const characters = Array.from(welcomeMsg);
    
    let i = 0;
    const t = setInterval(() => {
      if (i < characters.length) {
        const char = characters[i];
        if (char !== undefined) {
          setTypedText((prev) => prev + char);
        }
        i++;
      } else {
        clearInterval(t);
      }
    }, 18);
    
    return () => clearInterval(t);
  }, []);

  const buildMapsQuery = () => {
    const parts = [];
    
    if (purpose === 'Shopping') parts.push('mall parking');
    else if (purpose === 'Office') parts.push('office parking');
    else if (purpose === 'Event') parts.push('event parking stadium');
    else if (purpose === 'Travel') parts.push('airport railway station parking');

    if (vehicle === 'Bike') parts.push('two wheeler parking');
    else if (vehicle === 'EV') parts.push('ev charging parking');
    else if (vehicle === 'Car') parts.push('car parking');

    const dSuffix = (distance === '1km') ? 'within 1km' : (distance === '2km') ? 'within 2km' : (distance === '5km') ? 'within 5km' : 'near me';
    
    return `${parts.join(' ')} ${dSuffix}`.trim();
  };

  const mapsUrl = () => `https://www.google.com/maps/search/${encodeURIComponent(buildMapsQuery())}`;

  const openService = (service) => {
    if (service.isModal) {
      setShowPopup(true);
    } else {
      window.open(service.link, '_blank', 'noopener,noreferrer');
    }
  };

  const card = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };
  const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const modalVar = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } };

  const Pill = ({ active, children, onClick }) => (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
        active 
          ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
          : 'bg-[#173C5C] border-white/10 text-slate-300 hover:bg-[#1f4b70]'
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0A192F] text-white flex items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="w-[360px] h-[640px] max-w-full max-h-full bg-[#112240] rounded-2xl flex flex-col shadow-2xl relative border border-white/10 overflow-hidden shrink-0 z-10"
        variants={card}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'} 
              className="p-1 hover:text-white text-slate-400 transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Car size={16} className="text-white" />
            </div>
            <h1 className="font-semibold text-lg tracking-wide text-white">Book Parking</h1>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          <motion.div 
            className="p-4 rounded-xl bg-[#173C5C] border border-white/5 text-sm leading-relaxed shadow-sm min-h-[80px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-slate-200">
              {typedText}
              <span className="inline-block w-1.5 h-4 align-middle bg-cyan-400 ml-1 animate-pulse" />
            </span>
          </motion.div>

          <motion.div className="space-y-5" variants={list} initial="hidden" animate="show">
            
            <motion.div variants={item}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Purpose</div>
              <div className="flex flex-wrap gap-2">
                {purposeChips.map(p => (
                  <Pill key={p} active={purpose === p} onClick={() => setPurpose(prev => prev === p ? '' : p)}>{p}</Pill>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Duration</div>
              <div className="flex flex-wrap gap-2">
                {durationChips.map(d => (
                  <Pill key={d} active={duration === d} onClick={() => setDuration(prev => prev === d ? '' : d)}>{d}</Pill>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Vehicle Type</div>
              <div className="flex flex-wrap gap-2">
                {vehicleChips.map(v => (
                  <Pill key={v} active={vehicle === v} onClick={() => setVehicle(prev => prev === v ? '' : v)}>{v}</Pill>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Distance</div>
              <div className="flex flex-wrap gap-2 items-center">
                {distanceChips.map(d => (
                  <Pill key={d} active={distance === d} onClick={() => setDistance(prev => prev === d ? '' : d)}>{d}</Pill>
                ))}
                
                <motion.a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                  <Search size={12} /> Search Maps
                </motion.a>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 pl-1 flex items-center gap-1">
                 <MapPin size={10} /> Query: {buildMapsQuery()}
              </div>
            </motion.div>

          </motion.div>

          <div className="h-px bg-white/10 my-4" />

          <motion.div className="space-y-6" variants={list} initial="hidden" animate="show">
            
            <motion.div variants={item}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Popular in India</div>
              <div className="grid grid-cols-2 gap-3">
                {servicesIndia.map(s => (
                  <button
                    key={s.name}
                    onClick={() => openService(s)}
                    className="bg-[#0A192F]/60 hover:bg-[#0A192F] border border-white/5 hover:border-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-all group relative overflow-hidden"
                  >
                    <div className="p-2 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{s.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Global Services</div>
               <div className="grid grid-cols-2 gap-3">
                {servicesGlobal.map(s => (
                  <button
                    key={s.name}
                    onClick={() => openService(s)}
                    className="bg-[#0A192F]/60 hover:bg-[#0A192F] border border-white/5 hover:border-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-all group"
                  >
                    <div className="p-2 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{s.name}</span>
                  </button>
                ))}
               </div>
            </motion.div>

          </motion.div>
        </div>

      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" onClick={() => setShowPopup(false)} />
            <motion.div 
              className="relative bg-[#112240] w-full max-w-[300px] p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center text-center"
              variants={modalVar}
              initial="hidden"
              animate="show"
              exit="exit"
            >
               <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 text-cyan-400">
                <Car size={24} />
              </div>

              <h2 className="text-lg font-bold text-white mb-2">About ParkMitra</h2>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                A smart parking solution to find nearby parking spots, check availability, and book slots in advance.
              </p>
              
              <div className="bg-[#0A192F] rounded-lg p-3 w-full mb-4 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Creator</p>
                <p className="text-xs text-slate-200 font-medium">Niranjan Umesh Mali</p>
              </div>

              <button
                disabled
                className="w-full py-2.5 bg-white/10 text-slate-400 cursor-not-allowed rounded-lg text-sm font-semibold border border-white/5"
              >
                Coming Soon
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}