'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Sparkles, LayoutDashboard, Database, Menu, X, User as UserIcon, Calendar, CheckCircle2 } from 'lucide-react';
import { User } from '@/types';
import { api } from '@/services/api';

interface NavbarProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
  onOpenMyTrips?: () => void;
}

export function Navbar({ currentUser, onOpenAuth, onOpenMyTrips }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                RENT<span className="text-blue-600">CARS</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3 text-sm font-medium text-slate-600">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/' ? 'text-blue-600 font-bold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#fleet"
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Popular deals
            </Link>
            <Link
              href="/#why-us"
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Why choose us
            </Link>
            <Link
              href="/#testimonials"
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Testimonials
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* My Trips Button */}
            {currentUser && onOpenMyTrips && (
              <button
                onClick={onOpenMyTrips}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>My Trips</span>
              </button>
            )}

            {/* User Auth Pill / Button */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-800 transition-all flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {currentUser ? currentUser.name.charAt(0) : <UserIcon className="w-3 h-3" />}
                </div>
                <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
              </button>
            )}

            {/* Admin Dashboard */}
            <Link
              href="/admin"
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>

            {/* AI Matchmaker */}
            <button
              onClick={() => {
                const event = new CustomEvent('open-ai-concierge');
                window.dispatchEvent(event);
              }}
              className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              AI Matchmaker
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            How it works
          </Link>
          <Link
            href="/#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Popular deals
          </Link>
          <Link
            href="/#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Why choose us
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Testimonials
          </Link>

          {onOpenMyTrips && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyTrips();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-800 bg-slate-50 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              My Trips & Reservations
            </button>
          )}

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-blue-600 bg-blue-50"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Admin Dashboard
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Live</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-concierge'));
            }}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-5 h-5 text-blue-200" />
            AI Trip Matchmaker
          </button>
        </div>
      )}
    </header>
  );
}
