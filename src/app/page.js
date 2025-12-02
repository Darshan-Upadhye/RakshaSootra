'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  
  const [activeFooterModal, setActiveFooterModal] = useState(null);

  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    if (showPopup) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const page = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.35 } } };
  const fadeIn = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
  const popup = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
  };
  const modalVariant = { 
    hidden: { opacity: 0, scale: 0.95 }, 
    show: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const btnTap = { scale: 0.96 };
  const btnHover = { y: -1, boxShadow: '0 10px 30px rgba(59,130,246,0.25)' };

  const iconBtnClass = 'rounded-lg p-2 flex items-center justify-center bg-white/10 border border-white/15';

  return (
    <motion.div
      className="min-h-screen bg-[#0A2740] flex flex-col items-center justify-start pt-6 md:justify-center md:pt-0 text-white px-4 relative overflow-hidden"
      initial="hidden"
      animate="show"
      variants={page}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="absolute top-13 left-3.5"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/RakshaSootra_Icon.svg"
            alt="RakshaSootra Logo"
            className="w-16 h-16"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-13 right-4 flex flex-col space-y-3 items-end"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <motion.a
          href="/about"
          whileTap={btnTap}
          whileHover={btnHover}
          className={iconBtnClass}
          title="About"
        >
          <img src="/About.svg" alt="About" className="w-6 h-6" />
        </motion.a>

        <motion.a
          href="/SOS"
          whileTap={btnTap}
          whileHover={btnHover}
          className={iconBtnClass}
          title="SOS"
        >
          <img src="/SOS_Icon_Phone.svg" alt="SOS" className="w-6 h-6" />
        </motion.a>

        <motion.button
          onClick={() => setShowPopup((v) => !v)}
          whileTap={btnTap}
          whileHover={btnHover}
          className={iconBtnClass}
          title="More"
          aria-expanded={showPopup}
          aria-controls="more-menu"
        >
          <img src="/More_icon.svg" alt="More Features" className="w-6 h-6" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            id="more-menu"
            ref={popupRef}
            className="absolute top-40 right-4 bg-black/30 backdrop-blur-md rounded-2xl p-4 grid grid-cols-2 gap-3 shadow-xl border border-white/10 z-20"
            variants={popup}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/ingenigo')} className={iconBtnClass} title="InGeniGo">
              <img src="/InGeniGO.svg" alt="InGeniGo" className="w-6 h-6" />
            </motion.button>

            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/bluetooth')} className={iconBtnClass} title="Bluetooth">
              <img src="/Bluetooth_icon.svg" alt="Bluetooth" className="w-6 h-6" />
            </motion.button>

            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/Music')} className={iconBtnClass} title="Music">
              <img src="/Music_Icon.svg" alt="Music" className="w-6 h-6" />
            </motion.button>

            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/inbox')} className={iconBtnClass} title="Messages">
              <img src="/Message_icon.svg" alt="Message" className="w-6 h-6" />
            </motion.button>

            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/Mood')} className={iconBtnClass} title="Mood">
              <img src="/Stress_icon.svg" alt="Mood/Stress" className="w-6 h-6" />
            </motion.button>

            <motion.button whileTap={btnTap} whileHover={btnHover} onClick={() => navigateTo('/Feedback')} className={iconBtnClass} title="Feedback">
              <img src="/Feedback_icon.svg" alt="Feedback" className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="mt-8 mb-3 text-center" variants={fadeIn} initial="hidden" animate="show">
        <motion.h1 className="text-3xl font-bold" variants={fadeIn}>
          RakshaSootra
        </motion.h1>
        <motion.p className="text-sm text-blue-200" variants={fadeIn} transition={{ delay: 0.05 }}>
          The Sootra of Peaceful Driving
        </motion.p>
      </motion.div>

      <motion.div className="mb-1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <img src="/Women_Driving_Car.svg" alt="Driver Illustration" className="w-[360px] h-40 object-contain" />
      </motion.div>

      <motion.div
        className="bg-[#173C5C] px-4 py-3 rounded-xl text-lg w-full max-w-xs text-center mb-2 border border-white/10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        Hello! How can I assist?
      </motion.div>

      <motion.div className="flex flex-col gap-2 w-full max-w-xs" variants={fadeIn} initial="hidden" animate="show">
        <motion.button
          onClick={() => navigateTo('/voice-assistant')}
          whileTap={btnTap}
          whileHover={btnHover}
          className="bg-[#0070f3] hover:bg-blue-600 px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-900/30"
        >
          Voice Assistant
        </motion.button>

        <motion.button
          onClick={() => navigateTo('/order-food')}
          whileTap={btnTap}
          whileHover={btnHover}
          className="bg-[#0070f3] hover:bg-blue-600 px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-900/30"
        >
          Order food
        </motion.button>

        <motion.button
          onClick={() => navigateTo('/book-parking')}
          whileTap={btnTap}
          whileHover={btnHover}
          className="bg-[#0070f3] hover:bg-blue-600 px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-900/30"
        >
          Book parking
        </motion.button>
      </motion.div>

      <motion.div
        className="mt-3 mb-2 text-center text-blue-200/70 text-[13.5px]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        Smart Assistant support by{" "}
        <a
          href="https://in-geni-voice.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-200/70 hover:text-blue-400"
        >
          InGeniVoice
        </a>
        <br />
        Built by{" "}
        <span
          onClick={() => setActiveFooterModal('profile')}
          className="text-blue-200/70 hover:text-blue-400 cursor-pointer"
        >
          Darshan Akshay Upadhye
        </span>{" "}
        &{" "}
        <span
          onClick={() => setActiveFooterModal('team')}
          className="text-blue-200/70 hover:text-blue-400 cursor-pointer"
        >
          Team RakshakTech
        </span>
      </motion.div>

      <motion.div
        className="mb-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.button
          onClick={() => navigateTo('/voice-assistant')}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(59,130,246,0.25)' }}
          className="bg-[#0070f3] p-4 rounded-full border border-white/10"
          aria-label="Open Voice Assistant"
        >
          <img src="/microphone--v1.png" alt="Mic Icon" className="w-6 h-6" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {activeFooterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveFooterModal(null)}
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0E3255] border border-white/20 rounded-2xl shadow-2xl p-6 relative"
            >
              <button 
                onClick={() => setActiveFooterModal(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                ✕
              </button>

              {activeFooterModal === 'profile' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-white/10">
                    👨‍💻
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Darshan Akshay Upadhye</h2>
                  <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
                    Hi, I&apos;m Darshan Akshay Upadhye, a B.Tech student in Electronics and Computer Engineering.
                    I have a strong passion and experience in Full Stack Web Development, Generative AI and Graphic Design. 
                    I enjoy building innovative and intelligent web applications that solve real-world problems using cutting-edge technologies.
                  </p>
                  
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Connect with Me</p>
                    <div className="flex justify-center gap-4">
                    
                      <a href="https://www.linkedin.com/in/darshan-upadhye-02a9a5287/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#0077b5] transition-colors" title="LinkedIn">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                      </a>
                      
                      <a href="https://github.com/darshan-upadhye" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-black transition-colors" title="GitHub">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      </a>
                    
                      <a href="mailto:darshanupadhye272@gmail.com" className="p-2 bg-white/10 rounded-full hover:bg-red-500 transition-colors" title="Email">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-6.623 5.772v-11.206l6.623 5.434zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm7.494 6.105l-4.408-3.603-6.568 5.338v2.16h21v-2.16l-6.568-5.338-4.408 3.603-1.05 1.03-1.05-1.03zm7.906.963l6.118 5.33v-11.206l-6.118 5.876z"/></svg>
                      </a>
                      
                      <a href="https://wa.me/918412967484?text=Hi%20Darshan,%20I%20would%20like%20to%20connect%20with%20you" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-green-500 transition-colors" title="WhatsApp">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      </a>
                      
                      <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-purple-500 transition-colors" title="Portfolio">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm-5-2v2H9V4h6zM4 8h16v11H4V8z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeFooterModal === 'team' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border border-white/10">
                    🤝
                  </div>
                  <h2 className="text-xl font-bold text-white mb-4">Team RakshakTech</h2>
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4 text-left">
                    <ul className="space-y-3 text-sm text-blue-100">
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold">1</span>
                        Darshan Akshay Upadhye
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold">2</span>
                        Niranjan Umesh Mali
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold">3</span>
                        Uttkarsh Shital Aitawade
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold">4</span>
                        Shubham Avinash Bansode
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-xs font-bold">5</span>
                        Om Mansing Patil
                      </li>
                    </ul>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}