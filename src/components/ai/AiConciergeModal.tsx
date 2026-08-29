'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldCheck, Car, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '@/services/api';
import { RAGResponse, CarRecommendationResponse, Vehicle } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: Array<{ title: string; category?: string; score?: number; similarity_score?: number }>;
  recommendedCar?: any;
}

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar?: (carId: string) => void;
}

export function AiConciergeModal({ isOpen, onClose, onSelectCar }: AiConciergeModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Car Rental Concierge. Tell me about your upcoming trip (destination, passengers, luggage, terrain) or ask any question about our security deposit, insurance, or fleet specs!',
    }
  ]);

  const quickPrompts = [
    'Family of 6 going to Sylhet hills with luggage for 4 days',
    'What is the security deposit and refund timeline?',
    'What are the driver eligibility & license requirements?',
    'Need executive luxury car for VIP airport transfer'
  ];

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      // If query is a trip recommendation query
      const isTripQuery = /going to|trip|family|passengers|mountain|sylhet|sajek|traveling|luggage/i.test(text);

      if (isTripQuery) {
        const recResult: CarRecommendationResponse = await api.recommendCarForTrip(text, 5);
        const primary = recResult.primary_recommendation;
        const answerText = `Here is our AI-recommended vehicle match for your trip:\n\n**${primary.title}** (Match Confidence: ${primary.match_score}%)\n\n${primary.reasoning}\n\n${primary.details}`;

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: answerText,
            sources: recResult.citations,
            recommendedCar: primary
          }
        ]);
      } else {
        const ragResult: RAGResponse = await api.askRAG(text);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: ragResult.answer,
            sources: ragResult.sources,
            recommendedCar: ragResult.matched_vehicles.length > 0 ? ragResult.matched_vehicles[0] : undefined
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I apologize, but I encountered an error querying the RAG knowledge base. Please try asking again or check our FAQ section.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[640px] shadow-2xl flex flex-col overflow-hidden relative glow-indigo">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white font-['Plus_Jakarta_Sans']">
                  AI Rental Concierge & Trip Matchmaker
                </h3>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                  RAG Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Powered by Gemini 2.0 & Vector Semantic Search</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                className={`max-w-[82%] p-3.5 rounded-2xl space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                {/* Grounded Sources Badges */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified Grounded Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          {s.title} {s.score ? `(${(s.score * 100).toFixed(0)}%)` : ''}
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
                      <span>View & Book in Fleet Catalog</span>
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
              <span>Retrieving knowledge base & generating grounded response...</span>
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
                onClick={() => handleSendMessage(p)}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-indigo-500/40 px-2.5 py-1 rounded-lg transition-colors"
              >
                {p}
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
            placeholder="Ask anything about rental rules or describe your upcoming trip..."
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
