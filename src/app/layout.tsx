import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppShellWrapper } from '@/components/common/AppShellWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'RentCars | Fast & Easy Way to Rent a Car',
    template: '%s | RentCars Enterprise',
  },
  description: 'Enterprise Car Rental platform with verified luxury fleet, transparent pricing, instant airport delivery, and 24/7 AI Concierge.',
  keywords: ['car rental', 'rent a car', 'luxury car rental', 'suv rental', 'airport transfer', 'chauffeur drive'],
  authors: [{ name: 'Best Care Fleet Team' }],
  openGraph: {
    title: 'RentCars | Fast & Easy Way to Rent a Car',
    description: 'Enterprise Car Rental platform with verified luxury fleet, transparent pricing, and instant airport delivery.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RentCars Car Rental',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col antialiased">
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}
