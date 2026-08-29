import React from 'react';
import { MapPin, Calendar, Car } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      stepNumber: '01',
      icon: MapPin,
      title: 'Choose Location',
      description: 'Select your pickup point and find your preferred car from our verified hub network across cities and airport terminals.',
    },
    {
      stepNumber: '02',
      icon: Calendar,
      title: 'Pick-up Date',
      description: 'Select your flexible pickup date and return time. Tailor protection tiers, zero-excess add-ons, or child seats.',
    },
    {
      stepNumber: '03',
      icon: Car,
      title: 'Book your car',
      description: 'Instant automated booking confirmation. Your vehicle is sanitized, inspected, and dispatched in under 30 minutes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Rent With Simple 3 Easy Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            A seamless, transparent booking process designed to get you on the road in less than 2 minutes.
          </p>
        </div>

        {/* 3-Step Process Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-16 left-[18%] right-[18%] h-[2px] step-connector-dashed z-0"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-100 transition-all duration-300 group"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 relative border border-blue-100">
                  <Icon className="w-8 h-8" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans'] pt-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
