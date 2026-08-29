'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, Sparkles, ShieldCheck, FileText, CheckCircle2, Bot, Layers, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { RAGResponse } from '@/types';

export default function RagTesterPage() {
  const [query, setQuery] = useState('What are the driver license requirements and security deposit rules for 4x4 SUVs?');
  const [loading, setLoading] = useState(false);
  const [ragResult, setRagResult] = useState<RAGResponse | null>(null);
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

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.askRAG(query);
      setRagResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>RAG Architecture & Vector Index Inspector</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Retrieval-Augmented Generation (RAG) Diagnostics
          </h1>
          <p className="text-sm text-slate-400">
            Test real-time semantic embeddings, cosine similarity vector search, and grounded context extraction.
          </p>
        </div>

        {/* Live Query Tester Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl relative glow-cyan space-y-6">
          <form onSubmit={handleTestSearch} className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Enter Natural Language Query or Trip Scenario:</span>
              <span className="text-cyan-400 font-semibold lowercase">text-embedding-004 + cosine similarity</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Can I take the Prado to Sylhet hills and what is the deposit?"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Execute RAG Retrieval</span>
              </button>
            </div>
          </form>

          {/* Results Display */}
          {ragResult && (
            <div className="space-y-6 pt-6 border-t border-slate-800">
              
              {/* Generated Answer */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
                  <Bot className="w-4 h-4" />
                  <span>Gemini Grounded Synthesized Response</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {ragResult.answer}
                </div>
              </div>

              {/* Retrieved Sources & Scores */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Top-Ranked Context Chunks from Vector Store (Cosine Similarity Scores):</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ragResult.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate max-w-[220px]">{src.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Score: {(src.similarity_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-indigo-400 font-semibold">{src.category}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Indexed Documents Knowledge Base Viewer */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Indexed RAG Knowledge Base Chunks
              </h2>
              <p className="text-xs text-slate-400">Current domain knowledge documents loaded into in-memory vector index</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-bold">
              {knowledgeDocs.length > 0 ? knowledgeDocs.length : 14} Chunks Indexed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {(knowledgeDocs.length > 0 ? knowledgeDocs : [
              { id: 'fleet_prado_suv', category: 'Fleet Specs', title: 'Toyota Land Cruiser Prado TX (4x4 Luxury SUV)' },
              { id: 'fleet_tucson_suv', category: 'Fleet Specs', title: 'Hyundai Tucson AWD (Compact Modern SUV)' },
              { id: 'fleet_tesla_modely', category: 'Fleet Specs', title: 'Tesla Model Y Long Range (Electric SUV)' },
              { id: 'fleet_mercedes_eclass', category: 'Fleet Specs', title: 'Mercedes-Benz E-Class AMG Line' },
              { id: 'policy_age_license', category: 'Rental Policy', title: 'Driver Eligibility & License Requirements' },
              { id: 'policy_deposit_refund', category: 'Rental Policy', title: 'Security Deposit & Refund Timelines' }
            ]).map((doc: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">{doc.category}</span>
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
