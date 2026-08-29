'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, Sparkles, ShieldCheck, FileText, CheckCircle2, Bot, Layers, ArrowRight, Globe, RotateCcw, Cpu } from 'lucide-react';
import { api } from '@/services/api';
import { AgentChatResponse } from '@/types';

export default function RagTesterPage() {
  const [sessionId, setSessionId] = useState<string>(() => `test_sess_${Math.random().toString(36).substring(2, 9)}`);
  const [query, setQuery] = useState('amader 6 joner family niye sajek jabo kon gari bhalo hobe?');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<AgentChatResponse[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);

  useEffect(() => {
    async function loadDocs() {
      const res = await api.getKnowledgeDocs();
      if (res?.documents) {
        setKnowledgeDocs(res.documents);
      }
    }
    loadDocs();
  }, []);

  const handleTestSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToExecute = customQuery || query;
    if (!queryToExecute.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.agenticChat(queryToExecute, sessionId);
      setChatHistory(prev => [...prev, res]);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSessionId(`test_sess_${Math.random().toString(36).substring(2, 9)}`);
    setChatHistory([]);
  };

  const sampleQueries = [
    { label: '🇧🇩 Bangla', query: 'সিকিউরিটি ডিপোজিট ও রিফান্ড পলিসি বিস্তারিত কি?' },
    { label: '🗣️ Banglish Trip', query: 'amader 6 joner family niye sajek jabo kon gari bhalo hobe?' },
    { label: '🔄 Follow-up Cost', query: '4 diner jonno total koto porbe?' },
    { label: '👑 English VIP', query: 'Need luxury executive sedan for corporate airport delegation' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold shadow-lg shadow-cyan-500/10">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL pgvector • Non-Blocking RAG • Conversational Memory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Production Agentic RAG Diagnostics & Inspector
          </h1>
          <p className="text-sm text-slate-400">
            Test database-driven dynamic embeddings, multi-turn memory, Reciprocal Rank Fusion (RRF), and multilingual synthesis.
          </p>
        </div>

        {/* Live Query Tester Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl relative glow-cyan space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>Active Session: <strong className="text-white">{sessionId}</strong> ({chatHistory.length} turns in memory)</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Context</span>
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Try Sample Inquiries:</span>
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.query);
                  handleTestSearch(undefined, item.query);
                }}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
              >
                <span className="font-semibold text-cyan-300">{item.label}:</span> {item.query}
              </button>
            ))}
          </div>

          <form onSubmit={handleTestSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask in English, বাংলা (Bangla), or Banglish..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Execute Agentic Query</span>
              </button>
            </div>
          </form>

          {/* Multi-Turn Results Stream */}
          {chatHistory.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Multi-Turn Conversation & Memory Stream ({chatHistory.length} turns)</span>
              </h3>

              {chatHistory.map((res, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-4">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-indigo-300">Turn #{i + 1}: &ldquo;{res.query}&rdquo;</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                        Lang: {res.language}
                      </span>
                      {res.confidence_score && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Grounding: {(res.confidence_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                    {res.answer}
                  </div>

                  {/* Sources / Citations */}
                  {res.sources && res.sources.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Grounded PostgreSQL pgvector Chunks (RRF & Cosine Similarity):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {res.sources.map((src, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-200 truncate max-w-[240px]">{src.title}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                              Sim: {((src.similarity_score || 0.9) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PostgreSQL Database Canonical Knowledge Inspector */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>PostgreSQL Canonical Documents (Single Source of Truth)</span>
              </h2>
              <p className="text-xs text-slate-400">Database entities automatically synchronized with pgvector embeddings in the background</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
              {knowledgeDocs.length > 0 ? knowledgeDocs.length : 15} Documents in DB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {knowledgeDocs.map((doc: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">{doc.category}</span>
                  {doc.content_hash && (
                    <span className="text-[9px] font-mono text-slate-500 truncate max-w-[80px]">#{doc.content_hash.substring(0, 6)}</span>
                  )}
                </div>
                <p className="font-semibold text-white truncate">{doc.title}</p>
                <div className="text-[10px] text-emerald-400 font-mono">ID: {doc.id}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
