'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Car, Sparkles, Search, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: { pickupLocation: string; returnLocation: string; category: string; pickupDate: string; returnDate: string }) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [pickupLocation, setPickupLocation] = useState('Hazrat Shahjalal Intl Airport (DAC)');
  const [returnLocation, setReturnLocation] = useState('Hazrat Shahjalal Intl Airport (DAC)');
  const [category, setCategory] = useState('All');
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('2026-09-05');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ pickupLocation, returnLocation, category, pickupDate, returnDate });
    const fleetElem = document.getElementById('fleet');
    if (fleetElem) {
      fleetElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 bg-[#F8F9FB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Row (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>100% Trusted Car Rental Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.15]">
              FAST AND EASY WAY TO <span className="text-blue-600">RENT A CAR</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Find your ideal vehicle for daily commutes, weekend road trips, or executive corporate transfers with guaranteed low rates, verified drivers, and 24/7 support.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#fleet"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Rent Car</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm shadow-sm transition-colors"
              >
                How It Works
              </a>
            </div>

            {/* Rating / Trust Line */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">4.8 / 5.0</span>
              <span className="text-xs text-slate-500">• (1,200+ Verified Reviews)</span>
            </div>

          </div>

          {/* Right Column: Hero Car Card (Figma Style) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl bg-gradient-to-tr from-slate-200/80 via-slate-100 to-blue-50 border border-slate-200/60 p-6 flex items-center justify-center overflow-hidden shadow-xl">
              
              {/* Background decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-2xl"></div>
              
              {/* Hero Car Showcase Image */}
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
                  alt="Luxury Rental Vehicle"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Feature Badges */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800">Zero Excess Cover</div>
                  <div className="text-[10px] text-slate-500">100% Insured Fleet</div>
                </div>
              </div>

              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500">Starting from</div>
                <div className="text-sm font-extrabold text-blue-600">$55 <span className="text-[10px] text-slate-500 font-normal">/ day</span></div>
              </div>

            </div>
          </div>

        </div>

        {/* Floating Multi-field Search Bar Card */}
        <div className="max-w-6xl mx-auto">
          <div className="figma-card p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xl bg-white relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                
                {/* 1. Pick-up Location */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Pick-up Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Dhanmondi Express Hub">Dhanmondi Express Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                  </select>
                </div>

                {/* 2. Pick-up Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* 3. Return Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* 4. Category Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    Vehicle Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="All">All Categories</option>
                    <option value="SUV">SUV & 4x4</option>
                    <option value="Sedan">Premium Sedan</option>
                    <option value="Electric">Electric / Tesla</option>
                    <option value="Luxury">Executive Luxury</option>
                    <option value="Van">Passenger Van</option>
                  </select>
                </div>

                {/* 5. Submit CTA */}
                <div className="pt-5 lg:pt-0">
                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Car</span>
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

