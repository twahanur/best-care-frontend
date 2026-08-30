'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HeaderNavWrapper } from './HeaderNavWrapper';
import { Footer } from './Footer';
import { FloatingAiWidget } from '../ai/FloatingAiWidget';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDedicatedDashboard =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/customer') ||
    pathname.startsWith('/driver');

  if (isDedicatedDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <HeaderNavWrapper />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingAiWidget />
    </>
  );
}
