import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Shahriar Khan',
      role: 'Managing Director, Apex Holdings',
      comment: 'Rented the Jaguar XE for a 4-day corporate summit. The car was delivered sparkling clean directly to the airport terminal in 15 minutes. Truly executive class service!',
      rating: 5,
      car: 'Jaguar XE L Prestige',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Nusrat Jahan',
      role: 'Head of Brand, Unilever',
      comment: 'The booking process took under 2 minutes. The Audi A6 was in pristine condition, and the zero-excess protection allowed our team to travel with absolute peace of mind.',
      rating: 5,
      car: 'Audi A6 Sedan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Farhan Chowdhury',
      role: 'Tech Entrepreneur',
      comment: 'Took the Tesla Model Y for a weekend trip. Smooth performance, supercharging was effortless, and the 24/7 concierge support was extremely responsive.',
      rating: 5,
      car: 'Tesla Model Y Long Range',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-[#F8F9FB] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Trusted by Thousands of Happy Customers
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Real feedback from verified drivers, corporate partners, and travelers.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="figma-card p-7 rounded-2xl border border-slate-200/80 bg-white flex flex-col justify-between space-y-6 shadow-sm hover:border-blue-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-blue-100 group-hover:text-blue-200 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">{rev.name}</div>
                  <div className="text-[11px] text-blue-600 font-medium">{rev.role}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rented: <span className="text-slate-600 font-semibold">{rev.car}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

