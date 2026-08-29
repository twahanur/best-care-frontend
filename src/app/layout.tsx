import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingAiWidget } from '@/components/ai/FloatingAiWidget';

export const metadata: Metadata = {
  title: 'Digital Pylot Rentals | Premium Car Rental & AI Trip Matchmaker',
  description: 'Enterprise Car Rental platform with RAG-powered AI vehicle matchmaker, instant airport delivery, and real-time fleet analytics.',
  keywords: 'car rental, rent a car, luxury car rental, suv 4x4 rental, airport transfer, ai car recommendation',
  openGraph: {
    title: 'Digital Pylot Car Rental & AI Automation',
    description: 'Experience premium luxury and rugged 4x4 vehicle rentals with AI trip matchmaking.',
    type: 'website',
  },
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
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingAiWidget />
      </body>
    </html>
  );
}
