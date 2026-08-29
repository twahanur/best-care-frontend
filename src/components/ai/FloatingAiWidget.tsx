'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';
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
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in-90 duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="relative group px-4.5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 hover:scale-105 transition-all duration-300 flex items-center gap-2.5 font-bold text-xs border border-blue-400/30"
            aria-label="Open AI Rental Assistant"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-blue-600"></span>
            </div>
            <span className="tracking-wide font-['Plus_Jakarta_Sans'] font-extrabold">Chat with AI</span>
          </button>
        </div>
      )}

      <AiConciergeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

