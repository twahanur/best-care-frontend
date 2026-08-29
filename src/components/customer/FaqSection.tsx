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
    <section id="faq" className="py-16 md:py-24 bg-white border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about our rental policies, insurance, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="figma-card rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Prompt Box */}
        <div className="mt-8 p-5 rounded-2xl bg-blue-50/80 border border-blue-100 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-blue-900 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Have a unique trip question? Ask our AI Assistant!</span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Ask AI Concierge
          </button>
        </div>

      </div>
    </section>
  );
}

