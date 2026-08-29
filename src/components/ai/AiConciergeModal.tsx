'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldCheck, Car, ArrowRight, RotateCcw, Globe, Minus, MessageSquare } from 'lucide-react';
import { api } from '@/services/api';
import { AgentChatResponse } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  language?: string;
  intent?: string;
  sources?: Array<{ title: string; category?: string; score?: number; similarity_score?: number; rrf_score?: number }>;
  recommendedCar?: any;
  confidenceScore?: number;
}

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar?: (carId: string) => void;
}

export function AiConciergeModal({ isOpen, onClose, onSelectCar }: AiConciergeModalProps) {
  const [sessionId, setSessionId] = useState<string>(() => `sess_${Math.random().toString(36).substring(2, 10)}`);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Rental Concierge. I remember our conversation and understand English, বাংলা, and Banglish. Tell me about your destination, passengers, luggage, or ask any rental policy question!',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: '🇧🇩 বাংলা', text: 'সিলেটের চা বাগান ও পাহাড়ের জন্য কোন গাড়ি ভালো হবে?' },
    { label: '🗣️ Banglish', text: 'amader 6 joner family niye sajek jabo kon gari bhalo hobe?' },
    { label: '🛡️ Deposit', text: 'What is the security deposit and refund timeline?' },
    { label: '👑 Luxury', text: 'Dhaka airport VIP meet and greet car rental options' }
  ];

  if (!isOpen) return null;

  const handleResetSession = async () => {
    const newSessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    setSessionId(newSessionId);
    setMessages([
      {
        role: 'assistant',
        text: 'Session reset! Conversation memory refreshed. How can I assist you with your rental plans today?',
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      // Call PostgreSQL Agentic Chat with Conversational Memory
      const chatResult: AgentChatResponse = await api.agenticChat(text, sessionId);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: chatResult.answer,
          language: chatResult.language,
          intent: chatResult.intent,
          sources: chatResult.sources,
          recommendedCar: chatResult.matched_vehicles && chatResult.matched_vehicles.length > 0 ? chatResult.matched_vehicles[0] : undefined,
          confidenceScore: chatResult.confidence_score
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I apologize, but I encountered an error querying the knowledge base. Please try asking again.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] h-[590px] max-h-[calc(100vh-3.5rem)] flex flex-col bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-indigo-950/70 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Floating Chat Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-white font-['Plus_Jakarta_Sans']">
                AI Rental Concierge
              </h3>
              <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1 py-0.2 rounded">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Gemini & PostgreSQL RAG • Multi-turn Memory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetSession}
            title="New Chat (Reset Memory)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Minimize Chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3 rounded-2xl space-y-2 text-xs ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/85 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {/* Language / Confidence Tag for Assistant */}
              {msg.role === 'assistant' && (msg.language || msg.confidenceScore) && (
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800/60 text-[9px] text-slate-400">
                  <span className="capitalize font-semibold text-indigo-300">
                    Language: {msg.language === 'bangla' ? 'বাংলা' : msg.language === 'banglish' ? 'Banglish' : 'English'}
                  </span>
                  {msg.confidenceScore && (
                    <span className="text-emerald-400 font-mono font-bold">
                      Grounding: {(msg.confidenceScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-line leading-relaxed text-[11px] sm:text-xs">
                {msg.text}
              </div>

              {/* Grounded Sources Badges */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    Verified Knowledge:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.slice(0, 3).map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1"
                      >
                        <span className="text-indigo-400 font-semibold">{s.category}:</span> {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Car CTA Button */}
              {msg.recommendedCar && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const fleet = document.getElementById('fleet');
                      if (fleet) fleet.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <Car className="w-3 h-3" />
                    <span className="truncate">View in Fleet Catalog</span>
                    <ArrowRight className="w-3 h-3" />
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

        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[11px]">Searching NeonDB & generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Prompts */}
      <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              className="text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/40 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="font-semibold text-indigo-300">{p.label}:</span>
              <span className="truncate max-w-[140px]">{p.text}</span>
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
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask in English, বাংলা, or Banglish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-indigo-600/30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
