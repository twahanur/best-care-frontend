import React from 'react';

interface BestCarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'dark' | 'light';
}

export function BestCarLogo({ className = '', size = 'md', showText = true, variant = 'dark' }: BestCarLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isLightText = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Figma Swoosh Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={isSm ? "32" : isLg ? "48" : "40"}
          height={isSm ? "24" : isLg ? "36" : "30"}
          viewBox="0 0 54 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Red Swoosh Arc */}
          <path
            d="M3 14C8 6 22 2 38 4C48 5.5 52 9 53 11C47 7.5 35 6 24 8C14 9.5 7 13 3 14Z"
            fill="#E11D48"
          />
          {/* Red Main Body Arc */}
          <path
            d="M1 18C7 9 24 4 44 7C51 8 53 11 51 12C45 10 32 8.5 20 11C10 13 4 17 1 18Z"
            fill="#EF4444"
          />
          {/* Bottom Cyan/Blue Swoosh */}
          <path
            d="M8 24C16 19 32 17 48 19C52 19.5 53 21 51 22C44 20.5 30 19 18 22C12 23.5 9 24.5 8 24Z"
            fill="#0284C7"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline font-bold tracking-tight">
          <span
            className={`${isLightText ? 'text-white' : 'text-[#0F172A]'} font-extrabold ${
              isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Best
          </span>
          <span
            className={`text-[#0284C7] font-semibold italic ml-0.5 ${
              isSm ? 'text-base' : isLg ? 'text-xl' : 'text-lg'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', cursive, sans-serif" }}
          >
            Car
          </span>
        </div>
      )}
    </div>
  );
}

export default BestCarLogo;

