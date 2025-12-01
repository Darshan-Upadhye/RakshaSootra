'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Siren, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Copy, 
  Hospital, 
  Navigation,
  Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SOSPage() {
  const [sosActive, setSosActive] = useState(false);
  const [locationText, setLocationText] = useState('Locating...');
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState('Emergency! I need help. This is my current location:');
  
  const audioRef = useRef(null);

  useEffect(() => {
    let watchId;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)} • ${mapsUrl}`);
        },
        (err) => {
          let errorMsg = 'Location unavailable';
          switch(err.code) {
            case 1:
              errorMsg = 'Location denied. Enable permissions.';
              break;
            case 2:
              errorMsg = 'GPS signal lost.';
              break;
            case 3:
              errorMsg = 'Location timed out.';
              break;
            default:
              errorMsg = 'Location unavailable.';
          }
          console.warn("Location Error:", err.message);
          setLocationText(errorMsg);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 20000, 
          maximumAge: 5000 
        }
      );
    } else {
      setLocationText('Geolocation not supported');
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSOS = () => {
    if (sosActive) {
      setSosActive(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (navigator.vibrate) navigator.vibrate(0);
    } else {
      setSosActive(true);
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.play().catch((err) => console.error("Audio playback failed:", err));
      }
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${message}\n${locationText}`);
      alert('Emergency message copied.');
    } catch {
      alert('Copy failed.');
    }
  };

  const emergencyNumber = '112';
  const primaryContact = '';
  const smsBody = encodeURIComponent(`${message}\n${locationText}`);
  const hospitalSearch = 'https://www.google.com/maps/search/nearest+hospital';

  const card = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };
  const pulseRing = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0, 0.5],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  return (
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden font-sans transition-colors duration-500 ${sosActive ? 'bg-red-950' : 'bg-[#0A192F]'} text-white`}>
      
      <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${sosActive ? 'bg-red-600/30' : 'bg-blue-900/20'}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${sosActive ? 'bg-red-600/30' : 'bg-cyan-900/20'}`} />

      {sosActive && (
        <div className="fixed inset-0 bg-red-600/40 z-50 animate-[pulse_0.8s_ease-in-out_infinite] pointer-events-none" />
      )}

      <audio ref={audioRef} src="/emergency_alert.mp3" preload="auto" />

      <motion.div 
        className="w-[360px] h-[640px] max-w-full max-h-full bg-[#112240] rounded-2xl flex flex-col shadow-2xl relative border border-white/10 overflow-hidden shrink-0 z-40"
        variants={card}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5 relative z-10 shrink-0">
          <button 
            onClick={() => window.location.href = '/'} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-lg tracking-wide text-white">Emergency SOS</h1>
          {sosActive && (
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-red-400 animate-pulse">
              <Volume2 size={14} /> ACTIVE
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 flex flex-col items-center">
          <div className="relative mt-4 mb-8">
            {sosActive && (
              <>
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-red-500/50"
                  variants={pulseRing}
                  animate="animate"
                />
                 <motion.div 
                  className="absolute -inset-4 rounded-full border-2 border-red-500/30"
                  variants={pulseRing}
                  animate="animate"
                  transition={{ delay: 0.5 }}
                />
              </>
            )}

            <button
              onClick={toggleSOS}
              className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all transform active:scale-95 border-4 ${
                sosActive 
                  ? 'bg-red-600 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.6)]' 
                  : 'bg-gradient-to-b from-red-600 to-red-800 border-white/10'
              }`}
            >
              <Siren size={48} className={`mb-1 ${sosActive ? 'animate-bounce' : 'text-white'}`} />
              <span className="text-lg font-bold tracking-wider">
                {sosActive ? 'STOP' : 'SOS'}
              </span>
              <span className="text-[10px] uppercase opacity-80 mt-1">
                {sosActive ? 'Tap to Silence' : 'Tap for Help'}
              </span>
            </button>
          </div>

          <div className="w-full bg-[#0A192F] rounded-xl p-3 border border-white/5 mb-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-semibold mb-1">
              <MapPin size={12} /> Current Location
            </div>
            <p className="text-xs text-slate-200 break-all leading-relaxed font-mono">
              {locationText}
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            
            <a 
              href={`tel:${emergencyNumber}`}
              className="col-span-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-900/40 transition-transform active:scale-95"
            >
              <Phone size={18} /> Call 112
            </a>

            <a 
              href={hospitalSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#173C5C] hover:bg-[#1f4b70] text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5 transition-colors"
            >
              <Hospital size={20} className="text-cyan-400" />
              <span className="text-xs font-medium">Hospital</span>
            </a>

            <a 
              href={`sms:${primaryContact}?body=${smsBody}`}
              className="bg-[#173C5C] hover:bg-[#1f4b70] text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5 transition-colors"
            >
              <MessageSquare size={20} className="text-green-400" />
              <span className="text-xs font-medium">SMS</span>
            </a>

            <button 
              onClick={() => {
                 if (coords) window.open(`https://maps.google.com/?q=${coords.lat},${coords.lng}`, '_blank');
              }}
              className="bg-[#173C5C] hover:bg-[#1f4b70] text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5 transition-colors"
            >
              <Navigation size={20} className="text-blue-400" />
              <span className="text-xs font-medium">Navigate</span>
            </button>

             <button 
              onClick={copyToClipboard}
              className="bg-[#173C5C] hover:bg-[#1f4b70] text-white p-3 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5 transition-colors"
            >
              <Copy size={20} className="text-slate-300" />
              <span className="text-xs font-medium">Copy Info</span>
            </button>
          </div>

          <div className="w-full">
            <label className="text-xs text-slate-400 font-medium mb-1 block pl-1">Emergency Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0A192F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500/50 resize-none h-20"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}