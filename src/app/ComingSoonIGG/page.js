"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComingSoon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleFormActionURL = "https://docs.google.com/forms/d/e/1FAIpQLSd9K2gInfl97yKWl8byD2NBS1dAjnR71_yam6ZlRy6I9trxZA/formResponse";
  
  const emailEntryId = "entry.250463814"; 

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0A2740] flex flex-col items-center justify-center text-center text-white relative overflow-hidden px-6">
      
      <iframe 
        name="hidden_iframe" 
        id="hidden_iframe" 
        style={{ display: "none" }} 
      ></iframe>

      <motion.img
        src="/InGeniGO.svg"
        alt="InGeniGo Logo"
        className="w-41 h-41 object-contain rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-4"
      >
        🚀 Coming Soon
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-lg max-w-xl mb-6"
      >
        I’m working on building <b>InGeniGo</b> – your smart travel wishlist & planner.  
        Stay tuned, it’s launching soon with features you’ll love.  
        Be the first to know when it’s live!
      </motion.p>

      <motion.button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📩 Notify Me
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="bg-[#1E2A38] p-8 rounded-2xl shadow-xl max-w-sm w-full text-center relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              
              {!isSubmitted ? (
                <>
                  <h2 className="text-xl font-bold mb-2 text-left">Stay Updated</h2>
                  <p className="text-sm text-gray-300 mb-4 text-left">
                    Enter your email below to get notified when InGeniGo launches.
                  </p>

                  <form 
                    action={googleFormActionURL} 
                    method="POST" 
                    target="hidden_iframe"
                    onSubmit={handleSubmit}
                    className="text-left"
                  >
                    <input
                      type="email"
                      name={emailEntryId} 
                      placeholder="Your email address"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all text-white ${
                        isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isSubmitting ? "Adding..." : "Notify Me ✅"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-12 h-12 text-white stroke-current"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      <motion.path d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-3"
                  >
                    Thank You!
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-300 text-sm mb-6 leading-relaxed"
                  >
                    You have been successfully added to the InGeniGo notification list. 
                    We will send an alert to your email the moment our project goes live.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={handleClose}
                    className="bg-transparent border border-gray-400 text-gray-300 hover:text-white hover:border-white px-6 py-2 rounded-full text-sm transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              )}

              {!isSubmitted && (
                <button
                  onClick={handleClose}
                  className="mt-4 text-sm text-gray-400 hover:text-white block w-full text-center"
                >
                  ✖ Close
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}