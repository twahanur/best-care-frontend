import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Headphones, DollarSign, ArrowRight, Smartphone, Gift, Award, CheckCircle2 } from 'lucide-react';

export function WhyChooseUs() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Best price guarantee',
      description: 'Found a lower price elsewhere? We will match it and offer an additional discount with transparent, no-surge pricing.',
    },
    {
      icon: Headphones,
      title: '24/7 Road Assistance',
      description: 'Round-the-clock dedicated roadside support, nationwide emergency response, and rapid replacement vehicle dispatch.',
    },
    {
      icon: ShieldCheck,
      title: 'Free Cancellation',
      description: 'Flexible travel plans with zero penalty for cancellations or modifications made up to 24 hours prior to scheduled pickup.',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Unmatched Quality & Complete Peace of Mind
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            We deliver the ultimate seamless car rental experience crafted for business executives, travelers, and families.
          </p>
        </div>

        {/* Featured Lifestyle Image + 3 Benefit Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Left Column: Large Showcase Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85"
                alt="Why Choose Rentcars"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/10">
                  Premium Experience
                </span>
                <h4 className="text-xl font-bold font-['Plus_Jakarta_Sans'] mt-2">
                  Over 10,000+ Journeys Completed
                </h4>
                <p className="text-xs text-slate-200 mt-1">
                  100% verified fleet with comprehensive inspection before every dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Benefit Cards */}
          <div className="lg:col-span-6 space-y-6">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="figma-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white flex items-start gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 2 Bottom Promo Banner Cards (Matching Figma Bottom Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Mobile App Promo */}
          <div className="figma-card p-7 rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-widest text-blue-200 bg-white/10 px-2.5 py-1 rounded-md">
                Fast & Mobile
              </span>
              <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
                Download Our Mobile App
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-sm">
                Unlock 1-tap car unlock, live GPS tracking of delivery, and instant digital check-in directly from your smartphone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 transition-colors flex items-center gap-2 shadow">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>App Store / Play Store</span>
              </button>
            </div>
          </div>

          {/* Card 2: Special Deal Promo */}
          <div className="figma-card p-7 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                Special Weekend Offer
              </span>
              <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
                Get 20% Off Weekend Trips
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
                Use promo code <strong className="text-amber-400">WEEKEND20</strong> on any SUV or Luxury rental booked for 3+ days.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#fleet"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

