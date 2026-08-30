'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Viezh Robert',
      location: 'Warsaw, Poland',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: '“Wow... I am very happy to use this service, it turned out to be more than my expectations and so far there have been no problems. Best Car rental is always the best”.',
    },
    {
      name: 'Yessica Christy',
      location: 'Shanxi, China',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      comment: '“I like it because I like to travel far and still can rent comfortably without any delays. The fleet is in immaculate condition and support was instant”.',
    },
    {
      name: 'Kim Young Jou',
      location: 'Seoul, South Korea',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      comment: '“This is very unusual for my business trip. With this platform I can rent easily without having to wait at physical queues. Highly recommended!”.',
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact Figma Copy) */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] tracking-tight">
            Trusted by Thousands of Happy Customer
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        {/* 3 Testimonial Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                idx === activeIndex
                  ? 'bg-[#D1D5DB]/40 border-[#9CA3AF] shadow-md'
                  : 'bg-[#D1D5DB]/25 border-[#E5E7EB] hover:border-[#9CA3AF]'
              }`}
            >
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-300 border border-slate-300">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-[#111827] font-['Plus_Jakarta_Sans']">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#111827]">
                  <span>{item.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
              </div>

              {/* Quote Body */}
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {item.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Navigation Controls: Pagination Dots + Arrow Buttons (Exact Figma Placement) */}
        <div className="flex items-center justify-between pt-4">
          
          {/* Pagination Indicator Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-200 rounded-full ${
                  i === activeIndex
                    ? 'w-8 h-3 bg-[#111827]'
                    : 'w-3 h-3 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Left / Right Circular Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-[#D1D5DB] hover:border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] flex items-center justify-center transition-all shadow-sm"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-[#D1D5DB] hover:border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] flex items-center justify-center transition-all shadow-sm"
              aria-label="Next review"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
