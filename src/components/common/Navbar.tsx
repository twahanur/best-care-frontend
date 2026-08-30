'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LayoutDashboard, Menu, X, User as UserIcon, Calendar } from 'lucide-react';
import { User } from '@/types';
import { BestCarLogo } from './BestCarLogo';

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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          
          {/* Brand Logo matching Figma */}
          <Link href="/" className="flex items-center group transition-transform duration-150">
            <BestCarLogo />
          </Link>

          {/* Desktop Navigation Links matching Figma wireframe: Home, How it Work, Rental Deals, Why Choose Us, Testimonial */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6 text-sm font-semibold text-[#4B5563]">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/' ? 'text-[#111827] font-bold' : 'hover:text-[#111827]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-lg hover:text-[#111827] transition-colors"
            >
              How It Work
            </Link>
            <Link
              href="/#fleet"
              className="px-3 py-1.5 rounded-lg hover:text-[#111827] transition-colors"
            >
              Rental Deals
            </Link>
            <Link
              href="/#why-us"
              className="px-3 py-1.5 rounded-lg hover:text-[#111827] transition-colors"
            >
              Why Choose Us
            </Link>
            <Link
              href="/#testimonials"
              className="px-3 py-1.5 rounded-lg hover:text-[#111827] transition-colors"
            >
              Testimonial
            </Link>
          </nav>

          {/* Action CTAs: Single Login / Register or Role-Based Dashboard */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Role-Specific Dashboard Button */}
                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 bg-[#111827] text-white hover:bg-slate-800 shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Dashboard</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </Link>
                )}

                {currentUser.role === 'CAR_DRIVER' && (
                  <Link
                    href="/driver"
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm"
                  >
                    <span>🚗</span>
                    <span>Driver Workspace</span>
                  </Link>
                )}

                {currentUser.role === 'CUSTOMER' && (
                  <>
                    {onOpenMyTrips && (
                      <button
                        onClick={onOpenMyTrips}
                        className="text-xs font-bold text-[#374151] hover:text-[#111827] px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>My Trips</span>
                      </button>
                    )}
                    <Link
                      href="/customer"
                      className="text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-white" />
                      <span>Customer Portal</span>
                    </Link>
                  </>
                )}

                {/* User Profile Pill */}
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-3 py-1.5 bg-[#F9FAFB] hover:bg-slate-100 transition-all text-xs font-bold text-[#111827]"
                    title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#111827] text-white text-[11px] font-extrabold flex items-center justify-center">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="truncate max-w-[90px]">{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
                      <span className="text-[9px] text-blue-600 font-semibold uppercase">{currentUser.role}</span>
                    </div>
                  </button>
                )}
              </div>
            ) : (
              /* Single Login / Register CTA for visitors */
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 group"
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Login / Register</span>
              </Link>
            )}
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
        <div className="md:hidden border-b border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
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
            How It Work
          </Link>
          <Link
            href="/#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Rental Deals
          </Link>
          <Link
            href="/#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Why Choose Us
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Testimonial
          </Link>

          {currentUser ? (
            <div className="pt-2 space-y-2 border-t border-slate-100">
              {currentUser.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-[#111827] bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                    Admin Dashboard
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Admin</span>
                </Link>
              )}

              {currentUser.role === 'CAR_DRIVER' && (
                <Link
                  href="/driver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-slate-900 bg-amber-50 border border-amber-200"
                >
                  <span className="flex items-center gap-2">
                    <span>🚗</span>
                    Driver Workspace
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">Driver</span>
                </Link>
              )}

              {currentUser.role === 'CUSTOMER' && (
                <Link
                  href="/customer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-emerald-900 bg-emerald-50 border border-emerald-200"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-emerald-700" />
                    Customer Portal
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">Customer</span>
                </Link>
              )}

              {onOpenMyTrips && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyTrips();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-800 bg-slate-50 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#0284C7]" />
                  My Trips & Reservations
                </button>
              )}

              {onOpenAuth && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  My Account Profile
                </button>
              )}
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-[#111827] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <UserIcon className="w-4 h-4 text-blue-400" />
                Login / Register
              </Link>
            </div>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-concierge'));
            }}
            className="w-full mt-2 py-3 rounded-xl bg-[#0284C7] text-white font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            AI Assistant
          </button>
        </div>
      )}
    </header>
  );
}
