'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldCheck, Car, ArrowRight, RotateCcw, Globe } from 'lucide-react';
import { api } from '@/services/api';
import { AgentChatResponse, CarRecommendationResponse } from '@/types';

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
      text: 'Hello! I am your Agentic AI Car Rental Concierge. I remember our conversation context and support English, বাংলা (Bengali), and Banglish. Tell me about your destination, passengers, luggage, or ask any policy/pricing questions!',
    }
  ]);

  const quickPrompts = [
    { label: '🇧🇩 বাংলা', text: 'সিলেটের চা বাগান ও পাহাড়ের জন্য কোন গাড়ি ভালো হবে?' },
    { label: '🗣️ Banglish', text: 'amader 6 joner family niye sajek jabo kon gari bhalo hobe?' },
    { label: '🛡️ Deposit Policy', text: 'What is the security deposit and refund timeline?' },
    { label: '👑 VIP Transfer', text: 'Need executive luxury car for VIP airport transfer' }
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
          text: 'I apologize, but I encountered an error querying the RAG knowledge base. Please try asking again.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[660px] shadow-2xl flex flex-col overflow-hidden relative glow-indigo">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">
                  Agentic AI Rental Concierge
                </h3>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  PostgreSQL RAG & Memory
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Conversational Context • Multilingual (Bangla / Banglish / English)</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetSession}
              title="Reset Conversation Memory"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[84%] p-3.5 rounded-2xl space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Language / Confidence Header for Assistant */}
                {msg.role === 'assistant' && (msg.language || msg.confidenceScore) && (
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800/60 text-[10px] text-slate-400">
                    <span className="capitalize font-semibold text-indigo-300">
                      Language: {msg.language === 'bangla' ? 'বাংলা (Bengali)' : msg.language === 'banglish' ? 'Banglish' : 'English'}
                    </span>
                    {msg.confidenceScore && (
                      <span className="text-emerald-400 font-mono font-bold">
                        Grounding: {(msg.confidenceScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Grounded Sources Badges */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      PostgreSQL Grounded Evidence:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <span className="text-indigo-400">{s.category}:</span> {s.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Car Card Button */}
                {msg.recommendedCar && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        const fleet = document.getElementById('fleet');
                        if (fleet) fleet.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>View & Book {msg.recommendedCar.title || 'in Fleet'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Retrieving PostgreSQL pgvector & generating grounded response...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-5 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Try:</span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="font-semibold text-indigo-300">{p.label}:</span>
                <span className="truncate max-w-[220px]">{p.text}</span>
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
          className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask in English, বাংলা (Bangla), or Banglish (e.g. sajek jabo gari lagbe)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
