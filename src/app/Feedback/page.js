'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Check, 
  Send, 
  ThumbsUp, 
  Heart 
} from 'lucide-react';

export default function FeedbackPage() {
  const formRef = useRef(null);

  const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWMJLGawgGHRBe_CMfQ-w4pdEmbrN5yKXUmwAFDWWuohcWfQ/formResponse";
  
  const FORM_IDS = {
    name: "entry.496199743",
    email: "entry.1374381743",
    role: "entry.643378004",
    usage: "entry.577550932",
    rating: "entry.1620020567",
    liked: "entry.399161891",
    feedback: "entry.1161135458",
    consent: "entry.1901755385"
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    usage: '',
    rating: '5',
    liked: [],
    feedback: '',
    consent: false,
  });

  const [status, setStatus] = useState({ loading: false, error: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const likedOptions = [
    'AI voice assistance',
    'Emotion detection',
    'Parking booking',
    'Food ordering',
    'Calm driving guidance',
    'Overall experience',
  ];

  const roles = [
    "Daily commuter",
    "Professional driver",
    "Long-distance traveler",
    "New driver",
    "Other"
  ];

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  
  const toggleLiked = (value) =>
    setForm((f) => {
      const exists = f.liked.includes(value);
      const liked = exists ? f.liked.filter((v) => v !== value) : [...f.liked, value];
      return { ...f, liked };
    });

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (!form.role) return 'Please select your role.';
    if (!form.usage.trim()) return 'Please tell us how you plan to use it.';
    if (!form.consent) return 'Please accept the consent to proceed.';
    return '';
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: false, error: '' });

    const err = validate();
    if (err) {
      setStatus({ loading: false, error: err });
      return;
    }

    setStatus({ loading: true, error: '' });

    if (formRef.current) {
      formRef.current.submit();
    }

    setTimeout(() => {
      setStatus({ loading: false, error: '' });
      setShowSuccessModal(true);
      setForm({
        name: '', email: '', role: '', usage: '', rating: '5', liked: [], feedback: '', consent: false
      });
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    window.location.href = '/'; 
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] text-white font-sans relative flex flex-col items-center py-8 px-4 md:px-6">
      
      <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>

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
        className="w-full max-w-2xl relative z-10"
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <div className="text-center mb-8">
          <motion.img 
            src="/RakshaSootra_Icon.svg" 
            alt="RakshaSootra Logo" 
            className="w-20 h-20 mx-auto mb-4 drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">We Value Your Feedback</h1>
          <p className="text-slate-400 text-sm">Help us improve the Sootra of Peaceful Driving.</p>
        </div>

        <motion.div 
          className="bg-[#112240] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 md:p-8"
          variants={fadeUp}
        >
          <AnimatePresence>
            {status.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {status.error}
              </motion.div>
            )}
          </AnimatePresence>

          <form 
            ref={formRef} 
            action={GOOGLE_FORM_ACTION_URL} 
            method="POST" 
            target="hidden_iframe" 
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    name={FORM_IDS.name} 
                    value={form.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                    className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    name={FORM_IDS.email} 
                    value={form.email} 
                    onChange={(e) => updateField('email', e.target.value)} 
                    className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">I am a</label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  name={FORM_IDS.role} 
                  value={form.role} 
                  onChange={(e) => updateField('role', e.target.value)} 
                  className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-500">Select your role</option>
                  {roles.map(r => <option key={r} value={r} className="bg-[#0A192F]">{r}</option>)}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Planned Usage</label>
              <input 
                type="text" 
                name={FORM_IDS.usage} 
                value={form.usage} 
                onChange={(e) => updateField('usage', e.target.value)} 
                className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                placeholder="e.g., Daily commute, weekend trips..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Overall Satisfaction</label>
              <div className="flex justify-between bg-[#0A192F] p-2 rounded-xl border border-white/5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="cursor-pointer flex-1 relative">
                    <input 
                      type="radio" 
                      name={FORM_IDS.rating} 
                      value={String(num)} 
                      checked={form.rating === String(num)} 
                      onChange={(e) => updateField('rating', e.target.value)} 
                      className="peer sr-only"
                    />
                    <div className="flex flex-col items-center justify-center py-2 rounded-lg transition-all peer-checked:bg-blue-600 peer-checked:text-white text-slate-400 hover:bg-white/5">
                      <Star size={20} className={form.rating >= String(num) ? "fill-current" : ""} />
                      <span className="text-[10px] font-bold mt-1">{num}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">What did you like?</label>
              <div className="flex flex-wrap gap-2">
                {likedOptions.map((opt) => {
                  const isSelected = form.liked.includes(opt);
                  return (
                    <label 
                      key={opt} 
                      className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium border transition-all select-none flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                          : 'bg-[#0A192F] border-white/10 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleLiked(opt)} 
                        className="hidden" 
                      />
                      {isSelected && <Check size={12} />}
                      {opt}
                    </label>
                  );
                })}
              </div>

              {form.liked.map((item, i) => <input key={i} type="hidden" name={FORM_IDS.liked} value={item} />)}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Additional Feedback</label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
                <textarea 
                  name={FORM_IDS.feedback} 
                  rows={4} 
                  value={form.feedback} 
                  onChange={(e) => updateField('feedback', e.target.value)} 
                  className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600 resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.consent ? 'bg-blue-600 border-blue-600' : 'border-slate-500 bg-transparent'}`}>
                {form.consent && <Check size={14} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                name={FORM_IDS.consent} 
                value="Yes" 
                checked={form.consent} 
                onChange={(e) => updateField('consent', e.target.checked)} 
                className="hidden" 
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                I agree to share this feedback for improving RakshaSootra.
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={status.loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                status.loading 
                  ? 'bg-slate-600 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
              }`}
            >
              {status.loading ? (
                <>Sending...</>
              ) : (
                <>Submit Feedback <Send size={18} /></>
              )}
            </motion.button>

          </form>
        </motion.div>

      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSuccess}
          >
            <motion.div 
              className="bg-[#112240] rounded-3xl p-8 max-w-sm w-full text-center border border-white/10 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                <ThumbsUp size={40} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Your feedback is incredibly valuable to us. We appreciate you taking the time to help make RakshaSootra better.
              </p>

              <button 
                onClick={handleCloseSuccess}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/10"
              >
                Return to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}