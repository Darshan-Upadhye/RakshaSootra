'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Star, 
  Trash2, 
  Edit, 
  Search, 
  Send, 
  X, 
  Phone, 
  User, 
  CheckCircle,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InboxPage() {

  const initialMessages = useMemo(() => [
    {
      id: 'm1',
      type: 'email',
      from: 'Raksha Team',
      contact: 'support@raksha.com',
      subject: 'Welcome to RakshaSootra',
      preview: 'Thanks for joining the Sootra of Peaceful Driving.',
      time: '10:12 AM',
      unread: true,
      starred: false,
      body: 'Welcome aboard! Stay safe, calm, and focused with RakshaSootra. Explore SOS, Mood, Music, and more features designed for your safety.',
    },
    {
      id: 'm2',
      type: 'sms',
      from: '+91 98765 XXXXX',
      contact: '+91 98765 XXXXX',
      subject: 'Sent a location',
      preview: 'Hey, I reached the destination safely.',
      time: '09:40 AM',
      unread: false,
      starred: true,
      body: 'Hey, I reached the destination safely. The traffic was moderate. See you soon!',
    },
    {
      id: 'm3',
      type: 'email',
      from: 'System Alert',
      contact: 'admin@raksha.com',
      subject: 'Drive Summary: Good',
      preview: 'Your last drive summary is ready.',
      time: 'Yesterday',
      unread: false,
      starred: false,
      body: 'Your drive summary shows smooth acceleration and consistent speed. Your safety score is 95/100. Keep it up!',
    },
  ], []);

  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const filteredMessages = useMemo(() => {
    let list = messages;
    if (filter === 'unread') list = list.filter((m) => m.unread);
    if (filter === 'starred') list = list.filter((m) => m.starred);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, query]);

  const selectedMessage = useMemo(() => 
    messages.find((m) => m.id === selectedId), 
  [messages, selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, unread: false } : m));
  };

  const handleToggleStar = (e, id) => {
    e.stopPropagation();
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const determineType = (input) => {
    return input.includes('@') ? 'email' : 'sms';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeBody.trim()) return;

    const type = determineType(composeTo);
    const newMsg = {
      id: `m${Date.now()}`,
      type: type,
      from: 'Me',
      contact: 'Self',
      subject: type === 'email' ? (composeSubject || '(No Subject)') : 'Text Message',
      preview: composeBody.slice(0, 40) + '...',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false,
      starred: false,
      body: composeBody,
    };

    setMessages([newMsg, ...messages]);
    setComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    alert(`Message sent via ${type === 'email' ? 'Email' : 'SMS'}!`);
  };

  const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const cardVariant = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } };

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
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="font-semibold text-lg tracking-wide text-white flex items-center gap-2">
                Inbox <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded-full">{messages.filter(m => m.unread).length}</span>
              </h1>
            </div>
          </div>
          <button 
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-transform active:scale-95 shadow-lg"
          >
            <Edit size={16} /> <span className="hidden sm:inline">Compose</span>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          
          <div className={`w-full md:w-2/5 border-r border-white/5 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
            
            <div className="p-3 border-b border-white/5 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {['all', 'unread', 'starred'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                  <Inbox size={32} />
                  <p className="text-sm">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layoutId={msg.id}
                    onClick={() => handleSelect(msg.id)}
                    className={`p-3 mb-2 rounded-xl cursor-pointer border transition-all hover:bg-white/5 group ${
                      selectedId === msg.id 
                        ? 'bg-blue-600/10 border-blue-500/30' 
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <span className={`text-sm font-semibold truncate max-w-[140px] ${msg.unread ? 'text-white' : 'text-slate-300'}`}>
                          {msg.from}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${msg.unread ? 'text-slate-200' : 'text-slate-400'}`}>{msg.subject}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.preview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {msg.type === 'email' ? <Mail size={12} className="text-slate-500" /> : <MessageSquare size={12} className="text-slate-500" />}
                        <button onClick={(e) => handleToggleStar(e, msg.id)} className="text-slate-500 hover:text-yellow-400">
                          <Star size={12} fill={msg.starred ? "currentColor" : "none"} className={msg.starred ? "text-yellow-400" : ""} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className={`w-full md:w-3/5 flex flex-col bg-[#0A192F]/50 md:bg-transparent ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
            
            {selectedMessage ? (
              <>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#112240] md:bg-transparent">
                  <button 
                    onClick={() => setSelectedId(null)} 
                    className="md:hidden flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <div className="flex gap-3 ml-auto">
                    <button onClick={(e) => handleToggleStar(e, selectedMessage.id)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-yellow-400">
                      <Star size={18} fill={selectedMessage.starred ? "currentColor" : "none"} className={selectedMessage.starred ? "text-yellow-400" : ""} />
                    </button>
                    <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <h2 className="text-xl font-bold text-white mb-4">{selectedMessage.subject}</h2>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedMessage.from.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{selectedMessage.from}</p>
                        <span className="text-[10px] bg-white/10 px-1.5 rounded text-slate-300 uppercase">{selectedMessage.type}</span>
                      </div>
                      <p className="text-xs text-slate-400">{selectedMessage.contact}</p>
                    </div>
                    <div className="ml-auto text-xs text-slate-500">{selectedMessage.time}</div>
                  </div>

                  <div className="bg-[#0A192F] p-4 rounded-xl border border-white/5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner">
                    {selectedMessage.body}
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-[#112240]">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={`Reply via ${selectedMessage.type === 'email' ? 'Email' : 'SMS'}...`}
                      className="w-full bg-[#0A192F] border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors">
                      <Send size={14} className="text-white ml-0.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Mail size={32} className="opacity-50" />
                </div>
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-2 border-t border-white/5 text-center bg-[#112240] md:bg-transparent">
          <p className="text-[10px] text-slate-500">
            * This is dummy data for visualization purposes. Our team is actively working on integrating live features.
          </p>
        </div>

      </motion.div>

      <AnimatePresence>
        {composeOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" onClick={() => setComposeOpen(false)} />
            
            <motion.div 
              className="relative w-full max-w-lg bg-[#112240] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-[#0A192F]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit size={18} className="text-blue-400" /> New Message
                </h3>
                <button onClick={() => setComposeOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSend} className="p-5 space-y-4 overflow-y-auto">
                
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">To (Email or Mobile Number)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      placeholder="e.g., user@email.com or +919876543210"
                      className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      autoFocus
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {composeTo.includes('@') ? <Mail size={16} /> : <Phone size={16} />}
                    </div>
                    {composeTo && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                        {composeTo.includes('@') ? 'Email' : 'SMS'}
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {composeTo.includes('@') && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Subject</label>
                      <input 
                        type="text" 
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="Subject line..."
                        className="w-full bg-[#0A192F] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Message</label>
                  <textarea 
                    rows={6}
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-[#0A192F] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}