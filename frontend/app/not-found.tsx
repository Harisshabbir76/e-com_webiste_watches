'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Container from './components/Container';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-bg-main min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center">
        <Container>
          <div className="max-w-md mx-auto py-24 flex flex-col items-center text-center gap-10">
            <div className="relative">
              <span className="text-[12rem] font-bold text-white/[0.03] leading-none">404</span>
              <AlertCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={64} />
            </div>
            
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl text-white font-medium uppercase tracking-widest">Page Unreachable</h1>
              <p className="text-text-muted text-sm leading-relaxed uppercase tracking-[0.2em]">
                The resource you are looking for does not exist or access has been restricted.
              </p>
            </div>

            <Link href="/" className="btn-premium px-10 py-4 flex items-center gap-3">
              <Home size={18} />
              BACK TO HOME
            </Link>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
