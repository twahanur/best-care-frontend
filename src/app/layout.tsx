import type { Metadata } from 'next';
import './globals.css';
import { AppShellWrapper } from '@/components/common/AppShellWrapper';

export const metadata: Metadata = {
  title: 'RentCars | Fast & Easy Way to Rent a Car',
  description: 'Enterprise Car Rental platform with verified fleet, transparent pricing, and instant airport delivery.',
  keywords: 'car rental, rent a car, luxury car rental, suv rental, airport transfer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col antialiased">
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}
