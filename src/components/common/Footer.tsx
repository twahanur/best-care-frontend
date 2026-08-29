import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, Clock, MapPin, Mail, Phone, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                RENT<span className="text-blue-600">CARS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              Premium car rental ecosystem connecting travelers with top-tier verified vehicles, transparent daily pricing, zero-excess insurance, and 24/7 priority support.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Insured Fleet
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <Clock className="w-4 h-4 text-blue-600" />
                24/7 Roadside Assist
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              Our Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link href="/#fleet" className="hover:text-blue-600 transition-colors">Career</Link></li>
              <li><Link href="/#fleet" className="hover:text-blue-600 transition-colors">Car Fleet</Link></li>
              <li><Link href="/#fleet" className="hover:text-blue-600 transition-colors">Packages</Link></li>
              <li><Link href="/#fleet" className="hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link href="/#why-us" className="hover:text-blue-600 transition-colors">Priceline</Link></li>
            </ul>
          </div>

          {/* Platform & AI */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link href="/admin" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">Admin Dashboard <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">Live</span></Link></li>
              <li><Link href="/rag-tester" className="hover:text-blue-600 transition-colors">RAG Inspector</Link></li>
              <li><a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">NestJS Swagger API</a></li>
              <li><Link href="/#faq" className="hover:text-blue-600 transition-colors">Rental Policies & FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Hub */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              About Rentcars
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Hazrat Shahjalal Intl Airport (DAC) Terminal Hub</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>support@rentcars.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Rentcars. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer">Security & Insurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

