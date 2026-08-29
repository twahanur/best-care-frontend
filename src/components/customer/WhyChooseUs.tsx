import React from 'react';
import { ShieldCheck, Zap, Sparkles, Award, Clock, DollarSign, Headphones, KeyRound } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Trip Matchmaker',
      description: 'Our proprietary RAG intelligence recommends the exact vehicle model engineered for your destination terrain and passengers.',
      badge: 'Exclusive AI Feature'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Excess VIP Protection',
      description: 'Travel with complete serenity. Comprehensive coverage eliminates all excess deductibles with zero security deposit hold.',
      badge: '100% Insured'
    },
    {
      icon: Zap,
      title: '30-Minute Hub Dispatch',
      description: 'Direct airport terminal delivery at DAC, ZYL, and CGP with pre-inspected sanitization and key handoff.',
      badge: 'Fast Delivery'
    },
    {
      icon: DollarSign,
      title: 'Zero Hidden Surcharges',
      description: 'What you see is what you pay. Transparent pricing includes local road permits, tolls, and standard collision coverage.',
      badge: 'Honest Rates'
    },
    {
      icon: KeyRound,
      title: 'Pristine Modern Fleet',
      description: 'All vehicles are less than 24 months old, rigorously serviced, and equipped with Apple CarPlay, GPS, and active safety systems.',
      badge: 'Brand New Fleet'
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Concierge',
      description: 'Instant roadside support, emergency vehicle replacement within 2 hours, and multilingual concierge support.',
      badge: '24/7 Priority'
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-950 border-t border-slate-850 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Unrivaled Rental Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Why Travelers Choose Digital Pylot
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Engineered from the ground up for seamless business corporate mobility and unforgettable family adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center text-[11px] font-semibold text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Learn more about guarantee</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
