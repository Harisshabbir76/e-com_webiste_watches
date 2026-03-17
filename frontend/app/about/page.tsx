'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import { Camera, Clock, Award, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-bg-main min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-main/50 via-bg-main to-bg-main"></div>
        
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <span className="text-primary tracking-[0.5em] text-xs font-bold uppercase">Crafting Perfection</span>
            <h1 className="text-5xl md:text-7xl text-white font-medium tracking-tight">Our Story</h1>
            <div className="w-24 h-1 bg-primary"></div>
          </div>
        </Container>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-t border-glass-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-8">
              <span className="text-primary tracking-widest text-xs font-bold uppercase">Since 2024</span>
              <h2 className="text-4xl text-white font-light leading-tight">
                Redefining the essence of <span className="text-primary italic">timekeeping</span> through modern innovation and timeless design.
              </h2>
              <p className="text-text-muted leading-relaxed">
                Founded with a passion for horology and a vision for the modern era, iWRIST stands at the intersection of traditional craftsmanship and contemporary aesthetics. We believe a watch is more than just a tool to tell time; it's a statement of identity, a piece of art, and a legacy on your wrist.
              </p>
              <p className="text-text-muted leading-relaxed">
                Every timepiece in our collection is curated with meticulous attention to detail, ensuring that only the finest materials and movements make it to our discerning customers across the globe.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] glass overflow-hidden rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000" 
                  alt="Watch craftsmanship" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 glass hidden md:flex items-center justify-center p-6 text-center">
                <span className="text-primary text-xs font-bold tracking-widest uppercase italic">The pursuit of excellence.</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-accent/30 border-y border-glass-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Clock size={32} />, title: "Precision", desc: "Equipped with world-class movements for split-second accuracy." },
              { icon: <Shield size={32} />, title: "Authenticity", desc: "Every piece is guaranteed 100% authentic and original." },
              { icon: <Award size={32} />, title: "Quality", desc: "Crafted using premium sapphire crystal and 316L stainless steel." },
              { icon: <Camera size={32} />, title: "Aesthetics", desc: "Designed to be visually striking in every setting." },
            ].map((value, idx) => (
              <div key={idx} className="flex flex-col gap-6 group">
                <div className="text-primary group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl text-white font-medium uppercase tracking-widest">{value.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Vision Statement */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-white/[0.02] whitespace-nowrap pointer-events-none">
          TIMELESS ELEGANCE
        </div>
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-10 relative z-10">
            <h2 className="text-3xl md:text-5xl text-white font-light tracking-tight italic">
              "We don't just sell watches; we celebrate the moments that define your journey."
            </h2>
            <div className="flex flex-col items-center">
              <span className="text-white text-sm font-bold tracking-[0.3em] uppercase">Haris Shabbir</span>
              <span className="text-primary text-[10px] tracking-widest uppercase mt-2">Founder & Creative Director</span>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </main>
  );
};

export default AboutPage;
