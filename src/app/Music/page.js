'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_STATIONS = [
  {
    id: 'backup-1',
    title: 'Radio City Hindi',
    artist: 'Live • Bollywood Hits',
    src: 'https://stream.zeno.fm/squtvgf5ng0uv', 
    cover: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Radio_City_Logo.jpg'
  },
  {
    id: 'backup-2',
    title: 'Lata Mangeshkar Radio',
    artist: 'Live • Classics',
    src: 'https://stream.zeno.fm/vf6007x5438uv', 
    cover: '' 
  },
  {
    id: 'backup-3',
    title: 'Desi Bollywood',
    artist: 'Live • Upbeat',
    src: 'https://stream.zeno.fm/7k90q08130duv',
    cover: ''
  }
];

export default function MusicPlayerPage() {
  const handleBack = () => {
    console.log("Navigating back...");
    window.location.href = '/'; 
  };

  const [tracks, setTracks] = useState(FALLBACK_STATIONS); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false); 
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef(null);
  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    async function fetchRadioStations() {
      setIsLoading(true);
      const endpoint = "https://de1.api.radio-browser.info/json/stations/search";
      const params = new URLSearchParams({
        limit: '30',
        countrycode: 'IN',
        hidebroken: 'true',
        order: 'clickcount',
        tag: 'bollywood'
      });

      try {
        const res = await fetch(`${endpoint}?${params}`);
        const data = await res.json();

        if (data && data.length > 0) {
          const liveStations = data.map((station) => ({
            id: station.stationuuid,
            title: station.name.replace(/_/g, ' ').trim(),
            artist: 'Live Radio', 
            src: station.url_resolved,
            cover: station.favicon
          }));
          setTracks((prev) => {
             const newStations = liveStations.filter(ls => !prev.some(p => p.id === ls.id));
             return [...prev, ...newStations];
          });
        }
      } catch (error) {
        console.error("Radio API failed, using backups.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRadioStations();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const loadAndPlay = async () => {
      if (audio.src !== currentTrack.src) {
        audio.src = currentTrack.src;
        audio.load();
      }
      audio.volume = volume;
      if (isPlaying) {
        try { await audio.play(); } catch (err) { setIsPlaying(false); }
      }
    };
    loadAndPlay();
  }, [currentIndex, currentTrack]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(e => console.warn("Playback error:", e));
      setIsPlaying(true);
    }
  };

  const handlePrev = () => setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  const handleNext = () => setCurrentIndex((i) => (i + 1) % tracks.length);

  const AlbumCover = ({ src, alt, size = "w-full h-full" }) => {
    const [error, setError] = useState(false);
    useEffect(() => { setError(false); }, [src]);

    if (!src || error) {
      return (
        <div className={`${size} bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center`}>
          <svg className="w-1/2 h-1/2 text-white/50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
      );
    }
    return (
      <img 
        src={src} 
        alt={alt} 
        className={`${size} object-cover`}
        onError={() => setError(true)}
      />
    );
  };

  const ControlButton = ({ icon, onClick, primary = false }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all
        ${primary 
          ? 'w-16 h-16 bg-white text-[#0A2740] shadow-white/20' 
          : 'w-12 h-12 bg-white/10 text-white hover:bg-white/20 border border-white/10'}
      `}
    >
      {icon}
    </motion.button>
  );

  return (
    <motion.div
      className="min-h-screen bg-[#0A2740] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <motion.div 
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative z-10 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-6 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
               <img src="/Music_Icon.svg" alt="Music" className="w-6 h-6 object-contain" />
            </div>
            <div>
               <h1 className="text-lg font-bold tracking-wide">RakshaSootra Radio</h1>
               <p className="text-[10px] text-blue-300 uppercase tracking-widest">Live Stream</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowPlaylist(true)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition border border-white/10"
            title="Open Playlist"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8 z-10">
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-md animate-pulse opacity-50" />
          )}
          <div className={`
            w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative z-10
            ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}
          `}>
            <AlbumCover src={currentTrack?.cover} alt={currentTrack?.title} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0A2740] rounded-full border border-white/10 z-20 flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
        </div>

        <div className="text-center mb-8 px-4">
           <h2 className="text-xl font-bold truncate mb-1">{currentTrack?.title}</h2>
           <p className="text-white/60 text-sm truncate">{currentTrack?.artist}</p>
        </div>

        <div className="space-y-8 z-10 relative">
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 w-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="flex justify-between text-xs font-medium text-white/40">
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> LIVE
              </span>
              <span>Stereo</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <ControlButton 
              onClick={handlePrev} 
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>} 
            />
            
            <ControlButton 
              primary 
              onClick={togglePlay} 
              icon={isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )} 
            />

            <ControlButton 
              onClick={handleNext} 
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>} 
            />
          </div>

          <div className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07"/></svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
            />
            <span className="text-xs font-mono text-white/50 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-[#0A2740]/95 backdrop-blur-xl z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Stations</h3>
                    <p className="text-xs text-white/50">{tracks.length} Channels Live</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPlaylist(false)}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide -mx-2 px-2">
                {tracks.map((track, idx) => (
                  <div 
                    key={track.id + idx}
                    onClick={() => {
                      setCurrentIndex(idx); 
                    }}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2
                      ${currentIndex === idx ? 'bg-white/10 border border-white/10 shadow-lg' : 'hover:bg-white/5 border border-transparent'}
                    `}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative">
                      <AlbumCover src={track.cover} alt={track.title} />
                      {currentIndex === idx && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${currentIndex === idx ? 'text-blue-300' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/50 truncate uppercase tracking-wider">{track.artist}</p>
                    </div>

                    {currentIndex === idx && (
                      <div className="flex gap-1 items-end h-4 mr-2">
                        <span className="w-1 h-full bg-blue-400 rounded-sm animate-[bounce_1s_infinite]" />
                        <span className="w-1 h-2/3 bg-blue-400 rounded-sm animate-[bounce_1.2s_infinite]" />
                        <span className="w-1 h-full bg-blue-400 rounded-sm animate-[bounce_0.8s_infinite]" />
                      </div>
                    )}
                  </div>
                ))}
                <div className="h-4"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <audio ref={audioRef} crossOrigin="anonymous" />
    </motion.div>
  );
}