import React from 'react';
import { MapPin, Calendar, Car } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: 'Choose Location',
      description: 'Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.',
    },
    {
      icon: Calendar,
      title: 'Pick-up Date',
      description: 'Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.',
    },
    {
      icon: Car,
      title: 'Book your car',
      description: 'Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact Figma Copy) */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] tracking-tight">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        {/* 3-Step Process Row with Figma Connected Curve */}
        <div className="relative">
          
          {/* Smooth Sine Curved Vector Line Connecting Steps (Matching Figma) */}
          <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[60px] pointer-events-none z-0">
            <svg
              className="w-full h-full text-[#9CA3AF]"
              viewBox="0 0 800 60"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 30 C 130 90, 270 -30, 400 30 C 530 90, 670 -30, 800 30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center text-center space-y-4 px-4 group"
                >
                  {/* Rounded Icon Card matching Figma */}
                  <div className="w-[104px] h-[104px] rounded-2xl bg-[#F3F4F6] text-[#9CA3AF] flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-[#111827] group-hover:text-white transition-all duration-300">
                    <Icon className="w-9 h-9 stroke-[1.75]" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] pt-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
