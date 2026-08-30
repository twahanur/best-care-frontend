'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: { pickupLocation: string; returnLocation: string; category: string; pickupDate: string; returnDate: string }) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [pickupCity, setPickupCity] = useState('Select your city');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('Select your time');

  const [dropoffCity, setDropoffCity] = useState('Select your city');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('Select your time');

  const [activeTab, setActiveTab] = useState<'pickup' | 'dropoff'>('pickup');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      pickupLocation: pickupCity !== 'Select your city' ? pickupCity : 'London Central',
      returnLocation: dropoffCity !== 'Select your city' ? dropoffCity : 'London Central',
      category: 'All',
      pickupDate: pickupDate || '2026-09-01',
      returnDate: dropoffDate || '2026-09-05'
    });
    const fleetElem = document.getElementById('fleet');
    if (fleetElem) {
      fleetElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 bg-[#F8F9FB] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Row (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
          
          {/* Left Column: Headline & CTAs (Exact Figma Copy & Typography) */}
          <div className="lg:col-span-6 space-y-6">
            
            <p className="text-xs sm:text-sm font-semibold text-[#4B5563] tracking-wide">
              100% Trusted Car rental platform in the UK
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111827] tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.12]">
              FAST AND EASY WAY TO RENT A CAR
            </h1>

            <p className="text-sm sm:text-base text-[#6B7280] max-w-xl leading-relaxed">
              Our Car Rental online booking system designed to meet the specific needs of car rental business owners. This easy-to-use car rental software will let you manage.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <a
                href="#fleet"
                className="px-7 py-3.5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] inline-flex items-center justify-center"
              >
                Booking Now
              </a>

              <a
                href="#fleet"
                className="text-sm font-semibold text-[#4B5563] hover:text-[#111827] transition-colors inline-flex items-center gap-1.5"
              >
                <span>See all cars</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Hero Visual Container (Exact Figma Rounded Box) */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-[32px] bg-[#9CA3AF]/40 overflow-hidden flex items-center justify-center shadow-lg border border-slate-300/40 group">
              
              {/* High Quality Hero Car Image */}
              <div className="relative w-full h-full p-6 flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85"
                  alt="Best Car Rental"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

            </div>
          </div>

        </div>

        {/* Floating Search Filter Bar Widget (Exact Figma Layout) */}
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 md:p-8">
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Pick-Up Section (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="pickup-radio"
                      name="trip-type"
                      checked={activeTab === 'pickup'}
                      onChange={() => setActiveTab('pickup')}
                      className="w-4 h-4 text-[#111827] focus:ring-[#111827] accent-[#111827] cursor-pointer"
                    />
                    <label htmlFor="pickup-radio" className="text-sm font-bold text-[#111827] cursor-pointer">
                      Pick - Up
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Locations */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Locations</div>
                      <div className="relative">
                        <select
                          value={pickupCity}
                          onChange={(e) => setPickupCity(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 pr-6 focus:outline-none cursor-pointer"
                        >
                          <option value="Select your city">Select your city</option>
                          <option value="London Heathrow (LHR)">London Heathrow</option>
                          <option value="London Central">London Central</option>
                          <option value="Manchester Airport">Manchester Airport</option>
                          <option value="Birmingham Hub">Birmingham Hub</option>
                          <option value="Edinburgh Central">Edinburgh Central</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Date</div>
                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Time</div>
                      <div className="relative">
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 pr-6 focus:outline-none cursor-pointer"
                        >
                          <option value="Select your time">Select your time</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drop-Off Section (5 cols) */}
                <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-[#E5E7EB] lg:pl-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="dropoff-radio"
                      name="trip-type"
                      checked={activeTab === 'dropoff'}
                      onChange={() => setActiveTab('dropoff')}
                      className="w-4 h-4 text-[#111827] focus:ring-[#111827] accent-[#111827] cursor-pointer"
                    />
                    <label htmlFor="dropoff-radio" className="text-sm font-bold text-[#111827] cursor-pointer">
                      Drop - Off
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Locations */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Locations</div>
                      <div className="relative">
                        <select
                          value={dropoffCity}
                          onChange={(e) => setDropoffCity(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 pr-6 focus:outline-none cursor-pointer"
                        >
                          <option value="Select your city">Select your city</option>
                          <option value="London Heathrow (LHR)">London Heathrow</option>
                          <option value="London Central">London Central</option>
                          <option value="Manchester Airport">Manchester Airport</option>
                          <option value="Birmingham Hub">Birmingham Hub</option>
                          <option value="Edinburgh Central">Edinburgh Central</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Date</div>
                      <div className="relative">
                        <input
                          type="date"
                          value={dropoffDate}
                          onChange={(e) => setDropoffDate(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#111827]">Time</div>
                      <div className="relative">
                        <select
                          value={dropoffTime}
                          onChange={(e) => setDropoffTime(e.target.value)}
                          className="w-full appearance-none bg-transparent text-xs text-[#6B7280] font-medium py-1.5 pr-6 focus:outline-none cursor-pointer"
                        >
                          <option value="Select your time">Select your time</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Action (2 cols) */}
                <div className="lg:col-span-2 pt-2 lg:pt-0">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#111827] hover:text-white text-[#111827] font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
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
