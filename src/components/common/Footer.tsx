import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, Clock, MapPin, Mail, Phone, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-850 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                DIGITAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">PYLOT</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation car rental ecosystem integrating AI trip matching, verified vehicle fleet telemetry, zero-excess protection, and seamless executive transfers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Insured Fleet
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                24/7 Roadside Assist
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              Vehicle Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#fleet" className="hover:text-indigo-400 transition-colors">4x4 Mountain SUVs</Link></li>
              <li><Link href="/#fleet" className="hover:text-indigo-400 transition-colors">Executive Luxury Sedans</Link></li>
              <li><Link href="/#fleet" className="hover:text-indigo-400 transition-colors">Tesla & Electric (EV)</Link></li>
              <li><Link href="/#fleet" className="hover:text-indigo-400 transition-colors">11-Seater Passenger Vans</Link></li>
              <li><Link href="/#fleet" className="hover:text-indigo-400 transition-colors">Sports & Convertibles</Link></li>
            </ul>
          </div>

          {/* Platform & AI */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              AI & Architecture
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/admin" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">Admin Dashboard <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Live</span></Link></li>
              <li><Link href="/rag-tester" className="hover:text-cyan-400 transition-colors">RAG Vector Inspector</Link></li>
              <li><a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">NestJS Swagger API</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">FastAPI RAG Docs</a></li>
              <li><Link href="/#faq" className="hover:text-indigo-400 transition-colors">Rental Policies & FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Hub */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 font-['Plus_Jakarta_Sans']">
              Contact & Hubs
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Hazrat Shahjalal Intl Airport (DAC) Terminal 1 & 2 Hub</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>concierge@digitalpylot.io</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Digital Pylot Assessment. Built with Next.js 15, NestJS, and Python RAG Microservice.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span className="hover:text-slate-300">Security & Insurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
