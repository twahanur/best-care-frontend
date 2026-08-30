import React from 'react';
import Link from 'next/link';
import { BestCarLogo } from './BestCarLogo';

export function Footer() {
  return (
    <footer className="bg-[#D1D5DB]/30 border-t border-[#E5E7EB] pt-16 pb-12 text-[#4B5563]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Vision (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <BestCarLogo size="lg" />
            </Link>

            <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
              Our vision is to provide convenience and help increase your sales business.
            </p>

            {/* Social Media Icons (Facebook, Twitter, Instagram) matching Figma */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:border-[#111827] transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:border-[#111827] transition-colors shadow-sm"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:border-[#111827] transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns (7 cols total: About, Community, Socials) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* About */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                About
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#6B7280]">
                <li><Link href="/#how-it-works" className="hover:text-[#111827] transition-colors">How it works</Link></li>
                <li><Link href="/#fleet" className="hover:text-[#111827] transition-colors">Featured</Link></li>
                <li><Link href="/#why-us" className="hover:text-[#111827] transition-colors">Partnership</Link></li>
                <li><Link href="/#fleet" className="hover:text-[#111827] transition-colors">Business Relation</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                Community
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#6B7280]">
                <li><Link href="/#fleet" className="hover:text-[#111827] transition-colors">Events</Link></li>
                <li><Link href="/#testimonials" className="hover:text-[#111827] transition-colors">Blog</Link></li>
                <li><Link href="/#why-us" className="hover:text-[#111827] transition-colors">Podcast</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-[#111827] transition-colors">Invite a friend</Link></li>
              </ul>
            </div>

            {/* Socials */}
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-[#111827] font-['Plus_Jakarta_Sans']">
                Socials
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#6B7280]">
                <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#111827] transition-colors">Discord</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#111827] transition-colors">Instagram</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#111827] transition-colors">Twitter</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#111827] transition-colors">Facebook</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar matching Figma Wireframe */}
        <div className="border-t border-[#D1D5DB]/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-[#111827] gap-4">
          <p>©2026 Best Auto. All rights reserved</p>
          <div className="flex items-center gap-8 text-[#111827]">
            <Link href="/#privacy" className="hover:underline">Privacy & Policy</Link>
            <Link href="/#terms" className="hover:underline">Terms & Condition</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
