'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Car, Sparkles, Search, Shield, Zap, Award } from 'lucide-react';

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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Dynamic Background Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner glow-indigo">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>AI-Grounded Vehicle Matching & Dynamic Fleet Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.15]">
            Drive Luxury. Conquer Terrains.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400">
              Matched by AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            From rugged 4x4 mountain expeditions to high-profile executive airport transfers. 
            Instant transparent booking with zero hidden fees and 24/7 priority support.
          </p>

          {/* Quick Value Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Excess Protection Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Instant Airport Delivery in 30 Mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>4.9/5 Rating (2,400+ Trips)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Rental Search Widget Card */}
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 relative glow-indigo">
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-base text-white">Find Your Perfect Rental</span>
              </div>
              
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Not sure? Describe your trip to AI
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Pick-up Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    Pick-up Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Dhanmondi Express Hub">Dhanmondi Express Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                    <option value="Cox's Bazar Beach Hub">Cox's Bazar Beach Hub</option>
                  </select>
                </div>

                {/* Return Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Drop-off Location
                  </label>
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                    <option value="Cox's Bazar Beach Hub">Cox's Bazar Beach Hub</option>
                  </select>
                </div>

                {/* Pick-up Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Return Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

              </div>

              {/* Bottom Row: Category & Submit CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vehicle Category Filter</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'SUV', 'Luxury', 'Electric', 'Sedan', 'Van', 'Sports'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          category === cat
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat === 'All' ? 'All Fleet' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] transition-all"
                  >
                    <Search className="w-4 h-4" />
                    Search Available Fleet
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
