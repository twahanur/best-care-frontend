'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Sparkles, LayoutDashboard, Database, Menu, X, ShieldCheck, PhoneCall } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  DIGITAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">PYLOT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Rentals
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered Premium Fleet</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Customer Portal
            </Link>
            <Link
              href="/#fleet"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Fleet Catalog
            </Link>
            <Link
              href="/#why-us"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Why Choose Us
            </Link>
            <Link
              href="/rag-tester"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                pathname === '/rag-tester' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              RAG Inspector
            </Link>
            <Link
              href="/admin"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isAdmin ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              Admin Dashboard
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+8801700000000"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              24/7 Hotline
            </a>
            <button
              onClick={() => {
                const event = new CustomEvent('open-ai-concierge');
                window.dispatchEvent(event);
              }}
              className="relative group px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white overflow-hidden shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:scale-[1.02]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
                AI Trip Matchmaker
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Customer Home
          </Link>
          <Link
            href="/#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Fleet Catalog
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-indigo-400 bg-indigo-500/10"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Admin Dashboard
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Live</span>
          </Link>
          <Link
            href="/rag-tester"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-slate-800"
          >
            <Database className="w-5 h-5" />
            RAG Vector Inspector
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-concierge'));
            }}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            Ask AI Car Matchmaker
          </button>
        </div>
      )}
    </header>
  );
}
