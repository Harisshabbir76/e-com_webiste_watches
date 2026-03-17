import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Check } from 'lucide-react';
import api from '../lib/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/subscribers', { email: email.trim() });
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <footer className="bg-[#050505] border-t border-glass-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-widest text-white">iWRIST</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
          </Link>
          <p className="text-text-muted text-sm leading-relaxed">
            Crafting elegance since 2010. iWrist brings you a curated collection of the world's finest timepieces, combining tradition with modern innovation.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-primary">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-semibold text-white">Collections</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/catalog?category=luxury" className="text-text-muted hover:text-primary text-sm">Luxury Watches</Link></li>
            <li><Link href="/catalog?category=sports" className="text-text-muted hover:text-primary text-sm">Sports Watches</Link></li>
            <li><Link href="/catalog?category=chronograph" className="text-text-muted hover:text-primary text-sm">Chronograph</Link></li>
            <li><Link href="/catalog?category=automatic" className="text-text-muted hover:text-primary text-sm">Automatic</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-semibold text-white">Customer Care</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/faq" className="text-text-muted hover:text-primary text-sm">FAQ</Link></li>
            <li><Link href="/shipping" className="text-text-muted hover:text-primary text-sm">Shipping Policy</Link></li>
            <li><Link href="/returns" className="text-text-muted hover:text-primary text-sm">Returns & Exchanges</Link></li>
            <li><Link href="/warranty" className="text-text-muted hover:text-primary text-sm">Warranty Info</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-semibold text-white">Newsletter</h4>
          <p className="text-text-muted text-sm">Join our elite circle and receive exclusive updates on new collection releases.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-accent border border-glass-border p-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
              required
            />
            <button 
              type="submit" 
              disabled={submitting || submitted}
              className="btn-premium w-full text-xs flex items-center justify-center gap-2"
            >
              {submitting ? 'SUBSCRIBING...' : submitted ? <><Check size={16} /> SUBSCRIBED!</> : 'SUBSCRIBE'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] text-text-muted uppercase">
        <p>&copy; 2026 iWRIST WATCHES. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
