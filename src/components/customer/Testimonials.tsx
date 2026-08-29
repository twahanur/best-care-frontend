import React from 'react';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Shahriar Khan',
      role: 'Managing Director, Apex Holdings',
      comment: 'Rented the Toyota Prado TX for a 5-day corporate expedition to Sreemangal tea estates. Vehicle was delivered sparkling clean directly to DAC Terminal 2 within 15 minutes. Outstanding service!',
      rating: 5,
      car: 'Toyota Land Cruiser Prado TX',
      trip: 'Dhaka to Sylhet Expedition'
    },
    {
      name: 'Nusrat Jahan',
      role: 'Head of Brand, Unilever BD',
      comment: 'The AI Trip Assistant recommended the Mercedes E-Class AMG Line for our visiting regional executives. The chauffeur was punctual, bilingual, and extremely courteous.',
      rating: 5,
      car: 'Mercedes-Benz E-Class AMG Line',
      trip: 'VIP Corporate Airport Transfer'
    },
    {
      name: 'Farhan Chowdhury',
      role: 'Tech Entrepreneur',
      comment: 'Took the Tesla Model Y for a scenic weekend trip across the Padma Expressway. Super smooth ride, supercharging was effortless, and the VIP Full Shield protection gave total peace of mind.',
      rating: 5,
      car: 'Tesla Model Y Long Range',
      trip: 'Family Eco Roadtrip'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Verified Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Trusted by Corporate & Leisure Travelers
          </h2>
          <p className="text-sm text-slate-400">
            Over 2,400 completed trips with an average satisfaction rating of 4.9/5 stars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-indigo-500/30" />
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="font-bold text-sm text-white">{rev.name}</div>
                <div className="text-[11px] text-indigo-400">{rev.role}</div>
                <div className="text-[10px] text-slate-400 mt-1">Rented: <span className="text-slate-300 font-medium">{rev.car}</span></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
