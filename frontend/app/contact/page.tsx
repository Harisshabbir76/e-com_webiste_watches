'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import api from '../lib/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/messages', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-bg-main min-h-screen pt-32">
      <Navbar />
      <Container>
        <div className="flex flex-col lg:flex-row gap-20 mb-32">
          {/* Contact Info */}
          <div className="flex-1 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-primary tracking-[0.4em] text-[10px] font-bold uppercase">Get In Touch</span>
              <h1 className="text-5xl text-white font-light uppercase">Contact Us</h1>
              <p className="text-text-muted leading-relaxed font-light mt-4">
                Have a question about a timepiece? Or need assistance with an order? Our luxury specialists are here to help you around the clock.
              </p>
            </div>

            <div className="flex flex-col gap-8">
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 glass border border-glass-border flex items-center justify-center text-primary group-hover:border-primary transition-all">
                    <Mail size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Email us at</span>
                    <span className="text-white font-medium">concierge@iwrist.pk</span>
                  </div>
               </div>
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 glass border border-glass-border flex items-center justify-center text-primary group-hover:border-primary transition-all">
                    <Phone size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Call / WhatsApp</span>
                    <span className="text-white font-medium">+92 300 123 4567</span>
                  </div>
               </div>
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 glass border border-glass-border flex items-center justify-center text-primary group-hover:border-primary transition-all">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Showroom</span>
                    <span className="text-white font-medium">Elite Plaza, Gulberg III, Lahore</span>
                  </div>
               </div>
            </div>

            <div className="glass p-8 border-l-4 border-primary">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">WhatsApp Direct</h4>
              <p className="text-text-muted text-[10px] uppercase tracking-widest leading-loose mb-6">Connect with our specialists instantly for personalized consultations.</p>
              <a href="#" className="inline-flex items-center gap-2 text-primary text-[10px] font-bold tracking-[0.3em] uppercase hover:gap-4 transition-all">
                Start Chat <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-[1.2] glass p-10 border border-white/5">
             {submitted ? (
               <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl text-white uppercase tracking-widest">Message Received</h3>
                  <p className="text-text-muted text-sm font-light">Thank you for reaching out. One of our luxury specialists will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-premium mt-6 text-[10px]">SEND ANOTHER MESSAGE</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Your Name</label>
                       <input 
                         required
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         className="w-full bg-accent/50 border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest"
                         placeholder="e.g. HARIS SHABBIR"
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Email Address</label>
                       <input 
                         required
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         className="w-full bg-accent/50 border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm tracking-widest"
                         placeholder="email@example.com"
                       />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Subject</label>
                     <input 
                       required
                       type="text" 
                       value={formData.subject}
                       onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                       className="w-full bg-accent/50 border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest"
                       placeholder="HOW CAN WE ASSIST YOU?"
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Your Message</label>
                     <textarea 
                       required
                       rows={6}
                       value={formData.message}
                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       className="w-full bg-accent/50 border border-glass-border p-4 text-white focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-widest resize-none"
                       placeholder="TELL US MORE..."
                     ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn-premium py-5 flex items-center justify-center gap-3 text-xs"
                  >
                    {submitting ? 'SENDING...' : 'DISPATCH MESSAGE'}
                    {!submitting && <Send size={18} />}
                  </button>
               </form>
             )}
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
};

export default ContactPage;
