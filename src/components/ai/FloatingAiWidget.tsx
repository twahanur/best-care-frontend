'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';
import { api } from '@/services/api';
import { AiConciergeModal } from './AiConciergeModal';


export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Silent warmup ping so backend container wakes up in background
    api.getCategoriesStats().catch(() => {});

    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-ai-concierge', handleOpen);
    window.addEventListener('open-ai-chat', handleOpen);
    window.addEventListener('toggle-ai-chat', handleToggle);
    window.addEventListener('close-ai-chat', handleClose);

    return () => {
      window.removeEventListener('open-ai-concierge', handleOpen);
      window.removeEventListener('open-ai-chat', handleOpen);
      window.removeEventListener('toggle-ai-chat', handleToggle);
      window.removeEventListener('close-ai-chat', handleClose);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in zoom-in-90 duration-300">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative group px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-indigo-900/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 font-bold text-xs border border-white/20 cursor-pointer"
            aria-label="Open AI Rental Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600"></span>
            </div>
            <span className="tracking-wide font-['Plus_Jakarta_Sans'] font-extrabold text-white">
              AI Concierge
            </span>
          </button>
        </div>
      )}

      <AiConciergeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
