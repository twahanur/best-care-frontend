'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldCheck, Car, ArrowRight, RotateCcw, Minus, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  language?: string;
  intent?: string;
  query_type?: string;
  sources?: Array<{ title: string; category?: string; score?: number }>;
  recommendedCar?: any;
  confidenceScore?: number;
  bookingAction?: any;
  suggestedReplies?: string[];
}

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar?: (carId: string) => void;
}

/**
 * Custom Rich Text / Markdown Renderer
 * Properly renders **bold**, `code`, and list bullets without raw markdown symbols.
 */
function FormattedMessageContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-[11px] sm:text-xs">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        // Bullet point line
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : line;

        // Parse inline **bold** and `code`
        const parts = [];
        const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }
          if (match[2]) {
            // Bold
            parts.push(
              <strong key={match.index} className="font-bold text-white tracking-wide">
                {match[2]}
              </strong>
            );
          } else if (match[3]) {
            // Code / Reference tag
            parts.push(
              <code
                key={match.index}
                className="px-1.5 py-0.5 rounded bg-indigo-950/80 text-cyan-300 font-mono text-[10px] sm:text-[11px] border border-indigo-800/60 font-semibold"
              >
                {match[3]}
              </code>
            );
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="text-slate-200">{parts}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="text-slate-200">
            {parts}
          </p>
        );
      })}
    </div>
  );
}

export function AiConciergeModal({ isOpen, onClose, onSelectCar }: AiConciergeModalProps) {
  const [sessionId, setSessionId] = useState<string>(() => `sess_${Math.random().toString(36).substring(2, 10)}`);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Finding the best options...');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Welcome to **Best Care Car Rental**! 🚗\n\nI am your dedicated 24/7 Rental Assistant. I can assist you with:\n• Finding available cars and live rates\n• Instant reservation (e.g. **"Khulna theke Dhaka SUV book koro"**)\n• Rental policies, deposits, and insurance\n\nHow may I help you today?',
      suggestedReplies: [
        '🚗 View Available Fleet',
        '⚡ Book an SUV for Tomorrow',
        '🛡️ Security Deposit Policy',
        '🏔️ Trip Advice for Sajek/Sylhet'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const stages = [
        'Checking vehicle availability & rates...',
        'Matching best options for your route...',
        'Preparing recommendations...'
      ];
      let i = 0;
      setLoadingStage(stages[0]);
      interval = setInterval(() => {
        i = (i + 1) % stages.length;
        setLoadingStage(stages[i]);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const quickPrompts = [
    { label: '🚗 Available Fleet', text: 'Khulna ও Dhaka তে কোন কোন গাড়ি অ্যাভেইলেবল আছে?' },
    { label: '⚡ Book a Car', text: 'Khulna theke Dhaka te agamikal SUV book koro' },
    { label: '🛡️ Deposit & Refund', text: 'What is the security deposit and refund policy?' },
    { label: '🏔️ Sajek / Mountain', text: 'সাজেক ও পাহাড়ি রোডের জন্য কোন গাড়ি ভালো হবে?' }
  ];

  if (!isOpen) return null;

  const handleResetSession = async () => {
    const newSessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    setSessionId(newSessionId);
    setMessages([
      {
        role: 'assistant',
        text: 'Welcome to **Best Care Car Rental**! 🚗\n\nHow may I assist you with vehicle availability, rates, or reservations today?',
        suggestedReplies: [
          '🚗 View Available Fleet',
          '⚡ Book an SUV for Tomorrow',
          '🛡️ Security Deposit Policy'
        ]
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || query;
    const text = rawText.replace(/^[🚗⚡🛡️🏔️✨💬]\s*/, '').trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const chatResult: any = await api.agenticChat(text, sessionId);
      const responseText = chatResult.answer || chatResult.message || chatResult.text || '';
      
      const suggestions: string[] = [];
      const lower = responseText.toLowerCase();
      if (lower.includes('confirm') || lower.includes('নিশ্চিত') || (chatResult.booking_action && chatResult.booking_action.status === 'confirming')) {
        suggestions.push('Haan, confirm koro', 'Cancel koro');
      } else if (lower.includes('kon car') || lower.includes('কোন গাড়ি')) {
        suggestions.push('Toyota Prado TX', 'Hyundai Tucson', 'Toyota Camry', 'Toyota HiAce');
      } else if (lower.includes('location') || lower.includes('লোকেশন')) {
        suggestions.push('Sonadanga, Khulna', 'Gulshan, Dhaka', 'Dhaka Airport (DAC)');
      } else if (lower.includes('time') || lower.includes('সময়') || lower.includes('কয়টার')) {
        suggestions.push('Sokal 11:00 AM', 'Sokal 8:00 AM', 'Dupur 2:00 PM');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: responseText,
          language: chatResult.language,
          intent: chatResult.intent,
          query_type: chatResult.query_type,
          sources: chatResult.sources,
          recommendedCar: chatResult.matched_vehicles && chatResult.matched_vehicles.length > 0 ? chatResult.matched_vehicles[0] : undefined,
          confidenceScore: chatResult.confidence_score || 0.98,
          bookingAction: chatResult.booking_action,
          suggestedReplies: suggestions.length > 0 ? suggestions : undefined
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I apologize, but I encountered a temporary connection issue. Please feel free to ask again.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[380px] sm:w-[440px] h-[620px] max-h-[calc(100vh-3.5rem)] flex flex-col bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-white tracking-wide">
                Best Care AI Concierge
              </h3>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              24/7 Instant Reservation & Fleet Guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetSession}
            title="Start New Session"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Minimize"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs scroll-smooth">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[88%] p-3.5 rounded-2xl space-y-2.5 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                  : 'bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {/* Formatted Markdown Content */}
              <FormattedMessageContent content={msg.text} />

              {/* Interactive Booking Confirmation Card */}
              {msg.bookingAction && msg.bookingAction.status === 'confirming' && (
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 space-y-2 mt-2 shadow-inner">
                  <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Ready to Confirm Reservation
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Haan, confirm koro')}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirm Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Cancel koro')}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Grounded Sources Badges */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/70 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    Verified Information
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.slice(0, 2).map((s: any, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="text-[9px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1"
                      >
                        <span className="text-blue-400 font-semibold">{s.category || 'Official Guide'}:</span> {s.title || s.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clickable Quick Reply Chips */}
              {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {msg.suggestedReplies.map((r, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => handleSendMessage(r)}
                      className="text-[10px] py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-blue-600 border border-slate-700/60 hover:border-blue-500 text-slate-300 hover:text-white transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Recommended Car CTA */}
              {msg.recommendedCar && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const fleet = document.getElementById('fleet');
                      if (fleet) fleet.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span className="truncate">View in Fleet Catalog (${msg.recommendedCar.dailyRate}/day)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Dynamic Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2.5 text-blue-400 text-xs p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-[11px] text-slate-300 font-medium">{loadingStage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Prompts Bar */}
      <div className="px-3 py-2 bg-slate-900/70 border-t border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p.text)}
              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-blue-500/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <span className="font-semibold text-blue-300">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center gap-2 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything about available cars, rates, or bookings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
