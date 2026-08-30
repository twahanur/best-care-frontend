import React from 'react';
import Image from 'next/image';
import { Headphones, Tag, MapPin, ArrowRight } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Extremely responsive customer support provided by the team at best car rental UK.',
    },
    {
      icon: Tag,
      title: 'Best Price Guaranteed',
      description: 'Extremely best prices for all category people offered at the best car rental UK.',
    },
    {
      icon: MapPin,
      title: 'Many Location',
      description: 'Extremely the best location and available near the big cities. Just visit best car rental UK.',
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact Figma Copy) */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] tracking-tight">
            Why choose us
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        {/* Main Grid: Left Visual Card + Right 3 Feature Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Showcase Rounded Card matching Figma placeholder */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[360px] sm:h-[440px] rounded-[32px] bg-[#9CA3AF]/40 overflow-hidden shadow-lg border border-slate-300/40 p-6 flex items-center justify-center group">
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85"
                alt="Why Choose Best Car"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl p-4"
              />
            </div>
          </div>

          {/* Right Column: 3 Feature Items matching Figma Wireframe */}
          <div className="lg:col-span-6 space-y-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-5 group">
                  {/* Rounded Square Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-[#9CA3AF]/30 text-[#4B5563] flex items-center justify-center shrink-0 group-hover:bg-[#111827] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="space-y-1 pt-1">
                    <h3 className="text-lg font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 2 Bottom Banner Cards (Promotional Highlights matching Figma Wireframe) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Promo Card 1 */}
          <div className="relative h-64 rounded-[28px] bg-[#D1D5DB]/50 overflow-hidden border border-[#E5E7EB] p-8 flex items-center justify-between group shadow-sm">
            <div className="space-y-3 z-10 max-w-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] bg-white/80 px-2.5 py-1 rounded-md">
                Special Deals
              </span>
              <h4 className="text-2xl font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                Experience Luxury Rentals
              </h4>
              <p className="text-xs text-[#6B7280]">
                Explore executive sedans and SUVs with zero excess protection.
              </p>
              <a
                href="#fleet"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:underline pt-1"
              >
                <span>Discover fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative w-48 h-36 shrink-0 opacity-85 group-hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80"
                alt="Luxury Car Offer"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative h-64 rounded-[28px] bg-[#D1D5DB]/50 overflow-hidden border border-[#E5E7EB] p-8 flex items-center justify-between group shadow-sm">
            <div className="space-y-3 z-10 max-w-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] bg-white/80 px-2.5 py-1 rounded-md">
                Fast Delivery
              </span>
              <h4 className="text-2xl font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                Instant Airport Dispatch
              </h4>
              <p className="text-xs text-[#6B7280]">
                Delivered straight to airport arrivals in 15 minutes or less.
              </p>
              <a
                href="#fleet"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:underline pt-1"
              >
                <span>Book now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative w-48 h-36 shrink-0 opacity-85 group-hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80"
                alt="Airport Dispatch"
                fill
                className="object-contain"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
