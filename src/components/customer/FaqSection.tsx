'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the security deposit amount and when is it refunded?',
      a: 'A refundable pre-authorization deposit ($200 for Standard, $350 for SUVs, $500 for Luxury) is authorized at pickup. The hold is released immediately upon vehicle return inspection and typically reflects within 24 to 48 hours depending on your bank. If you select our VIP Full Shield package, zero security deposit hold is required!'
    },
    {
      q: 'What are the driver eligibility, age, and license requirements?',
      a: 'Primary drivers must be at least 21 years old (25 for Luxury & Sports categories) and hold a valid national driving license for at least 1 year. Foreign travelers can drive legally with an International Driving Permit (IDP) alongside their national passport.'
    },
    {
      q: 'Is mileage unlimited on car rentals?',
      a: 'Yes! All bookings of 3 days or longer automatically include 100% Unlimited Mileage nationwide. For short 1-day or 2-day rentals, an allowance of 250 km/day is included, with excess mileage billed at $0.25/km.'
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer 100% free cancellation with a full refund if requested up to 24 hours before your scheduled pickup time. Modifications can be made anytime through our 24/7 concierge without penalty.'
    },
    {
      q: 'Can I request delivery directly to the airport terminal or hotel?',
      a: 'Yes! We provide complimentary white-glove vehicle delivery to Hazrat Shahjalal International Airport (DAC), Sylhet (ZYL), and Chittagong (CGP) terminals, as well as designated central hotel hubs.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-slate-950 border-t border-slate-850">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about our rental policies, insurance, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Prompt Box */}
        <div className="mt-8 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Have a unique question not listed here? Ask our AI Assistant!</span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Ask AI Concierge
          </button>
        </div>

      </div>
    </section>
  );
}
