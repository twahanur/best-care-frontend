'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { AiConciergeModal } from './AiConciergeModal';

export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-concierge', handleOpen);
    return () => window.removeEventListener('open-ai-concierge', handleOpen);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300 flex items-center gap-2.5 font-bold text-xs"
          aria-label="Open AI Rental Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping"></span>
          </div>
          <span className="hidden sm:inline-block tracking-wide">Ask AI Concierge</span>
        </button>
      </div>

      <AiConciergeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
